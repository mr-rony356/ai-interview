"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavItem = ({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li className="relative ">
      <Link
        onClick={onClick}
        href={href}
        className=" hover:text-white/90 transition-colors grou text-[#90aeee]"
      >
        {label}
        <span
          className={`absolute inset-x-0 -top-5 h-[1px] bg-white transition-transform hidden lg:block ${
            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </Link>
    </li>
  );
};
