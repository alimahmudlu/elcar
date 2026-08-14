import type { Metadata } from "next";
import { HREFLANG, LOCALES, SITE_NAME, SITE_URL, type Locale } from "@/config/site";

/** Statik səhifələr üçün canonical + hreflang.
 *  path "/" və ya "/blog" formatındadır (dil prefiksi olmadan). */
export function alternatesFor(locale: string, path: string): Metadata["alternates"] {
  const clean = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[HREFLANG[l]] = `${SITE_URL}/${l}${clean}`;
  }
  languages["x-default"] = `${SITE_URL}/az${clean}`;
  return { canonical: `${SITE_URL}/${locale}${clean}`, languages };
}

/** Detal səhifələri üçün yalnız canonical.
 *  hreflang əlavə edilmir, çünki slug dillərə görə fərqlidir və API hazırda
 *  slug-ı yalnız cari dil üçün qaytarır. API `slug: {az,en,ru}` verəndə
 *  alternatesFor() məntiqi bura da tətbiq olunmalıdır. */
export function canonicalFor(locale: string, path: string): Metadata["alternates"] {
  return { canonical: `${SITE_URL}/${locale}${path}` };
}

type BuildArgs = {
  title: string;
  description?: string;
  locale: string;
  path: string;
  image?: string;
  /** true → hreflang da əlavə olunur (statik səhifələr) */
  withLanguages?: boolean;
  type?: "website" | "article";
};

export function buildMetadata({
  title, description, locale, path, image, withLanguages = false, type = "website",
}: BuildArgs): Metadata {
  const desc = (description || "").replace(/<[^>]*>/g, "").trim().slice(0, 300);
  return {
    title,
    description: desc || undefined,
    alternates: withLanguages ? alternatesFor(locale, path) : canonicalFor(locale, path),
    openGraph: {
      title,
      description: desc || undefined,
      url: `${SITE_URL}/${locale}${path === "/" ? "" : path}`,
      siteName: SITE_NAME,
      locale: HREFLANG[locale as Locale] ?? locale,
      type,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: desc || undefined,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/** Product + Offer JSON-LD */
export function productJsonLd(p: {
  title?: string;
  description?: string;
  image?: string;
  brand?: string;
  sku?: string;
  price?: number;
  discountedPrice?: number;
  inStock?: boolean;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    ...(p.image ? { image: [p.image] } : {}),
    ...(p.description
      ? { description: p.description.replace(/<[^>]*>/g, "").trim() }
      : {}),
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    ...(p.sku ? { sku: p.sku } : {}),
    offers: {
      "@type": "Offer",
      url: p.url,
      priceCurrency: "AZN",
      price: String(p.discountedPrice ?? p.price ?? ""),
      availability:
        p.inStock === false
          ? "https://schema.org/PreOrder"
          : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };
}
