"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {  ClipboardCheck, ClipboardCopy } from "lucide-react";
import Prism from "prismjs";

const CardTabComponent = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
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
        {copied ? (
          <ClipboardCheck className="w-4 h-4 inline-block mr-1" />
        ) : (
          <ClipboardCopy className="w-4 h-4 inline-block mr-1" />
        )}
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );

  const renderCardWithTabs = () => (
    <Card className="text-center p-6 shadow-md rounded-lg mt-8 border border-gray-100 w-96">
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
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe delectus praesentium voluptatum itaque dignissimos possimus corporis aliquam iste, cum porro amet architecto, facilis impedit. Quaerat dolores sed facilis, suscipit quis."
          )}
          {renderTabsContent(
            "html",
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint nulla, quo porro eum ratione expedita at quia fugit magni impedit. Adipisci cumque blanditiis officiis deserunt, necessitatibus hic earum excepturi laborum."
          )}
        </Tabs>
      </CardContent>
    </Card>
  );

  return (
    <div className="mt-20 mx-20">
      <div className="w-5xl md:w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h1 className="text-3xl mb-2 group inline-block">
            Card with tabs
            <span className="text-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500">
              {" "}
              #
            </span>
          </h1>
          <Tabs defaultValue="preview" className="w-full mt-10">
            <TabsList className="grid w-56 grid-cols-2 bg-gray-100 p-1 rounded-md h-10">
              <TabsTrigger value="preview" className="h-8 text-base">
                Preview
              </TabsTrigger>
              <TabsTrigger value="html" className="h-8 text-base">
                HTML
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preview">{renderCardWithTabs()}</TabsContent>
            <TabsContent value="html">{renderCodeBlock()}</TabsContent>
          </Tabs>
        </div>
        <div>
          <h1 className="text-3xl mb-2 group inline-block">
            Card with tabs
            <span className="text-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500">
              {" "}
              #
            </span>
          </h1>
          <Tabs defaultValue="preview" className="w-full mt-10">
            <TabsList className="grid w-56 grid-cols-2 bg-gray-100 p-1 rounded-md h-10">
              <TabsTrigger value="preview" className="h-8 text-base">
                Preview
              </TabsTrigger>
              <TabsTrigger value="html" className="h-8 text-base">
                HTML
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preview">{renderCardWithTabs()}</TabsContent>
            <TabsContent value="html">{renderCodeBlock()}</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CardTabComponent;