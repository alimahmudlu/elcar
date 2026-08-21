import Pagination from "@/components/common/Pagination";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Breadcrumb from "@/components/common/Breadcrumb";
import { getTranslations } from "next-intl/server";
import {
  getBrands,
  getCategories,
  getCharacteristic,
  getCharacteristicOptions,
  getModels,
  chargingConnectors,
} from "@/api/request";
import { CategoryEnum, ProductEnum } from "@/constants/enums";
import { groupCharacteristicsWithChildren } from "@/lib/utils";
import { ChildCharacteristic } from "@/types";
import ProductsSection from "../components/products/ProductsSection";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.connectors" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/connectors-accessories",
    withLanguages: true,
  });
}

type SearchParams = Promise<{ page?: string }>;

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page ?? 1) || 1);
  const PER_PAGE = 12;
  const t = await getTranslations();
  const initial = await chargingConnectors({}, String((page - 1) * PER_PAGE), PER_PAGE);
  const initialProducts = initial?.data ?? [];
  const initialTotal = initial?.meta?.total ?? 0;
  const categories = await getCategories(CategoryEnum.ConnectorAccessory);
  const brands = await getBrands(CategoryEnum.ConnectorAccessory);
  const characteristic = await getCharacteristic(
    CategoryEnum.ConnectorAccessory
  );
  const characteristicOptions = await getCharacteristicOptions(
    CategoryEnum.ConnectorAccessory,
    [...characteristic?.map((c: ChildCharacteristic) => c._id)]
  );

  const models = await getModels(CategoryEnum.ConnectorAccessory);

  const filterOptions = groupCharacteristicsWithChildren(
    characteristic,
    characteristicOptions
  );

  return (
    <section className="container max-md:max-w-[90%] mt-20">
      <div className="mb-8">
        <Breadcrumb items={[{ label: "Elcar", href: "/" }, { label: t("pages.connectors") }]} />

        <h1 className="text-3xl md:text-5xl text-title font-extrabold mt-4 leading-tight  dark:text-primary-foreground">
          {t("pages-content.connectors.title")}
        </h1>
        <p className="mt-4 text-subtitle text-sm md:text-base dark:text-secondary-foreground">
          {t("pages-content.connectors.subtitle")}
        </p>
      </div>

      <ProductsSection
        type={ProductEnum.ConnectorAccessory}
        categories={categories}
        brands={brands}
        models={models}
        filterOptions={filterOptions}
        initialProducts={initialProducts}
        initialTotal={initialTotal}
      />

      <Pagination
        page={page}
        total={initialTotal}
        perPage={PER_PAGE}
        basePath="/connectors-accessories"
        labels={{
          prev: t("pagination.prev"),
          next: t("pagination.next"),
          pageLabel: t("pagination.pageLabel"),
        }}
      />
    </section>
  );
};

export default Page;
