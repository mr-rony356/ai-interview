import ContactFooter from "../ui/component/contact/contact-footer";
import ContactForm from "../ui/component/contact/contact-form";
import Offices from "../ui/component/contact/offices";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <ContactForm />
      <hr />
      <Offices />
      <ContactFooter />
    </main>
  );
}
