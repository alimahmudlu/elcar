import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/common/Breadcrumb";
import { ENDPOINTS } from "@/api/endpoints";
import { fetchData } from "@/api/request";
import { buildMetadata } from "@/lib/seo";
import ChargerGuide from "../components/guide/ChargerGuide";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guide.seo" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/charger-guide",
    withLanguages: true,
  });
}

const Page = async () => {
  const t = await getTranslations();
  const filter = encodeURIComponent(JSON.stringify({ section: "charging-stations" }));
  const { data: products } = await fetchData(
    `${ENDPOINTS.products.list}?filter=${filter}&$limit=50`
  );

  return (
    <section className="container max-md:max-w-[90%] mt-20 mb-10">
      <Breadcrumb
        items={[
          { label: "Elcar", href: "/" },
          { label: t("pages.chargingStations"), href: "/charging-stations" },
          { label: t("guide.title") },
        ]}
      />
      <h1 className="text-3xl md:text-5xl text-title font-extrabold mt-4 leading-tight dark:text-primary-foreground">
        {t("guide.title")}
      </h1>
      <p className="mt-4 max-w-3xl text-subtitle text-sm md:text-base dark:text-secondary-foreground">
        {t("guide.subtitle")}
      </p>

      <ChargerGuide products={products ?? []} />
    </section>
  );
};

export default Page;
