"use client";

import { useState } from "react";
import Header from "@/components/header";
import HeroSection from "@/components/pages/Home/hero-section";
import FeaturesSection from "@/components/features-section";
import PricingSection from "@/components/pages/Home/pricing-section";
import TestimonialsSection from "@/components/pages/Home/testimonials-section";
import UseCasesSection from "@/components/use-cases-section";
import FaqSection from "@/components/faq-section";
import Footer from "@/components/pages/Home/footer";
import { ChatWidget } from "@/components/chat-widget";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/env";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

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
