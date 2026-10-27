import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/common/Breadcrumb";
import { getProductsByIds } from "@/api/request";
import { productPath } from "@/config/sections";
import { COMPARE_LIMIT } from "@/lib/compareStore";
import type { ProductType } from "@/types";
import CompareTable, {
  type CompareColumn,
  type CompareRow,
} from "../components/compare/CompareTable";

const BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;

type SearchParams = Promise<{ ids?: string }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compare" });
  return { title: t("title"), robots: { index: false, follow: true } };
}

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) => {
  const { locale } = await params;
  const t = await getTranslations();
  const sp = await searchParams;

  const text = (value: unknown): string | null => {
    if (Array.isArray(value)) return value.filter(Boolean).join(", ") || null;
    // checkbox tipli xüsusiyyətlər true/false (və ya "true"/"false") gəlir
    if (value === true || value === "true") return t("compare.yes");
    if (value === false || value === "false") return t("compare.no");
    if (value === null || value === undefined || value === "") return null;
    return String(value);
  };

  const ids = (sp?.ids ?? "")
    .split(",")
    .filter((id) => /^[a-f0-9]{24}$/i.test(id))
    .slice(0, COMPARE_LIMIT);

  const fetched: ProductType[] = ids.length ? await getProductsByIds(ids) : [];
  // API sırası fərqli ola bilər — istifadəçinin seçdiyi sıra saxlanılır
  const products = ids
    .map((id) => fetched.find((p) => p._id === id))
    .filter((p): p is ProductType => Boolean(p));

  const columns: CompareColumn[] = products.map((p) => ({
    _id: p._id,
    title: p.title,
    href: productPath(p.section, p.slug),
    image: p.image?.src ? `${BASE_URL}/${p.image.src.replace(/^\/+/, "")}` : undefined,
  }));

  const rows: CompareRow[] = [
    {
      label: t("compare.price"),
      values: products.map((p) => {
        const price = p.discountedPrice ?? p.price;
        return price ? `${price} AZN` : t("sections.price-on-request");
      }),
    },
    { label: t("compare.brand"), values: products.map((p) => text(p.brand?.name)) },
    { label: t("compare.model"), values: products.map((p) => text(p.model?.name)) },
    { label: t("compare.category"), values: products.map((p) => text(p.category?.name)) },
    { label: t("product-facts.sku"), values: products.map((p) => text(p.sku)) },
    {
      label: t("product-facts.warranty"),
      values: products.map((p) =>
        p.warranty
          ? p.warranty % 12 === 0
            ? t("product-facts.years", { n: p.warranty / 12 })
            : t("product-facts.months", { n: p.warranty })
          : null
      ),
    },
  ];

  // Bütün məhsulların xüsusiyyətləri adına görə birləşdirilir
  const specLabels: string[] = [];
  const specs = products.map((p) => {
    const map = new Map<string, string | null>();
    (p.characteristicGroups ?? []).forEach((group) =>
      (group.characteristics ?? []).forEach((char) => {
        if (!char?.name || char.visible === false) return;
        if (!specLabels.includes(char.name)) specLabels.push(char.name);
        map.set(char.name, text(char.value));
      })
    );
    return map;
  });
  specLabels.forEach((label) =>
    rows.push({ label, values: specs.map((map) => map.get(label) ?? null) })
  );

  // Heç bir məhsulda dəyəri olmayan sətirlər göstərilmir
  const filledRows = rows.filter((row) => row.values.some((v) => v !== null));

  return (
    <section className="container max-md:max-w-[90%] mt-20 mb-10">
      <Breadcrumb
        items={[{ label: "Elcar", href: "/" }, { label: t("compare.title") }]}
      />
      <h1 className="text-3xl md:text-4xl font-black mt-4 text-title dark:text-primary-foreground">
        {t("compare.title")}
      </h1>

      {products.length === 0 ? (
        <p className="mt-6 text-subtitle dark:text-secondary-foreground">
          {t("compare.empty")}
        </p>
      ) : (
        <CompareTable locale={locale} columns={columns} rows={filledRows} />
      )}
    </section>
  );
};

export default Page;
