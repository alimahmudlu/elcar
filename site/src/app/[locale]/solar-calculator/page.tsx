import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import Breadcrumb from "@/components/common/Breadcrumb";
import { ENDPOINTS } from "@/api/endpoints";
import { fetchData } from "@/api/request";
import type { CatalogueItem } from "@/lib/solarCatalogue";
import type { ProductType } from "@/types";
import SolarCalculator from "../components/calculator/SolarCalculator";

const CATALOGUE_SECTIONS = ["solar-energy", "inverters", "energy-storage"];

const fetchCatalogue = async (): Promise<CatalogueItem[]> => {
  const lists = await Promise.all(
    CATALOGUE_SECTIONS.map(async (section) => {
      const filter = encodeURIComponent(JSON.stringify({ section }));
      const { data } = await fetchData(`${ENDPOINTS.products.list}?filter=${filter}&$limit=50`);
      return ((data as ProductType[]) ?? []).map((product) => ({
        title: product.title,
        slug: product.slug,
        section,
        description: product.description,
      }));
    })
  );
  return lists.flat();
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calculator.seo" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/solar-calculator",
    withLanguages: true,
  });
}

const Page = async () => {
  const t = await getTranslations();
  const catalogue = await fetchCatalogue();

  return (
    <section className="container max-md:max-w-[90%] mt-20 mb-10">
      <Breadcrumb
        items={[
          { label: "Elcar", href: "/" },
          { label: t("sections.solar-energy.name"), href: "/solar-energy" },
          { label: t("calculator.title") },
        ]}
      />
      <h1 className="text-3xl md:text-5xl text-title font-extrabold mt-4 leading-tight dark:text-primary-foreground">
        {t("calculator.title")}
      </h1>
      <p className="mt-4 max-w-3xl text-subtitle text-sm md:text-base dark:text-secondary-foreground">
        {t("calculator.subtitle")}
      </p>

      <SolarCalculator catalogue={catalogue} />
    </section>
  );
};

export default Page;
