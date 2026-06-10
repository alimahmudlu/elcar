import { BASE_URL } from "@/api/endpoints";
import { extractTitlePrefix } from "@/lib/utils";
import { ProductType } from "@/types";
import { Breadcrumbs, Rating } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlineRight } from "react-icons/ai";
import { MdOutlineStarPurple500 } from "react-icons/md";

const ProductHero = ({ product }: { product: ProductType }) => {
  const t = useTranslations();
  return (
    <div className="w-full h-[80vh] overflow-hidden relative">
      <div className="product-hero-bg h-full overflow-hidden">
        <div className="container pt-18 h-full max-lg:max-w-[90%]">
          <div>
            <Breadcrumbs
              separator={
                <AiOutlineRight className="w-3 h-3 dark:text-primary-foreground" />
              }
              aria-label="breadcrumb"
              className="max-md:flex items-center flex-nowrap overflow-x-auto max-sm:[&>.MuiBreadcrumbs-ol]:!flex-nowrap"
            >
              <Link
                color="inherit"
                className="focused dark:text-primary-foreground max-sm:text-xs"
                href="/"
              >
                Elcar
              </Link>
              <Link
                color="inherit"
                className="dark:text-primary-foreground max-sm:text-xs max-sm:text-nowrap"
                href="/electric-vehicles"
              >
                {t("pages.electricVehicles")}
              </Link>
              <Link
                color="inherit"
                className="dark:text-primary-foreground max-sm:text-xs max-sm:text-nowrap"
                href=""
              >
                {product?.title}
              </Link>
            </Breadcrumbs>
          </div>
          <div className="h-full w-full flex pt-12 flex-col items-center justify-center">
            <div className="relative">
              <Image
                width={2500}
                height={2500}
                src={BASE_URL + "/" + product?.image?.src}
                alt={product?.title}
                className="max-xxl:w-[900px] max-xxl:h-[480px] object-contain relative md:z-[20] max-md:w-[350px] max-md:h-[210px] xxl:w-[680px] xxl:h-[380px] max-xl:w-[680px] max-xl:h-[380px] max-lg:w-[480px] max-lg:h-[340px]  max-md:object-contain"
              />
              {/* price */}
              <div className="absolute -top-2 -right-2 md:z-10 ">
                <div className="relative">
                  <div className="w-[120px] rotate-6 h-[120px] max-md:w-[80px] max-md:h-[80px] rounded-full bg-blue-600 flex flex-col justify-center items-center text-white font-bold text-[24px] shadow-md leading-[4px]">
                    {product?.discount ? (
                      <div className="flex flex-col items-center">
                        <del className="text-sm text-gray-300 -mb-1">
                          {product?.price}
                        </del>
                        <span className="text-2xl max-md:text-lg font-black tracking-wide">
                          {product?.discountedPrice}
                        </span>
                        <span className="text-2xl -mt-2">AZN</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center -mt-2">
                        <span className="text-lg">{product?.price}</span>
                        <span className="text-[18px]">AZN</span>
                      </div>
                    )}
                  </div>

                  {product?.discount && (
                    <div className="absolute rotate-6 -top-2 left-2 w-9 h-9 rounded-full bg-orange-500 text-white flex justify-center items-center text-xs font-bold shadow">
                      -{product?.discount}%
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-title md:text-center">
              <h1
                className="text-5xl max-md:text-3xl max-sm:text-xl font-black mb-4 max-md:mb-3 max-sm:mb-2 dark:text-primary-foreground
              "
              >
                {extractTitlePrefix(product?.title, product?.category?.name)}
              </h1>
              <p className="text-base dark:text-secondary-foreground">
                {product?.description}
              </p>
            </div>

            <>
              <ul className="grid items-center grid-cols-4 justify-between max-md:grid-cols-2 max-md:gap-12 max-sm:gap-4 px-6 gap-28 mt-6 mb-12 max-md:mb-8 max-sm:mb-6 max-md:mt-4 max-sm:mt-2 max-md:w-full text-[12px] dark:text-primary-foreground">
                <li className="flex flex-col gap-1 text-base">
                  <span>
                    {product?.characteristicGroups[1]?.characteristics?.find(
                      (item) => item.battery
                    )?.value
                      ? t("popular-cars.battery")
                      : t("popular-cars.fuel-type")}
                  </span>
                  <span className="font-bold">
                    {product?.characteristicGroups[1]?.characteristics?.find(
                      (item) => item.battery
                    )?.value
                      ? product?.characteristicGroups[1]?.characteristics?.find(
                          (item) => item.battery
                        )?.value
                      : product?.characteristicGroups[1]?.characteristics?.find(
                          (item) => item["fuel-type"]
                        )?.value ?? "--"}
                  </span>
                </li>
                <li className="flex flex-col gap-1 text-base">
                  <span>{t("popular-cars.max-speed")}</span>
                  <span className="font-bold">
                    {product?.characteristicGroups[1]?.characteristics?.find(
                      (item) => item["max-speed"]
                    )?.value ?? "--"}
                  </span>
                </li>
                <li className="flex flex-col gap-1 text-base">
                  <span>{t("popular-cars.max-horsepower")}</span>
                  <span className="font-bold">
                    {product?.characteristicGroups[1]?.characteristics?.find(
                      (item) => item["max-horsepower"]
                    )?.value ?? "--"}
                  </span>
                </li>
                <li className="text-base">
                  <Rating
                    icon={
                      <MdOutlineStarPurple500 className="w-4 text-[#ff5722] h-4" />
                    }
                    emptyIcon={
                      <MdOutlineStarPurple500 className="w-4 h-4 text-gray-400" />
                    }
                    name="read-only"
                    value={Number(5)}
                    readOnly
                  />
                </li>
              </ul>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
