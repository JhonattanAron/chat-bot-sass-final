import { create } from "zustand";

export interface AssistantFunction {
  [x: string]: string | undefined;
  id?: string;
  name: string;
  description?: string;
  type: "api" | "custom";
  api?: {
    url: string;
    method: string;
    headers?: { key: string; value: string }[];
    parameters?: {
      name: string;
      type: string;
      required: boolean;
      description?: string;
    }[];
    auth?: { type: string; value: string };
  };
  code?: string;
  credentials?: { name: string; value: string; description?: string }[];
  hasCode?: boolean;
  hasApi?: boolean;
}

interface FunctionsStore {
  functions: AssistantFunction[];
  loading: boolean;
  error: string | null;
  fetchFunctions: (user_id: string, assistant_id: string) => Promise<void>;
  addFunction: (
    user_id: string,
    assistant_id: string,
    func: AssistantFunction
  ) => Promise<any>;
  updateFunction: (
    user_id: string,
    assistant_id: string,
    functionId: string,
    func: Partial<AssistantFunction>
  ) => Promise<any>;
  deleteFunction: (
    user_id: string,
    assistant_id: string,
    functionId: string
  ) => Promise<any>;
  setFunctions: (functions: AssistantFunction[]) => void;
  setError: (error: string | null) => void;
}

export const useFunctionsStore = create<FunctionsStore>((set, get) => ({
  functions: [],
  loading: false,
  error: null,

  setFunctions: (functions) => set({ functions }),
  setError: (error) => set({ error }),

  fetchFunctions: async (user_id, assistant_id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `/api/functions-tasks?user_id=${encodeURIComponent(
          user_id
        )}&assistant_id=${encodeURIComponent(assistant_id)}`
      );
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "Error fetching functions");
      set({ functions: data.functions, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addFunction: async (user_id, assistant_id, func) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/functions-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, assistant_id, function: func }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "Error adding function");
      // Opcional: refresca funciones
      await get().fetchFunctions(user_id, assistant_id);
      set({ loading: false });
      return data;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  updateFunction: async (user_id, assistant_id, functionId, func) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/functions-tasks/${functionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, assistant_id, function: func }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "Error updating function");
      await get().fetchFunctions(user_id, assistant_id);
      set({ loading: false });
      return data;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deleteFunction: async (user_id, assistant_id, functionId) => {
    set({ loading: true, error: null });
    try {
      const url = `/api/functions-tasks/${functionId}?user_id=${encodeURIComponent(
        user_id
      )}&assistant_id=${encodeURIComponent(assistant_id)}`;
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "Error deleting function");
      await get().fetchFunctions(user_id, assistant_id);
      set({ loading: false });
      return data;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));
