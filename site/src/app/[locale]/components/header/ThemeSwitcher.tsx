"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import React from "react";
import { MdSunny } from "react-icons/md";
import { PiMoonStarsBold } from "react-icons/pi";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full cursor-pointer focused group"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <MdSunny className="duration-300 absolute h-10 w-10 rotate-0 scale-110 dark:-rotate-90 dark:scale-0 text-elcar group-active:scale-90 dark:text-white" />
      <PiMoonStarsBold className="duration-300 absolute h-10 w-10 rotate-90 scale-0 dark:rotate-0 dark:scale-110 text-elcar group-active:dark:scale-90 dark:text-white" />
    </Button>
  );
};

export default ThemeSwitcher;
