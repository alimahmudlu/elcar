"use client";

import Link from "next/link";
import { navigations } from "@/config/navigation";
import { usePathname } from "next/navigation";
import { NavigationItem, NavigationItems } from "@/types";
import CustomRipple from "../../common/CustomRipple";

interface NavBarProps {
  locale: string;
}

const NavBar: React.FC<NavBarProps> = ({ locale }) => {
  const navigation = navigations();
  const currentPath = usePathname();

  const isItemActive = (item: NavigationItem): boolean => {
    const pathWithoutLocale = currentPath.replace(`/${locale}`, "") || "/";

    if (
      pathWithoutLocale === item.href ||
      pathWithoutLocale.startsWith(`${item.href}/`)
    ) {
      return true;
    }

    if (item.subItems) {
      return item.subItems.some(
        (sub) =>
          pathWithoutLocale === sub.href ||
          pathWithoutLocale.startsWith(`${sub.href}/`)
      );
    }

    return false;
  };

  const renderNavItem = (item: NavigationItem) => (
    <li
      key={item.href}
      className="relative group text-[16px] max-lg:text-[14px]"
    >
      <Link
        href={`/${locale}${item.href}`}
        className={`text-elcar px-4 max-xl:px-2 py-1 hover:text-primary-600 transition-colors duration-200 flex items-center focused text-[14px] max-lg:text-[12px] font-bold h-[38px] min-w-[64px] max-xl:min-w-[40px] relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:transition-opacity before:duration-200 xl:mr-1 ${
          isItemActive(item)
            ? "rounded-[28px] before:bg-elcar overflow-hidden before:rounded-[28px] before:z-[-1] before:opacity-[0.18]"
            : "before:opacity-0 overflow-hidden"
        } hover:before:bg-transparent duration-300 p-ripple overflow-hidden`}
      >
        <span className="text-inherit text-nowrap dark:text-primary-foreground">
          {item.name}
        </span>
        <CustomRipple />
        {item.subItems && (
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </Link>
      {item.subItems && (
        <div
          className={`absolute left-0 mt-2 w-48 top-[140%]
            group-hover:top-[100%]
            bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 dark:bg-foreground`}
        >
          {item.subItems.map((subItem) => (
            <Link
              key={subItem.href}
              href={`/${locale}${subItem.href}`}
              className={`block px-4 py-2 text-sm text-gray-700 dark:text-primary-foreground dark:hover:bg-card dark:hover:text-primary-foreground ${
                isItemActive(subItem)
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {subItem.name}
            </Link>
          ))}
        </div>
      )}
    </li>
  );

  return (
    <nav className="hidden lg:block">
      <ul className="flex space-x-1 max-lg:space-x-0">
        {(navigation[locale as "az" | "en" | "ru"] as NavigationItems).map(
          (item) => renderNavItem(item)
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
