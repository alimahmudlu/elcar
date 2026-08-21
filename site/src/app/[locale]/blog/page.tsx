import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Roboto } from "next/font/google";
import BlogItem from "../components/blog/BlogItem";
import { ENDPOINTS } from "@/api/endpoints";
import { getTranslations } from "next-intl/server";
import { fetchData } from "@/api/request";
import { BlogType } from "@/types";
import BlogSwiper from "../components/blog/BlogSwiper";

const roboto = Roboto({ subsets: ["latin"] });
const BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.blog" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/blog",
    withLanguages: true,
  });
}

const Page = async () => {
  const t = await getTranslations();
  const { data: blogList } = await fetchData(
    ENDPOINTS.blog.list + "?top=false&$limit=12"
  );
  const blogListSwiper = await fetchData(
    ENDPOINTS.blog.list + "?top=true&$limit=5&noPagination=1"
  );

  return (
    <section
      className={`${roboto.className} container max-lg:max-w-[95%] mt-16`}
    >
      <div className="px-4 md:px-12 lg:px-20 py-10 max-w-[1400px] mx-auto">
        <div className="mb-10">
          <Breadcrumb items={[{ label: "Elcar", href: "/" }, { label: t("pages.blog") }]} />

          <h1 className="text-3xl md:text-5xl text-title font-extrabold mt-4 leading-tight  dark:text-primary-foreground">
            {t("blog.title")}
          </h1>
          <p className="mt-4 text-subtitle text-sm md:text-base dark:text-secondary-foreground">
            {t("blog.subtitle")}
          </p>
        </div>

        {blogListSwiper && blogListSwiper?.length > 0 ? (
          <BlogSwiper
            BASE_URL={BASE_URL ?? ""}
            blogListSwiper={blogListSwiper}
          />
        ) : (
          ""
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogList?.map((blog: BlogType) => (
            <BlogItem key={blog._id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Page;
