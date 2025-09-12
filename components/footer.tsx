import Link from "next/link"
import { Heart, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-humsafar-500 text-white" suppressHydrationWarning>
      <div className="container mx-auto px-8 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/humsafar-footer.png" alt="Humsafar Logo" className="w-48" />
            </div>
            <p className="text-humsafar-100 max-w-xl">Humsafar Forever Love is a sole proprietorship match-making service dedicated to helping people find not just a spouse, but a true life companion. With trust, privacy, and care at the heart of our work, we connect hearts to create lasting journeys of love.</p>
          </div>
          <div>
            <ul className="space-y-2 text-humsafar-100 hidden md:block">
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/match-making-process" className="hover:text-white transition-colors">
                  Match Making Process
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/about" className="hover:text-white transition-colors">
                  About 
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/terms-of-use" className="hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/shaadee-alerts" className="hover:text-white transition-colors">
                   Alerts
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/how-do-we-stand-out" className="hover:text-white transition-colors">
                  How do we stand out?
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/100-secure" className="hover:text-white transition-colors">
                  100% Secure
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/match-guarantee" className="hover:text-white transition-colors">
                  Match Guarantee
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2 text-humsafar-100 hidden md:block">
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/we-care" className="hover:text-white transition-colors">
                  We Care
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/word-from-ceo" className="hover:text-white transition-colors">
                  Word from the CEO
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/technical-issues" className="hover:text-white transition-colors">
                  Technical Issues
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/how-to-use-shaadee" className="hover:text-white transition-colors">
                  How to use 
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/bank-accounts" className="hover:text-white transition-colors">
                  Bank Accounts
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/faqs" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li className="flex items-center">
                <img src="/bullet.svg" alt="bullet" className="w-3 h-3 mr-3 flex-shrink-0" />
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Contact Info</h5>
            <div className="space-y-1 text-humsafar-100">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span>+92 332 7355 681</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span>info@humsafarforeverlove.com</span>
              </div>
            </div>
            <div className="mt-4">
              <h6 className="font-semibold mb-2">Follow Us</h6>
              <div className="flex space-x-3">
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