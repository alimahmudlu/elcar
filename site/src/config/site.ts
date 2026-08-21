export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://elcar.az";

export const SITE_NAME = "ELCAR";

export const LOCALES = ["az", "en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

/** hreflang üçün tam dil kodları */
export const HREFLANG: Record<Locale, string> = {
  az: "az-AZ",
  en: "en",
  ru: "ru-RU",
};

export const CONTACT = {
  phone: "+994773006060",
  phoneDisplay: "(+994 77) 300 60 60",
  email: "info@elcar.az",
  address: {
    street: "Həsənoğlu küçəsi 4",
    district: "Nərimanov",
    city: "Bakı",
    country: "AZ",
  },
};
