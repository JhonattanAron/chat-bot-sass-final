"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  UtensilsCrossed,
  ShoppingBag,
  HeadphonesIcon,
  Building,
  CalendarClock,
  Briefcase,
  Shield,
  AlertTriangle,
} from "lucide-react";

const useCases = [
  {
    id: "restaurantes",
    title: "Restaurantes",
    icon: <UtensilsCrossed className="h-5 w-5" />,
    description:
      "Automatiza pedidos y reservas, responde preguntas sobre el menú y horarios, y mejora la experiencia de tus clientes.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Toma de pedidos automática",
      "Gestión de reservas",
      "Información sobre el menú",
      "Promociones personalizadas",
      "Seguimiento de pedidos",
    ],
    chatExample: [
      {
        role: "bot",
        message:
          "¡Hola! Bienvenido a Restaurante El Sabor. ¿En qué puedo ayudarte hoy?",
      },
      { role: "user", message: "¿Tienen mesas disponibles para esta noche?" },
      {
        role: "bot",
        message:
          "Sí, tenemos disponibilidad para esta noche. ¿Para cuántas personas y a qué hora le gustaría reservar?",
      },
      { role: "user", message: "Para 4 personas a las 8:30 PM" },
      {
        role: "bot",
        message:
          "¡Perfecto! He reservado una mesa para 4 personas hoy a las 8:30 PM. ¿Le gustaría ver nuestro menú mientras tanto?",
      },
    ],
  },
  {
    id: "tiendas",
    title: "Tiendas Online",
    icon: <ShoppingBag className="h-5 w-5" />,
    description:
      "Ofrece soporte y recomendaciones de productos, gestiona devoluciones y mantén a tus clientes informados sobre sus pedidos.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Recomendaciones de productos",
      "Estado de pedidos",
      "Gestión de devoluciones",
      "Respuestas a preguntas frecuentes",
      "Notificaciones de stock",
    ],
    chatExample: [
      {
        role: "bot",
        message: "¡Hola! Bienvenido a ModaExpress. ¿En qué puedo ayudarte hoy?",
      },
      { role: "user", message: "Estoy buscando una chaqueta de cuero" },
      {
        role: "bot",
        message:
          "Tenemos varias chaquetas de cuero disponibles. ¿Prefieres un estilo clásico o moderno? También puedo filtrar por color y talla.",
      },
      { role: "user", message: "Moderno, en negro, talla M" },
      {
        role: "bot",
        message:
          "He encontrado 3 chaquetas que coinciden con tu búsqueda. Te muestro la más popular: Chaqueta Biker Negra, talla M - $89.99. ¿Te gustaría ver más detalles o añadirla al carrito?",
      },
    ],
  },
  {
    id: "soporte",
    title: "Soporte al Cliente",
    icon: <HeadphonesIcon className="h-5 w-5" />,
    description:
      "Responde preguntas frecuentes de tus clientes de manera instantánea y escala a agentes humanos cuando sea necesario.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Respuestas automáticas 24/7",
      "Escalado a agentes humanos",
      "Base de conocimientos integrada",
      "Seguimiento de tickets",
      "Encuestas de satisfacción",
    ],
    chatExample: [
      {
        role: "bot",
        message:
          "¡Hola! Soy el asistente virtual de TechSupport. ¿Cómo puedo ayudarte hoy?",
      },
      { role: "user", message: "Mi dispositivo no enciende" },
      {
        role: "bot",
        message:
          "Lamento escuchar eso. Vamos a solucionar este problema. Primero, ¿has intentado mantener presionado el botón de encendido durante 10 segundos y luego soltarlo?",
      },
      { role: "user", message: "Sí, ya lo intenté y no funciona" },
      {
        role: "bot",
        message:
          "Entiendo. En ese caso, vamos a intentar conectarlo a otra fuente de alimentación. Si eso no funciona, puedo conectarte con un técnico especializado. ¿Te gustaría intentar primero la solución o prefieres hablar con un técnico?",
      },
    ],
  },
  {
    id: "inmobiliarias",
    title: "Inmobiliarias",
    icon: <Building className="h-5 w-5" />,
    description:
      "Gestiona consultas sobre propiedades, programa visitas y califica leads automáticamente.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Búsqueda de propiedades",
      "Programación de visitas",
      "Calificación de leads",
      "Información detallada",
      "Seguimiento automático",
    ],
    chatExample: [
      {
        role: "bot",
        message:
          "¡Hola! Soy el asistente virtual de InmoCasa. ¿En qué puedo ayudarte hoy?",
      },
      {
        role: "user",
        message: "Busco un apartamento de 2 habitaciones en el centro",
      },
      {
        role: "bot",
        message:
          "Tenemos 5 apartamentos de 2 habitaciones disponibles en el centro. ¿Tienes alguna preferencia en cuanto a precio o metros cuadrados?",
      },
      { role: "user", message: "Máximo 1200€ al mes" },
      {
        role: "bot",
        message:
          "Perfecto. He encontrado 3 apartamentos que se ajustan a tu presupuesto. El más destacado es un apartamento de 75m² por 1150€/mes. ¿Te gustaría ver más detalles o programar una visita?",
      },
    ],
  },
  {
    id: "citas",
    title: "Gestión de Citas",
    icon: <CalendarClock className="h-5 w-5" />,
    description:
      "Automatiza la programación de citas para consultorios médicos, salones de belleza y otros servicios.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Programación automática",
      "Recordatorios de citas",
      "Reprogramación sencilla",
      "Integración con calendario",
      "Confirmaciones automáticas",
    ],
    chatExample: [
      {
        role: "bot",
        message:
          "¡Hola! Soy el asistente virtual de Clínica Bienestar. ¿En qué puedo ayudarte hoy?",
      },
      {
        role: "user",
        message: "Necesito programar una cita con el Dr. García",
      },
      {
        role: "bot",
        message:
          "Claro, puedo ayudarte con eso. El Dr. García tiene disponibilidad el próximo martes a las 10:00 AM y el jueves a las 3:30 PM. ¿Alguna de estas opciones te funciona?",
      },
      { role: "user", message: "El martes a las 10 está bien" },
      {
        role: "bot",
        message:
          "¡Perfecto! He programado tu cita con el Dr. García para el próximo martes a las 10:00 AM. Te enviaré un recordatorio 24 horas antes. ¿Necesitas algo más?",
      },
    ],
  },
];

const UseCasesSection = () => {
  const [activeTab, setActiveTab] = useState("restaurantes");

  return (
    <section id="casos-de-uso" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Casos de uso de nuestros chatbots
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre cómo nuestros chatbots pueden adaptarse a diferentes
            industrias y necesidades
          </p>
        </div>

        <Tabs
          defaultValue="restaurantes"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
            {useCases.map((useCase) => (
              <TabsTrigger
                key={useCase.id}
                value={useCase.id}
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow"
              >
                <span className="flex items-center">
                  <span className="mr-2">{useCase.icon}</span>
                  <span className="hidden md:inline">{useCase.title}</span>
                  <span className="md:hidden">
                    {useCase.title.split(" ")[0]}
                  </span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {useCases.map((useCase) => (
            <TabsContent key={useCase.id} value={useCase.id} className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    Chatbot para {useCase.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{useCase.description}</p>

                  <ul className="space-y-2 mb-6">
                    {useCase.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Ver demostración
                  </Button>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-4 bg-primary text-white font-medium">
                    Ejemplo de conversación
                  </div>
                  <div className="p-4 max-h-96 overflow-y-auto">
                    {useCase.chatExample.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
                      >
                        <div
                          className={`inline-block p-3 rounded-lg max-w-[80%] ${
                            message.role === "user"
                              ? "bg-primary/10 text-gray-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {message.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
        {/* Ecosistema de Bots IA */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-primary/20 p-8 md:p-12 bg-gradient-to-br from-primary/5 to-primary/10"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ecosistema de Bots con Inteligencia Artificial
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Una plataforma unificada donde chatbots y bots telefónicos
                trabajan juntos para automatizar ventas, soporte y operaciones
                empresariales.
              </p>
            </div>

            {/* Tipos de bots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Chatbots para Web y WhatsApp
                </h4>
                <p className="text-gray-600 mb-4">
                  Bots conversacionales diseñados para atender clientes en
                  tiempo real, resolver dudas, calificar leads y cerrar ventas
                  automáticamente desde canales digitales.
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Atención instantánea 24/7</li>
                  <li>• Calificación automática de clientes</li>
                  <li>• Ventas, reservas y agendamiento</li>
                  <li>• Integración con CRM y sistemas internos</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Bots Telefónicos con IA
                </h4>
                <p className="text-gray-600 mb-4">
                  Bots de voz capaces de gestionar llamadas entrantes y
                  salientes con conversaciones naturales, fluidas y orientadas a
                  resultados.
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Atención de llamadas entrantes</li>
                  <li>• Llamadas salientes automatizadas</li>
                  <li>• Voz natural y conversaciones humanas</li>
                  <li>• Transferencia a agentes cuando es necesario</li>
                </ul>
              </div>
            </div>

            {/* Capacidades compartidas */}
            <div className="mb-14">
              <h4 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Capacidades compartidas en todos los bots
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
                {[
                  "Comprensión avanzada del lenguaje natural",
                  "Conversaciones humanas en tiempo real",
                  "Calificación de leads y filtrado de clientes",
                  "Automatización de ventas y citas",
                  "Soporte al cliente y FAQs",
                  "Integración con CRM y sistemas internos",
                  "Memoria contextual de conversaciones",
                  "Soporte multilingüe",
                  "Disponibilidad 24/7",
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-white rounded-lg p-4 border border-primary/10 shadow-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Capacidades específicas de voz */}
            <div className="bg-white rounded-xl p-6 border border-primary/20 mb-12">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Capacidades avanzadas de los bots telefónicos
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="space-y-2">
                  <li>• Comprensión de lenguaje hablado natural</li>
                  <li>• Manejo de interrupciones en llamadas</li>
                  <li>• Flujo conversacional dinámico</li>
                </ul>
                <ul className="space-y-2">
                  <li>• Registro automático de llamadas</li>
                  <li>• Resumen y resultados de cada conversación</li>
                  <li>• Escalado a agentes humanos en tiempo real</li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Diseñado para empresas que quieren escalar atención, ventas y
                operaciones sin aumentar costos operativos.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Solicitar demostración
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
