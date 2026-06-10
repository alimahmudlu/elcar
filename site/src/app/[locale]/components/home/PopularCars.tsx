import { Roboto } from "next/font/google";
import ProductItem from "../common/ProductItem";
import { ProductType } from "@/types";
import { getTranslations } from "next-intl/server";
import { ENDPOINTS } from "@/api/endpoints";
import { fetchData } from "@/api/request";
import { ProductEnum } from "@/constants/enums";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const PopularCars = async () => {
  const t = await getTranslations("popular-cars");
  const filterObj = { section: "vehicles" };
  const filterString = encodeURIComponent(JSON.stringify(filterObj));
  const url = `${ENDPOINTS.products.list}?filter=${filterString}&$limit=12`;

  const { data: cars } = await fetchData(url);

  return (
    <section className={`mt-4 ${roboto.className}`}>
      <div className="text-center">
        <h1 className="text-[34px] font-black text-title dark:text-primary-foreground">
          {t("title")}
        </h1>
        <p className="mt-3 text-subtitle text-[14px] dark:text-secondary-foreground">
          {t("subtitle")}
        </p>
      </div>

      <div className="container max-lg:max-w-[95%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {cars?.map((car: ProductType) => (
          <ProductItem key={car?._id} product={car} type={ProductEnum.Car} />
        ))}
      </div>
    </section>
  );
};

export default PopularCars;
