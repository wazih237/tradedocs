'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  categories?: { id: string; name: string }[];
  markets?: { id: string; name: string }[];
  onResultsChange?: (count: number) => void;
}

export default function SearchBar({
  categories = [],
  markets = [],
  onResultsChange,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [selectedMarket, setSelectedMarket] = useState(
    searchParams.get('market') || ''
  );
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || '');
  const [resultCount, setResultCount] = useState(0);

  // Update URL and perform search
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.append('search', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedMarket) params.append('market', selectedMarket);
    if (priceRange) params.append('price', priceRange);

    const queryString = params.toString();
    const newUrl = queryString ? `/templates?${queryString}` : '/templates';

    router.push(newUrl, { shallow: true } as any);

    // Simulate fetching result count - replace with actual API call
    setResultCount(
      Math.floor(Math.random() * 50) + 10
    );
    onResultsChange?.(resultCount);
  }, [searchQuery, selectedCategory, selectedMarket, priceRange, router, onResultsChange]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedMarket('');
    setPriceRange('');
    router.push('/templates');
  };

  const hasActiveFilters =
    searchQuery || selectedCategory || selectedMarket || priceRange;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-brand-950">
          Filter Templates
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Template name, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Market Filter */}
      {markets.length > 0 && (
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Market
          </label>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
          >
            <option value="">All Markets</option>
            {markets.map((market) => (
              <option key={market.id} value={market.id}>
                {market.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
        >
          <option value="">All Prices</option>
          <option value="0-25">$0 - $25</option>
          <option value="25-50">$25 - $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100+">$100+</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-brand-600">{resultCount}</span> templates found
        </p>
      </div>
    </div>
  );
}
