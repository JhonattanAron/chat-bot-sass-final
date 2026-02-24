"use client";

import { useCartStore } from "@/store/shop/cart-store";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlanCard({ plan }: { plan: any }) {
  const addPlan = useCartStore((state) => state.addPlan);
  const isPopular = plan.popular;

  return (
    <div
      className={`relative group h-full transition-all duration-500 ${
        isPopular ? "md:scale-105" : ""
      }`}
    >
      {/* Fondo con gradiente y sombra */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
          isPopular
            ? "bg-gradient-to-br from-primary/15 to-accent/10 shadow-2xl"
            : "bg-gradient-to-br from-secondary to-background shadow-md group-hover:shadow-lg"
        }`}
      />

      {/* Badge popular */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
            ✨ Más Popular
          </div>
        </div>
      )}

      <div
        className={`relative p-8 rounded-2xl h-full flex flex-col ${
          isPopular
            ? "border-2 border-primary/30"
            : "border border-border hover:border-primary/20"
        }`}
      >
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Plan con acceso a créditos y tokens
          </p>
        </div>

        {/* Precio */}
        <div className="mb-8">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ${plan.price}
            </span>
            <span className="text-muted-foreground text-sm">/mes</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8 pb-8 border-b border-border">
          <div
            className={`rounded-xl p-3 ${isPopular ? "bg-primary/10" : "bg-muted"}`}
          >
            <p className="text-xs text-muted-foreground mb-1">Créditos</p>
            <p className="text-lg font-bold">{plan.credits.toString()}</p>
          </div>
          <div
            className={`rounded-xl p-3 ${isPopular ? "bg-accent/10" : "bg-muted"}`}
          >
            <p className="text-xs text-muted-foreground mb-1">Tokens</p>
            <p className="text-lg font-bold">
              {(plan.tokens / 1000000).toFixed(1)}M
            </p>
          </div>
          <div
            className={`rounded-xl p-3 ${isPopular ? "bg-primary/10" : "bg-muted"}`}
          >
            <p className="text-xs text-muted-foreground mb-1">Conv./mes</p>
            <p className="text-lg font-bold">
              {plan.monthlyConversations.toString()}
            </p>
          </div>
          <div
            className={`rounded-xl p-3 ${isPopular ? "bg-accent/10" : "bg-muted"}`}
          >
            <p className="text-xs text-muted-foreground mb-1">Conv./día</p>
            <p className="text-lg font-bold">~{plan.dailyConversations}</p>
          </div>
        </div>

        {/* Características */}
        <div className="flex-1 mb-8 space-y-3">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isPopular
                      ? "bg-gradient-to-br from-primary to-accent"
                      : "bg-primary/20"
                  }`}
                >
                  <Check
                    className={`w-3 h-3 ${isPopular ? "text-white" : "text-primary"}`}
                  />
                </div>
              </div>
              <span className="text-sm text-card-foreground">{feature}</span>
            </div>
          ))}
        </div>

        {/* Botón */}
        <Button
          onClick={() => addPlan(plan)}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
            isPopular
              ? "bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground shadow-md"
              : "bg-secondary hover:bg-muted text-foreground border border-border"
          }`}
        >
          {plan.price === 0 ? "Empezar Gratis" : "Seleccionar Plan"}
        </Button>
      </div>
    </div>
  );
}
