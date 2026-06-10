import React from "react";
import Image from "next/image";
import { ProductType } from "@/types";
import { BASE_URL } from "@/api/endpoints";
import { MdCheck } from "react-icons/md";
import { useTranslations } from "next-intl";

const sectionBg = "bg-gray-50 dark:bg-card py-10";
const sectionTitle = "text-2xl font-bold mb-4";
const labelClass = "text-gray-500";
const valueClass = "text-right font-medium";

interface Props {
  product: ProductType;
};
const imageClass = "object-cover shadow";

// Define ImageType interface
interface ImageType {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

const getImageSrc = (image: string | ImageType | ImageType[] | null | undefined): string => {
  if (!image) return "";
  if (Array.isArray(image)) {
    return image[0]?.src || "";
  }
  return typeof image === 'string' ? image : image?.src || "";
};

const ProductContent: React.FC<Props> = ({ product }) => {
  const t = useTranslations("pages-content.electric-vehicles.details");
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <section className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4 md:gap-8 items-center py-14 container max-lg:max-w-[90%]">
        <div>
          <h2 className={`${sectionTitle} dark:text-primary-foreground`}>
            {t("main")}
          </h2>
          <div className="space-y-1.5 dark:text-secondary-foreground">
            {product.characteristicGroups[0].characteristics.map((item) => (
              <div key={item.name} className="flex justify-between">
                <span className={labelClass}>{item.name}:</span>
                <span className={valueClass}>{item.value ?? "--"}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center md:justify-end items-start">
          <Image
            src={`${BASE_URL}/${getImageSrc(product.characteristicGroups[0].image)}`}
            alt={product.title}
            width={800}
            height={800}
            className={`${imageClass} w-[590px] h-[420px] max-md:w-[350px] max-md:h-[210px] max-md:object-contain`}
          />
        </div>
      </section>

      <section className={sectionBg}>
        <div className="container max-lg:max-w-[90%] grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-4 md:gap-8 items-center">
          <div className="flex justify-center md:justify-start items-start">
            <Image
              src={`${BASE_URL}/${getImageSrc(product.characteristicGroups[1].image)}`}
              alt={product.title}
              width={800}
              height={800}
              className={`${imageClass} w-[590px] h-[420px] max-md:w-[350px] max-md:h-[210px] max-md:object-contain`}
            />
          </div>
          <div>
            <h2 className={`${sectionTitle} dark:text-primary-foreground`}>
              {t("technical")}
            </h2>
            <div className="space-y-1.5 dark:text-secondary-foreground">
              {product.characteristicGroups[1].characteristics.map((item) => (
                <div key={item.name} className="flex justify-between">
                  <span className={labelClass}>{item.name}:</span>
                  <span className={valueClass}>{item.value ?? "--"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container max-lg:max-w-[90%]">
        <h2 className={`${sectionTitle} dark:text-primary-foreground`}>
          {t("interior")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4 md:gap-8 items-start relative">
          <div>
            <div className="space-y-1.5 dark:text-secondary-foreground">
              {product.characteristicGroups[2].characteristics.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-2"
                >
                  <span className={labelClass}>{item.name}</span>
                  {item.value === true && (
                    <div className="flex items-center gap-0.5">
                      <MdCheck className="text-elcar text-xl" />
                      <span>{t("yes")}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center md:justify-end items-start sticky top-20">
            <Image
              src={`${BASE_URL}/${getImageSrc(product.characteristicGroups[2].image)}`}
              alt={product.title}
              width={800}
              height={800}
              className={`${imageClass} w-[590px] h-[420px] max-md:w-[350px] max-md:h-[210px] max-md:object-contain`}
            />
          </div>
        </div>
      </section>

      <section className={sectionBg}>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-4 md:gap-8 items-start">
          <div className="flex justify-center md:justify-start items-start">
            <Image
              src={`${BASE_URL}/${getImageSrc(product.characteristicGroups[3].image)}`}
              alt={product.title}
              width={800}
              height={800}
              className={`${imageClass} w-[590px] h-[420px] max-md:w-[350px] max-md:h-[210px] max-md:object-contain`}
            />
          </div>
          <div>
            <h2 className={`${sectionTitle} dark:text-primary-foreground`}>
              {t("exterior")}
            </h2>
            <div className="space-y-1.5 dark:text-secondary-foreground">
              {product.characteristicGroups[3].characteristics.map((item) => (
                <div key={item.name} className="flex justify-between">
                  <span className={labelClass}>{item.name}:</span>
                  <span className={valueClass}>{item.value ?? "--"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductContent;
