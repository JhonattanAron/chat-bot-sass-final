import { create } from "zustand";

/* =========================
   🔹 Tipos
========================= */

export type BillingInterval = "month" | "year";

export type Plan = {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  credits: number;
  tokens: number;
  monthlyConversations: number;
  dailyConversations: number;
  tokensPerConversation: number;
  costPerToken: number;
  features: string[];
  popular?: boolean;
};

export type Addon = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "credits" | "tokens";
  quantity: number;
};

type CatalogStore = {
  plans: Plan[];
  addons: Addon[];
  loading: boolean;
  billingInterval: BillingInterval;
  setBillingInterval: (interval: BillingInterval) => void;
  fetchPlans: () => Promise<void>;
  fetchAddons: () => Promise<void>;
};

export const useCatalogStore = create<CatalogStore>((set, get) => ({
  plans: [],
  addons: [],
  loading: false,
  billingInterval: "month",

  setBillingInterval: (interval) => set({ billingInterval: interval }),

  /* =========================
     🔹 Fetch Plans
  ========================= */
  fetchPlans: async () => {
    set({ loading: true });

    try {
      const res = await fetch(`/api/backend/catalog/products?category=saas`);
      const response = await res.json();

      const plansWithPrices: Plan[] = await Promise.all(
        response.data.map(async (item: any) => {
          const priceRes = await fetch(
            `/api/backend/catalog/products/${item._id}/prices`,
          );

          const priceResponse = await priceRes.json();
          const prices = priceResponse.prices ?? [];

          const monthly = prices.find((p: any) => p.interval === "month");

          const yearly = prices.find((p: any) => p.interval === "year");

          return {
            id: item._id,
            name: item.name,
            monthlyPrice: monthly?.price ?? 0,
            yearlyPrice: yearly?.price ?? 0,
            credits: item.metadata.credits,
            tokens: item.metadata.tokens,
            monthlyConversations: item.metadata.monthlyConversations,
            dailyConversations: item.metadata.dailyConversations,
            tokensPerConversation: item.metadata.tokensPerConversation,
            costPerToken: item.metadata.costPerToken,
            features: item.metadata.features,
            popular: item.metadata.popular,
          };
        }),
      );

      set({ plans: plansWithPrices });
    } catch (err) {
      console.error("Error fetching plans:", err);
    } finally {
      set({ loading: false });
    }
  },

  /* =========================
     🔹 Fetch Addons
  ========================= */
  fetchAddons: async () => {
    set({ loading: true });

    try {
      const res = await fetch(`/api/backend/catalog/products?category=addon`);
      const response = await res.json();

      const addonsWithPrices: Addon[] = await Promise.all(
        response.data.map(async (item: any) => {
          const priceRes = await fetch(
            `/api/backend/catalog/products/${item._id}/prices`,
          );

          const priceResponse = await priceRes.json();
          const price = priceResponse.prices?.[0]?.price ?? 0;

          return {
            id: item._id,
            name: item.name,
            description: item.description,
            price,
            type: item.metadata.type,
            quantity: item.metadata.quantity,
          };
        }),
      );

      set({ addons: addonsWithPrices });
    } catch (err) {
      console.error("Error fetching addons:", err);
    } finally {
      set({ loading: false });
    }
  },
}));

/* =========================
   🔹 Helper dinámico
========================= */

export const getPlanPrice = (plan: Plan) => {
  const { billingInterval } = useCatalogStore.getState();
  return billingInterval === "month" ? plan.monthlyPrice : plan.yearlyPrice;
};
