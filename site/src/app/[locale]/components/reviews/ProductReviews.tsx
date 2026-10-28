import { getLocale, getTranslations } from "next-intl/server";
import { Rating } from "@mui/material";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { getReviews } from "@/api/request";
import type { ProductType, ReviewType } from "@/types";
import ReviewForm from "./ReviewForm";

const Stars = ({ value, size = "w-4 h-4" }: { value: number; size?: string }) => (
  <Rating
    value={value}
    precision={0.1}
    readOnly
    icon={<MdOutlineStarPurple500 className={`${size} text-[#ff5722]`} />}
    emptyIcon={<MdOutlineStarPurple500 className={`${size} text-gray-400`} />}
  />
);

/** Məhsulun təsdiqlənmiş rəyləri, orta reytinq və rəy forması */
const ProductReviews = async ({ product }: { product: ProductType }) => {
  const t = await getTranslations("reviews");
  const locale = await getLocale();
  const res = await getReviews(product._id);
  const reviews: ReviewType[] = Array.isArray(res) ? res : res?.data ?? [];
  const count = Number(product.reviewCount) || reviews.length;
  const average =
    Number(product.rating) ||
    (reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0);

  const dateFormat = new Intl.DateTimeFormat(locale === "az" ? "az-Latn-AZ" : locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="mt-12" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="text-2xl font-black text-title dark:text-primary-foreground">
        {t("title")}
      </h2>

      {count > 0 ? (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-3xl font-black text-title dark:text-primary-foreground">
            {average.toFixed(1)}
          </span>
          <div>
            <Stars value={average} size="w-5 h-5" />
            <p className="text-xs text-[#00000099] dark:text-secondary-foreground">
              {t("average", { n: count })}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-subtitle dark:text-secondary-foreground">{t("empty")}</p>
      )}

      {reviews.length > 0 && (
        <ul className="mt-6 space-y-4">
          {reviews.map((review) => (
            <li key={review._id} className="border-b pb-4 dark:border-secondary-foreground">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-bold dark:text-primary-foreground">{review.fullName}</span>
                <Stars value={review.rating} />
                <time
                  dateTime={review.createdAt}
                  className="text-xs text-[#00000099] dark:text-secondary-foreground"
                >
                  {dateFormat.format(new Date(review.createdAt))}
                </time>
              </div>
              <p className="mt-2 text-sm whitespace-pre-line dark:text-secondary-foreground">
                {review.text}
              </p>
            </li>
          ))}
        </ul>
      )}

      <ReviewForm productId={product._id} />
    </section>
  );
};

export default ProductReviews;
