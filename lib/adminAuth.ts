import { supabase } from './supabaseClient'

export interface AdminUser {
  id: string
  email: string
  role: 'admin'
  created_at: string
}

export class AdminAuthService {
  // Check if user is admin (simplified for debugging)
  static async isAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false

      console.log('Checking admin status for user:', user.id, user.email)

      // Check if user has admin role in admin_users table
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single()

      if (error) {
        console.error('Admin check error:', error)
        return false
      }

      if (adminUser) {
        console.log('Admin user found:', adminUser)
        return true
      }

      console.log('User not found in admin_users table')
      return false
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  // Check admin status using cookie-based authentication (for middleware)
  static async checkAdminCookieSession(): Promise<boolean> {
    try {
      // Check if admin auth cookie exists
      if (typeof document !== 'undefined') {
        const adminCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('humsafar_admin_auth='))
        
        if (adminCookie && adminCookie.split('=')[1] === 'true') {
          return true
        }
      }
      
      // Fallback: check if there's a valid Supabase session for admin
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        return await this.isAdmin()
      }
      
      return false
    } catch (error) {
      console.error('Error checking admin session:', error)
      return false
    }
  }

  // Clear admin authentication
  static clearAdminAuth(): void {
    try {
      // Clear admin cookie
      if (typeof document !== 'undefined') {
        document.cookie = "humsafar_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }
      
      // Clear any Supabase session
      supabase.auth.signOut()
      
      console.log('Admin authentication cleared')
    } catch (error) {
      console.error('Error clearing admin auth:', error)
    }
  }

  // Admin login with email and password
  static async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
    try {
      console.log('Attempting login for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Login error:', error)
        return { success: false, error: error.message }
      }

      if (!data.user) {
        console.log('No user returned from login')
        return { success: false, error: 'Login failed' }
      }

      console.log('User logged in successfully:', data.user.id)

      // Verify user is admin
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', data.user.id)
        .eq('role', 'admin')
        .single()

      if (adminError) {
        console.error('Admin verification error:', adminError)
        // Sign out the user if they're not admin
        await supabase.auth.signOut()
        return { success: false, error: 'Access denied. Admin privileges required.' }
      }

      if (!adminUser) {
        console.log('User not found in admin_users table')
        // Sign out the user if they're not admin
        await supabase.auth.signOut()
        return { success: false, error: 'Access denied. Admin privileges required.' }
      }

      console.log('Admin verification successful:', adminUser)

      // IMPORTANT: For admin users, we need to clear the Supabase session
      // and use only cookie-based authentication to prevent conflicts
      await supabase.auth.signOut()

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email!,
          role: 'admin',
          created_at: data.user.created_at
        }
      }
    } catch (error) {
      console.error('Admin login error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Admin logout
  static async logout(): Promise<void> {
    try {
      // Use the comprehensive clear method
      this.clearAdminAuth()
    } catch (error) {
      console.error('Admin logout error:', error)
    }
  }

  // Get current admin user
  static async getCurrentAdmin(): Promise<AdminUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single()

      if (error || !adminUser) return null

      return {
        id: user.id,
        email: user.email!,
        role: 'admin',
        created_at: user.created_at
      }
    } catch (error) {
      console.error('Error getting current admin:', error)
      return null
    }
  }

  // Check if admin session is valid
  static async checkSession(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return false

      // Verify admin role
      return await this.isAdmin()
    } catch (error) {
      console.error('Error checking session:', error)
      return false
    }
  }
}
