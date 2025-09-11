"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabaseClient"

// Admin credentials
const ADMIN_CREDENTIALS = {
  id: "bde3629a-4a19-418a-813b-fdf51176da30",
  email: "info@humsafarforeverlove.com"
}

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const form = e.target as HTMLFormElement
      const email = (form.email as HTMLInputElement).value
      const password = (form.password as HTMLInputElement).value
      
      // First check if this is the admin email
      if (email !== ADMIN_CREDENTIALS.email) {
        setError("Access denied. This is not an admin account.")
        setLoading(false)
        return
      }
      
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setError(`Authentication failed: ${error.message}`)
        setLoading(false)
        return
      }
      
      // Verify this is the admin user by checking the user ID
      if (data.user?.id !== ADMIN_CREDENTIALS.id) {
        setError("Access denied. This account does not have admin privileges.")
        // Sign out the non-admin user
        await supabase.auth.signOut()
        setLoading(false)
        return
      }
      
      // Store admin session in localStorage
      localStorage.setItem('admin_session', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        loginTime: new Date().toISOString()
      }))
      
      // Redirect to admin dashboard
      router.push("/admin/dashboard")
      
    } catch (err) {
      console.error('Admin login error:', err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-humsafar-50 to-white">
      <Header />
      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <Card className="border-humsafar-100">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-humsafar-100">
                <Shield className="h-6 w-6 text-humsafar-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-humsafar-600">Admin Login</CardTitle>
              <CardDescription>Sign in to access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Admin Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 h-5 w-5" />
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="Enter admin email" 
                      className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-humsafar-500 focus:ring-2 focus:ring-humsafar-100 rounded-lg transition-all duration-200 hover:border-gray-300" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Admin Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 h-5 w-5" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      className="pl-12 pr-12 py-3 border-2 border-gray-200 focus:border-humsafar-500 focus:ring-2 focus:ring-humsafar-100 rounded-lg transition-all duration-200 hover:border-gray-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 hover:text-humsafar-600 transition-colors"
                    >
                      {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                {error && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="font-medium mb-1">Authentication Error:</div>
                    <div>{error}</div>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-humsafar-500 hover:bg-humsafar-600" 
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In as Admin"}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Not an admin?{" "}
                  <button
                    onClick={() => router.push("/auth")}
                    className="text-humsafar-500 hover:text-humsafar-600 font-medium"
                  >
                    Go to user login
                  </button>
                </p>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-amber-600 mr-2" />
                  <div className="text-xs text-amber-700">
                    <p className="font-medium mb-1">Admin Access Only</p>
                    <p>This is a secure admin area. Only authorized personnel should access this page.</p>
                    <p className="mt-2 font-mono text-amber-600">
                      Admin Email: info@humsafarforeverlove.com<br/>
                      Use your Supabase account password
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}