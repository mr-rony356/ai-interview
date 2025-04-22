import DocumentationLanding from "./ui/documentation-landing/documentation-landing";
import Footer from "./ui/footer/footer";
import Hero from "./ui/hero/hero";
import CardTabComponent from "./ui/CardTabComponent/CardTabComponent";
import GuidSection from "./ui/component/guidSection/guidSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1180px] mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Job Listings</h3>
              <p className="text-gray-600 mb-4">
                Browse and manage job listings with ease. Create, edit, and
                track applications all in one place.
              </p>
              <Link href="/job-listings">
                <Button variant="outline">View Jobs</Button>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">
                Candidate Management
              </h3>
              <p className="text-gray-600 mb-4">
                Efficiently manage candidates, track their progress, and
                streamline your hiring process.
              </p>
              <Link href="/my-candidate">
                <Button variant="outline">Manage Candidates</Button>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">
                Interview Questions
              </h3>
              <p className="text-gray-600 mb-4">
                Access a comprehensive database of interview questions to help
                you make the right hiring decisions.
              </p>
              <Link href="/interview-question">
                <Button variant="outline">View Questions</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <CardTabComponent />
      <DocumentationLanding />
      <GuidSection />
      <Footer />
    </main>
  );
}
