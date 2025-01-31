import { Download, FileText, Home, MessageCircle } from "lucide-react";
import ContactFooter from "../ui/component/contact/contact-footer";

export default function About() {
  const features = [
    {
      icon: <Home className="h-6 w-6" />,
      title: "Overview",
      description:
        "Lorem ipsum sit consectetur adipiscing elit. Nequeporro mi quam vulputate.",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Files",
      description:
        "Lorem ipsum sit consectetur adipiscing elit. Nequeporro mi quam vulputate.",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Meeting chats",
      description:
        "Lorem ipsum sit consectetur adipiscing elit. Nequeporro mi quam vulputate.",
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Save events",
      description:
        "Lorem ipsum sit consectetur adipiscing elit. Nequeporro mi quam vulputate.",
    },
  ];

  return (
    <section>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900">
              Read About Our App
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600">
              Continuing network virtual strategic theme areas via vis
              ubiquitous potentialities. Proactively negotiate focused e-tailers
              without premium solutions.
            </p>
          </div>

          <div className="my-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-sm bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-block rounded-md bg-blue-50 p-4 text-primary hover:bg-primary hover:text-blue-500">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-lg font-medium text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContactFooter />
    </section>
  );
}
