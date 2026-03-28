'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';

interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Templates', href: '/templates' },
    { label: 'Categories', href: '/categories' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-brand-950 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-brand-600 rounded-md flex items-center justify-center font-bold text-white">
              TD
            </div>
            <span className="text-xl font-bold hidden sm:inline">TradeDocs</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-brand-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search and Cart - Desktop */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search templates..."
                className="pl-10 pr-4 py-2 rounded-lg bg-brand-800 text-white placeholder-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-600 w-48"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-400" />
            </div>
            <Link
              href="/cart"
              className="relative p-2 hover:bg-brand-800 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-brand-800 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-brand-800">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 px-4 hover:bg-brand-800 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 py-3 border-t border-brand-800 mt-2 space-y-3">
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-brand-800 text-white placeholder-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <Link
                href="/cart"
                className="flex items-center gap-2 py-2 px-4 hover:bg-brand-800 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="bg-brand-600 text-white text-xs font-bold rounded-full px-2 py-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
