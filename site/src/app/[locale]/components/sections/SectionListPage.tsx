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
  getSectionProducts,
} from "@/api/request";
import { ProductEnum } from "@/constants/enums";
import type { EnergySection } from "@/config/sections";
import { groupCharacteristicsWithChildren } from "@/lib/utils";
import { ChildCharacteristic } from "@/types";
import ProductsSection from "../products/ProductsSection";

const PER_PAGE = 12;

/** Enerji bölməsinin siyahı səhifəsi üçün metadata */
export async function sectionListMetadata(
  section: EnergySection,
  locale: string
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `sections.${section}.seo` });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: `/${section}`,
    withLanguages: true,
  });
}

/**
 * Enerji bölmələrinin (günəş, külək, BESS, lazer) ortaq siyahı səhifəsi.
 * Şarj stansiyaları səhifəsi ilə eyni quruluşdadır: ilk səhifə server-render
 * olunur, filtrlər (kateqoriya, brend, xüsusiyyətlər) API-dən `section` üzrə gəlir.
 */
const SectionListPage = async ({
  section,
  page,
}: {
  section: EnergySection;
  page: number;
}) => {
  const t = await getTranslations();
  const initial = await getSectionProducts(
    section,
    {},
    String((page - 1) * PER_PAGE),
    PER_PAGE
  );
  const initialProducts = initial?.data ?? [];
  const initialTotal = initial?.meta?.total ?? 0;

  const [categories, brands, characteristic, models] = await Promise.all([
    getCategories(section),
    getBrands(section),
    getCharacteristic(section),
    getModels(section),
  ]);
  const characteristicOptions = await getCharacteristicOptions(section, [
    ...(characteristic ?? []).map((c: ChildCharacteristic) => c._id),
  ]);

  const filterOptions = groupCharacteristicsWithChildren(
    characteristic,
    characteristicOptions
  );

  return (
    <section className="container max-md:max-w-[90%] mt-20">
      <div className="mb-8">
        <Breadcrumb
          items={[
            { label: "Elcar", href: "/" },
            { label: t(`sections.${section}.name`) },
          ]}
        />

        <h1 className="text-3xl md:text-5xl text-title font-extrabold mt-4 leading-tight  dark:text-primary-foreground">
          {t(`sections.${section}.title`)}
        </h1>
        <p className="mt-4 text-subtitle text-sm md:text-base dark:text-secondary-foreground">
          {t(`sections.${section}.subtitle`)}
        </p>
      </div>

      <ProductsSection
        type={section as ProductEnum}
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
        basePath={`/${section}`}
        labels={{
          prev: t("pagination.prev"),
          next: t("pagination.next"),
          pageLabel: t("pagination.pageLabel"),
        }}
      />
    </section>
  );
};

export default SectionListPage;
