import { HiArrowRight } from "react-icons/hi";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";

const MobileServices = () => {
  const t = useTranslations("services");
  const locale = useLocale();
  return (
    <section className="container max-md:max-w-[90%] md:hidden">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-title dark:text-primary-foreground">
          {t("main.title")}
        </h1>
        <p
          className="text-subtitle mt-4 dark:text-secondary-foreground"
          dangerouslySetInnerHTML={{ __html: t.raw("main.subtitle") }}
        />
        <Link
          href={`/${locale}/about`}
          className="mt-6 inline-flex items-center gap-2 bg-elcar-opacity text-elcar font-medium px-5 py-2 rounded-full dark:bg-primary dark:hover:bg-primary/80 duration-200 dark:hover:text-card-foreground transition"
        >
          {t("main.button")} <HiArrowRight size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-bold mb-2 text-title dark:text-primary-foreground">
            {t("second.title")}
          </h2>
          <p
            className="text-subtitle mb-4 dark:text-secondary-foreground"
            dangerouslySetInnerHTML={{ __html: t.raw("second.subtitle") }}
          />
          <button className="inline-flex items-center gap-2 bg-elcar-opacity text-elcar font-medium p-2 rounded-full dark:bg-primary dark:hover:bg-primary/80 duration-200 dark:hover:text-card-foreground transition">
            <HiArrowRight size={18} />
          </button>
        </div>

        {/* Sağ blok */}
        <div>
          <h2 className="text-xl font-bold mb-2 text-title dark:text-primary-foreground">
            {t("third.title")}
          </h2>
          <p
            className="text-subtitle mb-4 dark:text-secondary-foreground"
            dangerouslySetInnerHTML={{ __html: t.raw("third.subtitle") }}
          />
          <button className="inline-flex items-center gap-2 bg-elcar-opacity text-elcar font-medium p-2  rounded-full dark:bg-primary dark:hover:bg-primary/80 duration-200 dark:hover:text-card-foreground transition">
            <HiArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MobileServices;
