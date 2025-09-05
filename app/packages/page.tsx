"use client"


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Crown, Zap, Sparkles, Eye, Shield, Rocket, CheckCircle, ArrowRight, Gift, MessageCircle, Clock, Users, TrendingUp, Target } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PackagesPage() {

  const packages = [
    {
      id: "free",
      name: "Free Membership",
      price: 0,
      duration: "Forever",
      color: "gray",
      icon: Star,
      popular: false,
      profileViews: 5,
      mainFeatures: [
        "5 profile views per month",
        "No expiry - Forever access",
      ],
      features: [
        "Create profile",
        "Upload photos",
        "View limited matches",
        "Express interest (limited)",
        "Receive matches from premium users",
        "Basic search filters",
        "Mobile app access",
      ],
      limitations: [
        "Limited to 5 profile views per month",
        "Cannot view contact details",
        "Basic customer support",
      ],
      addOns: [],
    },
    {
      id: "basic",
      name: "Basic Package",
      price: 5000,
      duration: "3 months",
      color: "blue",
      icon: Star,
      popular: false,
      profileViews: 20, // 15 + 5 free
      mainFeatures: [
        "20 profile views per month",
        "3 months validity",
      ],
      features: [
        "15 additional profile views",
        "50 contacts access",
        "Advanced search filters",
        "Profile views tracking",
        "Priority customer support",
        "Mobile app premium features",
        "Read receipts",
      ],
      addOns: ["Verified Badge"],
    },
    {
      id: "standard",
      name: "Standard Package",
      price: 8000,
      duration: "6 months",
      color: "pink",
      icon: Crown,
      popular: true,
      profileViews: 35, // 30 + 5 free
      mainFeatures: [
        "35 profile views per month",
        "6 months validity",
      ],
      features: [
        "30 additional profile views",
        "100 contacts access",
        "Priority listing",
        "Advanced matching algorithm",
        "Profile analytics",
        "Dedicated support",
        "Profile boost (monthly)",
      ],
      addOns: ["Verified Badge", "Boost Profile", "Spotlight Profile"],
    },
    {
      id: "premium",
      name: "Premium Package",
      price: 13000,
      duration: "12 months",
      color: "purple",
      icon: Zap,
      popular: false,
      profileViews: 55, // 50 + 5 free
      mainFeatures: [
        "55 profile views per month",
        "12 months validity",
      ],
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
        "Unlimited everything",
      ],
      addOns: ["Verified Badge", "Boost Profile", "Spotlight Profile"],
    },
  ]

  const addOnServices = [
    {
      name: "Verified Badge",
      price: 0,
      duration: "Included",
      description: "Blue checkmark for profile authenticity - Included in all packages",
      icon: Shield,
      included: true,
    },
    {
      name: "Boost Profile",
      price: 500,
      duration: "24 hours",
      description: "Increased visibility and profile views - Available in Standard & Premium",
      icon: Rocket,
      included: false,
    },
    {
      name: "Spotlight Profile",
      price: 1500,
      duration: "7 days",
      description: "Top search result placement for maximum visibility - Available in Standard & Premium",
      icon: TrendingUp,
      included: false,
    },
  ]

  const getColorClasses = (color: string, isPopular = false) => {
    const colors = {
      gray: {
        border: "border-gray-200",
        bg: "bg-gray-50",
        text: "text-gray-600",
        button: "bg-gray-600 hover:bg-gray-700",
        badge: "bg-gray-100 text-gray-800",
      },
      blue: {
        border: "border-blue-200",
        bg: "bg-blue-50",
        text: "text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700",
        badge: "bg-blue-100 text-blue-800",
      },
      pink: {
        border: isPopular ? "border-humsafar-500 ring-2 ring-humsafar-200" : "border-humsafar-200",
        bg: "bg-humsafar50",
        text: "text-humsafar-600",
        button: "bg-humsafar-600 hover:bg-humsafar700",
        badge: "bg-humsafar-100 text-humsafar-800",
      },
      purple: {
        border: "border-purple-200",
        bg: "bg-purple-50",
        text: "text-purple-600",
        button: "bg-purple-600 hover:bg-purple-700",
        badge: "bg-purple-100 text-purple-800",
      },
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const handleChoosePlan = (packageId: string) => {
    // Redirect to dummy payment page
    window.location.href = `/packages/payment?package=${packageId}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Crown className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Premium Matrimonial Plans</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Choose Your Perfect
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Matrimonial Plan
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Unlock premium features and connect with verified profiles to find your perfect life partner. 
              Every plan includes 5 free profile views plus additional benefits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-humsafar-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg"
                onClick={() => document.getElementById('packages-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View All Plans
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white bg-transparent text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-3 rounded-full backdrop-blur-sm"
                onClick={() => document.getElementById('profile-view-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                How It Works
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-lg"></div>
        </div>

        {/* Profile View System */}
        <section id="profile-view-section" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Smart Profile View System</h2>
              <p className="text-xl text-gray-600">Transparent and intelligent profile viewing with clear usage tracking</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* How It Works Card */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-humsafar-600 rounded-full flex items-center justify-center mb-6">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">How It Works</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Free Profile Views</h4>
                        <p className="text-sm text-gray-600">Every user gets 5 free profile views to explore potential matches</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-humsafar-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Package Limits</h4>
                        <p className="text-sm text-gray-600">Purchase packages to unlock additional profile views and premium features</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Examples Card */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-humsafar-600 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Examples</h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-green-800">Free Membership</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-green-600" />
                          <span className="font-bold text-green-600">5</span>
                        </div>
                      </div>
                      <p className="text-sm text-green-600">Total Profile Views: 5 (0 + 5 free)</p>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-blue-800">Basic Package</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-blue-600">20</span>
                        </div>
                      </div>
                      <p className="text-sm text-blue-600">Total Profile Views: 20 (15 + 5 free)</p>
                    </div>
                    
                    <div className="bg-humsafar-50 border border-humsafar-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-humsafar-800">Premium Package</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-humsafar-600" />
                          <span className="font-bold text-humsafar-600">55</span>
                        </div>
                      </div>
                      <p className="text-sm text-humsafar-600">Total Profile Views: 55 (50 + 5 free)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits Card */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-humsafar-600 rounded-full flex items-center justify-center mb-6">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Benefits</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">Transparent usage tracking</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">Smart matching recommendations</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">Privacy protection guaranteed</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">Real-time compatibility scoring</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>



        {/* Packages Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div id="packages-section">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-humsafar-800 mb-4">
                  Choose Your Perfect Plan
                </h2>
                <p className="text-lg text-humsafar-600 max-w-2xl mx-auto">
                  Select the plan that best fits your needs and start your journey to find your perfect match
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packages.map((pkg) => {
                const colors = getColorClasses(pkg.color, pkg.popular)
                const displayPrice = pkg.price
                const displayDuration = pkg.duration

                  return (
                    <Card
                      key={pkg.id}
                      className={`relative bg-white border shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden ${
                        pkg.popular ? "border-humsafar-300 shadow-lg" : "border-gray-200"
                      }`}
                    >
                      {/* Popular Badge */}
                      {pkg.popular && (
                        <div className="absolute top-0 left-0 right-0 bg-humsafar-600 text-white text-center py-2 text-sm font-medium">
                          Most Popular
                        </div>
                      )}

                      <CardHeader className={`text-center ${pkg.popular ? 'pt-12 pb-6' : 'pt-6 pb-6'}`}>
                        <div className="flex justify-center mb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            pkg.popular ? 'bg-humsafar-600' : 'bg-humsafar-100'
                          }`}>
                            <pkg.icon className={`w-6 h-6 ${
                              pkg.popular ? 'text-white' : 'text-humsafar-600'
                            }`} />
                          </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                          {pkg.name}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {pkg.duration}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Price */}
                        <div className="text-center border-b border-gray-100 pb-4">
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            {pkg.price === 0 ? 'Free' : `Rs. ${displayPrice.toLocaleString()}`}
                          </div>
                          {pkg.price > 0 && (
                            <div className="text-sm text-gray-500">
                              per package
                            </div>
                          )}
                        </div>

                        {/* Profile Views */}
                        <div className="text-center bg-gray-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-humsafar-600 mb-1">
                            {pkg.profileViews}
                          </div>
                          <div className="text-xs text-gray-600">
                            Profile Views/Month
                          </div>
                        </div>
                           
                        {/* Main Features */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Key Features</h4>
                          <ul className="space-y-2">
                            {pkg.mainFeatures.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Add-ons */}
                        {pkg.addOns.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Included Add-ons</h4>
                            <div className="flex flex-wrap gap-1">
                              {pkg.addOns.map((addon) => (
                                <Badge 
                                  key={addon} 
                                  className="bg-humsafar-100 text-humsafar-700 text-xs px-2 py-1 rounded"
                                >
                                  {addon}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Choose Plan Button */}
                        <Button
                          onClick={() => handleChoosePlan(pkg.id)}
                          className={`w-full font-medium py-2 rounded-lg transition-colors ${
                            pkg.popular 
                              ? 'bg-humsafar-600 hover:bg-humsafar-700 text-white'
                              : pkg.id === 'free'
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-humsafar-600 hover:bg-humsafar-700 text-white'
                          }`}
                          disabled={pkg.id === "free"}
                        >
                          {pkg.id === "free" ? "Current Plan" : "Choose Plan"}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

      {/* Add-ons Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-humsafar-600 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-humsafar-800 mb-4">
                Premium Add-on Services
              </h2>
              <p className="text-lg text-humsafar-600 max-w-2xl mx-auto">
                Enhance your matrimonial journey with our exclusive add-on services designed to maximize your success.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {addOnServices.map((addon, index) => (
                <Card key={addon.name} className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-humsafar-100 rounded-lg flex items-center justify-center">
                        <addon.icon className="w-8 h-8 text-humsafar-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">{addon.name}</CardTitle>
                    <CardDescription className="text-gray-600 text-sm">{addon.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <div className="mb-4 border-b border-gray-100 pb-4">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {addon.included ? "Included" : `Rs. ${addon.price}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {addon.duration}
                      </div>
                    </div>
                    {addon.included ? (
                      <Badge className="bg-green-100 text-green-700 px-3 py-1 text-sm rounded">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Included in All Packages
                      </Badge>
                    ) : (
                      <Badge className="bg-humsafar-100 text-humsafar-700 px-3 py-1 text-sm rounded">
                        <Crown className="w-4 h-4 mr-1" />
                        Standard & Premium Only
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-humsafar-50 via-white to-humsafar-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-full mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-humsafar-800 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-humsafar-600 max-w-3xl mx-auto leading-relaxed">
              Get answers to common questions about our packages and services.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="group">
              <div className="bg-white rounded-2xl border-2 border-humsafar-100 hover:border-humsafar-300 transition-all duration-300 hover:shadow-xl p-6">
                <h3 className="text-xl font-bold text-humsafar-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-full flex items-center justify-center mr-3">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  How do profile views work?
                </h3>
                <p className="text-humsafar-600 leading-relaxed pl-11">
                  Every user gets 5 free profile views per month, whether they're logged in or not. 
                  When you purchase a package, the package limit is added to your free views. 
                  For example, Basic package (15) gives you 15 + 5 = 20 total profile views per month.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-2xl border-2 border-humsafar-100 hover:border-humsafar-300 transition-all duration-300 hover:shadow-xl p-6">
                <h3 className="text-xl font-bold text-humsafar-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-full flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  What happens when I reach my profile view limit?
                </h3>
                <p className="text-humsafar-600 leading-relaxed pl-11">
                  When you reach your monthly limit, you won't be able to view new profiles until 
                  the next month. You can still view profiles you've already seen before.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-2xl border-2 border-humsafar-100 hover:border-humsafar-300 transition-all duration-300 hover:shadow-xl p-6">
                <h3 className="text-xl font-bold text-humsafar-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-full flex items-center justify-center mr-3">
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                  Are add-ons included in packages?
                </h3>
                <p className="text-humsafar-600 leading-relaxed pl-11">
                  Verified Badge is included in all packages. Boost Profile and Spotlight Profile 
                  are available only in Standard and Premium packages.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-2xl border-2 border-humsafar-100 hover:border-humsafar-300 transition-all duration-300 hover:shadow-xl p-6">
                <h3 className="text-xl font-bold text-humsafar-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  Can I view profiles without logging in?
                </h3>
                <p className="text-humsafar-600 leading-relaxed pl-11">
                  Yes! You can view up to 5 profiles per month without creating an account. 
                  After reaching this limit, you'll need to login to continue viewing profiles 
                  or upgrade to a premium package for more views.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  )
}
