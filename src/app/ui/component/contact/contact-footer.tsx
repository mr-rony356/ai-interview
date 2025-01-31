"use client";

import { ArrowUp, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ContactFooter() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <>
      {/* CTA Section */}
      <div className="relative flex justify-center">
        <div className="absolute -top-6 bg-blue-600 w-16 h-16 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-800">
          <ArrowUp className="w-6 h-6 text-white" />
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
