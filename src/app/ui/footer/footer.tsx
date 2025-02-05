"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Footer() {
  const [language, setLanguage] = useState("english"); 

  return (
    <>
      {/* Footer---------------------- */}
      <footer className="bg-[#151515] text-white py-28">
        <div className="mx-auto max-w-[1180px] mt-32">
          <div className="flex flex-col md:flex-row gap-8 px-4 justify-between">
            {/* Logo-------------- */}
            <div>
              <Link href="/" className="flex items-center">
                <Image src="/logo-white.svg" width={50} height={50} alt="logo" />
              </Link>
            </div>

            {/* Content---------------- */}
            <div>
              <p className="mb-6 text-gray-400 text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod <br />
                tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="grid grid-cols-2 gap-8 mt-10">
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

            {/* Language Selector------------ */}
            <div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue>{language.charAt(0).toUpperCase() + language.slice(1)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Language</SelectLabel>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
