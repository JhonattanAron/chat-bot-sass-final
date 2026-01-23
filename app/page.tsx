"use client";

import { useState } from "react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import PricingSection from "@/components/pricing-section";
import TestimonialsSection from "@/components/testimonials-section";
import UseCasesSection from "@/components/use-cases-section";
import FaqSection from "@/components/faq-section";
import Footer from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/env";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const CLIENT_KEY =
    "e09c06905fa919493af795282f314dfba932755a4c2a77221f6b597534089b47";
  const ASSISTANT_ID = "6972c87148822e85b447ca2f";
  const USER_ID = "6972bbd448822e85b447ca11";

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <main className="min-h-screen">
      <Toaster />
      <Header />
      <HeroSection openChat={toggleChat} />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <UseCasesSection />
      <FaqSection />
      <Footer />
      <ChatWidget
        clientKey={
          env.NEXT_PUBLIC_CHAT_WIDGET_CLIENT_KEY ||
          "wck_8acc50240c99d993c9b42ad9cd2c9b5f"
        }
        apiBaseUrl="/api/backend"
        chatTitle="Aurentric Asisstant"
        chatSubtitle="Power By Aurentric AI Labs"
        initialBotMessage="Hola! Soy el asistente de demo. En que puedo ayudarte?"
        widgetPosition="bottom-right"
        onStatusChange={(status) => {
          console.log("[Demo] Widget status changed:", status);
        }}
        onError={(error) => {
          console.error("[Demo] Widget error:", error);
        }}
      />
    </main>
  );
}
