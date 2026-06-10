"use client";

import { Characteristic, CharacteristicGroup } from "@/types";
import { Check } from "lucide-react";
import { RiCloseLargeLine } from "react-icons/ri";
import Image from "next/image";
import SwiperGallery from "../../common/SwiperGallery";
import { useEffect, useState } from "react";

const CharacteristicValue = ({
  item,
  translatedStrings,
}: {
  item: Characteristic;
  translatedStrings: { yes: string; no: string };
}) => {
  if (typeof item.value === "boolean") {
    return item.value ? (
      <span className="flex gap-2">
        <Check className="w-6 text-elcar" />
        <span className="dark:text-secondary-foreground">{translatedStrings.yes}</span>
      </span>
    ) : (
      <span className="flex gap-2 items-center">
        <RiCloseLargeLine size={18} className="text-red-500" />
        <span className="dark:text-secondary-foreground">{translatedStrings.no}</span>
      </span>
    );
  }
  
  if (Array.isArray(item.value)) {
    return <span className="dark:text-secondary-foreground">{item.value.join(", ")}</span>;
  }
  
  return <span className="dark:text-secondary-foreground">{item.value}</span>;
};

const CharacteristicGroupClient = ({
  group,
  index,
  title,
  BASE_URL,
  translatedStrings,
}: {
  group: CharacteristicGroup;
  index: number;
  title: string;
  BASE_URL: string;
  translatedStrings: { yes: string; no: string };
}) => {
  const [isClient, setIsClient] = useState(false);
  const [descriptionHtml, setDescriptionHtml] = useState("");

  useEffect(() => {
    setIsClient(true);
    setDescriptionHtml(group?.description || "");
  }, [group?.description]);

  if (!group) return null;

  const isEven = index % 2 === 0;
  const bgClass = isEven
    ? "bg-[#f5f5f5] dark:bg-foreground dark:text-primary-foreground"
    : "";

  const hasMultipleImages =
    Array.isArray(group.image) && group.image.length > 0;
  const hasSingleImage = !Array.isArray(group.image) && group.image?.src;
  const hasMultiplePhotos = group.photo?.multiple && hasMultipleImages;

  return (
    <div
      className={`py-8 px-4 max-sm:px-2 mt-8 max-md:mt-6 max-sm:mt-4 rounded-md flex gap-4 max-md:gap-3 max-sm:gap-2 items-center justify-between max-md:flex-col-reverse ${bgClass}`}
    >
      <div className="flex-1 max-md:w-full md:max-w-[50%]">
        <h2 className="text-xl font-bold mb-4 max-md:text-lg max-sm:text-base dark:text-primary-foreground">
          {group.title}
        </h2>
        {group?.description && isClient && (
          <div
            className="mb-4 max-sm:mb-3 dark:text-secondary-foreground"
            dangerouslySetInnerHTML={{
              __html: descriptionHtml,
            }}
          />
        )}
        {group?.description && !isClient && (
          <div className="mb-4 max-sm:mb-3">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
          </div>
        )}
        <ul className="space-y-2 max-sm:space-y-1">
          {group?.characteristics?.map((item, charIndex) => (
            <li
              key={charIndex}
              className="border-b border-gray-200 dark:border-gray-700 pb-2 max-sm:pb-1"
            >
              <p className="flex justify-between items-center max-sm:gap-1">
                <span className="font-medium max-sm:text-sm dark:text-primary-foreground">
                  {item.name}
                </span>
                <CharacteristicValue
                  item={item}
                  translatedStrings={translatedStrings}
                />
              </p>
            </li>
          ))}
        </ul>
      </div>

      {hasMultiplePhotos ? (
        <div className="flex-1 max-md:w-full md:max-w-[30%]">
          <SwiperGallery
            BASE_URL={BASE_URL}
            images={group.image as { src: string }[]}
          />
        </div>
      ) : hasSingleImage ? (
        <div className="flex-1 flex justify-end max-md:justify-center">
          <Image
            src={`${BASE_URL}/${(group.image as { src: string }).src}`}
            alt={group.title || title}
            width={700}
            height={600}
            className="w-full h-auto max-w-[500px] max-h-[380px] max-md:max-w-full max-sm:max-h-[280px] object-contain rounded-md"
          />
        </div>
      ) : null}
    </div>
  );
};

export default CharacteristicGroupClient;
