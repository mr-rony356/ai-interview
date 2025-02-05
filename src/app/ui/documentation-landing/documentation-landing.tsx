import { ArrowRight } from "lucide-react";
import Link from "next/link";

const DocumentationLanding = () => {
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
    <div className="mx-auto max-w-[1180px] py-12 mt-20">
      <div className="text-center">
        <h1 className="text-4xl text-gray-900 sm:text-4xl">
          What&apos;s <span className="font-semibold">in the box</span>?
        </h1>
        <p className="mt-4 text-gray-600 lg:w-1/2 w-full mx-auto">
          Everything you might need to build a super intuitive & readable
          documentation. Missing something?
          <span className="inline-flex items-center ml-1 relative group">
            request{" "}
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-2 transition transform duration-300" />
          </span>
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 px-2">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="flex items-center justify-center rounded-sm border border-gray-200 px-4 py-8 text-center transition-colors hover:border-blue-400 hover:bg-gray-50"
          >
            <span className="text-lg font-medium text-gray-900">
              {category.title}
            </span>
          </Link>
        ))}
        <Link
          href="#view-all"
          className="flex items-center justify-center rounded-md border border-gray-200 p-4 text-center text-blue-600 transition-colors hover:border-blue-400 hover:bg-gray-50 group"
        >
          <span className="inline-flex items-center text-lg font-medium">
            View all
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-2 transition transform duration-300" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default DocumentationLanding;
