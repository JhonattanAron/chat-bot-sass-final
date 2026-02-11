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

export interface AssistantEditData {
  _id: string;
  user_id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  use_case: string;
  welcome_message: string;
  faqs: FAQ[];
  funciones?: string[];
  integrations?: Integration[];
  created_at?: string;
  updated_at?: string;
}

interface EditAssistantStore {
  assistantData: AssistantEditData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: boolean;

  // Fetch operations
  fetchAssistantForEdit: (
    assistant_id: string,
    user_id: string,
  ) => Promise<AssistantEditData | null>;

  // Update operations
  updateAssistantBasicInfo: (
    assistant_id: string,
    user_id: string,
    data: Partial<Omit<AssistantEditData, "_id" | "user_id" | "faqs">>,
  ) => Promise<boolean>;

  // FAQ operations
  addFaq: (
    assistant_id: string,
    user_id: string,
    faq: Omit<FAQ, "_id">,
  ) => Promise<FAQ | null>;

  updateFaqItem: (
    assistant_id: string,
    user_id: string,
    faq_id: string,
    faq: Partial<FAQ>,
  ) => Promise<FAQ | null>;

  deleteFaqItem: (
    assistant_id: string,
    user_id: string,
    faq_id: string,
  ) => Promise<boolean>;

  // State operations
  setAssistantData: (data: AssistantEditData | null) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
  clearState: () => void;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const useEditAssistantStore = create<EditAssistantStore>((set, get) => ({
  assistantData: null,
  loading: false,
  saving: false,
  error: null,
  success: false,

  setAssistantData: (data) => set({ assistantData: data }),
  setError: (error) => set({ error }),
  setSuccess: (success) => set({ success }),
  clearState: () =>
    set({
      assistantData: null,
      loading: false,
      saving: false,
      error: null,
      success: false,
    }),

  fetchAssistantForEdit: async (assistant_id, user_id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `/api/backend/assistant-chats/${assistant_id}?user_id=${user_id}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cargar el asistente");
      }

      const data = await response.json();

      if (!data.success || !data.assistant) {
        throw new Error(data.error || "Respuesta inválida del servidor");
      }

      const assistant = data.assistant as AssistantEditData;
      set({ assistantData: assistant, loading: false, error: null });
      return assistant;
    } catch (err: any) {
      const errorMessage =
        err.message || "Error desconocido al cargar el asistente";
      set({ error: errorMessage, loading: false });
      return null;
    }
  },

  updateAssistantBasicInfo: async (assistant_id, user_id, updateData) => {
    set({ saving: true, error: null });
    try {
      const response = await fetch(
        `/api/backend/assistant-chats/${assistant_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el asistente");
      }

      const data = await response.json();

      if (!data.success || !data.assistant) {
        throw new Error(data.error || "Respuesta inválida del servidor");
      }

      const updated = data.assistant as AssistantEditData;
      set((state) => ({
        assistantData: state.assistantData
          ? { ...state.assistantData, ...updated }
          : updated,
        saving: false,
        success: true,
        error: null,
      }));

      // Reset success after 3 seconds
      setTimeout(() => set({ success: false }), 3000);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Error desconocido al actualizar";
      set({ error: errorMessage, saving: false, success: false });
      return false;
    }
  },

  addFaq: async (assistant_id, user_id, faq) => {
    set({ saving: true, error: null });
    try {
      const response = await fetch("/api/backend/faq-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          assistant_id,
          faqs: [faq],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear FAQ");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Respuesta inválida del servidor");
      }

      const newFaq = data.faq as FAQ;
      set((state) => ({
        assistantData: state.assistantData
          ? {
              ...state.assistantData,
              faqs: [...state.assistantData.faqs, newFaq],
            }
          : state.assistantData,
        saving: false,
        success: true,
        error: null,
      }));

      setTimeout(() => set({ success: false }), 3000);
      return newFaq;
    } catch (err: any) {
      const errorMessage = err.message || "Error desconocido al crear FAQ";
      set({ error: errorMessage, saving: false, success: false });
      return null;
    }
  },

  updateFaqItem: async (assistant_id, user_id, faq_id, faq) => {
    set({ saving: true, error: null });
    try {
      const response = await fetch("/api/backend/faq-tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          assistant_id,
          faqId: faq_id,
          update: faq,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar FAQ");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Respuesta inválida del servidor");
      }

      const updatedFaq = data.faq as FAQ;
      set((state) => ({
        assistantData: state.assistantData
          ? {
              ...state.assistantData,
              faqs: state.assistantData.faqs.map((f) =>
                f._id === faq_id ? updatedFaq : f,
              ),
            }
          : state.assistantData,
        saving: false,
        success: true,
        error: null,
      }));

      setTimeout(() => set({ success: false }), 3000);
      return updatedFaq;
    } catch (err: any) {
      const errorMessage = err.message || "Error desconocido al actualizar FAQ";
      set({ error: errorMessage, saving: false, success: false });
      return null;
    }
  },

  deleteFaqItem: async (assistant_id, user_id, faq_id) => {
    set({ saving: true, error: null });
    try {
      const response = await fetch(
        `/api/backend/faq-tasks?user_id=${user_id}&assistant_id=${assistant_id}&faqId=${faq_id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar FAQ");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Respuesta inválida del servidor");
      }

      set((state) => ({
        assistantData: state.assistantData
          ? {
              ...state.assistantData,
              faqs: state.assistantData.faqs.filter((f) => f._id !== faq_id),
            }
          : state.assistantData,
        saving: false,
        success: true,
        error: null,
      }));

      setTimeout(() => set({ success: false }), 3000);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Error desconocido al eliminar FAQ";
      set({ error: errorMessage, saving: false, success: false });
      return false;
    }
  },
}));
