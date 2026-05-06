import Link from "next/link";
import { ShoppingBag, Mail, Phone, MessageCircle, MapPin } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%27m%20interested%20in%20your%20products";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const productCategories = [
  { label: "Men", href: "/shop?category=Men" },
  { label: "Women", href: "/shop?category=Women" },
  { label: "Kids", href: "/shop?category=Kids" },
  { label: "Uniforms", href: "/shop?category=Uniforms" },
  { label: "Sarees", href: "/shop?category=Sarees" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: About */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="h-7 w-7 text-blue-400" />
              <span className="text-xl font-bold text-white tracking-tight">
                Sri Garments
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Quality Garments, Trusted Craftsmanship. We bring you the finest
              selection of clothing for every occasion — crafted with care and
              delivered with pride.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Product Categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Product Categories
            </h3>
            <ul className="flex flex-col gap-2">
              {productCategories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <span>123, Garment Street, Chennai, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                <a
                  href="mailto:info@srigarments.com"
                  className="hover:text-blue-400 transition-colors"
                >
                  info@srigarments.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 shrink-0 text-blue-400" />
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="hover:text-blue-400 transition-colors"
                >
                  +91-XXXXXXXXXX
                </a>
              </li>
              <li className="mt-1">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Sri Garments. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Designed &amp; developed with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
