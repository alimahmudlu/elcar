import { getTranslations } from "next-intl/server";
import { MdOutlineCalculate } from "react-icons/md";
import { Link } from "@/i18n/navigation";

/** Enerji bölmələrində hesablayıcıya yönləndirən kiçik blok */
const CalculatorBanner = async () => {
  const t = await getTranslations("calculator");

  return (
    <div className="flex items-center gap-4 bg-elcar-opacity p-4 md:p-5 dark:bg-popover max-sm:flex-col max-sm:items-start">
      <MdOutlineCalculate className="w-10 h-10 shrink-0 text-elcar dark:text-primary-foreground" />
      <div className="flex-1">
        <p className="font-black text-title dark:text-primary-foreground">{t("banner-title")}</p>
        <p className="text-sm text-subtitle dark:text-secondary-foreground">{t("banner-text")}</p>
      </div>
      <Link
        href="/solar-calculator"
        className="shrink-0 bg-elcar text-white text-sm font-bold rounded-full px-5 py-2"
      >
        {t("banner-button")}
      </Link>
    </div>
  );
};

export default CalculatorBanner;
