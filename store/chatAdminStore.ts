import { create } from "zustand";

interface Message {
  role: "user" | "assistant" | "admin";
  content: string;
  createdAt: Date;
  important_info?: string;
  isTransferred?: boolean;
}

interface AdminChat {
  _id: string;
  userId: string;
  assistantId: string;
  messages: Message[];
  lastActivityAt: Date;
  transferred: boolean;
  transferredTo?: string;
  transferredAt?: Date;
  createdAt: Date;
}

interface ChatAdminStore {
  chats: AdminChat[];
  currentChat: AdminChat | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  stats: {
    total: number;
    transferred: number;
    avgMessagesPerChat: number;
    totalMessages: number;
  } | null;

  // Actions
  getUserChats: (assistantId?: string, limit?: number, offset?: number) => Promise<void>;
  getChat: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, content: string, role?: "admin" | "assistant") => Promise<void>;
  transferChat: (chatId: string, agentId?: string) => Promise<void>;
  restoreChat: (chatId: string) => Promise<void>;
  searchChats: (query: string, assistantId?: string) => Promise<void>;
  getStatistics: () => Promise<void>;
  setCurrentChat: (chat: AdminChat | null) => void;
  setError: (error: string | null) => void;
  setSuccess: (message: string | null) => void;
}

export const useChatAdminStore = create<ChatAdminStore>((set, get) => ({
  chats: [],
  currentChat: null,
  loading: false,
  error: null,
  success: null,
  stats: null,

  setCurrentChat: (chat) => set({ currentChat: chat }),
  setError: (error) => set({ error }),
  setSuccess: (message) => set({ success: message }),

  getUserChats: async (assistantId, limit = 50, offset = 0) => {
    set({ loading: true, error: null });
    try {
      const query = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...(assistantId && { assistantId }),
      });

      const response = await fetch(`/api/backend/chat-admin/chats?${query}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Error fetching chats");

      set({ chats: data.chats || [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  getChat: async (chatId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/backend/chat-admin/chats/${chatId}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Error fetching chat");

      set({ currentChat: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  sendMessage: async (chatId, content, role = "admin") => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/backend/chat-admin/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, content }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error sending message");

      // Actualizar chat local
      set((state) => {
        if (state.currentChat?._id === chatId) {
          return {
            currentChat: {
              ...state.currentChat,
              messages: [...state.currentChat.messages, data],
              lastActivityAt: new Date(),
            },
            loading: false,
            success: "Mensaje enviado",
          };
        }
        return { loading: false, success: "Mensaje enviado" };
      });

      setTimeout(() => set({ success: null }), 3000);
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  transferChat: async (chatId, agentId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/backend/chat-admin/chats/${chatId}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error transferring chat");

      set((state) => ({
        currentChat: state.currentChat
          ? {
              ...state.currentChat,
              transferred: true,
              transferredTo: agentId,
              transferredAt: new Date(),
            }
          : null,
        loading: false,
        success: "Chat transferido a agente",
      }));

      setTimeout(() => set({ success: null }), 3000);
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  restoreChat: async (chatId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/backend/chat-admin/chats/${chatId}/restore`, {
        method: "POST",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error restoring chat");

      set((state) => ({
        currentChat: state.currentChat
          ? {
              ...state.currentChat,
              transferred: false,
              transferredTo: undefined,
              transferredAt: undefined,
            }
          : null,
        loading: false,
        success: "Chat restaurado",
      }));

      setTimeout(() => set({ success: null }), 3000);
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  searchChats: async (query, assistantId) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams({ q: query, ...(assistantId && { assistantId }) });
      const response = await fetch(`/api/backend/chat-admin/chats/search?${params}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Error searching chats");

      set({ chats: data || [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  getStatistics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/backend/chat-admin/statistics");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Error fetching statistics");

      set({ stats: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
