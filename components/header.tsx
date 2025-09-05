"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Heart, Menu, User, Settings, LogOut, Crown } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { isUserAdmin } from "@/lib/utils"

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const router = useRouter()

  const navigationItems = [
    { title: "Browse Profiles", href: "/profiles" },
    { title: "Success Stories", href: "/success-stories" },
    { title: "Packages", href: "/packages" },
    { title: "Contact", href: "/contact" },
  ]

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        // Check for admin cookie first
        if (typeof document !== 'undefined') {
          const adminCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('humsafar_admin_auth='))
          
          if (adminCookie && adminCookie.split('=')[1] === 'true') {
            setIsAdminUser(true)
            setUser(null)
            setUserProfile(null)
            return
          }
        }

        // If we previously persisted session manually, restore it into Supabase on first load
        const persisted = localStorage.getItem('sb-auth-token')
        if (persisted) {
          const parsed = JSON.parse(persisted)
          if (parsed?.access_token) {
            await supabase.auth.setSession({
              access_token: parsed.access_token,
              refresh_token: parsed.refresh_token,
            })
          }
        }
      } catch (_) {}

      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Check if user is an admin - if so, don't show them as logged in user
        const isAdmin = await isUserAdmin(session.user.id)
        
        if (isAdmin) {
          // Admin user - set admin state but don't show as regular user
          setIsAdminUser(true)
          setUser(null)
          setUserProfile(null)
        } else {
          // Regular user - show as logged in
          setIsAdminUser(false)
          setUser(session.user)
          
          // Fetch user profile data
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single()
          
          setUserProfile(profile)
        }
      } else {
        setUser(null)
        setUserProfile(null)
        setIsAdminUser(false)
      }
    }

    // Small delay to prevent race conditions with auth page
    setTimeout(() => {
      getInitialSession()
    }, 100)

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      if (session?.user) {
        // Check if user is an admin - if so, don't show them as logged in user
        const isAdmin = await isUserAdmin(session.user.id)
        
        if (isAdmin) {
          // Admin user - set admin state but don't show as regular user
          setIsAdminUser(true)
          setUser(null)
          setUserProfile(null)
        } else {
          // Regular user - show as logged in
          setIsAdminUser(false)
          setUser(session.user)
          
          // Fetch user profile data
          const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", session.user.id).single()
          setUserProfile(profile)
        }
      } else {
        setUser(null)
        setUserProfile(null)
        setIsAdminUser(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    try { localStorage.removeItem('sb-auth-token') } catch (_) {}
    setUser(null)
    setUserProfile(null)
    router.push('/')
  }

  const handleSwitchToRegularUser = async () => {
    try {
      // Clear admin authentication
      if (typeof window !== 'undefined') {
        // Clear admin cookie
        document.cookie = "humsafar_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        // Clear admin localStorage
        localStorage.removeItem("humsafar_admin_auth")
      }
      
      // Clear any existing Supabase session
      await supabase.auth.signOut()
      
      // Refresh the page to reset all auth states
      window.location.href = '/'
    } catch (error) {
      // Fallback: just refresh the page
      window.location.href = '/'
    }
  }

  const getInitials = (firstName: string, middleName?: string, lastName?: string) => {
    if (!firstName) return "U"
    const first = firstName.charAt(0).toUpperCase()
    const middle = middleName ? middleName.charAt(0).toUpperCase() : ""
    const last = lastName ? lastName.charAt(0).toUpperCase() : ""
    return first + middle + last
  }

  const getUserDisplayName = () => {
    if (userProfile?.first_name) {
      return userProfile.first_name
    }
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name
    }
    return user?.email?.split("@")[0] || "User"
  }

  const getUserFullName = () => {
    const first = userProfile?.first_name || user?.user_metadata?.first_name || ""
    const middle = userProfile?.middle_name || user?.user_metadata?.middle_name || ""
    const last = userProfile?.last_name || user?.user_metadata?.last_name || ""
    const full = [first, middle, last].filter(Boolean).join(' ')
    return full || user?.email?.split("@")[0] || "User"
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50" suppressHydrationWarning>
      <div className="container mx-auto px-4" suppressHydrationWarning>
        <div className="flex items-center justify-between h-28" suppressHydrationWarning>
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" legacyBehavior>
              <img src="/humsafar-logo.png" alt="Humsafar Logo" className="w-48" />
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex items-center" suppressHydrationWarning>
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-12 w-max items-center justify-center rounded-md bg-background px-6 py-3 text-base font-semibold transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Login/Signup or User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Desktop actions: Dashboard + Logout */}
                <div className="hidden sm:flex items-center space-x-3">
                  <Link href="/dashboard" legacyBehavior>
                    <Button
                      variant="outline"
                      className="border-humsafar-500 text-humsafar-600 hover:bg-humsafar-500 hover:text-white bg-transparent"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="border-humsafar-500 text-humsafar-600 hover:bg-humsafar-500 hover:text-white bg-transparent"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>

                {/* Mobile view for authenticated user */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                          <AvatarFallback>
                            {getInitials(
                              userProfile?.first_name || user?.user_metadata?.first_name || "",
                              userProfile?.middle_name || user?.user_metadata?.middle_name || "",
                              userProfile?.last_name || user?.user_metadata?.last_name || "",
                            )}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      {/* Removed greeting label per requirements */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" legacyBehavior>
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" legacyBehavior>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Profile Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/packages" legacyBehavior>
                          <Crown className="mr-2 h-4 w-4" />
                          <span>Upgrade Plan</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : isAdminUser ? (
              <>
                {/* Admin user interface */}
                <div className="hidden sm:flex items-center space-x-3">
                  <Link href="/admin/dashboard" legacyBehavior>
                    <Button
                      variant="outline"
                      className="border-humsafar-500 text-humsafar-600 hover:bg-humsafar-500 hover:text-white bg-transparent"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleSwitchToRegularUser}
                    className="border-humsafar-500 text-humsafar-600 hover:bg-humsafar-500 hover:text-white bg-transparent"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Switch to User Mode
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth" className="hidden sm:block" legacyBehavior>
                  <Button className="bg-humsafar-500 hover:bg-humsafar-600 text-white">Login / Register</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/" className="flex items-center mb-6" legacyBehavior>
                    <a className="flex items-center">
                      <img src="/humsafar-logo.png" alt="Humsafar Logo" className="w-40" />
                    </a>
                  </Link>

                  {navigationItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="text-lg font-medium text-gray-900 hover:text-humsafar-500 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      legacyBehavior
                    >
                      <a className="block py-2">{item.title}</a>
                    </Link>
                  ))}

                  <div className="pt-6 border-t">
                    {user ? (
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600">Hello, {getUserDisplayName()}</div>
                        <Link
                          href="/dashboard"
                          className="flex items-center space-x-2 text-gray-900 hover:text-humsafar-500"
                          onClick={() => setMobileMenuOpen(false)}
                          legacyBehavior
                        >
                          <a className="flex items-center space-x-2">
                            <User className="h-5 w-5" />
                            <span>Dashboard</span>
                          </a>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-0 h-auto text-gray-900 hover:text-humsafar-500"
                          onClick={() => {
                            handleLogout()
                            setMobileMenuOpen(false)
                          }}
                        >
                          <LogOut className="h-5 w-5 mr-2" />
                          Log out
                        </Button>
                      </div>
                    ) : isAdminUser ? (
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600">Admin Mode</div>
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center space-x-2 text-gray-900 hover:text-humsafar-500"
                          onClick={() => setMobileMenuOpen(false)}
                          legacyBehavior
                        >
                          <a className="flex items-center space-x-2">
                            <User className="h-5 w-5" />
                            <span>Admin Dashboard</span>
                          </a>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-0 h-auto text-gray-900 hover:text-humsafar-500"
                          onClick={() => {
                            handleSwitchToRegularUser()
                            setMobileMenuOpen(false)
                          }}
                        >
                          <LogOut className="h-5 w-5 mr-2" />
                          Switch to User Mode
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Link href="/auth" onClick={() => setMobileMenuOpen(false)} legacyBehavior>
                          <a>
                            <Button className="w-full bg-humsafar-500 hover:bg-humsafar-600 text-white">
                              Login / Register
                            </Button>
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      {/* Announcement Bar */}
      {user && (
        <div className="bg-humsafar-500 text-white overflow-hidden relative">
          <div className="container mx-auto px-4 py-2">
            <div className="whitespace-nowrap animate-marquee">
              Welcome, {getUserFullName()}, hope you found your soulmate
            </div>
          </div>
        </div>
      )}
      {isAdminUser && (
        <div className="bg-yellow-600 text-white overflow-hidden relative">
          <div className="container mx-auto px-4 py-2">
            <div className="whitespace-nowrap animate-marquee">
              Admin Mode Active - You can switch to User Mode anytime
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
