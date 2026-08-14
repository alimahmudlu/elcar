import type { MetadataRoute } from "next";
import { fetchData } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";
import { LOCALES, SITE_URL } from "@/config/site";

export const revalidate = 3600;

type Doc = { slug?: string; updatedAt?: string; section?: string };

async function all(url: string): Promise<Doc[]> {
  const res = await fetchData(url);
  return (Array.isArray(res) ? res : res?.data) ?? [];
}

const STATIC_PATHS = [
  "",
  "/charging-stations",
  "/connectors-accessories",
  "/blog",
  "/about",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([
    all(`${ENDPOINTS.products.list}?noPagination=1`),
    all(`${ENDPOINTS.blog.list}?noPagination=1`),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.8,
      });
    }

    for (const p of products) {
      if (!p.slug) continue;
      // section: charging-stations | accessories | vehicles
      const segment =
        p.section === "accessories"
          ? "connectors-accessories"
          : p.section === "vehicles"
            ? "electric-vehicles"
            : "charging-stations";
      entries.push({
        url: `${SITE_URL}/${locale}/${segment}/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }

    for (const b of posts) {
      if (!b.slug) continue;
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${b.slug}`,
        lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
