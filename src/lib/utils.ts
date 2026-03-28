import { Template, Category, TemplateSearchParams } from './types';
import { templates, categories } from '@/data/templates';

/**
 * Format price as USD currency string
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Convert string to URL-friendly slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get category by ID
 */
export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find((cat) => cat.id === categoryId);
}

/**
 * Get all templates for a specific category
 */
export function getTemplatesByCategory(categoryId: string): Template[] {
  return templates.filter((template) => template.category === categoryId);
}

/**
 * Get featured/popular templates
 */
export function getFeaturedTemplates(limit = 12): Template[] {
  return [...templates]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

/**
 * Get trending templates (high popularity and recent)
 */
export function getTrendingTemplates(limit = 8): Template[] {
  return [...templates]
    .filter((t) => t.popularity >= 80)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

/**
 * Search templates with multiple filter criteria
 */
export function searchTemplates(params: TemplateSearchParams): Template[] {
  let results = [...templates];

  // Text search
  if (params.query) {
    const query = params.query.toLowerCase();
    results = results.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.commodities.some((c) => c.toLowerCase().includes(query))
    );
  }

  // Category filter
  if (params.category) {
    results = results.filter((t) => t.category === params.category);
  }

  // Status filter
  if (params.status) {
    results = results.filter((t) => t.status === params.status);
  }

  // Commodities filter
  if (params.commodities && params.commodities.length > 0) {
    results = results.filter((t) =>
      params.commodities!.some((c) =>
        t.commodities.some((tc) => tc.toLowerCase() === c.toLowerCase())
      )
    );
  }

  // Price range filter
  if (params.minPrice !== undefined) {
    results = results.filter((t) => t.price >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    results = results.filter((t) => t.price <= params.maxPrice!);
  }

  // Sorting
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'popularity':
        results.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
  }

  return results;
}

/**
 * Get templates by commodity type
 */
export function getTemplatesByCommodity(commodity: string): Template[] {
  return templates.filter((t) =>
    t.commodities.some((c) => c.toLowerCase() === commodity.toLowerCase())
  );
}

/**
 * Get templates by status (mandatory/recommended/optional)
 */
export function getTemplatesByStatus(status: 'mandatory' | 'recommended' | 'optional'): Template[] {
  return templates.filter((t) => t.status === status);
}

/**
 * Get all unique commodities across templates
 */
export function getAllCommodities(): string[] {
  const commodities = new Set<string>();
  templates.forEach((t) => t.commodities.forEach((c) => commodities.add(c)));
  return Array.from(commodities).sort();
}

/**
 * Get all unique markets across templates
 */
export function getAllMarkets(): string[] {
  const markets = new Set<string>();
  templates.forEach((t) => t.markets.forEach((m) => markets.add(m)));
  return Array.from(markets).sort();
}

/**
 * Get template by ID
 */
export function getTemplateById(templateId: string): Template | undefined {
  return templates.find((t) => t.id === templateId);
}

/**
 * Get related templates (same category or commodity)
 */
export function getRelatedTemplates(templateId: string, limit = 6): Template[] {
  const template = getTemplateById(templateId);
  if (!template) return [];

  const related = templates.filter(
    (t) =>
      t.id !== templateId &&
      (t.category === template.category ||
        t.commodities.some((c) => template.commodities.includes(c)))
  );

  return related.slice(0, limit);
}

/**
 * Get category statistics
 */
export function getCategoryStats(): Array<{
  categoryId: string;
  categoryName: string;
  templateCount: number;
  avgPrice: number;
  avgPopularity: number;
}> {
  return categories.map((cat) => {
    const catTemplates = getTemplatesByCategory(cat.id);
    const avgPrice =
      catTemplates.length > 0
        ? catTemplates.reduce((sum, t) => sum + t.price, 0) / catTemplates.length
        : 0;
    const avgPopularity =
      catTemplates.length > 0
        ? catTemplates.reduce((sum, t) => sum + t.popularity, 0) / catTemplates.length
        : 0;

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      templateCount: catTemplates.length,
      avgPrice: Math.round(avgPrice),
      avgPopularity: Math.round(avgPopularity),
    };
  });
}

/**
 * Calculate total price for multiple templates
 */
export function calculateBundlePrice(templateIds: string[]): number {
  return templateIds.reduce((total, id) => {
    const template = getTemplateById(id);
    return total + (template?.price || 0);
  }, 0);
}

/**
 * Get bundle discount (optional)
 */
export function calculateBundleDiscount(templateIds: string[]): number {
  const quantity = templateIds.length;

  if (quantity >= 10) return 0.2; // 20% discount
  if (quantity >= 5) return 0.15; // 15% discount
  if (quantity >= 3) return 0.1; // 10% discount

  return 0;
}

/**
 * Get final price after bundle discount
 */
export function getDiscountedBundlePrice(templateIds: string[]): {
  originalPrice: number;
  discount: number;
  discountAmount: number;
  finalPrice: number;
} {
  const originalPrice = calculateBundlePrice(templateIds);
  const discount = calculateBundleDiscount(templateIds);
  const discountAmount = originalPrice * discount;
  const finalPrice = originalPrice - discountAmount;

  return {
    originalPrice,
    discount,
    discountAmount,
    finalPrice,
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Get random featured templates (for homepage showcase)
 */
export function getRandomFeaturedTemplates(limit = 6): Template[] {
  const shuffled = [...templates].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}

/**
 * Check if template is on sale (for future use)
 */
export function isOnSale(templateId: string): boolean {
  // Placeholder for future sale logic
  return false;
}

/**
 * Get sale price (for future use)
 */
export function getSalePrice(templateId: string): number | null {
  // Placeholder for future sale pricing
  return null;
}
