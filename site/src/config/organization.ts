import { CONTACT, SITE_NAME, SITE_URL } from "./site";

/** Organization + LocalBusiness JSON-LD (root layout-da yayımlanır) */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  description:
    "Azərbaycanda elektromobil şarj stansiyalarının satışı və quraşdırılması",
  url: SITE_URL,
  telephone: CONTACT.phone,
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.address.street,
    addressLocality: CONTACT.address.city,
    addressRegion: CONTACT.address.district,
    addressCountry: CONTACT.address.country,
  },
  openingHours: "Mo-Sa 09:00-18:00",
};
