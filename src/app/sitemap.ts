import { MetadataRoute } from "next";
import { templates, categories } from "@/data/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tradedocs.com";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/templates`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const templatePages = templates.map((template) => ({
    url: `${baseUrl}/template/${template.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...templatePages];
}
