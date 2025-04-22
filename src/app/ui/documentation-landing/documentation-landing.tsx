import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  MessageSquare,
  ClipboardCheck,
  Brain,
  Users,
  FileText,
  Settings,
} from "lucide-react";

const DocumentationLanding = () => {
  const categories = [
    {
      title: "AI Interview Questions",
      href: "/interview-question",
      icon: MessageSquare,
    },
    { title: "Smart Evaluation", href: "#evaluation", icon: ClipboardCheck },
    { title: "Interview Insights", href: "#insights", icon: Brain },
    { title: "Candidate Analysis", href: "/my-candidate", icon: Users },
    { title: "Response Tracking", href: "#tracking", icon: FileText },
    { title: "AI Settings", href: "#settings", icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-[1180px] py-12 mt-12">
      <div className="text-center">
        <h1 className="text-4xl text-gray-900 sm:text-4xl">
          Interview <span className="font-semibold">Features</span>
        </h1>
        <p className="mt-4 text-gray-600 lg:w-1/2 w-full mx-auto">
          Discover our AI-powered interview tools. From smart question
          generation to detailed candidate analysis, we help you conduct better
          interviews and make informed hiring decisions.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 px-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.title}
              href={category.href}
              className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-6 text-center transition-colors hover:border-blue-400 hover:bg-gray-50 group"
            >
              <Icon className="h-8 w-8 mb-4 text-blue-600 group-hover:text-blue-700" />
              <span className="text-lg font-medium text-gray-900">
                {category.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentationLanding;
