"use client";
import { Roboto } from "next/font/google";
import NavBar from "../header/desktop/NavBar";
import Logo from "../header/Logo";
import ThemeSwitcher from "../header/ThemeSwitcher";
import { useLocale } from "next-intl";
import LanguageSwitcher from "../header/desktop/LanguageSwitcher";
import CartDrawer from "../header/CartDrawer";
import { MobileSidebar } from "../header/mobile/MobileSidebar";
import { useEffect, useState } from "react";

const roboto = Roboto({ subsets: ["latin"] });

const Header = () => {
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`${roboto.className} ${
        scrolled
          ? "bg-white dark:bg-foreground"
          : "bg-transparent dark:bg-transparent"
      } shadow-2xl border-[#0000004d] flex fixed w-full top-0 z-50 justify-between items-center h-[65px] px-4 py-1 max-sm:px-1 transition-colors duration-300`}
    >
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-3 max-md:gap-2 max-sm:gap-1 max-xs:gap-0.5">
          <div className="lg:hidden">
            <MobileSidebar />
          </div>
          <Logo />
        </div>
        <NavBar locale={locale} />
        <div className="flex items-center gap-2 max-xl:gap-1 max-sm:gap-0.5">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeSwitcher />
          <CartDrawer />
        </div>
      </div>
    </header>
  );
};

export default Header;
