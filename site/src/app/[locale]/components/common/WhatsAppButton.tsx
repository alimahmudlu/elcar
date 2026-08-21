import { CONTACT } from "@/config/site";
import { getTranslations } from "next-intl/server";
import { FaWhatsapp } from "react-icons/fa";

/** Hər səhifədə sabit WhatsApp düyməsi */
export default async function WhatsAppButton() {
  const t = await getTranslations("contact");
  const href = `https://wa.me/${CONTACT.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    t("whatsapp-message")
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp-label")}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform"
    >
      <FaWhatsapp className="w-7 h-7" />
    </a>
  );
}
