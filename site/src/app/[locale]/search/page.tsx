import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/common/Breadcrumb";
import Pagination from "@/components/common/Pagination";
import { searchProducts } from "@/api/request";
import { productTypeForSection } from "@/config/sections";
import type { ProductType } from "@/types";
import ProductItem from "../components/common/ProductItem";

const PER_PAGE = 24;

type SearchParams = Promise<{ q?: string; page?: string }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });
  // Axtarış nəticələri indekslənmir (sonsuz sayda URL yaranmasın)
  return { title: t("title"), robots: { index: false, follow: true } };
}

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const t = await getTranslations();
  const sp = await searchParams;
  const q = (sp?.q ?? "").trim().slice(0, 100);
  const page = Math.max(1, Number(sp?.page ?? 1) || 1);

  const result = q
    ? await searchProducts(q, (page - 1) * PER_PAGE, PER_PAGE)
    : { data: [], meta: { total: 0 } };
  const products: ProductType[] = result?.data ?? [];
  const total: number = result?.meta?.total ?? 0;

  return (
    <section className="container max-md:max-w-[90%] mt-20">
      <Breadcrumb
        items={[{ label: "Elcar", href: "/" }, { label: t("search.title") }]}
      />

      <form
        role="search"
        action=""
        className="mt-6 flex items-center gap-2 border rounded-full px-4 py-1 dark:border-secondary-foreground"
      >
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={t("search.placeholder")}
          aria-label={t("search.button")}
          maxLength={100}
          className="flex-1 min-w-0 bg-transparent outline-none py-2 dark:text-primary-foreground"
        />
        <button
          type="submit"
          className="bg-elcar text-white text-sm font-bold px-4 py-2 rounded-full"
        >
          {t("search.button")}
        </button>
      </form>

      <h1 className="text-2xl md:text-3xl font-black mt-8 text-title dark:text-primary-foreground">
        {q ? t("search.results", { q, count: total }) : t("search.title")}
      </h1>

      {!q ? (
        <p className="mt-4 text-subtitle dark:text-secondary-foreground">
          {t("search.prompt")}
        </p>
      ) : products.length === 0 ? (
        <p className="mt-4 text-subtitle dark:text-secondary-foreground">
          {t("search.empty", { q })}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              type={productTypeForSection(product.section)}
              imageClass="w-[280px]"
            />
          ))}
        </div>
      )}

      {q && (
        <Pagination
          page={page}
          total={total}
          perPage={PER_PAGE}
          basePath={`/search?q=${encodeURIComponent(q)}`}
          labels={{
            prev: t("pagination.prev"),
            next: t("pagination.next"),
            pageLabel: t("pagination.pageLabel"),
          }}
        />
      )}
    </section>
  );
};

export default Page;
