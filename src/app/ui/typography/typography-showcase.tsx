import { Check } from "lucide-react";
import ColorSwatch from "../component/color-swatch";
import FileTree from "../component/file-tree";
import TabsDemo from "../component/tabs-demo";

export default function TypographyShowcase() {
  return (
    <section className="mx-auto px-8 pt-16 bg-[#f8f8f8]">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-normal mb-4">
          <span className="text-gray-900">Highlight</span>{" "}
          <span>what's important.</span>
        </h2>
        <p className="text-gray-600 text-lg">
          We offer high ammount of different components to showcase your content
          in the best way possible.
        </p>
      </div>

      <div className="container mx-auto p-4 space-y-8">
        {/* Top Section */}
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-evenly">
          {/* Features */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-full">
                <Check className="w-8 h-8 text-white flex-shrink-0" />
              </div>
              <span className="text-lg text-gray-700">Advanced Layout</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-full">
                <Check className="w-8 h-8 text-white flex-shrink-0" />
              </div>
              <span className="text-lg text-gray-700">Exclusive Design</span>
            </div>
          </div>

          {/* Font Preview */}
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative border border-white bg-white rounded-sm shadow-md p-8">
              <div className="absolute top-4 right-4">
                <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded">
                  NEW
                </span>
              </div>
              <div className="mb-4 text-sm text-gray-600">Open Sans</div>
              <div className="text-[72px] leading-none">Ab</div>
            </div>
            <div className="border border-white bg-white rounded-sm shadow-md p-8">
              <div className="mb-4 text-sm text-gray-600">Open Sans Bold</div>
              <div className="text-[72px] leading-none font-bold">Ab</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="w-full hidden lg:block">
            <FileTree />
          </div>
          <div className="w-full">
            <TabsDemo />
            <div className="mt-3 flex justify-center lg:justify-start">
              <div className="w-full md:w-1/2">
                <ColorSwatch />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
