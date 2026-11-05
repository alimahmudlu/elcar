import { CONTACT } from "@/config/site";

/** Link həddən uzun olmasın. Array.from emojini yarıdan kəsmir. */
const MAX_TEXT_CHARS = 1500;

export const buildWhatsAppHref = (text: string) => {
  const limited = Array.from(text).slice(0, MAX_TEXT_CHARS).join("");
  return `https://wa.me/${CONTACT.phone.replace(/\D/g, "")}?text=${encodeURIComponent(limited)}`;
};
