import { create } from "zustand";

type ResourceItem = {
  total?: number;
  used?: number;
  available?: number;
};

interface ResourceState {
  resources: Record<string, ResourceItem>; // 🔥 DINÁMICO

  plans: any[];
  addons: any[];

  loading: boolean;
  error: string | null;

  fetchResources: () => Promise<void>;
  reset: () => void;
}

export const useResourcesStore = create<ResourceState>((set) => ({
  resources: {},

  plans: [],
  addons: [],

  loading: false,
  error: null,

  fetchResources: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch("/api/backend/me/resources", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error fetching resources");
      }

      const data = await res.json();

      // 🔥 separar dinámicamente recursos vs otras cosas
      const { plans, addons, ...rest } = data;

      set({
        resources: rest, // 👈 TODO dinámico aquí
        plans,
        addons,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.message,
        loading: false,
      });
    }
  },

  reset: () =>
    set({
      resources: {},
      plans: [],
      addons: [],
      error: null,
    }),
}));
