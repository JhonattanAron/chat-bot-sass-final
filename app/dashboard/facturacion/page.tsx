"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { PayphoneButton } from "@/components/payments-metods/checkout-form-payphone";
import { PayPalButton } from "@/components/payments-metods/checkout-form-paypal";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";

const plans = [
  {
    name: "Básico",
    price: 65,
    features: ["Chatbots IA", "WhatsApp QR + Bulk", "Email campaigns"],
    popular: false,
  },
  {
    name: "Estándar",
    price: 97,
    features: [
      "Automatizaciones avanzadas",
      "WhatsApp + Email con IA",
      "Scraping Google Maps",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: 595,
    features: [
      "Todos los módulos desbloqueados",
      "Scraping masivo",
      "APIs + Integraciones",
    ],
    popular: false,
  },
];

export default function BillingPage() {
  const { data: session } = useSession();
  const [step, setStep] = useState(1); // Paso actual
  const [selectedPlan, setSelectedPlan] = useState(plans[2]); // Plan por defecto

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {/* Steps */}
        <div className="flex justify-between mb-6">
          {["Seleccionar plan", "Confirmar detalles", "Pagar"].map(
            (label, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    step === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs">{label}</span>
              </div>
            ),
          )}
        </div>

        {/* Step content */}
        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                onClick={() => setSelectedPlan(plan)}
                className={`cursor-pointer border-2 ${
                  selectedPlan.name === plan.name
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.popular && <Badge className="ml-2">Popular</Badge>}
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold">${plan.price}</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Confirmar detalles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{selectedPlan.name}</p>
              <p>Precio: ${selectedPlan.price}</p>
              <ul className="mt-2 space-y-1 text-sm">
                {selectedPlan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Pagar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>Email de confirmación: {session?.user?.email}</div>
              <PayphoneButton
                amount={selectedPlan.price}
                reference={selectedPlan.name}
                email={session?.user?.email || ""}
              />
              <PayPalButton
                amount={selectedPlan.price}
                planName={selectedPlan.name}
                planId="1"
                email={session?.user?.email || ""}
              />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-4 w-4" /> Pago seguro
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setStep(step - 1)}
            >
              Atrás
            </button>
          )}
          {step < 3 && (
            <button
              className="ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setStep(step + 1)}
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
