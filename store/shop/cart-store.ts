"use client";

import { create } from "zustand";

const API_URL = "/api/backend";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  type: "plan" | "addon";
  billingInterval?: "month" | "year";
}

interface Cart {
  items: CartItem[];
  total: number;
}

interface CartState {
  cart: Cart | null;
  loading: boolean;
}

interface CartActions {
  syncCart: () => Promise<void>;
  addPlan: (itemId: string, billingInterval: "month" | "year") => Promise<void>;
  addAddon: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState & CartActions>((set, get) => ({
  cart: null,
  loading: false,

  // Sincronizar carrito con backend
  syncCart: async () => {
    set({ loading: true });

    try {
      const res = await fetch(`${API_URL}/cart`, {
        credentials: "include",
      });

      const data = await res.json();
      set({ cart: data, loading: false });
    } catch (error) {
      console.error("[v0] Error sincronizando carrito:", error);
      set({ loading: false });
    }
  },

  // Agregar plan al carrito
  addPlan: async (itemId, billingInterval) => {
    try {
      await fetch(`${API_URL}/cart`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          type: "plan",
          billingInterval,
        }),
      });

      await get().syncCart();
    } catch (error) {
      console.error("[v0] Error agregando plan:", error);
    }
  },

  // Agregar addon al carrito
  addAddon: async (itemId, quantity) => {
    try {
      await fetch(`${API_URL}/cart`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          type: "addon",
          quantity,
        }),
      });

      await get().syncCart();
    } catch (error) {
      console.error("[v0] Error agregando addon:", error);
    }
  },

  // Eliminar item del carrito
  removeItem: async (itemId) => {
    try {
      await fetch(`${API_URL}/cart/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      await get().syncCart();
    } catch (error) {
      console.error("[v0] Error eliminando item:", error);
    }
  },

  // Limpiar carrito
  clearCart: async () => {
    try {
      await fetch(`${API_URL}/cart`, {
        method: "DELETE",
        credentials: "include",
      });

      set({ cart: null });
    } catch (error) {
      console.error("[v0] Error limpiando carrito:", error);
    }
  },
}));
