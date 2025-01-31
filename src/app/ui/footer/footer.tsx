"use client";

import { ArrowRight, ChevronDown, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <>
      {/* CTA Section */}
      <div className="relative">
        <div className="container mx-auto px-4 relative">
          <div className="bg-[#064cdb] py-16 px-8 rounded-sm relative overflow-hidden -bottom-24 max-w-6xl mx-auto">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10">
              <ShoppingCart className="w-40 h-40 text-white" />
            </div>
            <div className="relative z-10 text-white px-8">
              <h2 className="text-3xl md:text-4xl font-light mb-4">
                Next Level of <strong>Documentation</strong>
              </h2>
              <h2 className="text-xl opacity-90 flex items-center">
                Purchase Guidebook now, and make documenting your project piece
                of cake.{" "}
                <Link
                  href="#"
                  className="group ml-2 text-sm flex items-center space-x-2 hover:text-gray-200 transition-all ease-in-out"
                >
                  <p>Buy Now</p>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:translate-x-2" />
                </Link>
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#151515] text-white py-12">
        <div className="mx-auto mt-40 max-w-6xl">
          <div className="flex  justify-between space-x-10">
            {/* Logo */}
            <div>
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo-white.svg"
                  width={50}
                  height={50}
                  alt="logo"
                />
              </Link>
            </div>

            {/* Content */}
            <div className="">
              <p className="mb-6 text-gray-400 text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod <br />
                tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <ul className="space-y-3 text-lg">
                    <li>
                      <Link
                        href="#"
                        className="text-white hover:underline underline-offset-8 decoration-2 transition-all"
                      >
                        Product Help
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-white hover:underline underline-offset-8 decoration-2 transition-all"
                      >
                        Training Videos
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-white hover:underline underline-offset-8 decoration-2 transition-all"
                      >
                        Integrations
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="#"
                        className="text-white hover:underline underline-offset-8 decoration-2 transition-all"
                      >
                        REST API
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="text-white hover:underline underline-offset-8 decoration-2 transition-all"
                      >
                        Corporate
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="md:col-span-4 lg:col-span-2 md:ml-auto">
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full px-4 py-2 text-left bg-transparent border border-white/20 rounded flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  {language}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                {isOpen && (
                  <div className="absolute w-full mt-1 bg-black border border-white/20 rounded shadow-lg">
                    <button
                      onClick={() => {
                        setLanguage("French");
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors"
                    >
                      French
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("German");
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors"
                    >
                      German
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
