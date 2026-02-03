"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  Zap,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  Facebook,
  Clock,
  Phone,
  Star,
} from "lucide-react";
import { useState } from "react";

/* =====================
   NUEVO: BUNDLES BOT + PLAN
===================== */
const botBundles = [
  {
    name: "Bot Telefónico + Básico",
    tag: "Recomendado para clínicas pequeñas",
    price: 250 + 65,
    popular: true,
    description:
      "Ideal para clínicas, consultorios e inmobiliarias que empiezan a agendar citas por llamadas.",
    features: [
      "Bot telefónico IA 24/7",
      "Agenda y reprograma citas automáticamente",
      "Plan Básico incluido",
      "WhatsApp + Email campaigns",
      "Soporte estándar",
    ],
  },
  {
    name: "Bot Telefónico + Estándar",
    tag: "Más vendido",
    price: 250 + 100,
    popular: false,
    description:
      "Para negocios en crecimiento que reciben alto volumen de llamadas y leads.",
    features: [
      "Bot telefónico IA avanzado",
      "Agenda + confirmaciones automáticas",
      "Plan Estándar incluido",
      "Scraping Google Maps",
      "Automatizaciones con IA",
    ],
  },
  {
    name: "Bot Telefónico + Pro",
    tag: "Escala empresarial",
    price: 250 + 595,
    popular: false,
    description:
      "Pensado para clínicas grandes, call centers e inmobiliarias con alto tráfico.",
    features: [
      "Bot telefónico con flujos personalizados",
      "Plan Pro incluido",
      "Scraping masivo",
      "APIs e integraciones",
      "Soporte dedicado",
    ],
  },
];

export default function PhoneBots() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            📞 Call Center Inteligente con IA
          </h2>
          <p className="text-xl font-semibold text-primary mt-2">
            Atiende llamadas, agenda citas y califica clientes automáticamente
            24/7 sin contratar personal adicional
          </p>
        </div>

        {/* INFO */}
        <div className="flex justify-center mb-14">
          <Badge variant="secondary" className="text-sm px-4 py-2 rounded-full">
            🔗 Servicio adicional · Requiere un plan base activo
          </Badge>
        </div>

        {/* BUNDLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {botBundles.map((bundle, i) => (
            <motion.div
              key={bundle.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-3xl border overflow-hidden
              ${
                bundle.popular
                  ? "border-primary shadow-[0_0_0_1px_rgba(var(--primary),0.4),0_30px_60px_-20px_rgba(0,0,0,0.5)]"
                  : "border-border"
              }
              bg-card`}
            >
              {bundle.popular && (
                <div className="absolute top-0 inset-x-0 bg-primary text-white text-center text-sm font-semibold py-1">
                  ⭐ Más recomendado
                </div>
              )}

              <Card className="border-0 shadow-none">
                <CardContent className="p-8 flex flex-col h-full">
                  {/* TITLE */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-11 w-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                        <Phone className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-bold">{bundle.name}</h3>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {bundle.description}
                    </p>

                    <div className="mt-3 inline-flex items-center gap-2 text-xs text-primary">
                      <Star className="h-3 w-3" /> {bundle.tag}
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="mb-8">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold">
                        ${bundle.price}
                      </span>
                      <span className="text-sm text-muted-foreground mb-1">
                        /mes
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Incluye bot telefónico IA ($280) + plan base
                    </p>
                  </div>

                  {/* FEATURES */}
                  <div className="space-y-3 mb-10">
                    {bundle.features.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    size="lg"
                    className={`mt-auto w-full ${
                      bundle.popular
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                    }`}
                  >
                    Activar call center con IA
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* ENTERPRISE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-primary/50 overflow-hidden
          bg-gradient-to-br from-primary/10 to-background
          shadow-[0_0_0_1px_rgba(var(--primary),0.4),0_30px_60px_-20px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute top-0 inset-x-0 bg-primary text-white text-center text-sm font-semibold py-1">
              🏢 Enterprise · Consumo por uso
            </div>

            <Card className="border-0 shadow-none">
              <CardContent className="p-8 flex flex-col h-full">
                {/* TITLE */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-11 w-11 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                      <Phone className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      Bot Telefónico Enterprise
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Solución avanzada para empresas con alto volumen de
                    llamadas.
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 text-xs text-primary">
                    <Star className="h-3 w-3" /> A medida · Alta concurrencia
                  </div>
                </div>

                {/* PRICE */}
                <div className="mb-8">
                  <span className="text-4xl font-extrabold">A medida</span>
                  <p className="text-xs text-muted-foreground mt-2">
                    El precio se calcula según volumen mensual de llamadas,
                    concurrencia y complejidad del flujo
                  </p>
                </div>

                {/* FEATURES */}
                <div className="space-y-3 mb-10">
                  {[
                    "Análisis del volumen de llamadas mensual",
                    "Gestión de llamadas simultáneas",

                    "Optimización de costos por consumo real",

                    "Soporte prioritario y SLA empresarial",
                    "Ideal para clínicas grandes, call centers e inmobiliarias",
                  ].map((f) => (
                    <div key={f} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  size="lg"
                  className="mt-auto w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Hablar con un asesor
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
