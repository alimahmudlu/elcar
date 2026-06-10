import { Roboto } from "next/font/google";
import AddToCartButton from "../../components/common/AddToCartButton";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { Breadcrumbs, Rating } from "@mui/material";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { AiOutlineRight } from "react-icons/ai";
import Link from "next/link";
import { fetchProductDetails } from "@/api/request";
import { BASE_URL, ENDPOINTS } from "@/api/endpoints";
import { Characteristic, ProductType } from "@/types";
import CharacteristicGroupClient from "../../components/products/charging-stations/CharacteristicGroupClient";

const roboto = Roboto({ subsets: ["latin"] });

const getMainCharacteristic = (
  characteristics: Characteristic[],
  key: string
): string | number | boolean | string[] | null | undefined => {
  return characteristics?.find((item) => item[key as keyof Characteristic])
    ?.value;
};

type Params = Promise<{ id: string }>;

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const t = await getTranslations();

  const product: ProductType = await fetchProductDetails(
    ENDPOINTS.products.detail.replace(":id", id)
  );

  const {
    title,
    price,
    discount,
    category,
    discountedPrice,
    image,
    description,
    characteristicGroups = [],
  } = product;

  const mainCharacteristics = characteristicGroups[0]?.characteristics || [];

  const translatedStrings = {
    yes: t("pages-content.electric-vehicles.details.yes"),
    no: t("pages-content.electric-vehicles.details.no"),
  };

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
          className="focused dark:text-primary-foreground max-sm:text-xs"
          href="/"
        >
          Elcar
        </Link>
        <Link
          className="dark:text-primary-foreground max-sm:text-xs max-sm:text-nowrap"
          href="/electric-vehicles"
        >
          {t("pages.chargingStations")}
        </Link>
        <Link
          className="dark:text-primary-foreground max-sm:text-xs max-sm:text-nowrap"
          href=""
        >
          {title}
        </Link>
      </Breadcrumbs>

      <div className="px-4 max-sm:px-2 py-8 mt-24 max-md:mt-14 max-sm:mt-8">
        <div className="grid md:grid-cols-2 gap-8 max-md:gap-6">
          <div className="relative w-full">
            {discount && discount > 0 && (
              <div className="absolute -top-6 -left-6 bg-blue-600 text-white w-24 h-24 max-md:w-20 max-md:h-20 max-sm:w-16 max-sm:h-16 rounded-full flex flex-col items-center justify-center text-center shadow-xl z-10">
                <span className="line-through text-sm max-sm:text-xs">
                  {price}₼
                </span>
                <span className="text-xl font-bold max-sm:text-lg">
                  {discountedPrice}₼
                </span>
                <span className="text-red-400 text-xs font-bold max-sm:text-[10px]">
                  -{discount}%
                </span>
              </div>
            )}
            <Image
              src={`${BASE_URL}/${image.src}`}
              alt={title}
              width={700}
              height={600}
              className="w-full h-auto object-contain rounded-md xl:w-[625px] xl:h-[410px] max-md:w-full max-md:h-auto"
            />
          </div>

          <div>
            <h4 className="text-title text-xl font-black dark:text-primary-foreground max-lg:text-lg max-sm:text-base">
              {category?.name}
            </h4>
            <h1 className="text-title text-5xl font-black mt-2 dark:text-primary-foreground max-lg:text-3xl max-md:text-xl max-sm:text-lg">
              {title.replace(category?.name || "", "")}
            </h1>
            <p className="text-subtitle mt-4 dark:text-secondary-foreground max-sm:text-sm">
              {description}
            </p>

            <ul className="flex justify-between gap-4 max-w-[60%] max-xs:grid max-xs:grid-cols-2 max-xs:gap-2 mt-8 max-md:mt-6 max-sm:mt-4">
              <li className="text-[16px] tracking-[0.4px] mb-1 leading-4 max-sm:text-sm dark:text-secondary-foreground">
                <p className="flex flex-col gap-1">
                  <span>{t("hero.sub-category.output")}</span>
                  <span className="font-bold">
                    {getMainCharacteristic(mainCharacteristics, "output-power")}
                  </span>
                </p>
              </li>
              <li className="text-[16px] tracking-[0.4px] mb-1 leading-4 max-sm:text-sm dark:text-secondary-foreground">
                <p className="flex flex-col gap-1">
                  <span>{t("hero.sub-category.voltage")}</span>
                  <span className="leading-5 font-bold">
                    {getMainCharacteristic(mainCharacteristics, "power-input")}
                  </span>
                </p>
              </li>
              <li className="text-[16px] tracking-[0.4px] mb-1 leading-4 max-sm:text-sm dark:text-secondary-foreground">
                <p className="flex flex-col gap-1">
                  <span>{t("hero.sub-category.phase")}</span>
                  <span className="leading-5 font-bold">
                    {getMainCharacteristic(mainCharacteristics, "phase-number")}
                  </span>
                </p>
              </li>
              <li className="text-[16px] tracking-[0.4px] mb-1 leading-4 max-sm:text-sm dark:text-secondary-foreground">
                <p className="flex flex-col gap-1">
                  <span>{t("hero.sub-category.rating")}</span>
                  <Rating
                    icon={
                      <MdOutlineStarPurple500 className="w-4 text-[#ff5722] h-4" />
                    }
                    emptyIcon={
                      <MdOutlineStarPurple500 className="w-4 h-4 text-gray-400" />
                    }
                    name="read-only"
                    value={5}
                    readOnly
                  />
                </p>
              </li>
            </ul>
          </div>
        </div>

        {characteristicGroups.map((group, index) => (
          <CharacteristicGroupClient
            key={index}
            group={group}
            index={index}
            title={title}
            BASE_URL={BASE_URL as string}
            translatedStrings={translatedStrings}
          />
        ))}
      </div>

      <AddToCartButton product={product} />
    </section>
  );
};

export default Page;
