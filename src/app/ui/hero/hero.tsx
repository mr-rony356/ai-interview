import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain, Sparkles, MessageSquare, ClipboardCheck } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative">
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 px-4 pb-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 mr-2 text-blue-200" />
            <span className="text-blue-100">AI-Powered Interview Platform</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
            Master Your Interviews with{" "}
            <span className="text-blue-200">AI Intelligence</span>
          </h1>
          <p className="mb-8 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            Get AI-generated interview questions, personalized feedback, and
            expert insights. Our platform helps you conduct better interviews
            and make smarter hiring decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                <Brain className="mr-2 h-5 w-5" />
                Explore Features
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <MessageSquare className="h-8 w-8 mb-4 text-blue-200" />
            <h3 className="text-xl font-semibold mb-2">
              AI Interview Questions
            </h3>
            <p className="text-blue-100">
              Get intelligent, role-specific interview questions generated by
              our AI
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <ClipboardCheck className="h-8 w-8 mb-4 text-blue-200" />
            <h3 className="text-xl font-semibold mb-2">Smart Evaluation</h3>
            <p className="text-blue-100">
              AI-powered analysis of candidate responses and interview
              performance
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <Brain className="h-8 w-8 mb-4 text-blue-200" />
            <h3 className="text-xl font-semibold mb-2">Interview Insights</h3>
            <p className="text-blue-100">
              Get detailed feedback and recommendations for better hiring
              decisions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
