"use client";

import { plans, addons } from "@/store/shop/store";
import { PlanCard } from "@/components/shop/plan-card";
import { AddonCard } from "@/components/shop/addon-card";
import { FloatingCart } from "@/components/shop/floating-cart";
import { Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";

export default function ShopPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />

          <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Planes Flexibles y Escalables
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Elige tu Plan Perfecto
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Comienza gratis, mejora según crezcas. Acceso flexible a créditos,
              tokens y todas nuestras características premium.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-12">Planes de Suscripción</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-2">Addons Adicionales</h2>
              <p className="text-muted-foreground">
                Compra créditos y tokens adicionales cuando lo necesites
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addons.map((addon) => (
                <AddonCard key={addon.id} addon={addon} />
              ))}
            </div>
          </div>
        </div>

        <FloatingCart />
      </div>
    </DashboardLayout>
  );
}
