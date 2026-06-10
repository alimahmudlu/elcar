import { useLocale, useTranslations } from "next-intl";
import { Roboto } from "next/font/google";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

const Services = () => {
  const t = useTranslations("services");
  const locale = useLocale();
  return (
    <div
      className={`${roboto.className} container max-md:max-w-[95%] relative z-10 [box-shadow:0_8px_10px_-5px_rgba(0,_0,_0,_.2),_0_16px_24px_2px_rgba(0,_0,_0,_.14),_0_6px_30px_5px_rgba(0,_0,_0,_.12)] bg-white w-full shadow-2xs -translate-y-[40px] grid-cols-4 hidden md:grid max-lg:-translate-y-[45px] dark:bg-foreground`}
    >
      <div className="col-span-2 p-8 max-lg:col-span-4 max-lg:border max-lg:border-b-2">
        <h2 className="font-black mb-6 text-elcar text-[34px] tracking-[0.25px] dark:text-primary-foreground">
          {t("main.title")}
        </h2>
        <div
          className="text-gray-600 max-w-4xl mx-auto text-sm tracking-normal leading-6 mb-4 dark:text-secondary-foreground"
          dangerouslySetInnerHTML={{ __html: t.raw("main.subtitle") }}
        />
        <div className="flex gap-4">
          <Link
            href={`/${locale}/about`}
            className="bg-elcar-opacity flex items-center gap-2 text-elcar px-4 focused py-2 rounded-full dark:bg-primary dark:hover:bg-primary/80 duration-200 dark:hover:text-card-foreground"
          >
            {t("main.button")}
            <RiArrowRightLine className="w-5 h-5" />
          </Link>
        </div>
      </div>
      <div className="col-span-1 p-8 relative overflow-hidden max-lg:col-span-2">
        <h2 className="text-2xl z-10 relative text-wrap mb-6 text-black tracking-[0.25px] max-w-[80%] font-black dark:text-primary-foreground">
          {t("second.title")}
        </h2>
        <div
          className="text-gray-600 z-10 relative mx-0 text-sm tracking-normal leading-6 mb-4 max-w-[80%] dark:text-secondary-foreground"
          dangerouslySetInnerHTML={{ __html: t.raw("second.subtitle") }}
        />
        <div className="flex gap-4 z-10 relative max-w-[80%]">
          <button className="bg-elcar-opacity flex items-center gap-2 text-elcar p-1 focused py-2 px-2 rounded-full dark:bg-primary dark:hover:bg-primary/80 duration-200 dark:hover:text-card-foreground">
            <RiArrowRightLine className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute -bottom-12 -right-20 z-0 w-[250px] h-[250px] bg-[url('/images/electric-vehicle.png')] bg-no-repeat bg-size-[250px]"></div>
      </div>
      <div className="col-span-1 p-8 relative overflow-hidden max-lg:col-span-2">
        <h2 className="text-2xl z-10 relative text-wrap mb-6 text-black tracking-[0.25px] max-w-[80%] font-black dark:text-primary-foreground">
          {t("third.title")}
        </h2>
        <div
          className="text-gray-600 z-10 relative mx-0 text-sm tracking-normal leading-6 mb-4 max-w-[80%] dark:text-secondary-foreground"
          dangerouslySetInnerHTML={{ __html: t.raw("third.subtitle") }}
        />
        <div className="flex gap-4 z-10 relative max-w-[80%]">
          <button className="bg-elcar-opacity flex items-center gap-2 text-elcar p-1 focused py-2 px-2 rounded-full dark:bg-primary dark:hover:bg-primary/80 duration-200 dark:hover:text-card-foreground">
            <RiArrowRightLine className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute -bottom-12 -right-22 z-0 w-[250px] h-[250px] bg-[url('/images/charging-tool.webp')] bg-no-repeat bg-size-[250px]"></div>
      </div>
    </div>
  );
};

export default Services;
