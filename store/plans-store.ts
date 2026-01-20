import { create } from "zustand";

export interface Plan {
  name: string;
  max_chatbots: number;
  max_conversations_day: number;
  max_conversations_month: number;
  max_tokens: number;
  tokens_per_conversation: number;
  cost_per_token: number;
  features: string[];
}

export interface UserPlanResponse {
  success: boolean;
  data: {
    user_id?: string; // opcional, lo agregamos en fetch
    plan: Plan;
    created_at: string;
    expires_at?: string;
  };
}

interface PlansState {
  userPlan: UserPlanResponse | null;
  availablePlans: Plan[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUserPlan: (userId: string) => Promise<void>;
  fetchAvailablePlans: () => Promise<void>;
  assignPlan: (userId: string, planId: string) => Promise<void>;
  checkLimits: (userId: string) => Promise<any>;
}

const API_BASE_URL = "http://localhost:8081";

export const usePlansStore = create<PlansState>((set, get) => ({
  userPlan: null,
  availablePlans: [],
  isLoading: false,
  error: null,

  fetchUserPlan: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/plans/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Error al obtener el plan del usuario");

      const result = await response.json();

      // Agregar user_id dentro de data
      const userPlan: UserPlanResponse = {
        success: result.success,
        data: {
          ...result.data,
          user_id: userId,
        },
      };

      set({ userPlan, isLoading: false });
    } catch (error) {
      console.error("Error fetching user plan:", error);
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        isLoading: false,
      });
    }
  },

  fetchAvailablePlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/plans`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener planes disponibles");
      const plans = await response.json();
      set({ availablePlans: plans, isLoading: false });
    } catch (error) {
      console.error(error);
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        isLoading: false,
      });
    }
  },

  assignPlan: async (userId: string, planId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/plans/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, planId }),
      });

      if (!response.ok) throw new Error("Error al asignar el plan");

      await get().fetchUserPlan(userId);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        isLoading: false,
      });
    }
  },

  checkLimits: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plans/limits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Error al verificar límites");

      return await response.json();
    } catch (error) {
      console.error("Error checking limits:", error);
      return null;
    }
  },
}));
