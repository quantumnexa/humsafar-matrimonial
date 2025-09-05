import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-humsafar50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-humsafar-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl opacity-90 mb-8">We're here to help you find your perfect life partner</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <Card className="border-humsafar-100 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Send us a Message</CardTitle>
                <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <Input placeholder="Enter your first name" className="border-humsafar-200 focus:border-humsafar400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <Input placeholder="Enter your last name" className="border-humsafar-200 focus:border-humsafar400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="border-humsafar-200 focus:border-humsafar400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input placeholder="Enter your phone number" className="border-humsafar-200 focus:border-humsafar400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <Input placeholder="What is this regarding?" className="border-humsafar-200 focus:border-humsafar400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <Textarea
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    className="border-humsafar-200 focus:border-humsafar400"
                  />
                </div>
                <Button className="w-full bg-humsafar-600 hover:bg-humsafar700 text-white">Send Message</Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="border-humsafar-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-humsafar-100 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-humsafar-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                      <p className="text-gray-600">Call us anytime</p>
                    </div>
                  </div>
                  <p className="text-humsafar-600 font-semibold text-lg">+92 332 7355 681</p>
                </CardContent>
              </Card>

              <Card className="border-humsafar-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-humsafar-100 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-humsafar-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                      <p className="text-gray-600">Send us an email</p>
                    </div>
                  </div>
                  <p className="text-humsafar-600 font-semibold">info@humsafarforeverlove.com</p>
                </CardContent>
              </Card>

              <Card className="border-humsafar-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-humsafar-100 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-humsafar-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Office</h3>
                      <p className="text-gray-600">Visit our office</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                  R-552, block 16, Water Pump, FB Area, Gulberg Town,Karachi,Pakistan
                  </p>
                </CardContent>
              </Card>

              <Card className="border-humsafar-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-humsafar-100 p-3 rounded-full">
                      <Clock className="w-6 h-6 text-humsafar-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Business Hours</h3>
                      <p className="text-gray-600">When we're available</p>
                    </div>
                  </div>
                  <div className="text-gray-700 space-y-1">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-humsafar50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-humsafar-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I create a profile?</h3>
                <p className="text-gray-600">
                  Simply click on "Register Free" and fill out the registration form with your basic information and
                  preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="border-humsafar-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Is my information secure?</h3>
                <p className="text-gray-600">
                  Yes, we use advanced security measures to protect your personal information and ensure complete
                  privacy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-humsafar-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">How does the matching work?</h3>
                <p className="text-gray-600">
                  Our advanced algorithm matches you based on your preferences, location, education, and other
                  compatibility factors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-humsafar-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I upgrade my package later?</h3>
                <p className="text-gray-600">
                  You can upgrade to Premium or VIP packages at any time to access more features and better matches.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">Still Have Questions?</h2>
          <p className="text-xl mb-8 text-black">Our support team is here to help you 24/7</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-humsafar-600 text-white hover:bg-humsafar-700">
              <MessageCircle className="w-5 h-5 mr-2" />
              Live Chat
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-humsafar-600 text-humsafar-600 hover:bg-humsafar-600 hover:text-white bg-transparent"
            >
              Call Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
