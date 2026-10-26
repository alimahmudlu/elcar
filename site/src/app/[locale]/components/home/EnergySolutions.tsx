import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RiArrowRightLine } from "react-icons/ri";
import { MdOutlineSolarPower, MdOutlineWindPower, MdBatteryChargingFull } from "react-icons/md";
import type { IconType } from "react-icons";
import { ENERGY_SOLUTIONS } from "@/config/sections";

const ICONS: Record<(typeof ENERGY_SOLUTIONS)[number], IconType> = {
  "solar-energy": MdOutlineSolarPower,
  "wind-energy": MdOutlineWindPower,
  "energy-storage": MdBatteryChargingFull,
};

/** Ana səhifədə enerji həlləri bölmələrinə keçid kartları */
const EnergySolutions = async () => {
  const t = await getTranslations("sections");

  return (
    <section className="container max-md:max-w-[90%] my-12">
      <div className="text-center">
        <h2 className="text-[34px] max-md:text-2xl font-black text-title dark:text-primary-foreground">
          {t("home.title")}
        </h2>
        <p className="mt-3 text-subtitle text-[14px] dark:text-secondary-foreground">
          {t("home.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {ENERGY_SOLUTIONS.map((section) => {
          const Icon = ICONS[section];
          return (
            <Link
              key={section}
              href={`/${section}`}
              className="group flex flex-col border p-6 hover:border-transparent hover:shadow-2xl transition-all duration-300 dark:border-secondary-foreground dark:hover:border-transparent dark:hover:shadow-md dark:hover:shadow-primary-foreground"
            >
              <Icon className="w-12 h-12 text-elcar dark:text-primary-foreground" />
              <h3 className="mt-4 text-[20px] font-black text-title dark:text-primary-foreground">
                {t(`${section}.name`)}
              </h3>
              <p className="mt-2 text-sm text-[#00000099] dark:text-secondary-foreground">
                {t(`${section}.short`)}
              </p>
              <span className="mt-auto pt-4 inline-flex items-center gap-2 text-elcar font-bold text-sm dark:text-primary-foreground">
                {t("home.more")}
                <RiArrowRightLine className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default EnergySolutions;
