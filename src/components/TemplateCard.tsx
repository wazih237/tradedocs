import Link from 'next/link';
import { Star, AlertCircle, CheckCircle } from 'lucide-react';

interface TemplateCardProps {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  markets: string[];
  mandatory: boolean;
  rating?: number;
  reviews?: number;
}

export default function TemplateCard({
  id,
  slug,
  name,
  category,
  categorySlug,
  price,
  markets,
  mandatory,
  rating = 0,
  reviews = 0,
}: TemplateCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Header Section */}
      <div className="p-5 border-b border-gray-100">
        {/* Category Badge */}
        <Link href={`/category/${categorySlug}`}>
          <span className="inline-block px-3 py-1 bg-blue-50 text-brand-600 text-xs font-semibold rounded-full hover:bg-blue-100 transition-colors mb-3">
            {category}
          </span>
        </Link>

        {/* Template Name */}
        <h3 className="text-lg font-semibold text-brand-950 truncate mb-2 hover:text-brand-600 transition-colors">
          <Link href={`/template/${slug}`}>{name}</Link>
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-gray-500">({reviews})</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1">
        {/* Markets */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {markets.slice(0, 2).map((market) => (
              <span
                key={market}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded"
              >
                {market}
              </span>
            ))}
            {markets.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                +{markets.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Mandatory/Optional Badge */}
        <div className="mb-4">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              mandatory
                ? 'bg-red-50 text-red-700'
                : 'bg-green-50 text-green-700'
            }`}
          >
            {mandatory ? (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                Mandatory
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                Optional
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-5 border-t border-gray-100 bg-gray-50">
        {/* Price and Button */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">Price</p>
            <p className="text-2xl font-bold text-brand-950">
              ${price.toFixed(2)}
            </p>
          </div>
          <Link
            href={`/template/${slug}`}
            className="flex-1 px-4 py-2.5 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors text-center whitespace-nowrap text-sm"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
