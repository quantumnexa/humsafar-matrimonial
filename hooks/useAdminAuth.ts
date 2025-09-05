import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminAuthService } from '@/lib/adminAuth'
import { supabase } from '@/lib/supabaseClient'

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        
        // Check if user is authenticated with Supabase
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          console.log("No session found, redirecting to admin login")
          router.push("/admin")
          return
        }

        // Check if user has admin privileges
        const isAdmin = await AdminAuthService.isAdmin()
        
        if (!isAdmin) {
          console.log("User is not admin, redirecting to admin login")
          router.push("/admin")
          return
        }

        console.log("User authenticated as admin")
        setIsAuthenticated(true)
        setUser(session.user)
        
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/admin")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const logout = async () => {
    try {
      await AdminAuthService.logout()
      localStorage.removeItem("humsafar_admin_auth")
      localStorage.removeItem("supabase.auth.token")
      document.cookie = "humsafar_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      router.push("/admin")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/admin")
    }
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    logout
  }
} 