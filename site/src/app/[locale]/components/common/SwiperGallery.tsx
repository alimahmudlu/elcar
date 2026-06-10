"use client";

import { useRef, useState, useEffect } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SwiperGalleryProps {
  images: {
    src: string;
  }[];
  BASE_URL: string;
}

const SwiperGallery = ({ images, BASE_URL }: SwiperGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!images || images.length === 0 || !isClient) {
    return (
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg group max-md:max-h-[300px]">
      <Swiper
        modules={[Navigation]}
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        onSwiper={(swiperInstance) => (swiperRef.current = swiperInstance)}
        className="w-full"
        navigation={false}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={images.length > 1}
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
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="w-full flex items-center justify-center p-2 sm:p-4">
              <div className="relative w-full max-w-lg mx-auto max-sm:flex max-sm:items-center max-sm:justify-center">
                <Image
                  src={`${BASE_URL}/${image.src}`}
                  alt={`Gallery image ${index + 1}`}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain max-sm:w-max max-h-[250px] max-sm:max-h-[180px]"
                  priority={index === 0}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {images.length > 1 && (
        <>
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
            disabled={currentIndex === images.length - 1}
            onClick={() => {
              if (swiperRef.current && currentIndex < images.length - 1) {
                swiperRef.current.slideNext();
              }
            }}
          >
            <IoChevronForward className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Slide Counter */}
      {images.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 
                bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-0 
                group-hover:opacity-100 transition-opacity duration-300"
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default SwiperGallery;
