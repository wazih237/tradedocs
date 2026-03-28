import TemplateCard from './TemplateCard';

interface Template {
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

interface TemplateGridProps {
  templates: Template[];
  title?: string;
}

export default function TemplateGrid({ templates, title }: TemplateGridProps) {
  return (
    <div className="w-full">
      {title && (
        <h2 className="text-3xl font-bold text-brand-950 mb-8">
          {title}
        </h2>
      )}

      {templates.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-600 text-lg">
            No templates found. Try adjusting your filters or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              id={template.id}
              slug={template.slug}
              name={template.name}
              category={template.category}
              categorySlug={template.categorySlug}
              price={template.price}
              markets={template.markets}
              mandatory={template.mandatory}
              rating={template.rating}
              reviews={template.reviews}
            />
          ))}
        </div>
      )}
    </div>
  );
}
