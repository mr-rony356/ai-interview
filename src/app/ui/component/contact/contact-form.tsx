"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import emailjs from "@emailjs/browser";
import { useState } from "react";
import Toast from "../../Toast/Toast";

interface ToastType {
  message: string;
  type: "success" | "error";
}

const ContactForm = () => {
  const [toast, setToast] = useState<ToastType | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      email: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      surname: Yup.string().required("Surname is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const serviceID = "service_pmlwpr1";
      const templateID = "template_h2mr61w";

      emailjs
      .send(
        serviceID,
        templateID,
        {
          to_email: "nurzihad123@gmail.com",
          from_name: values.name + " " + values.surname,
          from_email: values.email,
          message: values.message,
        },
        "JTlGKoLBLTifizSId"
      )
    
        .then(
          (response) => {
            console.log("Message sent successfully!", response);
            setToast({
              message: "Message sent successfully!",
              type: "success",
            });
            resetForm();
          },
          (error) => {
            console.error("Error sending message:", error);
            setToast({
              message: "Failed to send message. Please try again.",
              type: "error",
            });
          }
        );
    },
  });

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 py-16 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-12 text-4xl font-bold md:text-5xl">
          Get in touch. <span className="font-normal">It's free.</span>
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium uppercase text-gray-600">
                Name
              </label>
              <Input
                type="text"
                id="name"
                placeholder="Name"
                className="text-lg py-6 shadow-sm border border-gray-300 focus:border-transparent focus:ring-0 focus:outline-none"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium uppercase text-gray-600">
                Surname
              </label>
              <Input
                type="text"
                id="surname"
                placeholder="Surname"
                className="text-lg py-6 shadow-sm border border-gray-300 focus:border-transparent focus:ring-0 focus:outline-none"
                {...formik.getFieldProps("surname")}
              />
              {formik.touched.surname && formik.errors.surname && (
                <p className="text-red-500 text-sm">{formik.errors.surname}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium uppercase text-gray-600">
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                className="text-lg py-6 shadow-sm border border-gray-300 focus:border-transparent focus:ring-0 focus:outline-none"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium uppercase text-gray-600">
              Message
            </label>
            <Textarea
              id="message"
              rows={8}
              placeholder="Type your message here ..."
              className="text-lg py-3 h-32 md:h-64"
              {...formik.getFieldProps("message")}
            />
            {formik.touched.message && formik.errors.message && (
              <p className="text-red-500 text-sm">{formik.errors.message}</p>
            )}
          </div>

          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 py-6">
            Send Message
          </Button>
        </form>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
};

export default ContactForm;
