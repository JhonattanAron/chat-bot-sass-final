import { create } from "zustand";

interface ApiKey {
  id: string;
  _id?: string;
  name: string;
  key?: string;
  isActive: boolean;
  user_id: string;
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
}

interface ApiKeyState {
  apiKeys: ApiKey[];
  isLoading: boolean;
  isCreating: boolean;
  isDeleting: string | null;
  error: string | null;
  currentUserId: string | null;

  setUserId: (userId: string) => void;
  fetchApiKeys: (userId?: string) => Promise<void>;
  createApiKey: (name: string, userId?: string) => Promise<boolean>;
  deleteApiKey: (keyId: string) => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

export const useApiKeyStore = create<ApiKeyState>((set, get) => ({
  apiKeys: [],
  isLoading: false,
  isCreating: false,
  isDeleting: null,
  error: null,
  currentUserId: null,

  setUserId: (userId) => set({ currentUserId: userId }),

  fetchApiKeys: async (userId) => {
    const targetUserId = userId || get().currentUserId;
    if (!targetUserId) return;

    set({ isLoading: true, error: null });

    try {
      const res = await fetch(
        `/api/backend/api-key-validate/api-keys?user_id=${targetUserId}`,
        { credentials: "include" },
      );

      if (!res.ok) throw new Error("Failed to fetch api keys");

      const data = await res.json();

      set({
        apiKeys: Array.isArray(data.apiKeys)
          ? data.apiKeys.map((k: any) => ({
              id: k._id,
              _id: k._id,
              name: k.name,
              key: k.key,
              isActive: k.isActive,
              user_id: k.user_id,
              createdAt: k.createdAt,
              updatedAt: k.updatedAt,
              lastUsed: k.lastUsed,
            }))
          : [],
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createApiKey: async (name, userId) => {
    const targetUserId = userId || get().currentUserId;
    if (!targetUserId || !name.trim()) return false;

    set({ isCreating: true, error: null });

    try {
      const res = await fetch(`/api/backend/api-key-validate/api-keys`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          user_id: targetUserId,
        }),
      });

      if (!res.ok) throw new Error("Failed to create key");

      await get().fetchApiKeys(targetUserId);
      set({ isCreating: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, isCreating: false });
      return false;
    }
  },

  deleteApiKey: async (keyId) => {
    if (!keyId) return false;

    set({ isDeleting: keyId, error: null });

    try {
      const res = await fetch(
        `/api/backend/api-key-validate/api-keys/${keyId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Failed to delete key");

      set((state) => ({
        apiKeys: state.apiKeys.filter((k) => k.id !== keyId),
        isDeleting: null,
      }));

      return true;
    } catch (err: any) {
      set({ error: err.message, isDeleting: null });
      return false;
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      apiKeys: [],
      isLoading: false,
      isCreating: false,
      isDeleting: null,
      error: null,
      currentUserId: null,
    }),
}));
