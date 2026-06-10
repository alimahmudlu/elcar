"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import LeftSide from "./swiper/LeftSide";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { Swiper as SwiperType } from "swiper/types";
import { ProductType } from "@/types";
import Link from "next/link";
import { useLocale } from "next-intl";

const HeroSlider = ({
  data,
  BASE_URL,
}: {
  data: ProductType[];
  BASE_URL: string;
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [hoveredArrow, setHoveredArrow] = useState<"prev" | "next" | null>(
    null
  );
  const swiperRef = useRef<SwiperType | null>(null);
  const isTransitioning = useRef(false);

  const getSlideIndex = (index: number) => {
    const slidesCount = data.length;
    return ((index % slidesCount) + slidesCount) % slidesCount;
  };

  const getPrevIndex = (current: number) => getSlideIndex(current - 1);
  const getNextIndex = (current: number) => getSlideIndex(current + 1);

  const handlePrev = () => {
    if (isTransitioning.current) return;

    if (swiperRef.current) {
      isTransitioning.current = true;

      if (activeSlide === 0) {
        swiperRef.current.slideTo(data.length - 1);
      } else {
        swiperRef.current.slidePrev();
      }

      setTimeout(() => {
        isTransitioning.current = false;
      }, 500);
    }
  };

  const handleNext = () => {
    if (isTransitioning.current) return;

    if (swiperRef.current) {
      isTransitioning.current = true;

      if (activeSlide === data.length - 1) {
        swiperRef.current.slideTo(0);
      } else {
        swiperRef.current.slideNext();
      }

      setTimeout(() => {
        isTransitioning.current = false;
      }, 500);
    }
  };

  const prevSlideIndex = getPrevIndex(activeSlide);
  const nextSlideIndex = getNextIndex(activeSlide);

  const locale = useLocale();
  return (
    <div className="overflow-hidden hero-slider">
      <div>
        <div className="relative w-full h-full group ">
          <Swiper
            modules={[Navigation]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setActiveSlide(swiper.activeIndex);
            }}
            slidesPerView={1}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            effect="slide"
            loop={false}
            speed={500}
            className="!w-full !relative h-auto !bg-no-repeat !bg-transparent"
          >
            {data?.map((item, index) => (
              <SwiperSlide
                key={index}
                className="hero-bg w-full h-full overflow-hidden max-lg:px-3 pb-16"
              >
                <div className="container max-lg:max-w-[95%] h-full pt-20 max-xs:pt-10">
                  <div className="flex items-center justify-between max-md:flex-col">
                    <LeftSide item={item} />
                    <div className="max-md:order-1 order-2 h-[450px] relative w-2/4 max-xl:w-[470px] max-xl:h-[325px] max-sm:h-[225px] max-sm:mb-8 max-sm:mt-[60px]">
                      <Link href={`/${locale}/charging-stations/${item?.slug}`}>
                        <Image
                          src={`${BASE_URL}/${item.image?.src}`}
                          alt={item.title}
                          width={1200}
                          height={1200}
                          className="object-contain w-full h-full"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {/* Custom Arrows */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
              <button
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#8c8c8c] py-2 px-2 flex-shrink-0 flex items-center gap-2 dark:bg-popover dark:text-primary-foreground"
                onMouseEnter={() => setHoveredArrow("prev")}
                onMouseLeave={() => setHoveredArrow(null)}
                onClick={handlePrev}
              >
                <MdOutlineKeyboardArrowLeft className="text-[24px] text-elcar dark:text-primary-foreground" />
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    hoveredArrow === "prev" ? "max-w-[100px]" : "max-w-0"
                  }`}
                >
                  <div className="w-16 h-16 relative p-1 rounded shadow-lg">
                    <Image
                      src={`${BASE_URL}/${data[prevSlideIndex]?.image?.src}`}
                      alt={data[prevSlideIndex].title}
                      fill
                      className="object-contain"
                      sizes="64px"
                      priority={hoveredArrow === "prev"}
                    />
                  </div>
                </div>
              </button>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
              <button
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#8c8c8c] py-2 px-2 flex-shrink-0 flex items-center gap-2 dark:bg-popover dark:text-primary-foreground"
                onMouseEnter={() => setHoveredArrow("next")}
                onMouseLeave={() => setHoveredArrow(null)}
                onClick={handleNext}
              >
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    hoveredArrow === "next" ? "max-w-[100px]" : "max-w-0"
                  }`}
                >
                  <div className="w-16 h-16 relative p-1 rounded shadow-lg dark:bg-popover dark:text-primary-foreground">
                    <Image
                      src={`${BASE_URL}/${data[nextSlideIndex].image?.src}`}
                      alt={data[nextSlideIndex].title}
                      fill
                      className="object-contain"
                      sizes="64px"
                      priority={hoveredArrow === "next"}
                    />
                  </div>
                </div>
                <MdOutlineKeyboardArrowRight className="text-[24px] text-elcar dark:text-primary-foreground" />
              </button>
            </div>
            {/* ////// */}

            {/* pagination */}
            <CustomPagination
              totalSlides={data?.length || 0}
              activeSlide={activeSlide}
              onSlideClick={(index) => {
                swiperRef.current?.slideTo(index);
              }}
            />
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;

const CustomPagination = ({
  totalSlides,
  activeSlide,
  onSlideClick,
}: {
  totalSlides: number;
  activeSlide: number;
  onSlideClick: (index: number) => void;
}) => {
  return (
    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 container max-md:pl-6 max-sm:bottom-3 max-lg:max-w-[95%]">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <motion.button
          key={index}
          onClick={() => onSlideClick(index)}
          className={`rounded-full cursor-pointer transition-colors duration-500 ${
            activeSlide === index ? "bg-[#9e9e9e]" : "bg-[#9e9e9e]"
          }`}
          initial={{ width: 12, height: 12 }}
          animate={{
            width: activeSlide === index ? 64 : 12,
            height: activeSlide === index ? 4 : 12,
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            stiffness: 200,
            damping: 25,
          }}
          whileHover={{
            scale: activeSlide === index ? 1.05 : 1.2,
            transition: { duration: 0.2 },
          }}
          whileTap={{
            scale: 0.9,
            transition: { duration: 0.1 },
          }}
          style={{
            transformOrigin: "center",
            borderRadius: activeSlide === index ? "2px" : "50%",
          }}
        />
      ))}
    </div>
  );
};
