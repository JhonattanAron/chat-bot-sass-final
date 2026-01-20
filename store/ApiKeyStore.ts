import { create } from "zustand";

const NEST_API_URL = "http://localhost:8081";

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

  // Actions
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

  setUserId: (userId: string) => {
    set({ currentUserId: userId });
  },

  fetchApiKeys: async (userId?: string) => {
    const targetUserId = userId || get().currentUserId;

    if (!targetUserId) {
      set({ error: "User ID is required" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(
        `${NEST_API_URL}/api-key-validate/api-keys?user_id=${targetUserId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.apiKeys && Array.isArray(data.apiKeys)) {
        // Transform the backend response to match our frontend interface
        const transformedApiKeys = data.apiKeys.map((key: any) => ({
          id: key._id || key.id,
          _id: key._id,
          name: key.name,
          key: key.key || `api_key_${key._id}`, // Generate a placeholder if key is not provided
          isActive: key.isActive,
          user_id: key.user_id,
          createdAt: key.createdAt,
          updatedAt: key.updatedAt,
          lastUsed: key.lastUsed,
        }));

        set({
          apiKeys: transformedApiKeys,
          isLoading: false,
          error: null,
        });
      } else {
        // Handle case where apiKeys is undefined or not an array
        set({
          apiKeys: [],
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch API keys",
        isLoading: false,
        apiKeys: [],
      });
    }
  },

  createApiKey: async (name: string, userId?: string) => {
    const targetUserId = userId || get().currentUserId;

    if (!targetUserId) {
      set({ error: "User ID is required" });
      return false;
    }

    if (!name.trim()) {
      set({ error: "API key name is required" });
      return false;
    }

    set({ isCreating: true, error: null });

    try {
      const response = await fetch(
        `${NEST_API_URL}/api-key-validate/api-keys`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: name.trim(),
            user_id: targetUserId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.message === "API Key created successfully" || data.apiKey) {
        // Refresh the API keys list
        await get().fetchApiKeys(targetUserId);
        set({ isCreating: false, error: null });
        return true;
      } else {
        throw new Error(data.error || "Failed to create API key");
      }
    } catch (error) {
      console.error("Error creating API key:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to create API key",
        isCreating: false,
      });
      return false;
    }
  },

  deleteApiKey: async (keyId: string) => {
    if (!keyId) {
      set({ error: "API key ID is required" });
      return false;
    }

    set({ isDeleting: keyId, error: null });

    try {
      const response = await fetch(
        `${NEST_API_URL}/api-key-validate/api-keys/${keyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.message === "API Key deleted successfully") {
        // Remove the deleted key from the state
        set((state) => ({
          apiKeys: state.apiKeys.filter(
            (key) => key.id !== keyId && key._id !== keyId
          ),
          isDeleting: null,
          error: null,
        }));
        return true;
      } else {
        throw new Error(data.error || "Failed to delete API key");
      }
    } catch (error) {
      console.error("Error deleting API key:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete API key",
        isDeleting: null,
      });
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      apiKeys: [],
      isLoading: false,
      isCreating: false,
      isDeleting: null,
      error: null,
      currentUserId: null,
    });
  },
}));
