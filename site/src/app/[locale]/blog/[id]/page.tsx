import { BASE_URL, ENDPOINTS } from "@/api/endpoints";
import { fetchData } from "@/api/request";
import { formatDate } from "@/lib/utils";
import { BlogType } from "@/types";
import { Breadcrumbs, Card, CardContent } from "@mui/material";
import { getLocale, getTranslations } from "next-intl/server";
import { Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineRight } from "react-icons/ai";
import { FaFacebook, FaPinterest, FaTwitter, FaWhatsapp } from "react-icons/fa";
import dayjs from "dayjs";
const roboto = Roboto({ subsets: ["latin"] });

type Params = Promise<{ id: string }>;

if (!dayjs.Ls.az) {
  dayjs.locale("az", {
    name: "az",
    weekdays:
      "Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split(
        "_"
      ),
    months:
      "yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split(
        "_"
      ),
    weekStart: 1,
    weekdaysShort: "Baz_B.e_Ç.a_Çər_C.a_Cüm_Şən".split("_"),
    monthsShort: "yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),
    weekdaysMin: "Bz_B.e_Ç.a_Çə_C.a_Cü_Şə".split("_"),
    ordinal: (n) => n,
    formats: {
      LT: "HH:mm",
      LTS: "HH:mm:ss",
      L: "DD.MM.YYYY",
      LL: "D MMMM YYYY",
      LLL: "D MMMM YYYY HH:mm",
      LLLL: "dddd, D MMMM YYYY HH:mm",
    },
  });
}

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  const t = await getTranslations();

  const locale = await getLocale();

  const blog = await fetchData(ENDPOINTS.blog.detail.replace(":id", id));
  const similarBlogs = await fetchData(
    ENDPOINTS.blog.list +
      `?filter=` +
      encodeURIComponent(
        JSON.stringify({
          [`slug.${locale}`]: { $ne: blog.slug },
          $select: "title slug image -_id",
          limit: 4,
          noPagination: 1,
        })
      )
  );

  return (
    <section className={`${roboto.className} mt-12`}>
      <div className="container px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 max-lg:max-w-[95%] max-lg:flex max-lg:flex-col max-lg:gap-4">
        <article className="lg:col-span-7 pr-2 max-lg:w-full">
          <Breadcrumbs
            separator={
              <AiOutlineRight className="w-3 h-3 dark:text-primary-foreground" />
            }
            aria-label="breadcrumb"
          >
            <Link
              className="focused dark:text-primary-foreground"
              color="inherit"
              href="/"
            >
              Elcar
            </Link>
            <Link
              className="dark:text-primary-foreground"
              color="inherit"
              href="/blog"
            >
              {t("pages.blog")}
            </Link>
            <Link
              className="dark:text-primary-foreground"
              color="inherit"
              href="/blog"
            >
              {blog?.title}
            </Link>
          </Breadcrumbs>

          <h1 className="text-3xl font-bold mb-2 mt-6 dark:text-primary-foreground">{blog?.title}</h1>
          <p className="text-gray-700 mb-6 dark:text-secondary-foreground">{blog?.description}</p>
          <div className="flex justify-between items-center mb-6 border-t pt-3">
            <p className="text-sm text-gray-500">
              {formatDate(blog?.createdAt, locale)}
            </p>
            <div className="flex items-center gap-3">
              <FaFacebook className="cursor-pointer text-[#1877F2] p-0.5 rounded-full focused text-[24px]" />
              <FaTwitter className="cursor-pointer text-[#1DA1F2] p-0.5 rounded-full focused text-[24px]" />
              <FaPinterest className="cursor-pointer text-[#E4405F] p-0.5 rounded-full focused text-[24px]" />
              <FaWhatsapp className="cursor-pointer text-[#25D366] p-0.5 rounded-full focused text-[24px]" />
            </div>
          </div>

          <Image
            src={BASE_URL + "/" + blog?.image?.src}
            alt={blog?.title}
            width={900}
            height={500}
            className="rounded-xl shadow-md mb-6"
          />

          <div
            dangerouslySetInnerHTML={{ __html: blog?.content }}
            className="[&_p]:text-gray-700 [&_h2]:text-3xl [&_h2]:font-black [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-black [&_h3]:mb-4 [&_h4]:text-lg [&_h4]:font-black [&_h4]:mb-4 [&_h5]:text-sm [&_h5]:font-semibold [&_h5]:mb-4 [&_h6]:text-xs [&_h6]:font-semibold [&_h6]:mb-4 [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_li]:mb-2 dark:[&_h2]:text-primary-foreground dark:[&_h3]:text-primary-foreground dark:[&_h4]:text-primary-foreground dark:[&_h5]:text-primary-foreground dark:[&_h6]:text-primary-foreground dark:[&_p]:text-secondary-foreground"
          />
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-5 border-l-2 border-gray-200 pl-4 max-lg:w-full max-lg:border-0 max-lg:pl-0 max-lg:mt-6">
          <div className="sticky top-20 max-w-[80%] max-lg:max-w-full mx-auto">
            <h3 className="text-lg font-semibold mb-4  dark:!text-primary-foreground  ">{t("blog.similar-posts")}</h3>
            {similarBlogs && similarBlogs.length > 0
              ? similarBlogs.map((blog: BlogType) => (
                  <Card
                    key={blog?._id}
                    className="max-lg:border max-lg:border-gray-200 max-lg:!shadow-none dark:!bg-card-foreground"
                  >
                    <CardContent className="p-4 max-lg:flex max-lg:items-center max-lg:gap-4 max-lg:justify-between">
                      <Link href={`/${locale}/blog/${blog?.slug}`}>
                        <div>
                          <p className="text-sm bg-gray-300 dark:bg-gray-600 dark:text-secondary w-max rounded-lg px-2 py-1">
                            {dayjs(blog?.createdAt)
                              .locale(locale)
                              .format("DD MMMM YYYY")}
                          </p>
                          <p className="text-md font-medium text-black max-md:text-sm  dark:!text-primary-foreground  ">
                            {blog?.title}
                          </p>
                        </div>
                        <div className="lg:hidden max-lg:items-center max-lg:flex max-lg:justify-center">
                          <Image
                            src={BASE_URL + "/" + blog?.image?.src}
                            alt={blog?.title}
                            width={200}
                            height={200}
                            className="rounded-md shadow-md"
                          />
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              : ""}
          </div>
        </aside>
      </div>
    </section>
  );
}
