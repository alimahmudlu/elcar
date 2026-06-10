import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CustomRipple from "../common/CustomRipple";

const Logo = () => {
  const t = useTranslations("header");
  return (
    <div>
      <Link
        href="/"
        className="flex p-ripple items-center h-full gap-2 text-elcar"
      >
        <Image
          src="/icons/icon.svg"
          alt="Logo"
          width={40}
          height={40}
          className="max-lg:w-[34px] max-lg:h-[34px]"
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-[25px] uppercase block mb-1 font-black tracking-[1.1px] space-x-[1.1px] leading-3 max-lg:text-[20px] dark:text-primary-foreground ">
            ELCAR
          </h1>
          <span className="text-[10px] leading-3 tracking-[0.1px] max-lg:text-[8px] dark:text-primary-foreground">
            {t("title")}
          </span>
        </div>
        <CustomRipple />
      </Link>
    </div>
  );
};

export default Logo;
