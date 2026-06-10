"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "../Logo";
import Link from "next/link";
import { navigations } from "@/config/navigation";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { NavigationItem, NavigationItems } from "@/types";
import { useState } from "react";
import { LiaBarsSolid } from "react-icons/lia";
import CustomRipple from "../../common/CustomRipple";

export function MobileSidebar() {
  const locale = useLocale();
  const navigation = navigations();
  const currentPath = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, subItems?: NavigationItem["subItems"]) => {
    const pathWithoutLocale = currentPath.replace(`/${locale}`, "") || "/";

    if (href === pathWithoutLocale) return true;

    if (subItems) {
      return subItems.some((sub) => sub.href === pathWithoutLocale);
    }

    return false;
  };

  const renderNavItem = (item: NavigationItem) => (
    <li key={item.href} className="relative group !text-[16px]">
      <Link
        href={`/${locale}${item.href}`}
        className={`text-elcar px-4 py-1 hover:text-primary-600 transition-colors duration-200 flex items-center focused text-[14px] font-bold h-[38px] min-w-[64px] relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:transition-opacity before:duration-200 mr-1 p-ripple dark:text-primary-foreground ${
          isActive(item.href, item.subItems)
            ? "rounded-[4px] before:bg-elcar before:rounded-[4px] before:z-[-1] before:opacity-[0.18]"
            : "before:opacity-0"
        } ${
          item.subItems && "justify-between"
        } hover:before:bg-transparent duration-300`}
        onClick={() => {
          setOpen(false);
          if (item.subItems) setOpen(!open);
        }}
      >
        <span>{item.name}</span>
        <CustomRipple />

        {item.subItems && (
          <svg
            className={`w-4 h-4 ml-1 duration-200 ${
              open ? "-rotate-180" : ""
            } `}
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
      {item.subItems && open && (
        <ul className="flex flex-col">
          {item.subItems.map((subItem) => (
            <li key={subItem.href}>
              <Link
                href={`/${locale}${subItem.href}`}
                className={`text-elcar px-4 py-1 hover:text-primary-600 transition-colors duration-200 flex items-center focused text-[12px] font-bold h-[38px] min-w-[64px] relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-full before:h-full before:transition-opacity before:duration-200 mr-1 p-ripple dark:text-primary-foreground ${
                  isActive(subItem.href)
                    ? "rounded-[4px]  before:rounded-[4px] before:z-[-1]"
                    : "before:opacity-0"
                } hover:before:bg-transparent duration-300`}
                onClick={() => setOpen(false)}
              >
                <span>{subItem.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="md:p-2 p-0.5 rounded-full p-ripple active:bg-elcar-opacity duration-150 bg-transparent ">
          <LiaBarsSolid className="text-[26px] stroke-[1px] dark:text-primary-foreground" />
          <CustomRipple />
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="w-1/3 max-md:w-2/3 px-2">
        <SheetHeader className="border-b pb-3 dark:text-primary-foreground">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <ul className="flex flex-col">
          {(navigation[locale as "az" | "en" | "ru"] as NavigationItems).map(
            (item) => renderNavItem(item)
          )}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
