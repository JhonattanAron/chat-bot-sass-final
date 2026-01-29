import type React from "react";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import "./globals.css";
import { icons } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://aurentric.com"),

  title: {
    default: "Aurentric AI Labs | AI Chatbots for WhatsApp, Web & Automation",
    template: "%s | Aurentric AI Labs",
  },

  description:
    "Aurentric AI Labs is an AI-powered platform to create, deploy, and manage intelligent chatbots for WhatsApp, websites, and business automation. Boost sales, support, and engagement with advanced conversational AI.",

  keywords: [
    "AI chatbots",
    "WhatsApp chatbot",
    "AI automation",
    "customer support AI",
    "sales chatbot",
    "AI for business",
    "chatbot platform",
    "conversational AI",
    "Aurentric AI Labs",
    "GPT chatbots",
  ],

  authors: [{ name: "Aurentric AI Labs", url: "https://aurentric.com" }],
  creator: "Aurentric AI Labs",
  publisher: "Aurentric AI Labs",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://aurentric.com",
  },

  icons: {
    icon: "/logos/favicon.ico",
    apple: "/logos/favicon.png",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aurentric.com",
    siteName: "Aurentric AI Labs",
    title: "Aurentric AI Labs | AI Chatbots for WhatsApp & Web",
    description:
      "Create and manage AI-powered chatbots for WhatsApp, web, and business automation. Scale customer support and sales with Aurentric AI Labs.",
    images: [
      {
        url: "/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aurentric AI Labs - AI Chatbot Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Aurentric AI Labs | AI Chatbots for Business",
    description:
      "Build AI-powered chatbots for WhatsApp, web, and automation. Improve customer engagement and sales with Aurentric AI Labs.",
    images: ["/og/og-image.png"],
    creator: "@aurentric", // cambia si tienes otro handle
  },

  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <div id="payphone-root"></div>
      </body>
    </html>
  );
}
