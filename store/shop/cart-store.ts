"use client";

import { create } from "zustand";
import { Plan, Addon } from "./store";

type CartState = {
  plan: Plan | null;
  addons: (Addon & { quantity: number })[];
};

type CartActions = {
  addPlan: (plan: Plan) => void;
  addAddon: (addon: Addon, quantity: number) => void;
  removeAddon: (id: string) => void;
  updateAddonQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
};

export const useCartStore = create<CartState & CartActions>((set, get) => ({
  plan: null,
  addons: [],

  addPlan: (plan: Plan) => {
    set({ plan });
  },

  addAddon: (addon: Addon, quantity: number) => {
    set((state) => {
      const existingIndex = state.addons.findIndex(
        (item) => item.id === addon.id,
      );
      if (existingIndex > -1) {
        const newAddons = [...state.addons];
        newAddons[existingIndex].quantity += quantity;
        return { addons: newAddons };
      }
      return {
        addons: [...state.addons, { ...addon, quantity }],
      };
    });
  },

  removeAddon: (id: string) => {
    set((state) => ({
      addons: state.addons.filter((item) => item.id !== id),
    }));
  },

  updateAddonQuantity: (id: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeAddon(id);
      return;
    }
    set((state) => ({
      addons: state.addons.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    }));
  },

  clearCart: () => {
    set({ plan: null, addons: [] });
  },

  getTotalPrice: () => {
    const state = get();
    let total = 0;
    if (state.plan) {
      total += state.plan.price;
    }
    state.addons.forEach((addon) => {
      total += addon.price * addon.quantity;
    });
    return total;
  },

  getTotalItems: () => {
    const state = get();
    return (state.plan ? 1 : 0) + state.addons.length;
  },
}));
