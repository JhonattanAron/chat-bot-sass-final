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

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const CLIENT_KEY =
    "317ff11abaf125986f8129f001efea226a5d0c9216ac24e48091e617bbf39ab7";
  const ASSISTANT_ID = "69398394a5bac4c2b8659ca8";
  const USER_ID = "6938644c9e7ff7ff4f5a1c81";

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
        clientKey={CLIENT_KEY}
        validationApiUrl="http://localhost:8081/api-key-validate/validate-client-key" // Points to the new validation API route
        chatApiUrl="/api/chat/message" // Points to your existing chat message API route
        chatStartApiUrl="/api/chat/start" // Points to your existing chat start API route
        assistantId={ASSISTANT_ID}
        userId={USER_ID}
        chatTitle="My Custom Chatbot"
        chatSubtitle="Powered by AIDEN AI"
        initialBotMessage="Hola Bienvenido a nuestro software, la forma mas facil de implementar GPT-4 en tu negocio preguntame en que puedo ayudarte?"
        inputPlaceholder="Ask me anything..."
        theme="default" // or "custom"
        // If theme is "custom", you can uncomment and set these:
        // userTextColor="text-blue-100"
        // aiTextColor="text-gray-900"
        // primaryColor="bg-blue-700"
        // botMessageBgColor="bg-blue-100"
        // userMessageBgColor="bg-blue-700"
        // floatingButtonColor="bg-blue-600"
        widgetPosition="bottom-right"
        showLogo={true}
      />
    </main>
  );
}
