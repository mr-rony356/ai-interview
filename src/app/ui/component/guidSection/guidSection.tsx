import { ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";

const GuidSection = () => {
  return (
    <div className="mx-auto max-w-[1180px] px-4 -mb-24 relative">
      <div className="flex justify-between items-center bg-[#064cdb] text-white p-8 md:p-16 rounded-md">
        <div>
          <h1 className="text-4xl">
            Next Level of <span className="font-bold">Documentation</span>
          </h1>
          <p className="mt-4 text-gray-400">
            Purchase Guidebook now, and make documenting your project piece of
            cake.
            <Link
              href="#"
              className="inline-flex items-center ml-1 relative group text-white"
            >
              Buy Now{" "}
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-2 transition transform duration-300" />
            </Link>
          </p>
        </div>
        <div className="absolute right-14 bottom-14 transform scale-[2.5] opacity-30">
          <ShoppingCart size={32} className="h-16 w-16" />
        </div>
      </div>
    </div>
  );
};

export default GuidSection;
