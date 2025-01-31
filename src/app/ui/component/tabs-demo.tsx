"use client";

import { useRef, useState } from "react";

export default function TabsDemo() {
  const [activeTab, setActiveTab] = useState("html");
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const htmlCode = `<div class="image image-overlay"></div>`;
  const cssCode = `body {
  > section,
  > footer {
    position: relative;
    margin: 0 auto;
    padding: 6.25rem 0;
    overflow: hidden;
  }
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="mt-3">
      <div className="rounded-sm border shadow-md bg-white">
        {/* Tab Header */}
        <div className="border-b bg-white px-4 pb-0">
          <div className="flex gap-4" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === "html"}
              onClick={() => setActiveTab("html")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "html"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              HTML
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "css"}
              onClick={() => setActiveTab("css")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "css"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              CSS
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {/* HTML Code Block */}
          <div
            role="tabpanel"
            className={`relative ${activeTab === "html" ? "block" : "hidden"}`}
          >
            <div className="relative group">
              <pre className="rounded bg-gray-50 p-4">
                <code className="text-sm text-gray-800">{htmlCode}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(htmlCode)}
                className={`absolute top-2 right-2 p-2 bg-blue-600 rounded-md shadow-sm transition-opacity duration-200 group-hover:opacity-100 ${
                  isCopied ? "opacity-100" : "opacity-0"
                }`}
                aria-label="Copy code"
              >
                {isCopied ? (
                  <span className="text-[#ffff]">COPIED!</span>
                ) : (
                  <span className="text-[#ffff]">COPY</span>
                )}
              </button>
            </div>
          </div>

          {/* CSS Code Block */}
          <div
            role="tabpanel"
            className={`relative ${activeTab === "css" ? "block" : "hidden"}`}
          >
            <div className="relative group">
              <pre className="rounded bg-gray-50 p-4">
                <code className="text-sm text-gray-800">{cssCode}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(cssCode)}
                className={`absolute top-2 right-2 p-2 bg-blue-600 rounded-md shadow-sm transition-opacity duration-200 group-hover:opacity-100 ${
                  isCopied ? "opacity-100" : "opacity-0"
                }`}
                aria-label="Copy code"
              >
                {isCopied ? (
                  <span className="text-[#ffff]">COPIED!</span>
                ) : (
                  <span className="text-[#ffff]">COPY</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
