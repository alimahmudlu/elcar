import Link from "next/link";
import { Breadcrumbs } from "@mui/material";
import { AiOutlineRight } from "react-icons/ai";
import { useTranslations } from "next-intl";
import ContactForm from "../../components/contact/ContactForm";
import ContactInfo from "../../components/contact/ContactInfo";

const Page = () => {
  const t = useTranslations();

  return (
    <section className="container max-lg:max-w-[90%] my-24">
      <Breadcrumbs
        separator={<AiOutlineRight className="w-3 h-3 dark:text-primary-foreground" />}
        aria-label="breadcrumb"
      >
        <Link className="focused dark:text-primary-foreground" color="inherit" href="/">
          Elcar
        </Link>
        <Link className="dark:text-primary-foreground" color="inherit" href="/blog">
          {t("pages.contact")}
        </Link>
      </Breadcrumbs>
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
