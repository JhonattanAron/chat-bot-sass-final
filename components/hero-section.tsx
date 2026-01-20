"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageSquare, Clock, Code, Zap } from "lucide-react";

const HeroSection = ({ openChat }: { openChat: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Column - Text Content */}
          <motion.div
            className="md:w-1/2 mb-10 md:mb-0 md:pr-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              Crea tu propio chatbot para WhatsApp y tu página web en minutos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Diseña, configura y administra tu bot de forma sencilla para
              responder automáticamente a preguntas frecuentes, realizar pedidos
              y más.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Button
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 font-medium text-lg"
              >
                Prueba gratis por 14 días
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-medium text-lg border-black dark:border-white"
                onClick={openChat}
              >
                Ver demo
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="mr-2 text-primary">
                  <Code size={20} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Sin necesidad de programación
                </span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 text-primary">
                  <MessageSquare size={20} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Soporte para WhatsApp Business
                </span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 text-primary">
                  <Zap size={20} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Integración fácil en tu web
                </span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 text-primary">
                  <Clock size={20} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Atención 24/7 automatizada
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Image/Animation */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative rounded-2xl overflow-hidden dark-gradient-bg p-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/assets_task_01jv5cv5ckf0z8s4n9than2nh9_1747159252_img_3-x4i6M3veqT6AmB21EyBCl602pWBVeM.webp"
                alt="AI Assistants"
                width={600}
                height={400}
                className="w-full h-auto rounded-xl"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                <div className="flex items-start">
                  <div className="bg-primary/20 p-2 rounded-full mr-3">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      ChatBot SaaS
                    </p>
                    <p className="text-sm text-gray-200">
                      ¡Hola! ¿En qué puedo ayudarte hoy? Puedo responder
                      preguntas, tomar pedidos o agendar citas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
