import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CONTACT } from "@/config/site";
import { MdEmail, MdLocationOn, MdPhone, MdSchedule } from "react-icons/md";

const Footer = async () => {
  const t = await getTranslations("footer");
  const p = await getTranslations("pages");

  return (
    <footer className="bg-[#F5F5F5] dark:border-t dark:border-gray-700 dark:bg-foreground dark:text-primary-foreground mt-8">
      <div className="container max-lg:max-w-[90%] py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-black mb-3">ELCAR</h3>
          <p className="text-sm text-[#00000099] dark:text-secondary-foreground">
            {t("about")}
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-3">{t("products")}</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/charging-stations" className="hover:underline">
                {p("chargingStations")}
              </Link>
            </li>
            <li>
              <Link href="/connectors-accessories" className="hover:underline">
                {p("connectors")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3">{t("company")}</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:underline">
                {p("about")}
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:underline">
                {p("blog")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                {p("contact")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3">{t("contact")}</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MdLocationOn className="shrink-0" />
              <span>
                {CONTACT.address.city}, {CONTACT.address.district},{" "}
                {CONTACT.address.street}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MdPhone className="shrink-0" />
              <a href={`tel:${CONTACT.phone}`} className="hover:underline">
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MdEmail className="shrink-0" />
              <a href={`mailto:${CONTACT.email}`} className="hover:underline">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MdSchedule className="shrink-0" />
              <span>{t("hours")}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center border-t border-gray-200 dark:border-gray-700 py-4 text-sm">
        © ELCAR | {new Date().getFullYear()} | {t("title")}
      </div>
    </footer>
  );
};

export default Footer;
