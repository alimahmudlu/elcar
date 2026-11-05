import { getTranslations } from "next-intl/server";
import { ENDPOINTS } from "@/api/endpoints";
import { fetchData } from "@/api/request";
import type { EnergySection } from "@/config/sections";
import type { ProductType } from "@/types";
import ProductItem from "../common/ProductItem";

/** Hər bölmədən ana səhifədə göstərilən məhsul sayı */
const PER_SECTION = 2;

/** Məhsulu olan bölmələr; külək enerjisi məhsul əlavə olunanda bura yazılır */
const FEATURED_SECTIONS: EnergySection[] = [
  "solar-energy",
  "inverters",
  "energy-storage",
  "laser-equipment",
];

const fetchSection = async (section: EnergySection) => {
  const filter = encodeURIComponent(JSON.stringify({ section }));
  const { data } = await fetchData(
    `${ENDPOINTS.products.list}?filter=${filter}&$limit=${PER_SECTION}`
  );
  return ((data as ProductType[]) ?? []).map((product) => ({ product, section }));
};

/** Ana səhifədə enerji və lazer bölmələrindən seçilmiş məhsullar */
const FeaturedEnergyProducts = async () => {
  const t = await getTranslations("sections.home");
  const items = (await Promise.all(FEATURED_SECTIONS.map(fetchSection))).flat();

  if (items.length === 0) return null;

  return (
    <section className="container my-12">
      <div className="text-center">
        <h2 className="text-[34px] max-md:text-2xl font-black text-title dark:text-primary-foreground">
          {t("featured-title")}
        </h2>
        <p className="mt-3 text-subtitle text-[14px] dark:text-secondary-foreground">
          {t("featured-subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {items.map(({ product, section }) => (
          <ProductItem key={product._id} product={product} type={section} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedEnergyProducts;
