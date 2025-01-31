import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DocumentationLanding() {
  const categories = [
    { title: "Accordions", href: "#accordions" },
    { title: "Alerts", href: "#alerts" },
    { title: "Widgets", href: "#widgets" },
    { title: "Typography", href: "#typography" },
    { title: "Video", href: "#video" },
    { title: "Cards", href: "#cards" },
    { title: "Carousels", href: "#carousels" },
    { title: "Code", href: "#code" },
    { title: "Forms", href: "#forms" },
    { title: "Lists", href: "#lists" },
    { title: "Steps", href: "#steps" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8 bg-[#ffffff]">
      <div className="text-center">
        <h1 className="text-4xl font-normal tracking-tight text-gray-900 sm:text-5xl">
          What&apos;s in the box?
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Everything you might need to build a super intuitive & <br />
          readable documentation.{" "}
          <span className="text-gray-800">Missing something ?</span>{" "}
          <Link
            href="#request"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            Request
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6 max-w-6xl mx-auto">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="flex items-center justify-center rounded-sm border border-gray-200 px-4 py-8 text-center transition-colors hover:border-blue-400 hover:bg-gray-50 "
          >
            <span className="text-lg font-medium text-gray-900">
              {category.title}
            </span>
          </Link>
        ))}
        <Link
          href="#view-all"
          className="flex items-center justify-center rounded-lg border border-gray-200 p-4 text-center text-blue-600 transition-colors hover:border-blue-400 hover:bg-gray-50"
        >
          <span className="inline-flex items-center text-sm font-medium">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
