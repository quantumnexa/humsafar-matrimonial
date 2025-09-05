"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Users,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  CheckCircle,
  ArrowRight,
  MapPin,
  GraduationCap,
  Briefcase,
  User,
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { ProfileFilterService } from "@/lib/profileFilterService"
import { ProfileViewService } from "@/lib/profileViewService"

// Helper function to capitalize text
const capitalizeText = (text: string | null | undefined): string => {
  if (!text) return ''
  return text.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState<boolean>(true)
  const [isClient, setIsClient] = useState(false)
  const [viewedProfileIds, setViewedProfileIds] = useState<Set<string>>(new Set())

  // Note: suppressHydrationWarning is used throughout this component to prevent
  // hydration mismatches caused by browser extensions (like Bitdefender) that
  // inject attributes like 'bis_skin_checked' into the DOM after server rendering

  useEffect(() => {
    setIsClient(true)
    
    // Auto-logout admin users when visiting homepage
    const adminAuth = localStorage.getItem("humsafar_admin_auth")
    if (adminAuth === "true") {
      // Clear admin auth
      localStorage.removeItem("humsafar_admin_auth")
      document.cookie = "humsafar_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      
      // Clear any other admin-related data
      localStorage.removeItem("supabase.auth.token")
      
      // Optional: Show a toast or redirect
      console.log("Admin session cleared - redirected to homepage")
    }
    
    // Check user authentication
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // Fetch viewed profiles for authenticated users
        fetchViewedProfiles()
      }
    } catch (error) {
      console.error('Error checking authentication:', error)
    }
  }

  const fetchViewedProfiles = async () => {
    try {
      const result = await ProfileViewService.getViewedProfilesThisMonth()
      if (result.success && result.data) {
        const viewedIds = new Set(result.data.map(view => view.viewed_profile_user_id))
        setViewedProfileIds(viewedIds)
      }
    } catch (error) {
      console.error('Error fetching viewed profiles:', error)
    }
  }

  const handleViewProfile = async (profileId: string) => {
    if (!user) {
      // For non-authenticated users, just navigate
      window.location.href = `/profile/${profileId}`
      return
    }

    // Check if already viewed
    if (viewedProfileIds.has(profileId)) {
      // Already viewed, just navigate
      window.location.href = `/profile/${profileId}`
      return
    }

    // Check if user can view more profiles
    const canView = await ProfileViewService.canUserViewMoreProfiles()
    if (!canView.success || !canView.canView) {
      alert(`You have reached your view limit. ${canView.message || 'Upgrade your subscription to view more profiles.'}`)
      return
    }

    // Record the view and navigate
    const result = await ProfileViewService.recordProfileView(profileId)
    if (result.success) {
      // Update local state
      setViewedProfileIds(prev => new Set(Array.from(prev).concat(profileId)))
      // Navigate to profile
      window.location.href = `/profile/${profileId}`
    } else {
      alert(result.message || 'Failed to record profile view')
    }
  }


  const heroSlides = [
    {
      id: 1,
      title: "Find Your Perfect Life Partner",
      subtitle: "Join thousands of successful matches on Pakistan's most trusted matrimonial platform",
      image: "/wedding-couple-hero-1.jpg",
      cta: "Start Your Journey",
    },
    {
      id: 2,
      title: "Verified Profiles, Genuine Connections",
      subtitle: "Every profile is verified for authenticity and security",
      image: "/wedding-couple-hero-2.jpg",
      cta: "Browse Profiles",
    },
    {
      id: 3,
      title: "Success Stories That Inspire",
      subtitle: "Over 50,000 happy couples found their soulmate through Hamsafar",
      image: "/wedding-couple-hero-3.jpg",
      cta: "Read Stories",
    },
  ]

  const stats = [
    { label: "Active Members", value: "2.5M+", icon: Users },
    { label: "Success Stories", value: "50K+", icon: Heart },
    { label: "Verified Profiles", value: "95%", icon: Shield },
    { label: "Average Rating", value: "4.8", icon: Star },
  ]

  const features = [
    {
      title: "Advanced Matching",
      description: "AI-powered compatibility matching based on preferences, values, and lifestyle",
      icon: Heart,
    },
    {
      title: "Verified Profiles",
      description: "Every profile goes through rigorous verification for authenticity",
      icon: Shield,
    },
    {
      title: "Privacy Protection",
      description: "Your personal information is secure with our advanced privacy controls",
      icon: CheckCircle,
    },
    {
      title: "24/7 Support",
      description: "Our dedicated support team is available round the clock to help you",
      icon: Users,
    },
  ]

  const successStories = [
    {
      id: 1,
      names: "Ahmed & Fatima",
      location: "Karachi",
      story:
        "We found each other through Hamsafar and couldn't be happier. The platform made it so easy to connect with like-minded people.",
      image: "/placeholder.svg?height=300&width=400",
      date: "Married in 2023",
    },
    {
      id: 2,
      names: "Hassan & Ayesha",
      location: "Lahore",
      story: "After months of searching, we found our perfect match. Hamsafar's matching algorithm really works!",
      image: "/placeholder.svg?height=300&width=400",
      date: "Married in 2024",
    },
    {
      id: 3,
      names: "Ali & Zara",
      location: "Islamabad",
      story: "From the first conversation to our wedding day, everything felt perfect. Thank you Hamsafar!",
      image: "/placeholder.svg?height=300&width=400",
      date: "Married in 2024",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const currentUserId = user?.id

  // Helper function to calculate profile completion percentage
  const calculateProfileCompletion = (profile: any): number => {
    const fields = [
      'first_name', 'last_name', 'email', 'phone', 'age', 'gender', 
      'city', 'religion', 'sect', 'caste', 'mother_tongue', 
      'marital_status', 'nationality', 'ethnicity', 'education', 'field_of_study'
    ]
    
    let completedFields = 0
    fields.forEach(field => {
      if (profile[field] && profile[field].toString().trim() !== '') {
        completedFields++
      }
    })
    
    // Add bonus for having photos
    if (profile.has_photos) {
      completedFields += 2 // Photos are worth more
    }
    
    return Math.round((completedFields / (fields.length + 2)) * 100)
  }

  const fetchFeatured = useCallback(async () => {
    try {
      console.log('🏠 HOMEPAGE: Starting to fetch featured profiles...')
      
      // Use the new ProfileFilterService to get filtered profiles
      const result = await ProfileFilterService.getFilteredProfiles({
        currentUserId,
        excludeCurrentUser: true, // Always exclude current user from featured section
        maxProfiles: 4, // Show max 4 on homepage
        isFeaturedSection: true
      })
      
      console.log(`🏠 HOMEPAGE: ProfileFilterService returned ${result.profiles.length} profiles`)
      console.log('🏠 HOMEPAGE: Total available approved profiles:', result.totalAvailable)
      
      if (result.profiles.length > 0) {
        console.log('🏠 HOMEPAGE: Completion percentages:', result.profiles.map(p => `${p.first_name}: ${p.completionPercentage}%`))
      }
      
      setFeaturedProfiles(result.profiles)
      // Step 1: Get all approved user IDs from user_subscriptions
      const { data: approvedSubscriptions, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('user_id')
        .eq('profile_status', 'approved')
      
      if (subscriptionError) {
        console.error('🏠 HOMEPAGE: Error fetching approved subscriptions:', subscriptionError)
        
        // Fallback: Try to get some profiles if subscription query fails
        console.log('🏠 HOMEPAGE: Trying fallback due to subscription error...')
        let query = supabase
          .from('user_profiles')
          .select(`
            user_id,
            first_name,
            last_name,
            email,
            phone,
            age,
            gender,
            city,
            religion,
            sect,
            caste,
            mother_tongue,
            marital_status,
            nationality,
            ethnicity,
            education,
            field_of_study,
            created_at,
            updated_at
          `)
        
        // Only filter out current user if they are logged in
        if (currentUserId) {
          query = query.neq('user_id', currentUserId)
        }
        
        const { data: fallbackProfiles, error: fallbackError } = await query
          .order('created_at', { ascending: false })
          .limit(4)
        
        if (fallbackError) {
          console.error('🏠 HOMEPAGE: Fallback also failed:', fallbackError)
          
          setLoadingFeatured(false)
          return
        }
        
        if (fallbackProfiles && fallbackProfiles.length > 0) {
          console.log(`🏠 HOMEPAGE: Fallback successful! Found ${fallbackProfiles.length} profiles`)
          const fallbackFinalProfiles = await Promise.all(
            fallbackProfiles.map(async (profile) => {
              let mainImage = '/placeholder.jpg'
              try {
                const { data: images } = await supabase
                  .from('user_images')
                  .select('image_url, is_main')
                  .eq('user_id', profile.user_id)
                  .order('is_main', { ascending: false })
                  .limit(1)
                
                if (images && images.length > 0) {
                  mainImage = images[0].image_url
                }
              } catch (error) {
                console.log(`🏠 HOMEPAGE: No images found for fallback user ${profile.user_id}`)
              }
              
              return {
                ...profile,
                id: profile.user_id,
                mainImage,
                has_photos: mainImage !== '/placeholder.jpg'
              }
            })
          )
          
          // Calculate completion percentage and sort by highest completion first
          const fallbackWithCompletion = fallbackFinalProfiles.map(profile => ({
            ...profile,
            completionPercentage: calculateProfileCompletion(profile)
          }))
          
          // Sort by completion percentage (highest first)
          fallbackWithCompletion.sort((a, b) => b.completionPercentage - a.completionPercentage)
          
          console.log(`🏠 HOMEPAGE: Fallback profiles sorted by completion`)
          console.log('🏠 HOMEPAGE: Completion percentages:', fallbackWithCompletion.map(p => `${p.first_name}: ${p.completionPercentage}%`))
          
          setFeaturedProfiles(fallbackWithCompletion)
          setLoadingFeatured(false)
          return
        }
        
        setFeaturedProfiles([])
        setLoadingFeatured(false)
        return
      }
      
      if (!approvedSubscriptions || approvedSubscriptions.length === 0) {
        console.log('🏠 HOMEPAGE: No approved subscriptions found')
        
        // Fallback: Try to get some profiles if no approved subscriptions
        console.log('🏠 HOMEPAGE: Trying fallback due to no approved subscriptions...')
        const { data: fallbackProfiles, error: fallbackError } = await supabase
          .from('user_profiles')
          .select(`
            user_id,
            first_name,
            last_name,
            email,
            phone,
            age,
            gender,
            city,
            religion,
            sect,
            caste,
            mother_tongue,
            marital_status,
            nationality,
            ethnicity,
            education,
            field_of_study,
            created_at,
            updated_at
          `)
          .order('created_at', { ascending: false })
          .limit(4)
        
        if (fallbackError) {
          console.error('🏠 HOMEPAGE: Fallback also failed:', fallbackError)
          setFeaturedProfiles([])
          setLoadingFeatured(false)
          return
        }
        
        if (fallbackProfiles && fallbackProfiles.length > 0) {
          console.log(`🏠 HOMEPAGE: Fallback successful! Found ${fallbackProfiles.length} profiles`)
          const fallbackFinalProfiles = await Promise.all(
            fallbackProfiles.map(async (profile) => {
              let mainImage = '/placeholder.jpg'
              try {
                const { data: images } = await supabase
                  .from('user_images')
                  .select('image_url, is_main')
                  .eq('user_id', profile.user_id)
                  .order('is_main', { ascending: false })
                  .limit(1)
                
                if (images && images.length > 0) {
                  mainImage = images[0].image_url
                }
              } catch (error) {
                console.log(`🏠 HOMEPAGE: No images found for fallback user ${profile.user_id}`)
              }
              
              return {
                ...profile,
                id: profile.user_id,
                mainImage,
                has_photos: mainImage !== '/placeholder.jpg'
              }
            })
          )
          
          // Calculate completion percentage and sort by highest completion first
          const fallbackWithCompletion = fallbackFinalProfiles.map(profile => ({
            ...profile,
            completionPercentage: calculateProfileCompletion(profile)
          }))
          
          // Sort by completion percentage (highest first)
          fallbackWithCompletion.sort((a, b) => b.completionPercentage - a.completionPercentage)
          
          console.log(`🏠 HOMEPAGE: Fallback profiles sorted by completion`)
          console.log('🏠 HOMEPAGE: Completion percentages:', fallbackWithCompletion.map(p => `${p.first_name}: ${p.completionPercentage}%`))
          
          setFeaturedProfiles(fallbackWithCompletion)
          setLoadingFeatured(false)
          return
        }
        
        setFeaturedProfiles([])
        setLoadingFeatured(false)
        return
      }
      
      const approvedUserIds = approvedSubscriptions.map(sub => sub.user_id)
      console.log(`🏠 HOMEPAGE: Found ${approvedUserIds.length} approved user IDs:`, approvedUserIds)
      
      // Step 2: Fetch profiles for approved users from user_profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select(`
          user_id,
          first_name,
          last_name,
          email,
          phone,
          age,
          gender,
          city,
          religion,
          sect,
          caste,
          mother_tongue,
          marital_status,
          nationality,
          ethnicity,
          education,
          field_of_study,
          created_at,
          updated_at
        `)
        .in('user_id', approvedUserIds)
        .order('created_at', { ascending: false })
      
      if (profilesError) {
        console.error('🏠 HOMEPAGE: Error fetching profiles:', profilesError)
        setLoadingFeatured(false)
        return
      }
      
      if (!profilesData || profilesData.length === 0) {
        console.log('🏠 HOMEPAGE: No profiles found for approved users')
        setFeaturedProfiles([])
        setLoadingFeatured(false)
        return
      }
      
      console.log(`🏠 HOMEPAGE: Found ${profilesData.length} approved profiles`)
      
      // Step 3: Process profiles and add images
      const finalProfiles = await Promise.all(
        profilesData.map(async (profile) => {
          // Try to get profile image
          let mainImage = '/placeholder.jpg'
          
          try {
            const { data: images } = await supabase
              .from('user_images')
              .select('image_url, is_main')
              .eq('user_id', profile.user_id)
              .order('is_main', { ascending: false })
              .limit(1)
            
            if (images && images.length > 0) {
              // Construct proper public URL for Supabase storage
              const imageUrl = images[0].image_url
              if (imageUrl && imageUrl !== '/placeholder.jpg') {
                // Check if imageUrl is already a full URL
                if (imageUrl.startsWith('http')) {
                  mainImage = imageUrl
                } else {
                  mainImage = `https://kzmfreck4dxcc4cifgls.supabase.co/storage/v1/object/public/humsafar-user-images/${imageUrl}`
                }
              }
            }
          } catch (error) {
            console.log(`🏠 HOMEPAGE: No images found for user ${profile.user_id}`)
          }
          
          return {
            ...profile,
            id: profile.user_id,
            mainImage,
            has_photos: mainImage !== '/placeholder.jpg'
          }
        })
      )
      
      // Step 4: Calculate completion percentage and sort by highest completion first
      const profilesWithCompletion = finalProfiles.map(profile => ({
        ...profile,
        completionPercentage: calculateProfileCompletion(profile)
      }))
      
      // Sort by completion percentage (highest first)
      profilesWithCompletion.sort((a, b) => b.completionPercentage - a.completionPercentage)
      
      console.log(`🏠 HOMEPAGE: Final result: ${profilesWithCompletion.length} approved profiles sorted by completion`)
      console.log('🏠 HOMEPAGE: Completion percentages:', profilesWithCompletion.map(p => `${p.first_name}: ${p.completionPercentage}%`))
      
      setFeaturedProfiles(profilesWithCompletion.slice(0, 4)) // Show max 4 on homepage
      setLoadingFeatured(false)
      
    } catch (error: any) {
      console.error('🏠 HOMEPAGE: Error in fetchFeatured:', error)
      setFeaturedProfiles([])
      setLoadingFeatured(false)
    }
  }, [currentUserId])

  useEffect(() => {
    fetchFeatured()
  }, [fetchFeatured])

  return (
    <div className="min-h-screen bg-white" suppressHydrationWarning>
      <Header />
      {/* Hero Section with Slider */}
      <section className="relative h-[600px] overflow-hidden" suppressHydrationWarning>
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
            }`}
          >
            <div
              className="h-full bg-cover bg-top relative"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">{slide.title}</h1>
                  <p className="text-xl md:text-2xl mb-8 opacity-90">{slide.subtitle}</p>
                  <Button size="lg" className="bg-humsafar-600 hover:bg-humsafar-700 text-lg px-8 py-3">
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>
      {/* Dashboard Section - Only for authenticated users */}
      {/* {user && (
        <section className="py-12 bg-gradient-to-r from-humsafar-50 to-humsafar-50" suppressHydrationWarning>
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto border-humsafar-200 shadow-lg">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome Back!
                </h2>
                <p className="text-gray-600 mb-6">
                  Access your dashboard to manage your profile, view matches, and more
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button className="bg-humsafar-500 hover:bg-humsafar-600 text-white px-8 py-3">
                      <User className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )} */}
      {/* Quick Search Section */}
      <section className="py-16 bg-gray-50" suppressHydrationWarning>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Match</h2>
            <p className="text-xl text-gray-600">Search from thousands of verified profiles</p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Looking for" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bride">Bride</SelectItem>
                    <SelectItem value="groom">Groom</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-25">18-25 years</SelectItem>
                    <SelectItem value="26-30">26-30 years</SelectItem>
                    <SelectItem value="31-35">31-35 years</SelectItem>
                    <SelectItem value="36-40">36-40 years</SelectItem>
                    <SelectItem value="40+">40+ years</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="karachi">Karachi</SelectItem>
                    <SelectItem value="lahore">Lahore</SelectItem>
                    <SelectItem value="islamabad">Islamabad</SelectItem>
                    <SelectItem value="rawalpindi">Rawalpindi</SelectItem>
                    <SelectItem value="faisalabad">Faisalabad</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="bg-humsafar-600 hover:bg-humsafar-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              <div className="text-center">
                <Link
                  href="/profiles"
                  className="text-humsafar-600 hover:text-humsafar-700 font-medium">
                  Advanced Search <ArrowRight className="h-4 w-4 inline ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Featured Profiles Section */}
      <section className="py-16 bg-white" suppressHydrationWarning>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Profiles</h2>
            <p className="text-xl text-gray-600">Discover verified profiles of potential life partners</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {loadingFeatured && (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                {/* Compact Spinning Loader */}
                <div className="relative mb-4">
                  <div className="w-12 h-12 border-4 border-humsafar-100 border-t-humsafar-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-humsafar-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                
                {/* Loading Text */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">Loading Profiles</h3>
                  <p className="text-sm text-gray-500">Please wait...</p>
                </div>
                
                {/* Loading Dots Animation */}
                <div className="flex space-x-1 mt-3">
                  <div className="w-1.5 h-1.5 bg-humsafar-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-humsafar-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-humsafar-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            {!loadingFeatured && featuredProfiles.length === 0 && (
              <div className="text-center text-gray-600 col-span-full py-8">
                <p className="text-lg mb-2">No verified profiles to display at the moment.</p>
               
              </div>
            )}
            {featuredProfiles.map((profile) => {
              // Debug: Log profile image data
              console.log(`🏠 HOMEPAGE: Profile ${profile.id} image data:`, {
                mainImage: profile.mainImage,
                hasMainImage: !!profile.mainImage,
                imageUrl: profile.mainImage,
                profileId: profile.id,
                userId: profile.id
              })
              
              // Build full name including middle name and capitalize properly
              let name = 'Unnamed'
              if (profile.first_name || profile.last_name) {
                const nameParts = [profile.first_name, profile.last_name].filter(Boolean)
                name = nameParts.map(part => capitalizeText(part)).join(' ')
              } else if (profile.display_name) {
                name = capitalizeText(profile.display_name)
              } else if (profile.username) {
                name = capitalizeText(profile.username)
              }
              
              // Combine education + field of study
              let edu = 'Education not specified'
              if (profile.education && profile.field_of_study) {
                edu = `${capitalizeText(profile.education)} in ${capitalizeText(profile.field_of_study)}`
              } else if (profile.education) {
                edu = capitalizeText(profile.education)
              } else if (profile.degree) {
                edu = capitalizeText(profile.degree)
              } else if (profile.qualification) {
                edu = capitalizeText(profile.qualification)
              }
              
              const city = capitalizeText(profile.city || profile.location || profile.current_city || 'Location not specified')

              return (
                <Card
                  key={profile.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow border-humsafar-100 group flex flex-col h-full min-h-[400px]"
                >
                  <div className="relative">
                    {profile.mainImage && profile.mainImage !== '/placeholder.jpg' ? (
                    <Image
                      src={profile.mainImage}
                      alt={name}
                      width={400}
                      height={400}
                      className="w-full h-80 object-contain object-top group-hover:scale-105 transition-transform duration-300 bg-black"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement
                          console.log(`🏠 HOMEPAGE: Image failed to load for profile ${profile.id}:`, profile.mainImage)
                        target.src = '/placeholder.jpg'
                      }}
                        onLoad={() => {
                          console.log(`🏠 HOMEPAGE: Image loaded successfully for profile ${profile.id}:`, profile.mainImage)
                        }}
                        priority={true}
                      />
                    ) : (
                      <div className="w-full h-80 bg-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <div className="text-center text-gray-400">
                          <User className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">No Photo</p>
                        </div>
                      </div>
                    )}
                    {profile.premium && <Badge className="absolute top-3 left-3 bg-humsafar-600 text-xs">Premium</Badge>}

                  </div>
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="mb-3 flex-grow">
                      {/* User ID Display */}
                      <div className="text-center mb-3">
                        <span className="inline-block bg-humsafar-100 text-humsafar-800 px-4 py-2 rounded-full text-lg font-bold">
                          {profile.id.substring(0, 8).toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="space-y-1 mb-3 text-gray-600 text-sm">
                        {profile.age && (
                          <div className="flex items-center">
                            <span className="text-gray-700 text-sm font-medium w-20 mr-2">Age:</span>
                            <Calendar className="w-3 h-3 text-humsafar-500 mr-2" />
                            <span className="text-gray-600 text-sm">{profile.age} years</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className="text-gray-700 text-sm font-medium w-20 mr-2">Education:</span>
                          <GraduationCap className="w-3 h-3 text-humsafar-500 mr-2" />
                          <span className="text-gray-600 text-sm truncate">{edu}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-700 text-sm font-medium w-20 mr-2">Location:</span>
                          <MapPin className="w-3 h-3 text-humsafar-500 mr-2" />
                          <span className="text-gray-600 text-sm">{city}</span>
                        </div>
                        {profile.religion && (
                          <div className="flex items-center">
                            <span className="text-gray-700 text-sm font-medium w-20 mr-2">Religion:</span>
                            <User className="w-3 h-3 text-humsafar-500 mr-2" />
                            <span className="text-gray-600 text-sm">{capitalizeText(profile.religion)}</span>
                          </div>
                        )}
                        {profile.marital_status && (
                          <div className="flex items-center">
                            <span className="text-gray-700 text-sm font-medium w-20 mr-2">Status:</span>
                            <Heart className="w-3 h-3 text-humsafar-500 mr-2" />
                            <span className="text-gray-600 text-sm">{capitalizeText(profile.marital_status)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button 
                        onClick={() => handleViewProfile(profile.id)}
                        className={`w-full text-sm py-2 ${
                          viewedProfileIds.has(profile.id)
                            ? 'bg-gray-500 hover:bg-gray-600 text-white'
                            : 'bg-humsafar-600 hover:bg-humsafar-700 text-white'
                        }`}
                      >
                        {viewedProfileIds.has(profile.id) ? 'View Again' : 'View Profile'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );})}
          </div>

          <div className="text-center">
            <Link href="/profiles" legacyBehavior>
              <Button size="lg" className="bg-humsafar-600 hover:bg-humsafar-700 text-white px-8 py-3">
                See More Profiles
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-gray-50" suppressHydrationWarning>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-humsafar-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-humsafar-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-white" suppressHydrationWarning>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Hamsafar?</h2>
            <p className="text-xl text-gray-600">Pakistan's most trusted matrimonial platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-humsafar-100 rounded-full mb-4">
                    <feature.icon className="h-8 w-8 text-humsafar-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Success Stories */}
      <section className="py-16 bg-gray-50" suppressHydrationWarning>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Real couples, real love stories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200">
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={story.names}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{story.names}</h3>
                    <Badge variant="outline" className="text-humsafar-600 border-humsafar-600">
                      {story.location}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{story.story}"</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {story.date}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/success-stories" legacyBehavior>
              <Button
                variant="outline"
                size="lg"
                className="border-humsafar-600 text-humsafar-600 hover:bg-humsafar-50 bg-transparent"
              >
                View All Success Stories
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-white" suppressHydrationWarning>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Ready to Find Your Life Partner?</h2>
          <p className="text-xl text-humsafar-500/90 mb-8">Join millions of people who found love on Hamsafar</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" legacyBehavior>
              <Button size="lg" className="bg-humsafar-600 text-white hover:bg-gray-100 px-8 py-3">
                Create Free Profile
              </Button>
            </Link>
            <Link href="/profiles" legacyBehavior>
              <Button
                size="lg"
                variant="outline"
                className="border-humsafar-600 text-humsafar-600 hover:bg-humsafar/10 px-8 py-3 bg-transparent"
              >
                Browse Profiles
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
