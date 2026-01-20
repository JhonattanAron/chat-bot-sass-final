"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Check, Zap } from "lucide-react"

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: "Básico",
      description: "Ideal para pequeños negocios y emprendedores",
      monthlyPrice: 5,
      annualPrice: 5 * 12 * 0.9, // 10% descuento anual
      tokens: 10000000,
      tokensPerConversation: 40000,
      conversationsMonth: 240,
      conversationsDay: 8,
      tokenPrice: 0.0000005,
      features: [
        "1 chatbot activo",
        "Integración web básica",
        "Respuestas automáticas",
        "Personalización básica",
        "Soporte por email",
      ],
      cta: "Comienza con Básico",
      popular: false,
    },
    {
      name: "Estándar",
      description: "Perfecto para negocios en crecimiento",
      monthlyPrice: 9,
      annualPrice: 9 * 12 * 0.9, // 10% descuento anual
      tokens: 23000000,
      tokensPerConversation: 40000,
      conversationsMonth: 570,
      conversationsDay: 19,
      tokenPrice: 0.00000039,
      features: [
        "2 chatbots activos",
        "Integración web completa",
        "Integración WhatsApp Business",
        "Personalización avanzada",
        "Soporte prioritario",
        "Analíticas básicas",
      ],
      cta: "Comienza con Estándar",
      popular: true,
    },
    {
      name: "Avanzado",
      description: "Para negocios establecidos con mayor demanda",
      monthlyPrice: 22,
      annualPrice: 22 * 12 * 0.9, // 10% descuento anual
      tokens: 60000000,
      tokensPerConversation: 40000,
      conversationsMonth: 1500,
      conversationsDay: 50,
      tokenPrice: 0.00000037,
      features: [
        "5 chatbots activos",
        "Integraciones personalizadas",
        "API básica",
        "Personalización completa",
        "Soporte prioritario",
        "Analíticas detalladas",
        "Entrenamiento básico",
      ],
      cta: "Comienza con Avanzado",
      popular: false,
    },
    {
      name: "Pro",
      description: "Para grandes empresas con necesidades específicas",
      monthlyPrice: 45,
      annualPrice: 45 * 12 * 0.9, // 10% descuento anual
      tokens: 140000000,
      tokensPerConversation: 40000,
      conversationsMonth: 3480,
      conversationsDay: 116,
      tokenPrice: 0.00000032,
      features: [
        "Chatbots ilimitados",
        "Integraciones avanzadas",
        "API completa",
        "Personalización total",
        "Soporte 24/7 dedicado",
        "Analíticas avanzadas",
        "Entrenamiento personalizado",
      ],
      cta: "Comienza con Pro",
      popular: false,
    },
  ]

  return (
    <section id="precios" className="py-16 md:py-24 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Planes y precios</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Elige el plan que mejor se adapte a las necesidades de tu negocio
          </p>

          {/* GPT-4 Highlight */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-5 w-5 text-primary mr-2" />
              <span className="font-semibold text-primary">Potenciado por GPT-4</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Nuestros chatbots utilizan los modelos de IA más avanzados de OpenAI (GPT-4), que ofrecen comprensión
              contextual superior, respuestas más naturales y precisas, y capacidades de razonamiento avanzadas para
              brindar la mejor experiencia conversacional a tus clientes.
            </p>
          </div>

          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${isAnnual ? "text-gray-500" : "text-gray-900 dark:text-white font-medium"}`}>
              Mensual
            </span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} className="data-[state=checked]:bg-primary" />
            <span className={`ml-3 ${isAnnual ? "text-gray-900 dark:text-white font-medium" : "text-gray-500"}`}>
              Anual <span className="text-primary font-medium">(10% descuento)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-xl overflow-hidden ${
                plan.popular
                  ? "border-2 border-primary shadow-xl relative"
                  : "border border-gray-200 dark:border-gray-800 shadow-md"
              } bg-white dark:bg-gray-900`}
            >
              {plan.popular && <div className="bg-primary text-white text-center py-1 font-medium">Más popular</div>}

              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${isAnnual ? plan.annualPrice.toFixed(0) : plan.monthlyPrice}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 ml-1">{isAnnual ? "/año" : "/mes"}</span>
                  {isAnnual && <p className="text-sm text-primary mt-1">10% de descuento</p>}
                </div>

                {/* Token Information List */}
                <div className="mb-6 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Tokens totales</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {(plan.tokens / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Conversaciones/mes</span>
                    <span className="font-medium text-gray-900 dark:text-white">{plan.conversationsMonth}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Conversaciones/día</span>
                    <span className="font-medium text-gray-900 dark:text-white">~{plan.conversationsDay}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Tokens/conversación</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {(plan.tokensPerConversation / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Costo por token</span>
                    <span className="font-medium text-gray-900 dark:text-white">${plan.tokenPrice.toFixed(8)}</span>
                  </div>
                </div>

                <Button
                  className={`w-full mb-6 ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : "bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white"
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">¿Necesitas un plan personalizado para tu empresa?</p>
          <Button variant="outline" size="lg" className="border-black dark:border-white">
            Contacta con nuestro equipo
          </Button>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
