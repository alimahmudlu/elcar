import { Breadcrumbs } from "@mui/material";
import { AiOutlineRight } from "react-icons/ai";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  getBrands,
  getCategories,
  getCharacteristic,
  getCharacteristicOptions,
  getModels,
} from "@/api/request";
import { CategoryEnum, ProductEnum } from "@/constants/enums";
import { groupCharacteristicsWithChildren } from "@/lib/utils";
import { ChildCharacteristic } from "@/types";
import ProductsSection from "../components/products/ProductsSection";

const Page = async () => {
  const t = await getTranslations();
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
        <Breadcrumbs
          separator={
            <AiOutlineRight className="w-3 h-3 dark:text-primary-foreground" />
          }
          aria-label="breadcrumb"
        >
          <Link
            color="inherit"
            className="focused dark:text-primary-foreground"
            href="/"
          >
            Elcar
          </Link>
          <Link
            color="inherit"
            className="dark:text-primary-foreground"
            href="/electric-vehicles"
          >
            {t("pages.chargingStations")}
          </Link>
        </Breadcrumbs>

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
      />
    </section>
  );
};

export default Page;
