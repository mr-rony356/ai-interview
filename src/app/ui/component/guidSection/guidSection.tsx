import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const GuidSection = () => {
  return (
    <div className="mx-auto max-w-[1180px] px-4 -mb-20 relative">
      <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 md:p-12 rounded-lg">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h1 className="text-3xl md:text-4xl">
            Ready to Transform Your{" "}
            <span className="font-bold">Interviews</span>?
          </h1>
          <p className="mt-4 text-gray-200 max-w-xl">
            Experience the power of AI in your interview process. Get smart
            questions, detailed analysis, and expert insights to make better
            hiring decisions.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/interview-question">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Try Interview AI
            </Button>
          </Link>
          <Link href="/job-listings">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-blue-600 hover:bg-white/10"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuidSection;
