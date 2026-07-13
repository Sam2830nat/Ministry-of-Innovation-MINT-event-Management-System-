import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <Logo size="lg" className="mb-6" />
          <p className="text-sm leading-relaxed max-w-sm">
            Official event platform for Ethiopia&apos;s Ministry of Innovation and Technology (MInT).
            Coordinate research, innovation, ICT, and technology programs nationwide.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
            <li><Link href="#about-mint" className="hover:text-brand transition-colors">About MInT</Link></li>
            <li><Link href="/login" className="hover:text-brand transition-colors">Login</Link></li>
            <li>
              <a
                href="http://www.mint.gov.et/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand transition-colors"
              >
                mint.gov.et
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand shrink-0" />
              Addis Ababa, Ethiopia
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand shrink-0" />
              contact@mint.gov.et
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand shrink-0" />
              +251 11 813 2191
            </li>
          </ul>
        </div>

      </div>

      {/* Separator */}
      <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} MInT — Ministry of Innovation and Technology Event Management System. All rights reserved.
      </div>
    </footer>
  );
}