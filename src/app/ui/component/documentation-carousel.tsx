"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";

export default function DocumentationCarousel() {
  const images = [
    "/layout-1.png",
    "/layout-2.png",
    "/layout-3.png",
    "/layout-4.png",
    "/layout-5.png",
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative mx-auto px-4 py-12">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex sm:col-span-1">
          {/* Search Interface Slide */}
          {images.map((src, index) => (
            <div className="relative min-w-0 flex-[0_0_50%]" key={index}>
              <div className="relative mx-4 overflow-hidden rounded-sm shadow-lg transition-transform duration-300 hover:-translate-y-4">
                <Link href="#" className="shadow-lg">
                  <Image
                    src={src || "/layout-1.png"}
                    alt="layout-1"
                    width={1000}
                    height={1000}
                    className="object-cover h-[300px]"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
