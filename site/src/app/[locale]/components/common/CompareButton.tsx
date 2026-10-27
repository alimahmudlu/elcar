"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MdCompareArrows } from "react-icons/md";
import { COMPARE_LIMIT, useCompareStore } from "@/lib/compareStore";
import type { ProductType } from "@/types";

/**
 * Məhsulu müqayisə siyahısına əlavə edir / çıxarır.
 * "card" — kartın sağ yuxarı küncündə ikon, "inline" — detal səhifəsində düymə.
 */
const CompareButton = ({
  product,
  variant = "card",
}: {
  product: ProductType;
  variant?: "card" | "inline";
}) => {
  const t = useTranslations("compare");
  const { has, toggle } = useCompareStore();
  // localStorage yalnız brauzerdə oxunur — hydration uyğunsuzluğu olmasın
  const [mounted, setMounted] = useState(false);
  const [limitHit, setLimitHit] = useState(false);
  useEffect(() => setMounted(true), []);

  const active = mounted && has(product._id);
  const label = limitHit
    ? t("limit", { n: COMPARE_LIMIT })
    : active
      ? t("added")
      : t("add");

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!toggle(product)) {
      setLimitHit(true);
      setTimeout(() => setLimitHit(false), 2500);
    }
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border transition-colors ${
          active
            ? "bg-elcar text-white border-elcar"
            : "text-elcar border-elcar dark:text-primary-foreground dark:border-primary-foreground"
        }`}
      >
        <MdCompareArrows className="w-5 h-5" />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`absolute right-3 size-10 rounded-full flex items-center justify-center transition-all duration-500 focused z-[1] ${
        active
          ? "top-3 bg-elcar text-white"
          : "-top-full group-hover:top-3 bg-white text-elcar border border-elcar dark:bg-foreground dark:text-primary-foreground"
      } ${limitHit ? "top-3 ring-2 ring-orange-500" : ""}`}
    >
      <MdCompareArrows className="w-5 h-5" />
    </button>
  );
};

export default CompareButton;
