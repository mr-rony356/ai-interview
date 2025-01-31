import type { Metadata } from "next";
import { Open_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./ui/component/navbar/navbar";

export const metadata: Metadata = {
  title: "Guidebook-Online Documentation",
  description: "Generated by create next app",
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
      <body>
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        {children}
      </body>
    </html>
  );
}
