"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

interface Characteristic {
  name: string;
  value: string | number | null;
}

interface GroupImage {
  src: string;
}

interface GroupPhoto {
  multiple?: boolean;
}

interface CharacteristicGroup {
  title: string;
  description?: string;
  characteristics: Characteristic[];
  image: GroupImage[];
  photo?: GroupPhoto;
}

interface DetailSectionProps {
  characteristicGroups: CharacteristicGroup[];
  BASE_URL: string;
}

const DetailSection: React.FC<DetailSectionProps> = ({
  characteristicGroups,
  BASE_URL,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="w-full overflow-hidden">
      {characteristicGroups.map((group, index) => {
        return (
          <div
            key={index}
            className="bg-gray-100 dark:bg-card p-4 max-sm:p-3 sm:p-6 mt-10 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start md:items-center w-full max-w-full"
          >
            {/* Description Part */}
            <div className="w-full min-w-0">
              <h2 className="text-2xl sm:text-3xl max-sm:text-xl text-title dark:text-primary-foreground font-black mb-4 sm:mb-6 break-words">
                {group.title}
              </h2>
              <div
                className="text-subtitle dark:text-secondary-foreground text-sm mb-4 break-words"
                dangerouslySetInnerHTML={{ __html: group.description || "" }}
              />
              <div className="text-sm font-semibold text-title dark:text-primary-foreground">
                {group.characteristics.map((char, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b py-1 gap-2"
                  >
                    <span className="truncate flex-shrink-0 max-w-[60%]">
                      {char.name ?? "-- --"}:
                    </span>
                    <span className="text-right break-words min-w-0">
                      {char.value ?? "-- --"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Slider Part */}
            <div className="relative group w-full min-w-0 overflow-hidden">
              <div className="w-full max-w-full overflow-hidden rounded-lg">
                <Swiper
                  modules={[Navigation]}
                  onSlideChange={(swiper) =>
                    setCurrentIndex(swiper.activeIndex)
                  }
                  onSwiper={(swiperInstance) =>
                    (swiperRef.current = swiperInstance)
                  }
                  className="mySwiper w-full"
                  width={undefined}
                  breakpoints={{
                    320: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    640: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    768: {
                      slidesPerView: 1,
                      spaceBetween: 15,
                    },
                    1024: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                  }}
                >
                  {group.image.length > 0 ? (
                    group.image.map((img, idx) => (
                      <SwiperSlide key={idx} className="w-full">
                        <div className="w-full flex items-center justify-center p-2 sm:p-4">
                          <div className="relative w-full max-w-lg mx-auto">
                            <Image
                              src={`${BASE_URL}/${img.src}`}
                              alt={group.title}
                              width={800}
                              height={600}
                              className="w-full h-auto object-contain rounded-md max-h-80 sm:max-h-96"
                              style={{
                                maxWidth: "100%",
                                height: "auto",
                              }}
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <Image
                      src={`${BASE_URL}/${group.image[0].src}`}
                      alt={group.title}
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain rounded-md max-h-80 sm:max-h-96"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                      }}
                    />
                  )}
                </Swiper>
              </div>

              <button
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 
                bg-white/90 hover:bg-white shadow-lg p-2 sm:p-3 transition-all duration-300 ease-in-out
                opacity-0 -translate-x-4 pointer-events-none
                group-hover:opacity-100 group-hover:translate-x-0 rounded-full group-hover:pointer-events-auto 
                text-gray-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                disabled={currentIndex === 0}
                onClick={() => {
                  if (swiperRef.current && currentIndex > 0) {
                    swiperRef.current.slidePrev();
                  }
                }}
              >
                <IoChevronBack className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 
                bg-white/90 hover:bg-white shadow-lg p-2 sm:p-3 transition-all duration-300 ease-in-out
                opacity-0 translate-x-4 pointer-events-none
                group-hover:opacity-100 group-hover:translate-x-0 rounded-full group-hover:pointer-events-auto 
                text-gray-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                disabled={currentIndex === group.image.length * 2 - 1}
                onClick={() => {
                  if (
                    swiperRef.current &&
                    currentIndex < group.image.length * 2 - 1
                  ) {
                    swiperRef.current.slideNext();
                  }
                }}
              >
                <IoChevronForward className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Slide Counter */}
              <div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 
                bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-0 
                group-hover:opacity-100 transition-opacity duration-300"
              >
                {currentIndex + 1} / {group.image.length * 2}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DetailSection;
