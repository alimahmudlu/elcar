import { BlogType } from "@/types";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogItem = ({ blog }: { blog: BlogType }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;

  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/blog/${blog.slug}`}
      className="border shadow-sm bg-white hover:shadow-2xl transition-all duration-300 dark:border-secondary-foreground dark:hover:border-transparent dark:hover:shadow-md dark:hover:shadow-primary-foreground dark:bg-foreground 
      flex flex-col justify-between"
    >
      <Image
        src={BASE_URL + "/" + blog.image.src}
        width={500}
        height={500}
        alt="Şarj cihazları"
        className="w-full max-h-[330px] object-cover"
      />
      <div className="p-4 py-8">
        <h2 className="font-black text-2xl text-title mb-5 leading-8 dark:text-primary-foreground">
          {blog?.title}
        </h2>
        <p className="text-sm text-subtitle dark:text-secondary-foreground">
          {blog?.description}
        </p>
      </div>
    </Link>
  );
};

export default BlogItem;
