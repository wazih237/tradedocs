import { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import TemplateGrid from "@/components/TemplateGrid";
import { templates, categories } from "@/data/templates";

export const metadata: Metadata = {
  title: "All Templates - Browse 256+ Trade Document Templates",
  description:
    "Browse and search 256+ professional commodity trade document templates. Filter by category, market, price. Contracts, shipping, SGS certificates, China compliance, and more.",
};

interface Props {
  searchParams: {
    q?: string;
    category?: string;
    market?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default function TemplatesPage({ searchParams }: Props) {
  let filtered = [...templates];

  // Search query
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.commodities.some((c) => c.toLowerCase().includes(q)) ||
        t.markets.some((m) => m.toLowerCase().includes(q))
    );
  }

  // Category filter
  if (searchParams.category) {
    filtered = filtered.filter((t) => t.category === searchParams.category);
  }

  // Market filter
  if (searchParams.market) {
    const market = searchParams.market.toLowerCase();
    filtered = filtered.filter((t) =>
      t.markets.some((m) => m.toLowerCase().includes(market))
    );
  }

  // Price filter
  if (searchParams.minPrice) {
    filtered = filtered.filter(
      (t) => t.price >= Number(searchParams.minPrice)
    );
  }
  if (searchParams.maxPrice) {
    filtered = filtered.filter(
      (t) => t.price <= Number(searchParams.maxPrice)
    );
  }

  // Sort by popularity
  filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-wide py-10">
          <h1 className="text-4xl font-bold text-brand-950 mb-3">
            All Templates
          </h1>
          <p className="text-lg text-gray-600">
            {templates.length} professional document templates for commodity and
            agricultural trading
          </p>
        </div>
      </div>

      {/* Search + Results */}
      <div className="container-wide py-8">
        <SearchBar categories={categories} resultCount={filtered.length} />
        <div className="mt-8">
          <TemplateGrid templates={filtered} />
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-2">No templates found</p>
            <p className="text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
