import { BASE_URL, ENDPOINTS } from "@/api/endpoints";
import { fetchData } from "@/api/request";
import { cn } from "@/lib/utils";
import { Manufacturer } from "@/types";
import { getTranslations } from "next-intl/server";
import { Roboto } from "next/font/google";
import Image from "next/image";
import React from "react";

const roboto = Roboto({ subsets: ["latin"] });

const Brands = async () => {
  const manufacturers: Manufacturer[] = await fetchData(ENDPOINTS.brands.list);

  const t = await getTranslations("brands");
  return (
    <div
      className={cn(
        roboto.className,
        "flex flex-col lg:flex-row bg-white dark:bg-foreground relative my-8"
      )}
    >
      <div className="bg-[#027878] lg:w-[25%] dark:bg-background absolute left-0 top-0 bottom-0 z-0 max-md:hidden"></div>
      <div className="md:container  flex items-center gap-4 z-10 max-lg:flex-col">
        <div className="bg-elcar dark:bg-foreground overflow-hidden relative text-white w-full lg:w-[50%] p-6 h-full max-lg:w-full z-10">
          <h2 className="text-3xl font-bold leading-tight mb-4 max-md:text-xl">
            {t("title")}
          </h2>
          <p className="text-sm max-md:text-xs">{t("subtitle")}</p>
          <div className="mt-6 absolute bottom-0 -right-32 -z-10">
            <Image
              src="/images/electric-vehicle-1.webp"
              alt="Electric Car"
              width={300}
              height={300}
              className="w-96 h-auto"
            />
          </div>
        </div>
        <div className="bg-white dark:bg-foreground dark:text-primary-foreground w-full p-6 max-md:p-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-md:max-w-[90%]">
          {manufacturers
            .sort((a, b) => (b.top === true ? 1 : 0) - (a.top === true ? 1 : 0))
            .slice(0, 6)
            .map((m, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 p-4 max-md:p-1 transition-shadow hover:shadow-xl border-transparent border hover:border-gray-200`}
              >
                {m.logo && (
                  <Image
                    src={BASE_URL + "/" + m.logo.src}
                    alt={m.name}
                    width={180}
                    height={180}
                    className="w-12 h-12 max-md:w-16 max-md:h-16 brightness-0 invert-0 object-contain dark:brightness-0 dark:invert-100"
                  />
                )}
                <div>
                  <h3 className="dark:text-primary-foreground font-bold">
                    {m.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-secondary-foreground">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;
