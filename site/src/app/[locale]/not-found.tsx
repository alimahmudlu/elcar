import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CONTACT } from "@/config/site";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="container max-lg:max-w-[90%] my-32 text-center">
      <p className="text-7xl md:text-9xl font-black text-primary">404</p>
      <h1 className="mt-6 text-3xl md:text-5xl font-extrabold dark:text-primary-foreground">
        {t("title")}
      </h1>
      <p className="mt-4 text-subtitle dark:text-secondary-foreground">
        {t("subtitle")}
      </p>

      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link
          href="/charging-stations"
          className="px-6 py-3 rounded-md bg-primary text-white font-semibold"
        >
          {t("stations")}
        </Link>
        <Link
          href="/connectors-accessories"
          className="px-6 py-3 rounded-md border font-semibold dark:text-primary-foreground"
        >
          {t("connectors")}
        </Link>
        <Link
          href="/"
          className="px-6 py-3 rounded-md border font-semibold dark:text-primary-foreground"
        >
          {t("home")}
        </Link>
      </div>

      <p className="mt-10 dark:text-secondary-foreground">
        {t("help")}{" "}
        <a href={`tel:${CONTACT.phone}`} className="font-semibold text-primary">
          {CONTACT.phoneDisplay}
        </a>
      </p>
    </section>
  );
}
