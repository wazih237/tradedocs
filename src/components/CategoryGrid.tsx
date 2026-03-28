import Link from 'next/link';
import {
  FileText,
  Truck,
  CheckCircle,
  Award,
  DollarSign,
  Shield,
  LucideIcon,
} from 'lucide-react';

interface Category {
  id: string;
  slug: string;
  name: string;
  templateCount: number;
  description: string;
  icon?: 'contract' | 'shipping' | 'inspection' | 'certification' | 'finance' | 'compliance';
}

interface CategoryGridProps {
  categories: Category[];
}

const iconMap: Record<string, LucideIcon> = {
  contract: FileText,
  shipping: Truck,
  inspection: CheckCircle,
  certification: Award,
  finance: DollarSign,
  compliance: Shield,
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => {
        const IconComponent = category.icon ? iconMap[category.icon] : FileText;

        return (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group"
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              {/* Icon */}
              <div className="mb-4 inline-block p-3 bg-blue-50 rounded-lg group-hover:bg-brand-600 transition-colors">
                <IconComponent className="w-6 h-6 text-brand-600 group-hover:text-white transition-colors" />
              </div>

              {/* Category Name */}
              <h3 className="text-lg font-semibold text-brand-950 mb-2 group-hover:text-brand-600 transition-colors">
                {category.name}
              </h3>

              {/* Template Count */}
              <p className="text-sm font-medium text-brand-600 mb-3">
                {category.templateCount} templates
              </p>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {category.description}
              </p>

              {/* CTA */}
              <div className="inline-flex items-center text-brand-600 font-medium text-sm group-hover:gap-2 transition-all">
                Explore
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
