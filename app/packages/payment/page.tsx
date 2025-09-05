"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Shield, Clock, Star, Crown, Zap } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabaseClient"

interface Package {
  id: string
  name: string
  price: number
  duration: string
  profileViews: number
  features: string[]
  addOns: string[]
  icon: any
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get('package')
  
  const [packageDetails, setPackageDetails] = useState<Package | null>(null)
  const [loading, setLoading] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)

  const packages: Record<string, Package> = {
    basic: {
      id: "basic",
      name: "Basic Package",
      price: 5000,
      duration: "3 months",
      profileViews: 20,
      features: [
        "15 additional profile views",
        "50 contacts access",
        "Advanced search filters",
        "Profile views tracking",
        "Priority customer support",
        "Mobile app premium features",
        "Read receipts"
      ],
      addOns: ["Verified Badge"],
      icon: Star
    },
    standard: {
      id: "standard",
      name: "Standard Package",
      price: 8000,
      duration: "6 months",
      profileViews: 35,
      features: [
        "30 additional profile views",
        "100 contacts access",
        "Priority listing",
        "Advanced matching algorithm",
        "Profile analytics",
        "Dedicated support",
        "Profile boost (monthly)"
      ],
      addOns: ["Verified Badge", "Boost Profile", "Spotlight Profile"],
      icon: Crown
    },
    premium: {
      id: "premium",
      name: "Premium Package",
      price: 13000,
      duration: "12 months",
      profileViews: 55,
      features: [
        "50 additional profile views",
        "200 contacts access",
        "Spotlight profile",
        "Priority listing",
        "Advanced analytics",
        "Personalized matchmaker support",
        "Exclusive events access",
        "Profile verification",
        "Background check assistance",
        "Unlimited everything"
      ],
      addOns: ["Verified Badge", "Boost Profile", "Spotlight Profile"],
      icon: Zap
    }
  }

  useEffect(() => {
    if (packageId && packages[packageId]) {
      setPackageDetails(packages[packageId])
    } else {
      router.push('/packages')
    }

    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUser(user)
      } else {
        router.push('/auth')
      }
    }
    getCurrentUser()
  }, [packageId, router])

  const handlePayment = async () => {
    if (!packageDetails || !currentUser) return

    setLoading(true)
    
    try {
      // Create user subscription record
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: currentUser.id,
          subscription_status: packageDetails.id === 'basic' ? 'premium_lite' : 
                             packageDetails.id === 'standard' ? 'premium_classic' : 'premium_plus',
          package_name: packageDetails.name,
          package_price: packageDetails.price,
          package_duration_months: packageDetails.id === 'basic' ? 3 : 
                                  packageDetails.id === 'standard' ? 6 : 12,
          package_start_date: new Date().toISOString(),
          contacts_limit: packageDetails.id === 'basic' ? 50 : 
                         packageDetails.id === 'standard' ? 100 : 200,
          active_addons: packageDetails.addOns,
          features: {
            profile_views: packageDetails.profileViews,
            addons: packageDetails.addOns
          }
        })

      if (subscriptionError) {
        // Error creating subscription
        throw subscriptionError
      }

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: currentUser.id,
          amount: packageDetails.price,
          currency: 'PKR',
          status: 'success',
          payment_method: 'dummy_payment',
          created_at: new Date().toISOString()
        })

      if (paymentError) {
        // Error creating payment record
        // Don't throw here as subscription was created successfully
      }

      // Redirect to success page
      router.push('/dashboard?package=success')
      
    } catch (error) {
      // Payment error
      alert('There was an error processing your payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!packageDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-humsafar50 via-white to-humsafar100">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-humsafar-600 mx-auto"></div>
          <p className="mt-4 text-humsafar-600">Loading package details...</p>
        </div>
        <Footer />
      </div>
    )
  }

  const IconComponent = packageDetails.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar50 via-white to-humsafar100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-humsafar-800 mb-4">
              Complete Your Purchase
            </h1>
            <p className="text-xl text-humsafar-600">
              You're just one step away from unlocking premium features
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Package Summary */}
            <Card className="h-fit">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <IconComponent className="w-16 h-16 text-humsafar-600" />
                </div>
                <CardTitle className="text-2xl text-humsafar-800">
                  {packageDetails.name}
                </CardTitle>
                <CardDescription className="text-lg">
                  {packageDetails.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center bg-humsafar-50 rounded-lg p-4">
                  <div className="text-4xl font-bold text-humsafar-600">
                    Rs. {packageDetails.price.toLocaleString()}
                  </div>
                  <div className="text-humsafar-600">
                    One-time payment
                  </div>
                </div>

                {/* Profile Views */}
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {packageDetails.profileViews} Profile Views
                  </div>
                  <div className="text-blue-600 text-sm">
                    Per month (5 free + {packageDetails.profileViews - 5} package)
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold text-humsafar-700 mb-3">Package Features:</h3>
                  <ul className="space-y-2">
                    {packageDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-humsafar-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Add-ons */}
                <div>
                  <h3 className="font-semibold text-humsafar-700 mb-3">Included Add-ons:</h3>
                  <div className="flex flex-wrap gap-2">
                    {packageDetails.addOns.map((addon) => (
                      <Badge key={addon} variant="secondary" className="bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" />
                        {addon}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-humsafar-800">
                  Payment Details
                </CardTitle>
                <CardDescription>
                  This is a dummy payment system for demonstration purposes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">Secure Payment</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    This is a demonstration payment system. No real payment will be processed.
                  </p>
                </div>

                {/* Package Summary */}
                <div className="bg-humsafar-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-humsafar-700">Package:</span>
                    <span className="font-semibold">{packageDetails.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-humsafar-700">Duration:</span>
                    <span className="font-semibold">{packageDetails.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-humsafar-700">Total:</span>
                    <span className="text-2xl font-bold text-humsafar-600">
                      Rs. {packageDetails.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Dummy Payment Input */}
                <div className="space-y-2">
                  <Label htmlFor="payment-details" className="text-humsafar-700">
                    Enter Dummy Payment Details
                  </Label>
                  <Input
                    id="payment-details"
                    placeholder="e.g., Card Number: 1234-5678-9012-3456"
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    className="border-humsafar-200"
                  />
                  <p className="text-sm text-humsafar-500">
                    This field is for demonstration purposes only
                  </p>
                </div>

                {/* Proceed Button */}
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-humsafar-600 hover:bg-humsafar-700 text-white font-semibold py-3 text-lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Proceed with Payment
                    </div>
                  )}
                </Button>

                {/* Terms */}
                <div className="text-center text-sm text-humsafar-500">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back to Packages */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => router.push('/packages')}
              className="border-humsafar-200 text-humsafar-600 hover:bg-humsafar-50"
            >
              ← Back to Packages
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
