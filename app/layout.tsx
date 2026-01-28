import type React from "react";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import "./globals.css";
import { icons } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aurentric AI Labs - Create and manage your chatbots",
  description: "A platform to create and manage chatbots for web and WhatsApp",
  icons: {
    icon: "/logos/favicon.ico",
    apple: "/logos/favicon.png",
  },
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
      </body>
    </html>
  );
}
