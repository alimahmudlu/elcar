import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "@/components/common/Breadcrumb";
import { buildMetadata, jsonLdHtml } from "@/lib/seo";
import QuoteRequestForm from "../../components/quote/QuoteRequestForm";

const STEPS = ["request", "check", "offer", "install", "handover", "support"] as const;
const AREAS = [
  { key: "charging", href: "/charging-stations" },
  { key: "solar", href: "/solar-energy" },
  { key: "storage", href: "/energy-storage" },
  { key: "laser", href: "/laser-equipment" },
] as const;
const FAQ = ["price", "self", "prepare", "warranty", "location"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "service.seo" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/services",
    withLanguages: true,
  });
}

const Page = async () => {
  const t = await getTranslations("service");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((key) => ({
      "@type": "Question",
      name: t(`faq.${key}.q`),
      acceptedAnswer: { "@type": "Answer", text: t(`faq.${key}.a`) },
    })),
  };

  return (
    <section className="container max-lg:max-w-[90%] mt-20 mb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(faqJsonLd) }}
      />
      <Breadcrumb items={[{ label: "Elcar", href: "/" }, { label: t("title") }]} />
      <h1 className="text-3xl md:text-5xl text-title font-extrabold mt-4 leading-tight dark:text-primary-foreground">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-3xl text-subtitle text-sm md:text-base dark:text-secondary-foreground">
        {t("subtitle")}
      </p>

      <h2 className="mt-12 text-2xl md:text-3xl font-black text-title dark:text-primary-foreground">
        {t("areas-title")}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {AREAS.map(({ key, href }) => (
          <Link
            key={key}
            href={href}
            className="border p-6 hover:border-transparent hover:shadow-2xl transition-all duration-300 dark:border-secondary-foreground dark:hover:shadow-md dark:hover:shadow-primary-foreground"
          >
            <h3 className="text-lg font-black text-title dark:text-primary-foreground">
              {t(`areas.${key}.title`)}
            </h3>
            <p className="mt-2 text-sm text-[#00000099] dark:text-secondary-foreground">
              {t(`areas.${key}.text`)}
            </p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-2xl md:text-3xl font-black text-title dark:text-primary-foreground">
        {t("steps-title")}
      </h2>
      <ol className="grid md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
        {STEPS.map((key, index) => (
          <li key={key} className="flex gap-4">
            <span className="shrink-0 size-10 rounded-full bg-elcar text-white font-black flex items-center justify-center">
              {index + 1}
            </span>
            <div>
              <h3 className="font-black text-title dark:text-primary-foreground">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="mt-1 text-sm text-[#00000099] dark:text-secondary-foreground">
                {t(`steps.${key}.text`)}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 bg-elcar-opacity p-6 dark:bg-popover">
        <h2 className="text-xl font-black text-title dark:text-primary-foreground">
          {t("safety-title")}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-subtitle dark:text-secondary-foreground">
          {t("safety-text")}
        </p>
      </div>

      <h2 className="mt-12 text-2xl md:text-3xl font-black text-title dark:text-primary-foreground">
        {t("faq-title")}
      </h2>
      <div className="mt-6 max-w-3xl divide-y border-y dark:border-secondary-foreground dark:divide-secondary-foreground">
        {FAQ.map((key) => (
          <details key={key} className="group py-4">
            <summary className="cursor-pointer font-bold text-title dark:text-primary-foreground">
              {t(`faq.${key}.q`)}
            </summary>
            <p className="mt-2 text-sm text-[#00000099] dark:text-secondary-foreground">
              {t(`faq.${key}.a`)}
            </p>
          </details>
        ))}
      </div>

      <div className="mt-12">
        <QuoteRequestForm />
      </div>
    </section>
  );
};

export default Page;
