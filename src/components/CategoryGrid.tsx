import Link from 'next/link';
import {
  Archive,
  Award,
  Banknote,
  Building2,
  CheckCircle,
  CreditCard,
  FileCheck,
  FileText,
  Flame,
  FlaskConical,
  Gauge,
  Gavel,
  Globe,
  Leaf,
  MapPin,
  Receipt,
  ScrollText,
  Shield,
  Ship,
  Shirt,
  Trees,
  TrendingUp,
  Umbrella,
  UtensilsCrossed,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Category {
  id: string;
  slug: string;
  name: string;
  templateCount: number;
  description: string;
  icon?: string;
}

interface CategoryGridProps {
  categories: Category[];
}

const iconMap: Record<string, LucideIcon> = {
  Archive,
  Award,
  Banknote,
  Building2,
  CheckCircle,
  CreditCard,
  FileCheck,
  FileText,
  Flame,
  FlaskConical,
  Beaker: FlaskConical,
  Gauge,
  Gavel,
  Globe,
  Leaf,
  MapPin,
  Receipt,
  ScrollText,
  Shield,
  Ship,
  Shirt,
  Trees,
  TrendingUp,
  Umbrella,
  UtensilsCrossed,
  Zap,
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => {
        const IconComponent = (category.icon && iconMap[category.icon]) || FileText;
        return (
          <Link key={category.id} href={`/category/${category.slug}`} className="group">
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="mb-4 inline-block p-3 bg-blue-50 rounded-lg group-hover:bg-brand-600 transition-colors">
                <IconComponent className="w-6 h-6 text-brand-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-brand-950 mb-2 group-hover:text-brand-600 transition-colors">{category.name}</h3>
              <p className="text-sm font-medium text-brand-600 mb-3">{category.templateCount} templates</p>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{category.description}</p>
              <div className="inline-flex items-center text-brand-600 font-medium text-sm">Explore →</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
