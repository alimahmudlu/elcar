import { Breadcrumbs } from "@mui/material";
import { AiOutlineRight } from "react-icons/ai";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE_URL } from "@/config/site";

export type Crumb = {
  label: string;
  /** Sonuncu (aktiv) element üçün verilmir — link olmamalıdır */
  href?: string;
};

type Props = {
  items: Crumb[];
  className?: string;
};

/**
 * Vahid breadcrumb komponenti.
 * - next-intl Link istifadə edir, dil prefiksi avtomatik qorunur
 * - sonuncu element link deyil (aria-current="page")
 * - BreadcrumbList JSON-LD yayımlayır
 */
export default async function Breadcrumb({ items, className }: Props) {
  const locale = await getLocale();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href
        ? { item: `${SITE_URL}/${locale}${item.href === "/" ? "" : item.href}` }
        : {}),
    })),
  };

  return (
    <>
      <Breadcrumbs
        separator={
          <AiOutlineRight className="w-3 h-3 dark:text-primary-foreground" />
        }
        aria-label="breadcrumb"
        className={className}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          if (isLast || !item.href) {
            return (
              <span
                key={i}
                aria-current="page"
                className="dark:text-primary-foreground"
              >
                {item.label}
              </span>
            );
          }
          return (
            <Link
              key={i}
              href={item.href}
              className={
                i === 0
                  ? "focused dark:text-primary-foreground"
                  : "dark:text-primary-foreground"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
