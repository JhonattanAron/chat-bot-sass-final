"use client";

import { useEffect, useState } from "react";
import { useCatalogStore } from "@/store/shop/store";
import { PlanCard } from "@/components/shop/plan-card";
import { AddonCard } from "@/components/shop/addon-card";
import { FloatingCart } from "@/components/shop/floating-cart";
import { Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/pages/dashboard/dashboard-layout";

export default function ShopPage() {
  const {
    plans,
    addons,
    fetchPlans,
    fetchAddons,
    billingInterval,
    setBillingInterval,
    loading,
  } = useCatalogStore();

  useEffect(() => {
    fetchPlans();
    fetchAddons();
  }, [fetchPlans, fetchAddons]);

  const [activeTab, setActiveTab] = useState<"plans" | "addons">("plans");
  const [addonTypeTab, setAddonTypeTab] = useState<
    "vps" | "creditos" | "tokens"
  >("creditos");

  // Agrupar addons por tipo
  const groupedAddons = {
    vps: addons.filter((addon) => addon.type === "vps"),
    creditos: addons.filter((addon) => addon.type === "credits"),
    tokens: addons.filter((addon) => addon.type === "tokens"),
  };

  const addonTypes = [
    { id: "creditos", label: "💳 Créditos", icon: "💳" },
    { id: "tokens", label: "🔑 Tokens", icon: "🔑" },
    { id: "vps", label: "🖥️ VPS", icon: "🖥️" },
  ];

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
              Comienza gratis, mejora según crezcas.
            </p>
            <div className="flex justify-center mt-4">
              <div className="relative bg-muted/50 backdrop-blur-xl border border-border rounded-2xl p-1 shadow-lg">
                {/* Sliding Background */}
                <div
                  className={`absolute top-1 bottom-1 w-1/2 rounded-xl bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-in-out ${
                    activeTab === "plans" ? "left-1" : "left-1/2"
                  }`}
                />

                <div className="relative flex w-[320px]">
                  <button
                    onClick={() => setActiveTab("plans")}
                    className={`w-1/2 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      activeTab === "plans"
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    🚀 Planes
                  </button>

                  <button
                    onClick={() => setActiveTab("addons")}
                    className={`w-1/2 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      activeTab === "addons"
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    ⚡ Addons
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-20">
          {/* PLANES */}
          {activeTab === "plans" && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-12">
                Planes de Suscripción
              </h2>

              <div className="flex justify-center mb-10">
                <div className="inline-flex rounded-lg border bg-muted p-1">
                  <button
                    onClick={() => setBillingInterval("month")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                      billingInterval === "month"
                        ? "bg-background shadow"
                        : "text-muted-foreground"
                    }`}
                  >
                    Mensual
                  </button>

                  <button
                    onClick={() => setBillingInterval("year")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                      billingInterval === "year"
                        ? "bg-background shadow"
                        : "text-muted-foreground"
                    }`}
                  >
                    Anual
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...plans].reverse().map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          )}

          {/* ADDONS */}
          {activeTab === "addons" && (
            <div>
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-2">Addons Adicionales</h2>
                <p className="text-muted-foreground">
                  Compra recursos adicionales cuando lo necesites
                </p>
              </div>

              {/* Sub-tabs para tipos de addons */}
              <div className="mb-8 flex flex-wrap gap-2">
                {addonTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setAddonTypeTab(type.id as any)}
                    className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      addonTypeTab === type.id
                        ? "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                        : "bg-secondary text-muted-foreground hover:text-foreground border border-border hover:border-primary/50"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Productos del tipo seleccionado */}
              <div>
                {groupedAddons[addonTypeTab].length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...groupedAddons[addonTypeTab]].reverse().map((addon) => (
                      <AddonCard key={addon.id} addon={addon} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No hay addons disponibles en esta categoría
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <FloatingCart />
      </div>
    </DashboardLayout>
  );
}
