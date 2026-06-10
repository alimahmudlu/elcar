"use client";
import Rating from "@mui/material/Rating";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import React from "react";
import { MdAddShoppingCart, MdOutlineStarPurple500 } from "react-icons/md";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import CustomRipple from "./CustomRipple";
import { ProductType } from "@/types";
import { ProductEnum } from "@/constants/enums";
import { cn, extractTitlePrefix } from "@/lib/utils";
import CheckCart from "../icons/CheckCart";
import { useCartStore } from "@/lib/cartStore";
import { useDrawerStore } from "@/lib/drawerStore";

const ProductItem = ({
  product,
  type,
  imageClass = "",
}: {
  product: ProductType;
  type: string;
  imageClass?: string;
}) => {
  const BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
  const t = useTranslations();
  const locale = useLocale();

  const rediretUrl =
    type === ProductEnum.Car
      ? `/electric-vehicles/${product?.slug}`
      : type === ProductEnum.ConnectorAccessory
      ? `/connectors-accessories/${product?.slug}`
      : `/charging-stations/${product?.slug}`;

  const { addToCart, getCount } = useCartStore();
  const { setIsOpen } = useDrawerStore();
  const inCart = getCount(product._id) > 0;

  const handleClick = () => {
    addToCart(product);
    setIsOpen(true);
  };

  return (
    <div className="relative group overflow-hidden border hover:border-transparent hover:shadow-2xl transition-all duration-300 shadow-none py-8 p-ripple  dark:border-secondary-foreground dark:hover:border-transparent dark:hover:shadow-md dark:hover:shadow-primary-foreground">
      <Link href={`/${locale}${rediretUrl}`}>
        <CustomRipple />
        <div className="relative flex flex-col justify-between">
          <Image
            src={`${BASE_URL}/${product?.image?.src}`}
            alt={product?.title}
            width={400}
            height={400}
            className={cn(
              `mx-auto object-contain ${
                type === "car" ? "w-[400px] h-[225px]" : "w-[280px] h-[160px]"
              }`,
              imageClass
            )}
          />

          {/* price */}
          <div className="absolute bottom-4 right-4">
            <div className="relative">
              <div className="w-[80px] rotate-6 h-[80px] rounded-full bg-blue-600 flex flex-col justify-center items-center text-white font-bold text-[14px] shadow-md leading-[2px]">
                {product?.discount ? (
                  <div className="flex flex-col items-center">
                    <del className="text-sm text-gray-300 -mb-1">
                      {product?.price}
                    </del>
                    <span className="text-lg">{product?.discountedPrice}</span>
                    <span className="text-[12px]">AZN</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center -mt-2">
                    <span className="text-lg">{product?.price}</span>
                    <span className="text-[12px]">AZN</span>
                  </div>
                )}
              </div>

              {/* Endirim faizi dairəsi */}
              {product?.discount && (
                <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-orange-500 text-white flex justify-center items-center text-xs font-bold shadow">
                  -{product?.discount}%
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between dark:text-primary-foreground">
          <div className="px-6">
            <span className="text-[12px] mt-3 font-bold">
              {product?.category?.name}
            </span>
            <h3 className="leading-[26px] text-[20px] font-black tracking-wide mb-1">
              {extractTitlePrefix(product?.title, product?.category?.name)}
            </h3>

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

            <p className="text-[#00000099] text-sm dark:text-secondary-foreground">
              {product?.description}
            </p>
          </div>

          {type !== ProductEnum.ConnectorAccessory && (
            <>
              <div className="border-b border-[text-title] my-4" />

              <ul className="grid grid-cols-3 justify-between px-6 text-[12px] mt-auto">
                <li className="flex flex-col gap-1">
                  <span>
                    {product?.characteristicGroups[1]?.characteristics?.find(
                      (item) => item.battery
                    )?.value
                      ? t("popular-cars.battery")
                      : t("popular-cars.fuel-type")}
                  </span>
                  <span className="font-bold">
                    {type === ProductEnum.Car
                      ? product?.characteristicGroups[1]?.characteristics?.find(
                          (item) => item.battery
                        )?.value
                        ? product?.characteristicGroups[1]?.characteristics?.find(
                            (item) => item.battery
                          )?.value
                        : product?.characteristicGroups[1]?.characteristics?.find(
                            (item) => item["fuel-type"]
                          )?.value
                      : product?.characteristicGroups[0]?.characteristics?.find(
                          (item) => item["output-power"]
                        )?.value ?? "-"}
                  </span>
                </li>
                <li className="flex flex-col gap-1">
                  <span>{t("popular-cars.max-speed")}</span>
                  <span className="font-bold">
                    {type === ProductEnum.Car
                      ? product?.characteristicGroups[1]?.characteristics?.find(
                          (item) => item["max-speed"]
                        )?.value ?? ""
                      : product?.characteristicGroups[0]?.characteristics?.find(
                          (item) => item["power-input"]
                        )?.value ?? ""}
                  </span>
                </li>
                <li className="flex flex-col gap-1">
                  <span>{t("popular-cars.max-horsepower")}</span>
                  <span className="font-bold">
                    {type === ProductEnum.Car
                      ? product?.characteristicGroups[1]?.characteristics?.find(
                          (item) => item["max-horsepower"]
                        )?.value ?? ""
                      : product?.characteristicGroups[0]?.characteristics?.find(
                          (item) => item["phase-number"]
                        )?.value ?? ""}
                  </span>
                </li>
              </ul>
            </>
          )}
        </div>
      </Link>
      <Tooltip
        sx={{ p: 5, fontSize: 24 }}
        title={t("buttons.add-to-cart")}
        placement="right"
        className="!text-[24px] !z-0"
      >
        <div
          onClick={() => {
            handleClick();
          }}
          className={`absolute -top-full left-3 size-10 rounded-full bg-elcar text-white flex items-center justify-center focused group-hover:top-3 transition-all duration-500 ${
            inCart ? "top-3" : ""
          }`}
        >
          {!inCart ? <MdAddShoppingCart className="w-5 h-5" /> : <CheckCart />}
        </div>
      </Tooltip>
    </div>
  );
};

export default ProductItem;
