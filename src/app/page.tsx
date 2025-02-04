import DocumentationLanding from "./ui/documentation-landing/documentation-landing";
import Footer from "./ui/footer/footer";
import Hero from "./ui/hero/hero";
import CardTabComponent from "./ui/CardTabComponent/CardTabComponent";

export default function Home() {
  return (
    <main>
      <Hero />
      <CardTabComponent />
      <DocumentationLanding />
      <Footer />
    </main>
  );
}
