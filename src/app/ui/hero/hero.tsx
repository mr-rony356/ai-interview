import DocumentationCarousel from "../component/documentation-carousel";

export default function Hero() {
  return (
    <div className="relative">
      <div className="flex min-h-[50vh] md:min-h-[70vh] flex-col items-center justify-center bg-[#0047CC] px-4 pb-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 text-xl font-[300] sm:text-4xl max-w-xl ">
            Powerful <span className="font-bold">Documentation</span> and Help
            Center Bootstrap Template.
          </h1>
          <button className="rounded-sm bg-[#28A745] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#27AE60] focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:ring-offset-2 focus:ring-offset-[#0047CC] sm:px-8 sm:py-3 sm:text-sm">
            Purchase Now
          </button>
        </div>
      </div>
      <DocumentationCarousel />
    </div>
  );
}
