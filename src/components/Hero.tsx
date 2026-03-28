'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { value: '256+', label: 'Templates' },
    { value: '28', label: 'Categories' },
    { value: '50+', label: 'Countries' },
    { value: '$25', label: 'Avg Price' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/templates?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-950 mb-6 leading-tight">
            Professional Trade Document Templates for Commodity & Agricultural Business
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            256+ ready-to-use templates for contracts, shipping, inspections, certifications, and trade finance. Used by traders in 50+ countries.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-16">
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search templates by name, category, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600 focus:ring-opacity-20 transition-all text-gray-900 placeholder-gray-500"
                />
                <Search className="absolute right-4 top-4 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-gray-200">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-brand-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-gray-700">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm mb-4 font-medium">
            Trusted by commodity traders & agricultural businesses
          </p>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            {['GAFTA', 'ISO Certified', 'SOX Compliant', 'GDPR Ready'].map((badge) => (
              <div
                key={badge}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 text-sm font-medium shadow-sm"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
