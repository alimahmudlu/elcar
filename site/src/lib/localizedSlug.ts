import { permanentRedirect } from "next/navigation";

/**
 * Səhifə başqa dilin slug-u ilə açılıbsa (dil dəyişdiricisi, köhnə link),
 * API məhsulu yenə tapır — burada həmin dilin öz linkinə yönləndirilir.
 */
export const redirectToLocalizedSlug = (
  locale: string,
  basePath: string,
  id: string,
  slug?: string
) => {
  if (slug && decodeURIComponent(id) !== slug) {
    permanentRedirect(`/${locale}${basePath}/${slug}`);
  }
};
