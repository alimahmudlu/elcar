import { BASE_URL, ENDPOINTS } from "@/api/endpoints";
import { fetchProductDetails } from "@/api/request";
import { Roboto } from "next/font/google";
import Image from "next/image";
import React from "react";

import DetailSection from "../../components/common/DetailSection";
import { Breadcrumbs, Rating } from "@mui/material";
import { AiOutlineRight } from "react-icons/ai";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MdOutlineStarPurple500 } from "react-icons/md";
import AddToCartButton from "../../components/common/AddToCartButton";

const roboto = Roboto({ subsets: ["latin"] });

type Params = Promise<{ id: string }>;

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const t = await getTranslations();

  const product = await fetchProductDetails(
    ENDPOINTS.products.detail.replace(":id", id)
  );

  const {
    title,
    price,
    discount,
    discountedPrice,
    image,
    description,
    characteristicGroups,
    category,
  } = product;

  return (
    <section
      className={`container max-lg:max-w-[90%] mt-18 ${roboto.className}`}
    >
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
          {t("pages.connectors")}
        </Link>
        <Link
          color="inherit"
          className="dark:text-primary-foreground max-sm:text-xs max-sm:text-nowrap"
          href=""
        >
          {title}
        </Link>
      </Breadcrumbs>
      <div className="px-4 py-8 mt-24 max-md:mt-14 max-sm:mt-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative w-full">
            {discount > 0 && (
              <div className="absolute -top-6 -left-6 bg-blue-600 text-white w-24 h-24 rounded-full flex flex-col items-center justify-center text-center shadow-xl z-10">
                <span className="line-through text-sm">{price}₼</span>
                <span className="text-xl font-bold">{discountedPrice}₼</span>
                <span className="text-red-400 text-xs font-bold">
                  -{discount}%
                </span>
              </div>
            )}
            <Image
              src={`${BASE_URL}/${image.src}`}
              alt={title}
              width={700}
              height={600}
              className="w-full h-auto object-contain rounded-md xl:w-[625px] xl:h-[410px]"
            />
          </div>

          {/* Text Info */}
          <div>
            <h4 className="text-title text-xl font-black dark:text-primary-foreground max-lg:text-lg max-sm:text-base">
              {category?.name}
            </h4>
            <h1 className="text-title text-5xl font-black mt-2 dark:text-primary-foreground max-lg:text-3xl max-md:text-xl max-sm:text-lg">
              {title.replace(category?.name, "")}
            </h1>
            <p className="text-subtitle mt-4 dark:text-secondary-foreground max-sm:text-sm">
              {description}
            </p>
            <p className="mt-4 font-semibold text-gray-600 flex flex-col gap-1 max-sm:text-sm">
              {t("hero.sub-category.rating")}
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
            </p>
          </div>
        </div>

        {/* Detail Sections */}
        <DetailSection
          characteristicGroups={characteristicGroups}
          BASE_URL={BASE_URL || ""}
        />

        <AddToCartButton product={product} />
      </div>
    </section>
  );
};

export default Page;
