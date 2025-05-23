import type { Metadata } from "next";
import { Open_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./ui/component/navbar/navbar";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export const metadata: Metadata = {
  title: "First Day AI | AI-Powered Recruitment Platform",
  description: "AI-Powered Recruitment Platform for Job Listings, Interview Preparation, and Candidate Matching",
};

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-open-sans",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-roboto-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`$${openSans.variable} ${robotoMono.variable}`}>
      <UserProvider>
        <body>
          <div className="sticky top-0 z-50">
            <Navbar />
          </div>
          {children}
        </body>
      </UserProvider>
    </html>
  );
}
