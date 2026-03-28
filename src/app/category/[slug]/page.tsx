import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import TemplateGrid from "@/components/TemplateGrid";
import { categories, templates } from "@/data/templates";
import { ChevronRight, Home } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categories.find((c) => c.id === params.slug);
  if (!category) return {};

  return {
    title: `${category.name} Templates - Download Professional Trade Documents`,
    description: `${category.templateCount}+ ${category.name.toLowerCase()} templates for commodity and agricultural trading. Editable .docx files with field placeholders. Instant download.`,
    openGraph: {
      title: `${category.name} Templates | TradeDocs`,
      description: category.description,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const category = categories.find((c) => c.id === params.slug);
  if (!category) notFound();

  const categoryTemplates = templates
    .filter((t) => t.category === category.id)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  const mandatoryCount = categoryTemplates.filter(
    (t) => t.status === "mandatory"
  ).length;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-wide py-3">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-brand-600 flex items-center">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/templates" className="hover:text-brand-600">
              Templates
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="container-wide py-10">
          <h1 className="text-4xl font-bold text-brand-950 mb-3">
            {category.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-4">
            {category.description}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="badge bg-brand-100 text-brand-800">
              {categoryTemplates.length} templates
            </span>
            {mandatoryCount > 0 && (
              <span className="badge-mandatory">
                {mandatoryCount} mandatory
              </span>
            )}
            <span className="text-gray-500">
              From ${Math.min(...categoryTemplates.map((t) => t.price))} to $
              {Math.max(...categoryTemplates.map((t) => t.price))}
            </span>
          </div>
        </div>
      </div>

      {/* Templates */}
      <div className="container-wide py-10">
        <TemplateGrid templates={categoryTemplates} />
      </div>
    </div>
  );
}
