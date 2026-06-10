import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");
  return (
    <footer className="text-center bg-[#F5F5F5] py-5 dark:border-t dark:border-gray-700 dark:bg-foreground dark:text-primary-foreground mt-8">
      <h3>
        © ELCAR | {new Date().getFullYear()} | {t("title")}
      </h3>
    </footer>
  );
};

export default Footer;
