import Link from "next/link"
import { Heart, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-humsafar-500 text-white" suppressHydrationWarning>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/humsafar-footer.png" alt="Humsafar Logo" className="w-48" />
            </div>
            <p className="text-humsafar-100 max-w-xl">Humsafar Forever Love is a sole proprietorship match-making service dedicated to helping people find not just a spouse, but a true life companion. With trust, privacy, and care at the heart of our work, we connect hearts to create lasting journeys of love.</p>
          </div>


          <div>
            <h5 className="font-semibold mb-4">Contact Info</h5>
            <div className="space-y-1 text-humsafar-100">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="break-all">+92 332 7355 681</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="break-all text-sm">info@humsafarforeverlove.com</span>
              </div>
            </div>
            <div className="mt-4">
              <h6 className="font-semibold mb-2">Follow Us</h6>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="https://facebook.com"
                  className="text-humsafar-100 hover:text-white transition-colors"
                  legacyBehavior>
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link
                  href="https://instagram.com"
                  className="text-humsafar-100 hover:text-white transition-colors"
                  legacyBehavior>
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link
                  href="https://twitter.com"
                  className="text-humsafar-100 hover:text-white transition-colors"
                  legacyBehavior>
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link
                  href="https://youtube.com"
                  className="text-humsafar-100 hover:text-white transition-colors"
                  legacyBehavior>
                  <Youtube className="w-5 h-5" />
                </Link>
                <Link
                  href="https://linkedin.com"
                  className="text-humsafar-100 hover:text-white transition-colors"
                  legacyBehavior>
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom white strip */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-600 text-sm">Powered & Designed by <a href="https://quantumnexa.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-gray-800 hover:text-blue-600 transition-colors">Quantamnexa</a> | &copy; 2024 Humsafar.pk. All rights reserved. </p>
        </div>
      </div>
    </footer>
  );
}
