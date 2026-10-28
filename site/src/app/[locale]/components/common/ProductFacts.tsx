import { getTranslations } from "next-intl/server";
import { MdOutlineFileDownload, MdOutlineInsertDriveFile } from "react-icons/md";
import type { ProductType } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;

const formatSize = (bytes?: number) => {
  if (!bytes) return null;
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

/** API fayl yolunu "uploads/..." və ya "/uploads/..." şəklində qaytara bilər */
const fileUrl = (src: string) => `${BASE_URL}/${src.replace(/^\/+/, "")}`;

/**
 * Məhsul detal səhifəsində SKU, zəmanət və yüklənə bilən sənədlər
 * (datasheet, təlimat, sertifikat). Ölçü/çəki xüsusiyyətlərdə saxlanılır.
 * Heç biri doldurulmayıbsa blok göstərilmir.
 */
const ProductFacts = async ({ product }: { product: ProductType }) => {
  const t = await getTranslations("product-facts");
  const { sku, warranty } = product;
  const documents = (product.documents ?? []).filter((doc) => doc?.src);

  const facts = [
    sku && { label: t("sku"), value: sku },
    warranty && {
      label: t("warranty"),
      value:
        warranty % 12 === 0
          ? t("years", { n: warranty / 12 })
          : t("months", { n: warranty }),
    },
  ].filter(Boolean) as { label: string; value: string }[];

  if (!facts.length && !documents.length) return null;

  return (
    <div className="grid md:grid-cols-2 gap-8 mt-10">
      {facts.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-title dark:text-primary-foreground">
            {t("title")}
          </h2>
          <dl className="mt-4 divide-y border-y dark:divide-secondary-foreground dark:border-secondary-foreground">
            {facts.map((fact) => (
              <div key={fact.label} className="flex justify-between gap-4 py-3 text-sm">
                <dt className="text-[#00000099] dark:text-secondary-foreground">
                  {fact.label}
                </dt>
                <dd className="font-bold text-right dark:text-primary-foreground">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {documents.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-title dark:text-primary-foreground">
            {t("documents")}
          </h2>
          <ul className="mt-4 space-y-2">
            {documents.map((doc) => (
              <li key={doc.src}>
                <a
                  href={fileUrl(doc.src)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border p-3 hover:shadow-md transition-shadow dark:border-secondary-foreground"
                >
                  <MdOutlineInsertDriveFile className="w-6 h-6 shrink-0 text-elcar dark:text-primary-foreground" />
                  <span className="flex-1 min-w-0">
                    <span className="block truncate font-bold text-sm dark:text-primary-foreground">
                      {doc.name}
                    </span>
                    <span className="block text-xs uppercase text-[#00000099] dark:text-secondary-foreground">
                      {[doc.extension, formatSize(doc.size)].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-elcar text-sm font-bold dark:text-primary-foreground">
                    <MdOutlineFileDownload className="w-5 h-5" />
                    {t("download")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductFacts;
