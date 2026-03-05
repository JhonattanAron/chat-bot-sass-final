"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/shop/cart-store";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X } from "lucide-react";

export function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, syncCart, removeItem } = useCartStore();

  useEffect(() => {
    syncCart();
  }, [syncCart]);

  const items = cart?.items || [];
  const totalItems = items.length;
  const totalPrice = cart?.total || 0;

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-40 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute bottom-0 right-0 w-full sm:w-96 bg-card rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300 flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-xl font-semibold">Tu Carrito</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-secondary rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">Tu carrito está vacío</p>
                </div>
              ) : (
                items.map((item: any) => (
                  <div
                    key={item.itemId}
                    className="bg-secondary p-4 rounded-xl space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>

                        <p className="text-sm text-muted-foreground">
                          {item.currency} {item.price} x {item.quantity}
                        </p>

                        {item.billingInterval && (
                          <p className="text-xs text-muted-foreground">
                            {item.billingInterval}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeItem(item.itemId)}
                        className="p-1 hover:bg-border rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-primary">
                      {item.currency} {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="sticky bottom-0 bg-card border-t border-border p-6 space-y-4">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Total</p>
                  <p className="text-3xl font-bold">
                    {cart.currency || "$"} {totalPrice.toFixed(2)}
                  </p>
                </div>

                <Link
                  href="shop/checkout"
                  className="block"
                  onClick={() => setIsOpen(false)}
                >
                  <Button className="w-full text-lg py-6 rounded-xl">
                    Ir al Checkout
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
