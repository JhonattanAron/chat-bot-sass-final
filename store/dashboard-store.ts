import { create } from "zustand";
import { devtools } from "zustand/middleware";

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

const API_BASE_URL = "http://localhost:8081";

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    (set, get) => ({
      stats: null,
      bots: [],
      tokenUsage: null,
      isLoading: false,
      error: null,

      fetchDashboardData: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const [statsResponse, botsResponse, tokenResponse] =
            await Promise.all([
              fetch(`${API_BASE_URL}/dashboard/stats/${userId}`, {
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
              }),
              fetch(`${API_BASE_URL}/dashboard/bots/${userId}`, {
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
              }),
              fetch(`${API_BASE_URL}/dashboard/token-usage/${userId}`, {
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
              }),
            ]);

          if (!statsResponse.ok || !botsResponse.ok || !tokenResponse.ok) {
            throw new Error("Failed to fetch dashboard data");
          }

          const stats = await statsResponse.json();
          const bots = await botsResponse.json();
          const tokenUsage = await tokenResponse.json();

          set({
            stats,
            bots,
            tokenUsage,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
        }
      },

      fetchBots: async (userId: string) => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/dashboard/bots/${userId}`,
            {
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch bots");
          }

          const bots = await response.json();
          set({ bots });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch bots",
          });
        }
      },

      fetchTokenUsage: async (userId: string) => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/dashboard/token-usage/${userId}`,
            {
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch token usage");
          }

          const tokenUsage = await response.json();
          set({ tokenUsage });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch token usage",
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "dashboard-store",
    }
  )
);
