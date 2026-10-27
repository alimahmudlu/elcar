"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { MdCompareArrows, MdClose } from "react-icons/md";
import { Link } from "@/i18n/navigation";
import { compareHref, useCompareStore } from "@/lib/compareStore";

/** Müqayisə siyahısında məhsul olanda ekranın aşağısında görünən panel */
const CompareBar = () => {
  const t = useTranslations("compare");
  const pathname = usePathname();
  const { items, remove, clear } = useCompareStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || items.length === 0 || pathname.endsWith("/compare")) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(640px,calc(100%-32px))] max-md:bottom-24">
      <div className="flex items-center gap-3 bg-white dark:bg-foreground shadow-2xl rounded-full border border-elcar/30 pl-4 pr-2 py-2">
        <MdCompareArrows className="w-5 h-5 shrink-0 text-elcar dark:text-primary-foreground" />
        <ul className="flex-1 min-w-0 flex gap-2 overflow-x-auto">
          {items.map((item) => (
            <li
              key={item._id}
              className="flex items-center gap-1 shrink-0 max-w-[160px] text-xs bg-elcar-opacity text-elcar rounded-full pl-3 pr-1 py-1 dark:bg-popover dark:text-primary-foreground"
            >
              <span className="truncate">{item.title}</span>
              <button
                type="button"
                onClick={() => remove(item._id)}
                aria-label={`${t("remove")}: ${item.title}`}
                className="p-0.5"
              >
                <MdClose className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={clear}
          className="text-xs text-gray-500 shrink-0 dark:text-secondary-foreground max-sm:hidden"
        >
          {t("clear")}
        </button>
        {items.length > 1 ? (
          <Link
            href={compareHref(items.map((i) => i._id))}
            className="shrink-0 bg-elcar text-white text-sm font-bold rounded-full px-4 py-2"
          >
            {t("bar", { n: items.length })}
          </Link>
        ) : (
          <span className="shrink-0 text-xs text-gray-500 px-2 dark:text-secondary-foreground">
            {t("more")}
          </span>
        )}
      </div>
    </div>
  );
};

export default CompareBar;
