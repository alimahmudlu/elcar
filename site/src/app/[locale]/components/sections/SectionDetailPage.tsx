import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, jsonLdHtml, productJsonLd } from "@/lib/seo";
import { CONTACT, SITE_URL } from "@/config/site";
import type { EnergySection } from "@/config/sections";
import type { ProductType } from "@/types";
import Breadcrumb from "@/components/common/Breadcrumb";
import { BASE_URL, ENDPOINTS } from "@/api/endpoints";
import { fetchProductDetails } from "@/api/request";
import { Roboto } from "next/font/google";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FaWhatsapp } from "react-icons/fa";
import DetailSection from "../common/DetailSection";
import AddToCartButton from "../common/AddToCartButton";

const roboto = Roboto({ subsets: ["latin"] });

const getProduct = async (id: string): Promise<ProductType> =>
  fetchProductDetails(ENDPOINTS.products.detail.replace(":id", encodeURIComponent(id)));

/** Enerji bölməsinin məhsul detal səhifəsi üçün metadata */
export async function sectionDetailMetadata(
  section: EnergySection,
  locale: string,
  id: string
): Promise<Metadata> {
  const product = await getProduct(id);
  if (!product?.title) return { title: "404" };

  const price = product.discountedPrice ?? product.price;
  return buildMetadata({
    title: price ? `${product.title} — ${price} AZN` : product.title,
    description: product.description,
    locale,
    path: `/${section}/${product?.slug ?? id}`,
    image: product.image?.src ? BASE_URL + product.image.src : undefined,
  });
}

/**
 * Enerji bölmələrinin ortaq məhsul detal səhifəsi.
 * Qiyməti olmayan məhsullarda (məs. sənaye BESS, lazer xətləri)
 * "Qiymət sorğu ilə" göstərilir və WhatsApp ilə sorğu düyməsi önə çıxır.
 */
const SectionDetailPage = async ({
  section,
  id,
  locale,
}: {
  section: EnergySection;
  id: string;
  locale: string;
}) => {
  const t = await getTranslations();
  const product = await getProduct(id);
  if (!product?.title) notFound();

  const {
    title,
    price,
    discount,
    discountedPrice,
    image,
    description,
    characteristicGroups = [],
    category,
  } = product;

  const keySpecs = (characteristicGroups[0]?.characteristics ?? [])
    .filter(
      (item) =>
        item.name && item.value !== "" && item.value != null && item.visible !== false
    )
    .slice(0, 4);

  const whatsappHref = `https://wa.me/${CONTACT.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    t("sections.whatsapp-message", { product: title })
  )}`;

  return (
    <section
      className={`container max-lg:max-w-[90%] mt-18 ${roboto.className}`}
    >
      <Breadcrumb
        className="max-md:flex items-center flex-nowrap overflow-x-auto max-sm:[&>.MuiBreadcrumbs-ol]:!flex-nowrap"
        items={[
          { label: "Elcar", href: "/" },
          { label: t(`sections.${section}.name`), href: `/${section}` },
          { label: title },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml(
            productJsonLd({
              title,
              description,
              image: image?.src ? BASE_URL + image.src : undefined,
              brand: product?.brand?.name,
              price,
              discountedPrice,
              url: `${SITE_URL}/${locale}/${section}/${product?.slug ?? id}`,
            })
          ),
        }}
      />
      <div className="px-4 py-8 mt-24 max-md:mt-14 max-sm:mt-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative w-full">
            {discount && discount > 0 && price ? (
              <div className="absolute -top-6 -left-6 bg-blue-600 text-white w-24 h-24 rounded-full flex flex-col items-center justify-center text-center shadow-xl z-10">
                <span className="line-through text-sm">{price}₼</span>
                <span className="text-xl font-bold">{discountedPrice}₼</span>
                <span className="text-red-400 text-xs font-bold">
                  -{discount}%
                </span>
              </div>
            ) : null}
            {image?.src && (
              <Image
                src={`${BASE_URL}/${image.src}`}
                alt={title}
                width={700}
                height={600}
                className="w-full h-auto object-contain rounded-md xl:w-[625px] xl:h-[410px]"
              />
            )}
          </div>

          <div>
            <h4 className="text-title text-xl font-black dark:text-primary-foreground max-lg:text-lg max-sm:text-base">
              {category?.name}
            </h4>
            <h1 className="text-title text-5xl font-black mt-2 dark:text-primary-foreground max-lg:text-3xl max-md:text-xl max-sm:text-lg">
              {category?.name ? title.replace(category.name, "") : title}
            </h1>
            <p className="text-subtitle mt-4 dark:text-secondary-foreground max-sm:text-sm">
              {description}
            </p>

            {keySpecs.length > 0 && (
              <ul className="grid grid-cols-2 gap-4 mt-8 max-md:mt-6 max-sm:mt-4 max-w-md">
                {keySpecs.map((item, i) => (
                  <li
                    key={i}
                    className="flex flex-col gap-1 text-[16px] max-sm:text-sm dark:text-secondary-foreground"
                  >
                    <span>{item.name}</span>
                    <span className="font-bold">{String(item.value)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="text-2xl font-black text-title dark:text-primary-foreground">
                {price
                  ? `${discount ? discountedPrice : price} AZN`
                  : t("sections.price-on-request")}
              </span>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-3 font-bold text-white hover:opacity-90 transition-opacity"
              >
                <FaWhatsapp className="w-5 h-5" />
                {t("sections.request-quote")}
              </a>
            </div>
          </div>
        </div>

        <DetailSection
          characteristicGroups={characteristicGroups as any}
          BASE_URL={BASE_URL || ""}
        />

        <AddToCartButton product={product} />
      </div>
    </section>
  );
};

export default SectionDetailPage;
