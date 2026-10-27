import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { productPath } from "@/config/sections";
import type { ProductType } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;

const money = (n: number) => `${Math.round(n * 100) / 100} AZN`;

/**
 * Hazır dəstin tərkibi: komponentlər, sayları və linkləri.
 * Bütün komponentlərin qiyməti məlumdursa, ayrı-ayrılıqda alışla müqayisədə
 * qənaət göstərilir.
 */
const ProductBundle = async ({ product }: { product: ProductType }) => {
  const items = (product.bundleItems ?? []).filter((item) => item.product?._id);
  if (!items.length) return null;

  const t = await getTranslations("bundle");

  const unitPrice = (p: NonNullable<(typeof items)[number]["product"]>) =>
    p.discountedPrice ?? p.price;
  const allPriced = items.every((item) => unitPrice(item.product!) != null);
  const separately = allPriced
    ? items.reduce((sum, item) => sum + (unitPrice(item.product!) ?? 0) * item.quantity, 0)
    : 0;
  const bundlePrice = product.discountedPrice ?? product.price;
  const saving = allPriced && bundlePrice ? separately - bundlePrice : 0;

  return (
    <section className="mt-10" aria-labelledby="bundle-title">
      <h2 id="bundle-title" className="text-2xl font-black text-title dark:text-primary-foreground">
        {t("title")}
      </h2>

      <ul className="mt-4 grid sm:grid-cols-2 gap-3">
        {items.map(({ product: item, quantity }) => (
          <li key={item!._id}>
            <Link
              href={productPath(item!.section, item!.slug)}
              className="flex items-center gap-3 border p-3 hover:shadow-md transition-shadow dark:border-secondary-foreground"
            >
              {item!.image?.src && (
                <Image
                  src={`${BASE_URL}/${item!.image.src.replace(/^\/+/, "")}`}
                  alt={item!.title}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain shrink-0"
                />
              )}
              <span className="flex-1 min-w-0 text-sm font-bold dark:text-primary-foreground">
                {item!.title}
              </span>
              <span className="shrink-0 bg-elcar-opacity text-elcar text-sm font-black rounded-full px-3 py-1 dark:bg-popover dark:text-primary-foreground">
                {t("pcs", { n: quantity })}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {saving > 0 && (
        <p className="mt-4 text-sm dark:text-secondary-foreground">
          {t("separately")}: <s>{money(separately)}</s>
          {" · "}
          <span className="font-black text-elcar dark:text-primary-foreground">
            {t("saving")}: {money(saving)}
          </span>
        </p>
      )}
    </section>
  );
};

export default ProductBundle;
