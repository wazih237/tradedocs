import Link from 'next/link';
import { Check } from 'lucide-react';

export default function PricingBanner() {
  const pricingTiers = [
    {
      type: 'Individual',
      priceRange: '$15 - $45',
      description: 'Perfect for single templates',
      features: ['Single template access', 'Instant download', 'Email support'],
      cta: 'Browse Templates',
      ctaHref: '/templates',
      highlight: false,
    },
    {
      type: 'Category Bundle',
      priceRange: '$99 - $149',
      description: 'Complete category coverage',
      features: [
        'All templates in category',
        'Unlimited downloads',
        'Priority support',
        'Bundle discount included',
      ],
      cta: 'View Bundles',
      ctaHref: '/bundles',
      highlight: true,
    },
    {
      type: 'Complete Library',
      priceRange: '$499',
      description: 'Everything you need',
      features: [
        'All 256+ templates',
        'Lifetime updates',
        'Dedicated support',
        'Custom modifications',
      ],
      cta: 'Get Full Access',
      ctaHref: '/complete-library',
      highlight: false,
    },
  ];

  return (
    <section className="bg-brand-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Flexible Pricing Plans
          </h2>
          <p className="text-brand-200 text-lg">
            Choose the perfect plan for your trading operation
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => (
            <div
              key={tier.type}
              className={`rounded-lg p-8 transition-all duration-300 ${
                tier.highlight
                  ? 'bg-brand-600 text-white shadow-xl scale-105 md:scale-110'
                  : 'bg-brand-800 text-white hover:bg-brand-700'
              }`}
            >
              {/* Type */}
              <h3 className="text-2xl font-bold mb-2">
                {tier.type}
              </h3>

              {/* Description */}
              <p className="text-sm opacity-90 mb-4">
                {tier.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl sm:text-4xl font-bold">
                  {tier.priceRange}
                </div>
                <p className="text-sm opacity-75 mt-1">per item or bundle</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                href={tier.ctaHref}
                className={`block text-center py-3 px-6 font-semibold rounded-lg transition-all duration-300 ${
                  tier.highlight
                    ? 'bg-white text-brand-600 hover:bg-brand-50'
                    : 'bg-brand-600 text-white hover:bg-brand-500'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12 pt-8 border-t border-brand-800">
          <p className="text-brand-200 text-sm">
            Need a custom solution?{' '}
            <Link href="/contact" className="text-white font-semibold hover:underline">
              Contact our sales team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
