import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { label: 'Contracts', href: '/category/contracts' },
    { label: 'Shipping', href: '/category/shipping' },
    { label: 'Inspection', href: '/category/inspection' },
    { label: 'Certification', href: '/category/certification' },
    { label: 'Finance', href: '/category/finance' },
    { label: 'Compliance', href: '/category/compliance' },
  ];

  const resources = [
    { label: 'Blog', href: '/blog' },
    { label: 'Guides', href: '/guides' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  const legal = [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Refund Policy', href: '/refund' },
  ];

  return (
    <footer className="bg-brand-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Four Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-md flex items-center justify-center font-bold">
                TD
              </div>
              <h3 className="text-lg font-bold">TradeDocs</h3>
            </div>
            <p className="text-brand-300 text-sm mb-4">
              Professional commodity and agricultural trade document templates trusted by traders in 50+ countries.
            </p>
            <div className="space-y-2 text-sm text-brand-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@tradedocs.io</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Amsterdam, Netherlands</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Categories</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-brand-300 hover:text-white transition-colors text-sm"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.href}>
                  <Link
                    href={resource.href}
                    className="text-brand-300 hover:text-white transition-colors text-sm"
                  >
                    {resource.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-brand-300 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="border-t border-brand-800 pt-8">
          <p className="text-center text-brand-400 text-sm">
            &copy; {currentYear} TradeDocs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
