import { ENDPOINTS } from "@/api/endpoints";
import { fetchData } from "@/api/request";
import { getTranslations } from "next-intl/server";
import ProductItem from "../common/ProductItem";
import { ProductType } from "@/types";
import { ProductEnum } from "@/constants/enums";
import { Link } from "@/i18n/navigation";
import { RiArrowRightLine } from "react-icons/ri";

const ChargingStations = async () => {
  const t = await getTranslations("charging-stations");

  const filterObj = { section: "charging-stations" };
  const filterString = encodeURIComponent(JSON.stringify(filterObj));
  const url = `${ENDPOINTS.products.list}?filter=${filterString}&$limit=8`;

  const { data: chargingStations } = await fetchData(url);

  return (
    <section className="container my-12">
      <div className="text-center">
        <h2 className="text-[34px] font-black text-title dark:text-primary-foreground">
          {t("title")}
        </h2>
        <p className="mt-3 text-subtitle text-[14px] dark:text-secondary-foreground">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {chargingStations?.map((product: ProductType) => (
          <ProductItem key={product._id} product={product} type={ProductEnum.ChargingStation} />
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/charging-stations"
          className="inline-flex items-center gap-2 bg-elcar-opacity text-elcar font-medium px-5 py-2 rounded-full dark:bg-primary dark:hover:bg-primary/80 duration-200 dark:hover:text-card-foreground"
        >
          {t("all-products")}
          <RiArrowRightLine className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};

export default ChargingStations;
