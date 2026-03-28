import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, templates } from "@/data/templates";
import BuyButton from "@/components/BuyButton";
import TemplateGrid from "@/components/TemplateGrid";
import {
  ChevronRight,
  Home,
  FileText,
  Download,
  Shield,
  Clock,
  Globe,
  CheckCircle,
} from "lucide-react";

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  return templates.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const template = templates.find((t) => t.id === params.id);
  if (!template) return {};

  const category = categories.find((c) => c.id === template.category);

  return {
    title: `${template.name} Template - Download Now`,
    description: `${template.description} Professional editable .docx template for commodity trading. ${template.status === "mandatory" ? "MANDATORY document." : ""} $${template.price} instant download.`,
    openGraph: {
      title: `${template.name} | TradeDocs`,
      description: template.description,
    },
  };
}

export default function TemplatePage({ params }: Props) {
  const template = templates.find((t) => t.id === params.id);
  if (!template) notFound();

  const category = categories.find((c) => c.id === template.category);

  // Related templates from same category
  const related = templates
    .filter((t) => t.category === template.category && t.id !== template.id)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 3);

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
            {category && (
              <>
                <Link
                  href={`/category/${category.id}`}
                  className="hover:text-brand-600"
                >
                  {category.name}
                </Link>
                <ChevronRight className="w-4 h-4 mx-2" />
              </>
            )}
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {template.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container-wide py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border p-8">
              {/* Status badges */}
              <div className="flex items-center gap-2 mb-4">
                {template.status === "mandatory" && (
                  <span className="badge-mandatory">Mandatory</span>
                )}
                {template.status === "recommended" && (
                  <span className="badge-recommended">Recommended</span>
                )}
                {template.status === "optional" && (
                  <span className="badge-optional">Optional</span>
                )}
                {category && (
                  <Link
                    href={`/category/${category.id}`}
                    className="badge bg-brand-100 text-brand-800 hover:bg-brand-200 transition-colors"
                  >
                    {category.name}
                  </Link>
                )}
              </div>

              <h1 className="text-3xl font-bold text-brand-950 mb-4">
                {template.name}
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                {template.description}
              </p>

              {/* Markets */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Applicable Markets
                </h3>
                <div className="flex flex-wrap gap-2">
                  {template.markets.map((market) => (
                    <span key={market} className="badge-market">
                      <Globe className="w-3 h-3 mr-1" />
                      {market}
                    </span>
                  ))}
                </div>
              </div>

              {/* Commodities */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Commodities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {template.commodities.map((commodity) => (
                    <span
                      key={commodity}
                      className="badge bg-gray-100 text-gray-700"
                    >
                      {commodity}
                    </span>
                  ))}
                </div>
              </div>

              {/* What's included */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-brand-950 mb-4">
                  What You Get
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Editable .docx file with field placeholders",
                    "Usage instructions on page 1",
                    "Regulatory framework reference",
                    "Commodity-specific language",
                    "Professional formatting & layout",
                    "Instant download after purchase",
                  ].map((item) => (
                    <div key={item} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Purchase card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 rounded-full mb-4">
                  <FileText className="w-8 h-8 text-brand-600" />
                </div>
                <div className="text-4xl font-bold text-brand-950 mb-1">
                  ${template.price}
                </div>
                <div className="text-sm text-gray-500">One-time purchase</div>
              </div>

              <BuyButton
                templateId={template.id}
                price={template.price}
                name={template.name}
              />

              <div className="mt-6 space-y-3">
                {[
                  { icon: Download, text: "Instant download" },
                  { icon: FileText, text: "Editable .docx format" },
                  { icon: Shield, text: "30-day money-back guarantee" },
                  { icon: Clock, text: "Lifetime access to updates" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <Icon className="w-4 h-4 text-brand-600 mr-2" />
                    {text}
                  </div>
                ))}
              </div>

              {/* Bundle upsell */}
              <div className="mt-6 p-4 bg-accent-50 rounded-lg border border-accent-200">
                <p className="text-sm font-semibold text-accent-800 mb-1">
                  Save with a bundle
                </p>
                <p className="text-xs text-accent-700">
                  Get the entire {category?.name} category for $99-$149.
                  That&apos;s up to 70% off individual prices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Templates */}
      {related.length > 0 && (
        <section className="py-10 bg-white border-t">
          <div className="container-wide">
            <h2 className="text-2xl font-bold text-brand-950 mb-6">
              Related Templates
            </h2>
            <TemplateGrid templates={related} />
          </div>
        </section>
      )}
    </div>
  );
}
