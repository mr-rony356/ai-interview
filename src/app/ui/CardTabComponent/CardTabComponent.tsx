"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Users,
  FileText,
  CheckCircle,
  Brain,
  Sparkles,
  MessageSquare,
  ClipboardCheck,
} from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

const CardTabComponent = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      Prism.highlightAll();
    }
  }, []);

  const handleCopy = () => {
    const codeText = document.getElementById("code-block")?.innerText;
    if (codeText) {
      navigator.clipboard.writeText(codeText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  const renderTabsContent = (value: string, content: string) => (
    <TabsContent value={value}>
      <p className="text-gray-600 text-base">{content}</p>
    </TabsContent>
  );

  const renderCodeBlock = () => (
    <div className="relative group mt-8">
      <pre
        id="code-block"
        className="bg-gray-100 text-gray-900 p-4 rounded-lg overflow-x-auto text-sm h-[300px] overflow-y-auto border border-gray-300"
      >
        <code className="language-markup">
          {`
<div class="card-header no-border bg-white pb-0">
  <ul class="nav nav-pills card-header-pills lavalamp" id="tab-1" role="tablist">
    <li class="nav-item">
      <a class="nav-link active" data-toggle="tab" href="#tab-1-1" role="tab" aria-controls="tab-1-1" aria-selected="true">Preview</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-toggle="tab" href="#tab-1-2" role="tab" aria-controls="tab-1-2" aria-selected="false">HTML</a>
    </li>
  </ul>
</div>
<div class="card-body">
  <div class="tab-content" id="tab-1-content">
    <div class="tab-pane fade show active" id="tab-1-1" role="tabpanel" aria-labelledby="tab-1-1">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe delectus praesentium voluptatum itaque dignissimos possimus corporis aliquam iste, cum porro amet architecto, facilis impedit. Quaerat dolores sed facilis, suscipit quis.</p>
    </div>
    <div class="tab-pane fade" id="tab-1-2" role="tabpanel" aria-labelledby="tab-1-2">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint nulla, quo porro eum ratione expedita at quia fugit magni impedit. Adipisci cumque blanditiis officiis deserunt, necessitatibus hic earum excepturi laborum.</p>
    </div>
  </div>
</div>
          `}
        </code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-1/2 md:right-4 translate-x-8 p-2 px-4 bg-blue-700 text-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out hover:bg-blue-600"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );

  const renderCardWithTabs = () => (
    <Card className="text-center p-6 shadow-md rounded-lg mt-6 border border-gray-100 w-96">
      <CardContent className="flex flex-col items-center">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-56 grid-cols-2 bg-gray-100 p-1 rounded-md mb-4 h-10">
            <TabsTrigger value="preview" className="h-8 text-base">
              Preview
            </TabsTrigger>
            <TabsTrigger value="html" className="h-8 text-base">
              HTML
            </TabsTrigger>
          </TabsList>
          {renderTabsContent(
            "preview",
            "Our AI-powered platform helps you create and manage job listings with intelligent suggestions and automated optimization."
          )}
          {renderTabsContent(
            "html",
            "Leveraging cutting-edge AI technology to provide a seamless experience for both employers and candidates."
          )}
        </Tabs>
      </CardContent>
    </Card>
  );

  return (
    <div className="mt-12 mx-auto max-w-[1180px] flex justify-center items-center px-4">
      <div className="w-5xl md:w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl mb-4 group inline-block">
            AI-Powered Job Management
            <span className="text-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500">
              {" "}
              #
            </span>
          </h1>
          <div className="mt-6 space-y-6">
            <div className="flex items-start space-x-4">
              <Brain className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">Smart Job Matching</h3>
                <p className="text-gray-600">
                  AI algorithms analyze job requirements and candidate profiles
                  to find the perfect match.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Users className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">Candidate Analysis</h3>
                <p className="text-gray-600">
                  AI-powered tools help you evaluate candidates based on skills,
                  experience, and cultural fit.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FileText className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">Automated Screening</h3>
                <p className="text-gray-600">
                  AI automatically screens applications and ranks candidates
                  based on job requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-3xl mb-4 group inline-block">
            Intelligent Interview Process
            <span className="text-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500">
              {" "}
              #
            </span>
          </h1>
          <div className="mt-6 space-y-6">
            <div className="flex items-start space-x-4">
              <Sparkles className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">
                  AI Interview Assistant
                </h3>
                <p className="text-gray-600">
                  Get AI-generated interview questions tailored to each
                  candidate's profile and experience.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Users className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">Smart Scheduling</h3>
                <p className="text-gray-600">
                  AI-powered calendar management that finds the best time slots
                  for all participants.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FileText className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">Feedback Analysis</h3>
                <p className="text-gray-600">
                  AI analyzes interview feedback to provide insights and
                  recommendations for hiring decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTabComponent;
