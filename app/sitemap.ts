import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// O site tem só três páginas públicas: início, sobre nós e equoterapia.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/sobre`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/equoterapia`, changeFrequency: "monthly", priority: 0.9 },
  ];
}
