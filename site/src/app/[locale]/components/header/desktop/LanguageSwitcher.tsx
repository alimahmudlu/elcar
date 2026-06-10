"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import CustomRipple from "../../common/CustomRipple";

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: "az", name: "Azərbaycan", flag: "/flags/az.png" },
  { code: "en", name: "English", flag: "/flags/en.png" },
  { code: "ru", name: "Русский", flag: "/flags/ru.png" },
];

const LanguageSwitcher = ({ currentLocale }: { currentLocale: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const currentLanguage =
    languages.find((lang) => lang.code === currentLocale) || languages[0];

  const switchLanguage = (locale: string) => {
    let newPath: string;
    if (locale === "az") {
      const segments = pathname.split("/");
      if (segments[1] === "en" || segments[1] === "ru") {
        segments.splice(1, 1);
        newPath = "/az/" + segments.join("/") || "/";
      } else {
        newPath = pathname;
      }
    } else {
      if (currentLocale === "az") {
        newPath = `/${locale}${pathname}`;
      } else {
        const segments = pathname.split("/");
        segments[1] = locale;
        newPath = segments.join("/");
      }
    }

    router.push(newPath);
    // setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex focused items-center p-ripple justify-center w-10 h-10 rounded-full bg-white dark:bg-card bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 relative"
          id="language-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          <CustomRipple />
          <Image
            src={currentLanguage.flag}
            alt={currentLanguage.name}
            width={50}
            height={50}
            className="w-[30px] h-[30px] rounded-sm"
          />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-foreground z-50 duration-200"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="py-1" role="none">
            {languages.map((language) => (
              <button
                type="button"
                key={language.code}
                onClick={() => switchLanguage(language.code)}
                className={`${
                  currentLocale === language.code
                    ? "bg-gray-100 text-gray-900 dark:bg-card dark:text-primary"
                    : "text-gray-700 dark:text-primary"
                } group flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-card`}
                role="menuitem"
              >
                <Image
                  src={language.flag}
                  alt={language.name}
                  width={20}
                  height={15}
                  className="w-5 h-auto rounded-sm mr-2"
                />
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
