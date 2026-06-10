"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { BlogType } from "@/types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import dayjs from "dayjs";
import Image from "next/image";
import { useLocale } from "next-intl";
import "dayjs/locale/ru";
import "dayjs/locale/en";
import Link from "next/link";
import CustomRipple from "../common/CustomRipple";

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

const BlogSwiper = ({
  blogListSwiper,
  BASE_URL,
}: {
  blogListSwiper: BlogType[];
  BASE_URL: string;
}) => {
  const locale = useLocale();
  return (
    <div className="relative group w-full h-[400px] md:h-[500px] overflow-hidden mb-6 md:mb-8">
      {/* Custom Navigation Buttons */}
      <button
        className="absolute focused left-4 top-1/2 z-20 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        id="blog-swiper-prev"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={22} />
      </button>
      <button
        className="absolute focused right-4 top-1/2 z-20 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        id="blog-swiper-next"
        aria-label="Next slide"
      >
        <FaChevronRight size={22} />
      </button>
      <Swiper
        navigation={{
          prevEl: "#blog-swiper-prev",
          nextEl: "#blog-swiper-next",
        }}
        modules={[Navigation]}
        className="w-full h-full"
      >
        {blogListSwiper.map((blog) => (
          <SwiperSlide key={blog._id}>
            <Link
              href={`/${locale}/blog/${blog?.slug}`}
              className="relative w-full p-ripple h-[400px] md:h-[500px] max-md:h-[300px] flex items-end"
            >
              <CustomRipple />
              {/* Background Image */}
              <Image
                width={800}
                height={700}
                src={BASE_URL + "/" + blog.image.src}
                alt={blog?.title}
                className="absolute inset-0 w-full h-full object-cover object-center z-0"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
              {/* Content */}
              <div className="relative z-20 p-6 md:p-10 max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-red-600 text-white text-xs px-3 py-1 rounded flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {dayjs(blog?.createdAt)
                      .locale(locale)
                      .format("DD MMMM YYYY")}
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl max-sm:text-xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                  {blog?.title}
                </h2>
                <p className="text-white text-base md:text-lg drop-shadow-md line-clamp-2">
                  {blog?.description || ""}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogSwiper;
