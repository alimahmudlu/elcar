import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useTranslations } from "next-intl";
import ContactForm from "../../components/contact/ContactForm";
import ContactInfo from "../../components/contact/ContactInfo";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.contact" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/contact",
    withLanguages: true,
  });
}

const Page = () => {
  const t = useTranslations();

  return (
    <section className="container max-lg:max-w-[90%] my-24">
      <Breadcrumb items={[{ label: "Elcar", href: "/" }, { label: t("pages.contact") }]} />
      <div>
        <h1 className="text-[48px] font-black dark:text-primary-foreground">{t("contact.title")}</h1>
      </div>
      <p className="dark:text-secondary-foreground">{t("contact.subtitle")}</p>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-8 border mt-16 p-4">
        <div>
          <ContactInfo />
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default Page;
