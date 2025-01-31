"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
const services = [
  {
    title: "Resume Match",
    description:
      "Effortlessly Scan Resumes, build a candidate summary, and review whether the candidate is a good match for the job using our Match Algorithm.",
    imgSrc: "/images/RG_Logo.png",
  },
  {
    title: "Interview Generator",
    description:
      "Build customized interview questions for candidates, and have candidates record their responses via video and audio recording, all while using AI.",
    imgSrc: "/images/IG_Logo.png",
  },
  {
    title: "Candidate Scoring",
    description:
      "Score Candidates on their interviews and responses using AI Models, and compare candidates side by side to pick the right person for the position.",
    imgSrc: "/images/Scoring_Logo.png",
  },
];
export default function DocumentationCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative mx-auto px-4 -mt-36">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex col-span-1">
          {/* Search Interface Slide */}
          {services.map((service, index) => (
            <div
              className="relative flex min-w-max md:min-w-[500px] md:flex-[0_0_50%]"
              key={index}
            >
              <div className="relative mx-4 overflow-hidden rounded-sm shadow-lg transition-transform duration-300 hover:-translate-y-4">
                <div className="bg-white shadow-lg rounded-lg text-center p-6">
                  <div className="flex justify-center mb-4">
                    <Image
                      src={service.imgSrc}
                      alt={service.title}
                      width={80}
                      height={80}
                      className="rounded-full bg-blue-500 p-2"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <a
                    href="#"
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    Read More
                  </a>
                </div>{" "}
              </div>
            </div>
          ))}
        </div>{" "}
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
