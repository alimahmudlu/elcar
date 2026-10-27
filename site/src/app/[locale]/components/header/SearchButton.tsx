"use client";

import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";

/** Header-də axtarış: ikon klikləndə header-in altında sorğu sahəsi açılır */
const SearchButton = () => {
  const t = useTranslations("search");
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/${locale}/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        aria-label={t("button")}
        aria-expanded={open}
        className="rounded-full cursor-pointer focused"
        onClick={() => setOpen((v) => !v)}
      >
        <MdSearch className="h-5 w-5 text-elcar dark:text-white" />
      </Button>

      {open && (
        <form
          role="search"
          onSubmit={submit}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          className="absolute left-0 right-0 top-[65px] bg-white dark:bg-foreground shadow-lg border-t border-gray-100 dark:border-gray-700"
        >
          <div className="container max-md:max-w-[90%] flex items-center gap-2 py-3">
            <MdSearch className="h-5 w-5 shrink-0 text-elcar dark:text-white" />
            <input
              ref={inputRef}
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("placeholder")}
              aria-label={t("button")}
              maxLength={100}
              className="flex-1 min-w-0 bg-transparent outline-none text-sm py-2 dark:text-primary-foreground"
            />
            <button
              type="submit"
              className="bg-elcar text-white text-sm font-bold px-4 py-2 rounded-full"
            >
              {t("button")}
            </button>
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setOpen(false)}
              className="p-2 text-gray-500 dark:text-secondary-foreground"
            >
              <MdClose className="h-5 w-5" />
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default SearchButton;
