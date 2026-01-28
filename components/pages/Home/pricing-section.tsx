"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Lock, Zap, MessageCircle, Mail, Search } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    description: "Para probar la plataforma y lanzar tu primera campaña",
    popular: false,

    monthlyPrice: 0,
    annualPrice: 0,

    tokens: 50_000,
    conversationsMonth: 200,
    conversationsDay: 7,
    tokensPerConversation: 250,
    tokenPrice: 0,

    features: [
      "Chatbots IA habilitados",
      "WhatsApp QR (contactos propios)",
      "1 campaña activa",
      "Mensajes generados por IA",
    ],

    limitations: [
      "Scraping bloqueado",
      "Sin adquisición automática de leads",
      "No recarga de créditos",
    ],

    cta: "Empezar gratis",
  },

  {
    name: "Básico",
    description: "Para pequeños negocios que escalan campañas",
    popular: false,

    monthlyPrice: 65,
    annualPrice: 702, // 10% descuento

    tokens: 10_000_000,
    conversationsMonth: 8_000,
    conversationsDay: 260,
    tokensPerConversation: 1250,
    tokenPrice: 0.0000065,

    features: [
      "Chatbots IA",
      "WhatsApp QR + Bulk",
      "Email campaigns",
      "Scraping (pago por uso)",
    ],

    cta: "Elegir Básico",
  },

  {
    name: "Estándar",
    description: "El plan ideal para growth y automatización",
    popular: true,

    monthlyPrice: 100,
    annualPrice: 1080,

    tokens: 23_000_000,
    conversationsMonth: 18_000,
    conversationsDay: 600,
    tokensPerConversation: 1300,
    tokenPrice: 0.0000043,

    features: [
      "Automatizaciones avanzadas",
      "WhatsApp + Email con IA",
      "Scraping Google Maps",
      "Enriquecimiento de leads",
    ],

    cta: "Elegir Estándar",
  },

  {
    name: "Pro",
    description: "Para agencias y operaciones a gran escala",
    popular: false,

    monthlyPrice: 595,
    annualPrice: 6426,

    tokens: 140_000_000,
    conversationsMonth: 120_000,
    conversationsDay: 4_000,
    tokensPerConversation: 1200,
    tokenPrice: 0.0000029,

    features: [
      "Todos los módulos desbloqueados",
      "Scraping masivo",
      "APIs + Integraciones",
      "Soporte dedicado",
    ],

    cta: "Contactar ventas",
  },
];

const services = [
  {
    name: "WhatsApp Campaigns",
    icon: MessageCircle,
    description:
      "Envíos masivos con QR, mensajes generados por IA y automatización.",
    free: "Disponible (manual)",
    paid: "Automatización + IA",
  },
  {
    name: "Email Campaigns",
    icon: Mail,
    description: "Scraping, normalización y envío de emails a gran escala.",
    free: "Bloqueado",
    paid: "Pago por uso",
  },
  {
    name: "Scraping de Leads",
    icon: Search,
    description: "Obtén leads desde Google Maps y sitios web automáticamente.",
    free: "Bloqueado",
    paid: "Pago por uso",
  },
];
export function AnnualDiscountBadge({ isAnnual }: { isAnnual: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
        bg-gradient-to-r from-primary/15 to-primary/5
        text-primary border border-primary/20
        shadow-sm`}
    >
      <Zap className="h-4 w-4" />
      <span>
        {isAnnual ? (
          <>
            💸 <strong>10% de ahorro</strong> aplicado por facturación anual
          </>
        ) : (
          <>
            Activa facturación anual y <strong>ahorra 10%</strong>
          </>
        )}
      </span>
    </motion.div>
  );
}

export default function CampaignsPricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        {/* HEADER */}

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">🚀 Campañas con IA</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Automatiza WhatsApp, Email y adquisición de leads con inteligencia
            artificial.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 mb-12">
          <span
            className={`text-sm ${
              !isAnnual
                ? "font-semibold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Facturación mensual
          </span>

          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition
      ${isAnnual ? "bg-primary" : "bg-muted"}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition
        ${isAnnual ? "translate-x-5" : "translate-x-1"}`}
            />
          </button>

          <span
            className={`text-sm ${
              isAnnual
                ? "font-semibold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Facturación anual
            <Badge className="ml-2" variant="secondary">
              -10%
            </Badge>
          </span>
          <AnnualDiscountBadge isAnnual={isAnnual} />
        </div>

        {/* PLANS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl overflow-hidden border transition-all
    ${
      plan.popular
        ? "border-primary shadow-[0_0_0_1px_rgba(var(--primary),0.3),0_20px_40px_-20px_rgba(0,0,0,0.4)]"
        : "border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg"
    }
    bg-white dark:bg-gray-900`}
            >
              {/* Popular ribbon */}
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 bg-primary text-white text-center text-sm font-semibold py-1">
                  ⭐ Más popular
                </div>
              )}

              <div className="p-6 md:p-8 flex flex-col h-full">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {isAnnual
                        ? `$${(plan.annualPrice / 12).toFixed(0)}`
                        : `$${plan.monthlyPrice}`}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      /mes
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mb-8 space-y-3 text-sm">
                  {[
                    plan.name == "Free"
                      ? ["Tokens totales", `50K`]
                      : [
                          "Tokens totales",
                          `${(plan.tokens / 1_000_000).toFixed(1)}M`,
                        ],
                    ["Conversaciones / mes", plan.conversationsMonth],
                    ["Conversaciones / día", `~${plan.conversationsDay}`],
                    [
                      "Tokens / conversación",
                      `${(plan.tokensPerConversation / 1000).toFixed(0)}K`,
                    ],
                    ["Costo por token", `$${plan.tokenPrice.toFixed(8)}`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        {label}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  size="lg"
                  className={`w-full mb-8 ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : "bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white"
                  }`}
                >
                  {plan.cta}
                </Button>

                {/* Features */}
                <div className="space-y-3 mt-auto">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="text-3xl font-bold text-center mb-10">
            🧠 Servicios Pay-per-Use
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl border 
    bg-gradient-to-br from-background/80 to-muted/40 
    backdrop-blur-xl p-6
    hover:shadow-2xl hover:shadow-primary/10
    transition-all"
              >
                {/* Glow overlay */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                </div>

                {/* Icon */}
                <div
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl 
    bg-primary/10 text-primary
    group-hover:scale-110 transition"
                >
                  <s.icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  {s.name}
                </h4>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  {s.description}
                </p>

                {/* Availability */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <span className="flex items-center gap-2">
                      🆓 <span className="font-medium">Free</span>
                    </span>
                    <span className="text-muted-foreground">{s.free}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <span className="flex items-center gap-2">
                      💼 <span className="font-medium">Planes pagos</span>
                    </span>
                    <span className="text-muted-foreground">{s.paid}</span>
                  </div>
                </div>

                {/* Coming soon / lock hint */}
                {s.free === "Bloqueado" && (
                  <div className="absolute top-4 right-4 rounded-full bg-destructive/10 px-3 py-1 text-xs text-destructive flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Bloqueado
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
