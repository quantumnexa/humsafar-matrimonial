import Link from "next/link"
import { Heart, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-humsafar-500 text-white" suppressHydrationWarning>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/humsafar-footer.png" alt="Humsafar Logo" className="w-48" />
            </div>
            <p className="text-humsafar-100">Pakistan's most trusted matrimonial platform</p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-humsafar-100">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-white transition-colors">
                  Packages
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="hover:text-white transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/consultants" className="hover:text-white transition-colors">
                  Rishta Consultants
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Support</h5>
            <ul className="space-y-2 text-humsafar-100">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Contact Info</h5>
            <div className="space-y-2 text-humsafar-100">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+92 332 7355 681</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
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
        <div className="border-t border-humsafar-400 mt-8 pt-8 text-center text-humsafar-100">
          <p>&copy; 2024 Humsafar.pk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
