import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Handle canonical URL redirects and duplicate content prevention
  // Remove trailing slashes (except root)
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(0, -1)
    return NextResponse.redirect(url, 301)
  }
  
  // Handle common duplicate content patterns
  if (pathname === '/index' || pathname === '/home') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url, 301)
  }
  
  // Normalize case for certain paths
  if (pathname === '/PROFILES') {
    const url = request.nextUrl.clone()
    url.pathname = '/profiles'
    return NextResponse.redirect(url, 301)
  }
  
  if (pathname === '/PACKAGES') {
    const url = request.nextUrl.clone()
    url.pathname = '/packages'
    return NextResponse.redirect(url, 301)
  }
  
  // Check if user is trying to access regular user areas while being admin
  if (pathname === "/" || pathname === "/profiles" || pathname === "/packages" || pathname === "/contact" || pathname === "/success-stories") {
    const adminAuth = request.cookies.get("humsafar_admin_auth")
    if (adminAuth && adminAuth.value === "true") {
      const response = NextResponse.next()
      // Clear admin auth cookie when accessing regular user areas
      response.cookies.set("humsafar_admin_auth", "", { 
        path: "/", 
        expires: new Date(0),
        maxAge: 0
      })
      return response
    }
  }
  
  // Only apply middleware to admin routes that are NOT the main admin page
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    // Check for admin authentication in cookies first (for performance)
    const adminAuth = request.cookies.get("humsafar_admin_auth")
    
    if (!adminAuth || adminAuth.value !== "true") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    // Additional check: verify the auth token is valid
    const authHeader = request.headers.get("authorization")
    if (authHeader) {
      try {
        // Create Supabase client for server-side auth check
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
        
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        })

        // Extract token from Authorization header
        const token = authHeader.replace('Bearer ', '')
        
        // Verify the token
        const { data: { user }, error } = await supabase.auth.getUser(token)
        
        if (error || !user) {
          return NextResponse.redirect(new URL("/admin", request.url))
        }

        // Check if user has admin role
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single()

        if (adminError || !adminUser) {
          return NextResponse.redirect(new URL("/admin", request.url))
        }
      } catch (error) {
        console.error('Middleware auth error:', error)
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    }
  }

  // Additional check: prevent admin users from accessing regular user areas
  // Only check if admin cookie is present to avoid conflicts
  if (pathname === "/" || pathname === "/profiles" || pathname === "/packages" || pathname === "/contact" || pathname === "/success-stories") {
    try {
      // Check for admin cookie first (less intrusive)
      const adminCookie = request.cookies.get("humsafar_admin_auth")
      if (adminCookie && adminCookie.value === "true") {
        // Admin user trying to access regular user area - redirect to admin dashboard
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      }
      
      // Only do deeper check if there's an authorization header
      const authHeader = request.headers.get("authorization")
      if (authHeader) {
        // Create Supabase client for server-side auth check
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
        
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        })

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error } = await supabase.auth.getUser(token)
        
        if (!error && user) {
          // Check if user has admin role
          const { data: adminUser, error: adminError } = await supabase
            .from('admin_users')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .single()

          if (!adminError && adminUser) {
            // Admin user trying to access regular user area - redirect to admin dashboard
            return NextResponse.redirect(new URL("/admin/dashboard", request.url))
          }
        }
      }
    } catch (error) {
      console.error('Middleware admin check error:', error)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all admin routes except the main admin page
    "/admin/((?!$).*)",
    // Also match regular user routes for admin access prevention
    "/",
    "/profiles",
    "/packages", 
    "/contact",
    "/success-stories"
  ],
}
