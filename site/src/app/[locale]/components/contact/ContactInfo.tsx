import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const ContactInfo = () => {
  const t = useTranslations();
  return (
    <div>
      <Typography variant="h5" className="font-bold mb-4 dark:text-primary-foreground">
        {t("contact.info.title")}
      </Typography>
      <Typography className="mb-6 dark:text-secondary-foreground">
        {t("contact.info.subtitle")}
      </Typography>

      <div className="flex items-start gap-4 mb-4 mt-4">
        <div className="text-2xl bg-red-100 text-red-500 p-2 rounded-full">
          <MdEmail />
        </div>
        <div>
          <Typography className="font-bold dark:text-primary-foreground">
            {t("contact.info.email")}
          </Typography>
          <Typography className="dark:text-secondary-foreground">info@elcar.az</Typography>
        </div>
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="text-2xl bg-green-100 text-green-500 p-2 rounded-full">
          <MdPhone />
        </div>
        <div>
          <Typography className="font-bold dark:text-primary-foreground">
            {t("contact.info.phone")}
          </Typography>
          <Typography className="dark:text-secondary-foreground">(+994 77) 300 60 60</Typography>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="text-2xl bg-blue-100 text-blue-500 p-2 rounded-full">
          <MdLocationOn />
        </div>
        <div>
          <Typography className="font-bold dark:text-primary-foreground">
            {t("contact.info.address")}
          </Typography>
          <Typography className="dark:text-secondary-foreground">{t("contact.info.address-info")}</Typography>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
