"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HamburgerButton } from "./hamburger-button";
import { NavDropdown } from "./nav-dropdown";
import { NavItem } from "./nav-item";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".dropdown")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="bg-[#0439a4] text-white max-w[1120px]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image src="/logo-white.svg" width={40} height={40} alt="logo" />
            </Link>

            {/* Desktop Navigation */}
            <div
              className={`lg:flex ${
                isOpen ? "block" : "hidden"
              } absolute lg:relative top-full left-0 right-0 bg-gray-800 lg:bg-transparent`}
            >
              <ul className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 p-4 lg:p-0 text-xs uppercase text-[#90aeee]">
                <NavItem href="/" label="Home" />
                <NavDropdown
                  label="Products"
                  items={[
                    {
                      href: "/interview-question",
                      label: "Interview Question",
                    },
                    { href: "/job-match", label: "Job Match Summary" },
                    { href: "/interview-lists", label: "Interview Lists" },
                    { href: "/candidate-lists", label: "Candidate Lists" },
                  ]}
                  isOpen={openDropdown === "Products"}
                  setOpenDropdown={setOpenDropdown}
                />{" "}
                <NavItem href="/about" label="About Us" />
                <NavItem href="/contact" label="Contact Us" />
              </ul>
            </div>
          </div>

          {/* Right Navigation Items */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8 text-xs uppercase">
            <ul className="flex flex-row items-center space-x-4 p-4 lg:p-0">
              <NavItem href="/login" label="Login" />
              <NavDropdown
                label="Profile"
                items={[{ href: "/my-candidate", label: "My Candidate" }]}
                isOpen={openDropdown === "Profile"}
                setOpenDropdown={setOpenDropdown}
              />
            </ul>
          </div>
        </div>

        <div className="lg:hidden xl:hidden flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo-white.svg" width={40} height={40} alt="logo" />
          </Link>
          {/* Hamburger Menu Button */}
          <HamburgerButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          {/* Navigation Menu */}
          <AnimatePresence>
            {/* Mobile Navigation */}
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-x-0 top-16 bottom-0 bg-[#0439a4] lg:hidden z-50"
              >
                <div className="h-full overflow-y-auto px-4 py-6">
                  <ul className="flex flex-col space-y-4">
                    <NavItem
                      href="/"
                      label="Home"
                      onClick={() => setIsOpen(false)}
                    />
                    <NavDropdown
                      label="Profile"
                      items={[{ href: "/my-candidate", label: "My Candidate" }]}
                      isOpen={openDropdown === "Profile"}
                      setOpenDropdown={setOpenDropdown}
                    />
                    <NavDropdown
                      label="Products"
                      items={[
                        {
                          href: "/interview-question",
                          label: "Interview Question",
                        },
                        { href: "/job-match", label: "Job Match Summary" },
                        { href: "/interview-lists", label: "Interview Lists" },
                        { href: "/candidate-lists", label: "Candidate Lists" },
                      ]}
                      isOpen={openDropdown === "Products"}
                      setOpenDropdown={setOpenDropdown}
                      onClick={() => setIsOpen(false)}
                    />
                    <div className="lg:hidden pt-4 border-t border-white/10">
                      <NavItem
                        href="/contact"
                        label="Contact Us"
                        onClick={() => setIsOpen(false)}
                      />
                      <NavItem
                        href="/about"
                        label="About Us"
                        onClick={() => setIsOpen(false)}
                      />
                    </div>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
