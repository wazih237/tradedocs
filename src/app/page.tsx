import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import TemplateGrid from "@/components/TemplateGrid";
import PricingBanner from "@/components/PricingBanner";
import { categories, templates } from "@/data/templates";

export default function HomePage() {
  // Get featured/popular templates sorted by popularity
  const featured = [...templates]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 6);

  // Get mandatory templates (high value for SEO + conversions)
  const mandatory = templates
    .filter((t) => t.status === "mandatory")
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 6);

  return (
    <>
      <Hero />

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-brand-950 mb-2">
            Browse by Category
          </h2>
          <p className="text-gray-600 mb-8">
            28 specialized categories covering every stage of commodity trading
          </p>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* Most Popular */}
      <section className="py-16 bg-gray-50">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-brand-950 mb-2">
            Most Popular Templates
          </h2>
          <p className="text-gray-600 mb-8">
            The templates commodity traders download most
          </p>
          <TemplateGrid templates={featured} />
        </div>
      </section>

      {/* Mandatory Documents */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-brand-950 mb-2">
            Mandatory Compliance Documents
          </h2>
          <p className="text-gray-600 mb-8">
            Required by law for market entry. Missing these blocks your trade.
          </p>
          <TemplateGrid templates={mandatory} />
        </div>
      </section>

      {/* Pricing */}
      <PricingBanner />

      {/* Trust / SEO section */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-brand-950 mb-8 text-center">
            Trusted by Commodity Traders Worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-brand-600 mb-2">256+</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">
                Professional Templates
              </div>
              <p className="text-gray-600">
                Covering GAFTA, FOSFA, UCP 600, GACC, SGS, and 20+ regulatory
                frameworks
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-brand-600 mb-2">28</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">
                Specialized Categories
              </div>
              <p className="text-gray-600">
                From FCOs and contracts to China customs declarations and FTA
                certificates of origin
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-brand-600 mb-2">
                Instant
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-2">
                Download & Edit
              </div>
              <p className="text-gray-600">
                Every template is an editable .docx file with field placeholders
                and usage instructions
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
