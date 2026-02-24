"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/shop/cart-store";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X } from "lucide-react";

export function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const { plan, addons, getTotalPrice, getTotalItems, removeAddon } =
    useCartStore();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-40 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Toggle cart"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Panel del carrito */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Carrito deslizable */}
          <div className="absolute bottom-0 right-0 w-full sm:w-96 bg-card rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300 flex flex-col max-h-[80vh]">
            {/* Header sticky */}
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-xl font-semibold">Tu Carrito</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido con scroll interno */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!plan && !addons?.length ? (
                <div className="py-12 text-center">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  {/* Plan */}
                  {plan && (
                    <div className="bg-secondary p-4 rounded-xl space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${plan.price.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => useCartStore.setState({ plan: null })}
                          className="p-1 hover:bg-border rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Addons */}
                  {addons?.map((addon) => (
                    <div
                      key={addon.id}
                      className="bg-secondary p-4 rounded-xl space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-sm">
                            {addon.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            ${addon.price} cada uno
                          </p>
                        </div>
                        <button
                          onClick={() => removeAddon(addon.id)}
                          className="p-1 hover:bg-border rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Cantidad */}
                      <div className="flex items-center gap-2 bg-background rounded-lg p-2 w-fit">
                        <button
                          onClick={() =>
                            useCartStore.setState((state) => ({
                              addons: state.addons.map((item) =>
                                item.id === addon.id
                                  ? {
                                      ...item,
                                      quantity: Math.max(1, item.quantity - 1),
                                    }
                                  : item,
                              ),
                            }))
                          }
                          className="px-3 py-1 hover:bg-secondary rounded transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-sm font-medium min-w-8 text-center">
                          {addon.quantity}
                        </span>
                        <button
                          onClick={() =>
                            useCartStore.setState((state) => ({
                              addons: state.addons.map((item) =>
                                item.id === addon.id
                                  ? { ...item, quantity: item.quantity + 1 }
                                  : item,
                              ),
                            }))
                          }
                          className="px-3 py-1 hover:bg-secondary rounded transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-primary">
                        ${(addon.price * addon.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Footer sticky - Resumen y botón */}
            {(plan || addons?.length) && (
              <div className="sticky bottom-0 bg-card border-t border-border p-6 space-y-4">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Total</p>
                  <p className="text-3xl font-bold">${totalPrice.toFixed(2)}</p>
                </div>

                <Link
                  href="shop/checkout"
                  className="block"
                  onClick={() => setIsOpen(false)}
                >
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg py-6 rounded-xl transition-all duration-300">
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
