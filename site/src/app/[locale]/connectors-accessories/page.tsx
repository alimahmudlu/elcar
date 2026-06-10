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
            {t("pages.connectors")}
          </Link>
        </Breadcrumbs>

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
      />
    </section>
  );
};

export default Page;
