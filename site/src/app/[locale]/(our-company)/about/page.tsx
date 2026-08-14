import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useTranslations } from "next-intl";
import Image from "next/image";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.about" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/about",
    withLanguages: true,
  });
}

const Page = () => {
  const t = useTranslations();
  return (
    <section className="container max-lg:max-w-[90%] my-24">
      <h1 className="text-3xl md:text-5xl text-title font-extrabold mt-4 leading-tight  dark:text-primary-foreground">
        {t("about.title")}
      </h1>
      <Breadcrumb items={[{ label: "Elcar", href: "/" }, { label: t("pages.about") }]} />

      <p className="mt-4 text-subtitle text-sm md:text-base dark:text-secondary-foreground">
        {t.raw("about.subtitle")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16 mt-8">
        <div>
          <p
            className="text-lg md:text-xl text-gray-800 leading-relaxed dark:text-primary-foreground"
            dangerouslySetInnerHTML={{ __html: t.raw("about.section1") }}
          />
        </div>

        <div className="w-full">
          <Image
            src="/images/electric-car.webp"
            alt="Popular Cars"
            width={500}
            height={500}
            className="mx-auto"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-6">
          <Image
            src="/images/electric-car-2.webp"
            alt="Popular Cars"
            width={500}
            height={500}
            className="mx-auto"
          />
        </div>

        <div>
          <p
            className="text-lg md:text-xl text-gray-800 leading-relaxed dark:text-primary-foreground"
            dangerouslySetInnerHTML={{ __html: t.raw("about.section2") }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-16">
        <div>
          <p
            className="text-lg md:text-xl text-gray-800 leading-relaxed dark:text-primary-foreground"
            dangerouslySetInnerHTML={{ __html: t.raw("about.section3") }}
          />
        </div>

        <div className="w-full">
          <Image
            src="/images/electric-car-1.webp"
            alt="Popular Cars"
            width={500}
            height={500}
            className="mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Page;
