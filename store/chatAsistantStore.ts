import type { APIResponse } from "@/interfaces/api-response-interface";
import { create } from "zustand";

interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  category: string;
}

interface Integration {
  name: string;
  type: string;
  config: Record<string, any>;
}

export interface ChatAssistant {
  _id?: string;
  user_id: string;
  name: string;
  description: string;
  funciones?: [];
  integrations?: Integration[];
  type: string;
  status: string;
  use_case: string;
  welcome_message: string;
  faqs: FAQ[];
}

interface ChatAssistantStore {
  assistants: ChatAssistant[];
  assistant?: ChatAssistant;
  loading: boolean;
  error: string | null;
  createAssistant: (assistant: ChatAssistant) => Promise<APIResponse>;
  updateAssistant: (
    id: string,
    assistant: Partial<ChatAssistant>,
  ) => Promise<void>;
  createFaq: (faqData: {
    user_id: string;
    assistant_id: string;
    faqs: FAQ[];
  }) => Promise<void>;
  updateFaq: (faqUpdate: {
    user_id: string;
    assistant_id: string;
    faqId: string;
    update: Partial<FAQ>;
  }) => Promise<void>;
  deleteFaq: (params: {
    user_id: string;
    assistant_id: string;
    faqId: string;
  }) => Promise<void>;
  getAssistants: (user_id: string) => Promise<ChatAssistant[]>;
  getAssistantById: (
    assistant_id: string,
    user_id: string,
  ) => Promise<ChatAssistant | undefined>;
  deleteAssistant: (assistant_id: string, user_id: string) => Promise<void>;
  setAssistants: (assistants: ChatAssistant[]) => void;
  setError: (error: string | null) => void;
}

export const useChatAssistantStore = create<ChatAssistantStore>((set, get) => ({
  assistants: [],
  loading: false,
  error: null,

  setAssistants: (assistants) => set({ assistants }),
  setError: (error) => set({ error }),

  createFaq: async (faqData) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/backend/faq-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error creating FAQ");
      set({ loading: false });
      return data;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  updateFaq: async (faqUpdate) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/backend/faq-tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqUpdate),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error updating FAQ");
      set({ loading: false });
      return data;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deleteFaq: async (params) => {
    set({ loading: true, error: null });
    try {
      const query = new URLSearchParams(
        params as Record<string, string>,
      ).toString();
      const res = await fetch(`/api/backend/faq-tasks?${query}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error deleting FAQ");
      set({ loading: false });
      return data;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  getAssistants: async (user_id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `/api/backend/assistant-chats?user_id=${user_id}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      console.log(data);

      if (!res.ok || !data.success)
        throw new Error(data.error || "Error fetching assistants");
      set({ assistants: data.assistants || [], loading: false });
      return data.assistants || [];
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return [];
    }
  },

  getAssistantById: async (assistant_id, user_id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `/api/backend/assistant-chats/${assistant_id}?user_id=${user_id}`,
      );
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "Error fetching assistant");
      set({ assistant: data.assistant, loading: false });
      return data.assistant;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return undefined;
    }
  },

  createAssistant: async (assistant) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/backend/assistant-chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: assistant.user_id,
          name: assistant.name,
          description: assistant.description,
          funciones: assistant.funciones,
          integrations: assistant.integrations,
          type: assistant.type,
          status: assistant.status,
          use_case: assistant.use_case,
          welcome_message: assistant.welcome_message,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { data, error: true, local: assistant };
      } else {
        set((state) => ({
          assistants: [...state.assistants, data.assistant],
          loading: false,
        }));
        return { data, error: false };
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  updateAssistant: async (assistant_id, updates) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/backend/assistant-chats/${assistant_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "Error updating assistant");
      set((state) => ({
        assistants: state.assistants.map((a) =>
          a._id === assistant_id ? { ...a, ...updates } : a,
        ),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  deleteAssistant: async (assistant_id, user_id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `/api/backend/assistant-chats/${assistant_id}?user_id=${user_id}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "Error deleting assistant");
      set((state) => ({
        assistants: state.assistants.filter((a) => a._id !== assistant_id),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
