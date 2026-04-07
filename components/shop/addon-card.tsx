"use client";

import { useState } from "react";
import { useCartStore } from "@/store/shop/cart-store";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

export function AddonCard({ addon }: { addon: any }) {
  const addAddon = useCartStore((state) => state.addAddon);
  const [quantity, setQuantity] = useState(1);
  console.log(addon);

  const handleAdd = () => {
    console.log(addon);

    addAddon(addon.id, quantity);
    setQuantity(1);
  };

  const isCredits = addon.type === "credits";

  return (
    <div className="group relative h-full">
      {/* Fondo con efecto hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary to-background rounded-2xl shadow-md group-hover:shadow-lg transition-all duration-300" />

      <div className="relative rounded-2xl border border-border p-6 h-full flex flex-col hover:border-primary/30 transition-colors duration-300">
        {/* Badge tipo */}
        <div className="inline-flex w-fit mb-4">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              isCredits
                ? "bg-primary/15 text-primary"
                : "bg-accent/15 text-accent"
            }`}
          >
            {isCredits ? "💳 Créditos" : "🔑 Tokens"}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 mb-6">
          <h3 className="text-xl font-bold mb-1">{addon.name}</h3>
          <p className="text-sm text-muted-foreground">{addon.description}</p>
        </div>

        {/* Precio */}
        <div className="mb-6 pb-6 border-b border-border">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-primary">
              ${addon.price}
            </span>
            <span className="text-muted-foreground text-sm">
              /{addon.interval}
            </span>
          </div>
        </div>

        {/* Cantidad */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            Cantidad
          </p>
          <div className="flex items-center gap-2 bg-secondary rounded-lg p-2 w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 hover:bg-border rounded transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-1 text-sm font-semibold min-w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 hover:bg-border rounded transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Botón */}
        <Button
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-300 ${
            isCredits
              ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-md"
              : "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:shadow-md"
          }`}
        >
          Agregar al carrito
        </Button>
      </div>
    </div>
  );
}
