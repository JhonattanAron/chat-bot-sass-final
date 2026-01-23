import { create } from "zustand";
import { devtools } from "zustand/middleware";

/* =========================
   TYPES
========================= */

export interface Bot {
  id: string;
  name: string;
  status: "online" | "offline" | "maintenance";
  messages_count: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_bots: number;
  total_messages: number;
  active_users: number;
  conversion_rate: number;
  bots_change: string;
  messages_change: string;
  users_change: string;
  conversion_change: string;
}

export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  max_tokens: number;
  usage_percentage: number;
}

export interface DashboardData {
  stats: DashboardStats | null;
  bots: Bot[];
  tokenUsage: TokenUsage | null;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardStore extends DashboardData {
  fetchDashboardData: (userId: string) => Promise<void>;
  fetchBots: (userId: string) => Promise<void>;
  fetchTokenUsage: (userId: string) => Promise<void>;
  clearError: () => void;
}

/* =========================
   STORE
========================= */

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    (set) => ({
      stats: null,
      bots: [],
      tokenUsage: null,
      isLoading: false,
      error: null,

      /* ---------- FETCH ALL ---------- */
      fetchDashboardData: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
          const [statsRes, botsRes, tokenRes] = await Promise.all([
            fetch(`/api/dashboard/stats/${userId}`, {
              credentials: "include",
            }),
            fetch(`/api/dashboard/bots/${userId}`, {
              credentials: "include",
            }),
            fetch(`/api/dashboard/token-usage/${userId}`, {
              credentials: "include",
            }),
          ]);

          if (!statsRes.ok || !botsRes.ok || !tokenRes.ok) {
            throw new Error("Failed to fetch dashboard data");
          }

          const [stats, bots, tokenUsage] = await Promise.all([
            statsRes.json(),
            botsRes.json(),
            tokenRes.json(),
          ]);

          set({
            stats,
            bots,
            tokenUsage,
            isLoading: false,
          });
        } catch (err) {
          set({
            error:
              err instanceof Error ? err.message : "Error loading dashboard",
            isLoading: false,
          });
        }
      },

      /* ---------- FETCH BOTS ---------- */
      fetchBots: async (userId: string) => {
        try {
          const res = await fetch(`/api/dashboard/bots/${userId}`, {
            credentials: "include",
          });

          if (!res.ok) {
            throw new Error("Failed to fetch bots");
          }

          const bots = await res.json();
          set({ bots });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Failed to fetch bots",
          });
        }
      },

      /* ---------- FETCH TOKEN USAGE ---------- */
      fetchTokenUsage: async (userId: string) => {
        try {
          const res = await fetch(`/api/dashboard/token-usage/${userId}`, {
            credentials: "include",
          });

          if (!res.ok) {
            throw new Error("Failed to fetch token usage");
          }

          const tokenUsage = await res.json();
          set({ tokenUsage });
        } catch (err) {
          set({
            error:
              err instanceof Error
                ? err.message
                : "Failed to fetch token usage",
          });
        }
      },

      /* ---------- CLEAR ERROR ---------- */
      clearError: () => set({ error: null }),
    }),
    {
      name: "dashboard-store",
    },
  ),
);
