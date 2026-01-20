import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Message = {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

type Chat = {
  id: string;
  userId: string;
  assistant_id: string;
  messages: Message[];
  lastActivity: string;
  tokenUsage: {
    input: number;
    output: number;
  };
};

type ChatStore = {
  currentChat: Chat | null;
  chats: Chat[];
  loading: boolean;
  error: string | null;
  startChat: (payload: {
    userId: string;
    assistant_id: string;
    promt: string;
  }) => Promise<void>;
  sendMessage: (payload: {
    chatId: string;
    assistant_id: string;
    role: "user" | "assistant";
    content: string;
  }) => Promise<void>;
  fetchChat: (chatId: string) => Promise<void>;
  fetchUserChats: (userId: string) => Promise<void>;
  clearError: () => void;
};

export const useChatStore = create<ChatStore>()(
  devtools((set) => ({
    currentChat: null,
    chats: [],
    loading: false,
    error: null,

    startChat: async ({ userId, assistant_id, promt }) => {
      set({ loading: true, error: null });
      try {
        const res = await fetch("/api/chat/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, assistant_id, promt }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to start chat");
        return data;
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    sendMessage: async ({ chatId, assistant_id, role, content }) => {
      set({ loading: true, error: null });
      try {
        const res = await fetch("/api/chat/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId, assistant_id, role, content }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to send message");

        set((state) => ({
          currentChat: state.currentChat
            ? {
                ...state.currentChat,
                messages: [
                  ...(state.currentChat.messages || []),
                  { role, content },
                  { role: "assistant", content: data.response },
                ],
              }
            : null,
          loading: false,
        }));
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    fetchChat: async (chatId) => {
      set({ loading: true, error: null });
      try {
        const res = await fetch(`/api/chat/${chatId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch chat");

        set({ currentChat: data.chat, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    fetchUserChats: async (userId) => {
      set({ loading: true, error: null });
      try {
        const res = await fetch(`/api/chat/user/${userId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch chats");

        set({ chats: data.chats, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    clearError: () => set({ error: null }),
  }))
);
