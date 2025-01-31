"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TiArrowSortedDown } from "react-icons/ti";

export const NavDropdown = ({
  label,
  items,
  isOpen,
  setOpenDropdown,
  onClick,
}: {
  label: string;
  items: { href: string; label: string }[];
  isOpen: boolean;
  setOpenDropdown: (dropdown: string | null) => void;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = items.some((item) => pathname === item.href);
  return (
    <li className="relative dropdown text-xs uppercase ">
      {/* Dropdown Toggle Button */}
      <button
        className="text-white hover:text-white/90 focus:outline-none flex items-center transition-colors group"
        onClick={() => setOpenDropdown(isOpen ? null : label)}
      >
        <h6 className="flex space-x-1 items-center text-xs uppercase text-[#90aeee]">
          <p>{label}</p>
          <TiArrowSortedDown className="h-3 w-3" />
        </h6>
        <span
          className={`absolute inset-x-0 -top-5 h-[1px] bg-white transition-transform hidden lg:block ${
            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="absolute left-0 mt-2 w-36 bg-white rounded-sm shadow-lg z-10"
          >
            {items.map((item) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: 0.1,
                }}
              >
                <Link
                  href={item.href}
                  className="block px-2 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors capitalize"
                  onClick={() => {
                    setOpenDropdown(null); // Close dropdown
                    onClick?.();
                  }}
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};
