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
  chargingStations,
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
  const t = await getTranslations({ locale, namespace: "seo.chargingStations" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/charging-stations",
    withLanguages: true,
  });
}

type SearchParams = Promise<{ page?: string }>;

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page ?? 1) || 1);
  const PER_PAGE = 12;
  const t = await getTranslations();
  const initial = await chargingStations({}, String((page - 1) * PER_PAGE), PER_PAGE);
  const initialProducts = initial?.data ?? [];
  const initialTotal = initial?.meta?.total ?? 0;
  const categories = await getCategories(CategoryEnum.ChargingStation);
  const brands = await getBrands(CategoryEnum.ChargingStation);
  const characteristic = await getCharacteristic(CategoryEnum.ChargingStation);
  const characteristicOptions = await getCharacteristicOptions(
    CategoryEnum.ChargingStation,
    [...characteristic?.map((c: ChildCharacteristic) => c._id)]
  );

  const models = await getModels(CategoryEnum.ChargingStation);

  const filterOptions = groupCharacteristicsWithChildren(
    characteristic,
    characteristicOptions
  );

  return (
    <section className="container max-md:max-w-[90%] mt-20">
      <div className="mb-8">
        <Breadcrumb items={[{ label: "Elcar", href: "/" }, { label: t("pages.chargingStations") }]} />

        <h1 className="text-3xl md:text-5xl text-title font-extrabold mt-4 leading-tight  dark:text-primary-foreground">
          {t("pages-content.chargingStations.title")}
        </h1>
        <p className="mt-4 text-subtitle text-sm md:text-base dark:text-secondary-foreground">
          {t("pages-content.chargingStations.subtitle")}
        </p>
      </div>

      <ProductsSection
        type={ProductEnum.ChargingStation}
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
        basePath="/charging-stations"
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
