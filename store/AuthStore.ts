import { create } from "zustand";
import { persist } from "zustand/middleware";

const NEST_API_URL = "https://api.aurentric.com";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  binding_id?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User) => void;
  logout: () => void;
  clearError: () => void;
  register: (
    data: RegisterData,
  ) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          error: null,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        }),
      clearError: () => set({ error: null }),
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const res = await fetch("/api/backend/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
          });

          const result = await res.json();

          if (!res.ok) {
            const errorMessage = result?.message || "Error al crear la cuenta";
            set({ error: errorMessage, isLoading: false });
            return { success: false, error: errorMessage };
          }

          set({ isLoading: false });
          return { success: true };
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Error al conectar con el servidor";

          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
