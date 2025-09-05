import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Calendar, MapPin, Quote, Star, Share2, ThumbsUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SuccessStoriesPage() {
  const successStories = [
    {
      id: 1,
      couple: {
        bride: "Ayesha Khan",
        groom: "Ahmed Hassan",
        brideAge: 26,
        groomAge: 29,
        brideCity: "Karachi",
        groomCity: "Karachi",
        brideImage: "/placeholder.svg?height=150&width=150",
        groomImage: "/placeholder.svg?height=150&width=150",
      },
      weddingDate: "December 15, 2023",
      story:
        "We met through Humsafar.pk in January 2023. What started as a simple conversation about our shared love for technology and travel quickly blossomed into something beautiful. Ahmed's sense of humor and Ayesha's kindness made us realize we were perfect for each other. After 8 months of getting to know each other and our families, we tied the knot in a beautiful ceremony in Karachi.",
      testimonial:
        "Humsafar.pk made our dream come true. The platform's compatibility matching helped us find each other among thousands of profiles. We're grateful for this wonderful journey!",
      likes: 234,
      featured: true,
      tags: ["Love Marriage", "Same City", "Tech Couple"],
    },
    {
      id: 2,
      couple: {
        bride: "Fatima Ali",
        groom: "Omar Sheikh",
        brideAge: 24,
        groomAge: 27,
        brideCity: "Lahore",
        groomCity: "Islamabad",
        brideImage: "/placeholder.svg?height=150&width=150",
        groomImage: "/placeholder.svg?height=150&width=150",
      },
      weddingDate: "October 22, 2023",
      story:
        "Distance couldn't keep us apart! Omar was in Islamabad while I was in Lahore, but Humsafar.pk's detailed profiles helped us connect on a deeper level. We spent months video calling, sharing our dreams, and planning our future together. Our families met, and everyone could see how perfect we were for each other.",
      testimonial:
        "The verification system on Humsafar.pk gave us confidence that we were talking to genuine people. It made the whole process safe and trustworthy.",
      likes: 189,
      featured: false,
      tags: ["Long Distance", "Family Approved", "Doctor Couple"],
    },
    {
      id: 3,
      couple: {
        bride: "Zara Malik",
        groom: "Hassan Raza",
        brideAge: 28,
        groomAge: 31,
        brideCity: "Faisalabad",
        groomCity: "Multan",
        brideImage: "/placeholder.svg?height=150&width=150",
        groomImage: "/placeholder.svg?height=150&width=150",
      },
      weddingDate: "September 8, 2023",
      story:
        "As working professionals, we both had specific requirements for our life partners. Humsafar.pk's advanced filters helped us find exactly what we were looking for. Hassan's dedication to his career and family values aligned perfectly with my own. Our first meeting felt like we had known each other for years!",
      testimonial:
        "The detailed profiles and preference matching on Humsafar.pk saved us so much time. We found our perfect match without having to go through hundreds of incompatible profiles.",
      likes: 156,
      featured: true,
      tags: ["Professional Match", "Career Focused", "Perfect Timing"],
    },
    {
      id: 4,
      couple: {
        bride: "Sana Ahmed",
        groom: "Ali Khan",
        brideAge: 25,
        groomAge: 28,
        brideCity: "Peshawar",
        groomCity: "Peshawar",
        brideImage: "/placeholder.svg?height=150&width=150",
        groomImage: "/placeholder.svg?height=150&width=150",
      },
      weddingDate: "November 30, 2023",
      story:
        "We were both a bit skeptical about online matrimonial platforms, but our friends convinced us to try Humsafar.pk. The first conversation we had lasted for hours! We discovered we had so much in common - from our love for books to our dreams of traveling the world together. Six months later, we were engaged!",
      testimonial:
        "Humsafar.pk's user-friendly interface and genuine profiles made our search so much easier. We recommend it to all our single friends!",
      likes: 203,
      featured: false,
      tags: ["Book Lovers", "Travel Enthusiasts", "Quick Connection"],
    },
    {
      id: 5,
      couple: {
        bride: "Amna Hassan",
        groom: "Bilal Sheikh",
        brideAge: 27,
        groomAge: 30,
        brideCity: "Sialkot",
        groomCity: "Gujranwala",
        brideImage: "/placeholder.svg?height=150&width=150",
        groomImage: "/placeholder.svg?height=150&width=150",
      },
      weddingDate: "August 18, 2023",
      story:
        "After several unsuccessful attempts at finding the right person, we had almost given up hope. Then we found each other on Humsafar.pk! What attracted us to each other was our shared values and similar family backgrounds. Our families clicked instantly, and we knew this was meant to be.",
      testimonial:
        "Sometimes the best things come when you least expect them. Humsafar.pk brought us together at the perfect time in our lives.",
      likes: 167,
      featured: false,
      tags: ["Second Chance", "Family Values", "Destiny"],
    },
    {
      id: 6,
      couple: {
        bride: "Hira Ali",
        groom: "Usman Malik",
        brideAge: 23,
        groomAge: 26,
        brideCity: "Rawalpindi",
        groomCity: "Islamabad",
        brideImage: "/placeholder.svg?height=150&width=150",
        groomImage: "/placeholder.svg?height=150&width=150",
      },
      weddingDate: "July 5, 2023",
      story:
        "We were both young professionals just starting our careers when we met on Humsafar.pk. What began as casual conversations about our goals and aspirations turned into deep discussions about life, faith, and our future dreams. Despite our young age, we both knew we had found something special.",
      testimonial:
        "Age is just a number when you find the right person. Humsafar.pk helped us connect with someone who truly understood and supported our dreams.",
      likes: 145,
      featured: false,
      tags: ["Young Love", "Career Starters", "Supportive Partners"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-humsafar-100 rounded-full mb-6">
            <Heart className="h-8 w-8 text-humsafar-600 fill-current" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Success Stories</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real couples, real love stories. Discover how Humsafar.pk helped thousands of people find their perfect life
            partners and build beautiful relationships.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-humsafar-600 mb-2">2,500+</div>
              <p className="text-gray-600">Happy Couples</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-humsafar-600 mb-2">95%</div>
              <p className="text-gray-600">Success Rate</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-humsafar-600 mb-2">50+</div>
              <p className="text-gray-600">Cities Connected</p>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories Grid */}
        <div className="space-y-8">
          {successStories.map((story) => (
            <Card
              key={story.id}
              className={`overflow-hidden ${story.featured ? "ring-2 ring-humsafar-200 bg-gradient-to-r from-humsafar50 to-white" : ""}`}
            >
              {story.featured && (
                <div className="bg-humsafar-600 text-white text-center py-2">
                  <Badge variant="secondary" className="bg-white text-humsafar-600">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured Story
                  </Badge>
                </div>
              )}

              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Couple Photos */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <div className="text-center">
                        <Image
                          src={story.couple.brideImage || "/placeholder.svg"}
                          alt={story.couple.bride}
                          width={200}
                          height={200}
                          className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                        />
                        <h3 className="font-semibold text-gray-900">{story.couple.bride}</h3>
                        <p className="text-sm text-gray-600">{story.couple.brideAge} years</p>
                        <p className="text-xs text-gray-500 flex items-center justify-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {story.couple.brideCity}
                        </p>
                      </div>

                      <div className="flex flex-col items-center">
                        <Heart className="h-8 w-8 text-humsafar-600 fill-current mb-2" />
                        <span className="text-xs text-gray-500">+</span>
                      </div>

                      <div className="text-center">
                        <Image
                          src={story.couple.groomImage || "/placeholder.svg"}
                          alt={story.couple.groom}
                          width={200}
                          height={200}
                          className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                        />
                        <h3 className="font-semibold text-gray-900">{story.couple.groom}</h3>
                        <p className="text-sm text-gray-600">{story.couple.groomAge} years</p>
                        <p className="text-xs text-gray-500 flex items-center justify-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {story.couple.groomCity}
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                        <Calendar className="h-4 w-4 mr-2" />
                        Married on {story.weddingDate}
                      </div>

                      <div className="flex flex-wrap justify-center gap-2">
                        {story.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Story Content */}
                  <div className="lg:col-span-2">
                    <div className="mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                        {story.couple.bride} & {story.couple.groom}'s Love Story
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-6">{story.story}</p>

                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-humsafar-600">
                        <Quote className="h-5 w-5 text-humsafar-600 mb-2" />
                        <p className="text-gray-700 italic">"{story.testimonial}"</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-humsafar-600 hover:text-humsafar700">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          {story.likes} Likes
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Story
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 bg-gradient-to-r from-humsafar-600 to-humsafar700 rounded-2xl p-8 sm:p-12 text-white">
          <Heart className="h-12 w-12 mx-auto mb-6 fill-current" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Write Your Own Success Story?</h2>
          <p className="text-humsafar-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy couples who found their perfect match on Humsafar.pk. Your soulmate might be just
            one click away!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-humsafar-600 hover:bg-gray-100">
              <Link href="/auth">Start Your Journey</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-humsafar-600 bg-transparent"
            >
              <Link href="/profiles">Browse Profiles</Link>
            </Button>
          </div>
        </div>

        {/* Share Your Story Section */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Got Married Through Humsafar.pk?</h3>
            <p className="text-gray-600 mb-6">
              We'd love to hear your story! Share your journey and inspire others to find their perfect match.
            </p>
            <Button className="bg-humsafar-600 hover:bg-humsafar700">Share Your Story</Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
