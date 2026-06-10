import { ENDPOINTS } from "@/api/endpoints";
import { fetchData } from "@/api/request";
import { getTranslations } from "next-intl/server";
import ProductItem from "../common/ProductItem";
import { ProductType } from "@/types";
import { ProductEnum } from "@/constants/enums";

const ChargingStations = async () => {
  const t = await getTranslations("charging-stations");

  const filterObj = { section: "charging-stations" };
  const filterString = encodeURIComponent(JSON.stringify(filterObj));
  const url = `${ENDPOINTS.products.list}?filter=${filterString}&$limit=12`;

  const { data: chargingStations } = await fetchData(url);

  return (
    <section className="container my-12">
      <div className="text-center">
        <h1 className="text-[34px] font-black text-title dark:text-primary-foreground">
          {t("title")}
        </h1>
        <p className="mt-3 text-subtitle text-[14px] dark:text-secondary-foreground">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {chargingStations?.map((product: ProductType) => (
          <ProductItem key={product._id} product={product} type={ProductEnum.ChargingStation} />
        ))}
      </div>
    </section>
  );
};

export default ChargingStations;
