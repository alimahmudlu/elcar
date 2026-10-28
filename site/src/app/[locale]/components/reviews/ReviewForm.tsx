"use client";

import { useState } from "react";
import { Rating } from "@mui/material";
import { useTranslations } from "next-intl";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { createReview } from "@/api/request";

const NAME_RE = /^[\p{L}\s.'-]+$/u;

/** Rəy forması. Göndərilən rəy admin təsdiqləyənə qədər saytda görünmür. */
const ReviewForm = ({ productId }: { productId: string }) => {
  const t = useTranslations("reviews");
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [website, setWebsite] = useState(""); // bot tələsi, istifadəçi görmür
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (fullName.trim().length < 2 || !NAME_RE.test(fullName.trim())) next.name = t("errors.name");
    if (!rating) next.rating = t("errors.rating");
    if (text.trim().length < 10) next.text = t("errors.text");
    setErrors(next);
    if (Object.keys(next).length) return;

    setState("sending");
    const res = await createReview({
      product: productId,
      fullName: fullName.trim(),
      rating: rating as number,
      text: text.trim(),
      website,
    });
    setState(res ? "sent" : "error");
  };

  if (state === "sent") {
    return (
      <p role="status" className="mt-4 p-4 bg-elcar-opacity text-elcar font-bold dark:bg-popover dark:text-primary-foreground">
        {t("sent")}
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 border border-elcar text-elcar font-bold text-sm rounded-full px-5 py-2 dark:text-primary-foreground dark:border-primary-foreground"
      >
        {t("write")}
      </button>
    );
  }

  const inputClass =
    "w-full border rounded-md px-3 py-2 text-sm bg-transparent dark:border-secondary-foreground dark:text-primary-foreground";

  return (
    <form onSubmit={submit} noValidate className="mt-4 space-y-4 max-w-xl">
      <label className="block">
        <span className="block text-sm font-bold mb-1 dark:text-primary-foreground">{t("name")}</span>
        <input
          className={inputClass}
          value={fullName}
          maxLength={60}
          autoComplete="name"
          onChange={(e) => setFullName(e.target.value)}
          aria-invalid={!!errors.name}
        />
        {errors.name && <span className="block mt-1 text-xs text-red-600">{errors.name}</span>}
      </label>

      <div>
        <span id="review-rating" className="block text-sm font-bold mb-1 dark:text-primary-foreground">
          {t("rating")}
        </span>
        <Rating
          aria-labelledby="review-rating"
          value={rating}
          onChange={(_, value) => setRating(value)}
          icon={<MdOutlineStarPurple500 className="w-7 h-7 text-[#ff5722]" />}
          emptyIcon={<MdOutlineStarPurple500 className="w-7 h-7 text-gray-400" />}
        />
        {errors.rating && <span className="block mt-1 text-xs text-red-600">{errors.rating}</span>}
      </div>

      <label className="block">
        <span className="block text-sm font-bold mb-1 dark:text-primary-foreground">{t("text")}</span>
        <textarea
          className={inputClass}
          rows={4}
          value={text}
          maxLength={2000}
          placeholder={t("text-hint")}
          onChange={(e) => setText(e.target.value)}
          aria-invalid={!!errors.text}
        />
        {errors.text && <span className="block mt-1 text-xs text-red-600">{errors.text}</span>}
      </label>

      {/* Botlar bu sahəni doldurur, insanlar görmür */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {state === "error" && <p className="text-sm text-red-600">{t("error")}</p>}

      <button
        type="submit"
        disabled={state === "sending"}
        className="bg-elcar text-white text-sm font-bold rounded-full px-5 py-2 disabled:opacity-60"
      >
        {t("send")}
      </button>
    </form>
  );
};

export default ReviewForm;
