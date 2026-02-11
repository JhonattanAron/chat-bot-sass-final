import { create } from "zustand";

interface Contact {
  id: string;
  phoneNumber: string;
  name: string;
  customFields?: Record<string, any>;
}

interface CampaignTemplate {
  message: string;
  useTemplate: boolean;
  variables?: string[];
}

interface Campaign {
  _id?: string;
  name: string;
  description?: string;
  assistantId: string;
  contacts: Contact[];
  template: CampaignTemplate;
  status: "draft" | "scheduled" | "running" | "completed" | "paused";
  scheduledTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CampaignStore {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
  success: string | null;

  // Acciones
  createCampaign: (campaign: Campaign) => Promise<void>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  getCampaigns: (userId: string, assistantId?: string) => Promise<void>;
  getCampaignById: (id: string) => Promise<void>;
  startCampaign: (id: string) => Promise<void>;
  pauseCampaign: (id: string) => Promise<void>;
  resumeCampaign: (id: string) => Promise<void>;
  setCampaigns: (campaigns: Campaign[]) => void;
  setCurrentCampaign: (campaign: Campaign | null) => void;
  setError: (error: string | null) => void;
  setSuccess: (message: string | null) => void;
}

export const useCampaignStore = create<CampaignStore>((set, get) => ({
  campaigns: [],
  currentCampaign: null,
  loading: false,
  error: null,
  success: null,

  setCampaigns: (campaigns) => set({ campaigns }),
  setCurrentCampaign: (campaign) => set({ currentCampaign: campaign }),
  setError: (error) => set({ error }),
  setSuccess: (message) => set({ success: message }),

  createCampaign: async (campaign) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/backend/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaign),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error creating campaign");

      set((state) => ({
        campaigns: [...state.campaigns, data.campaign],
        loading: false,
        success: "Campaña creada exitosamente",
      }));

      setTimeout(() => set({ success: null }), 3000);
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  updateCampaign: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/backend/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error updating campaign");

      set((state) => ({
        campaigns: state.campaigns.map((c) => (c._id === id ? data.campaign : c)),
        currentCampaign: state.currentCampaign?._id === id ? data.campaign : state.currentCampaign,
        loading: false,
        success: "Campaña actualizada",
      }));

      setTimeout(() => set({ success: null }), 3000);
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deleteCampaign: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/backend/campaigns/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error deleting campaign");

      set((state) => ({
        campaigns: state.campaigns.filter((c) => c._id !== id),
        currentCampaign: state.currentCampaign?._id === id ? null : state.currentCampaign,
        loading: false,
        success: "Campaña eliminada",
      }));

      setTimeout(() => set({ success: null }), 3000);
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  getCampaigns: async (userId, assistantId) => {
    set({ loading: true, error: null });
    try {
      const query = new URLSearchParams({ userId, ...(assistantId && { assistantId }) });
      const response = await fetch(`/api/backend/campaigns?${query}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Error fetching campaigns");

      set({ campaigns: data.campaigns || [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  getCampaignById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/backend/campaigns/${id}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Error fetching campaign");

      set({ currentCampaign: data.campaign, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  startCampaign: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/backend/campaigns/${id}/start`, {
        method: "POST",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error starting campaign");

      set((state) => ({
        campaigns: state.campaigns.map((c) => (c._id === id ? { ...c, status: "running" } : c)),
        loading: false,
        success: "Campaña iniciada",
      }));

      setTimeout(() => set({ success: null }), 3000);
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  pauseCampaign: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/backend/campaigns/${id}/pause`, {
        method: "POST",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error pausing campaign");

      set((state) => ({
        campaigns: state.campaigns.map((c) => (c._id === id ? { ...c, status: "paused" } : c)),
        loading: false,
        success: "Campaña pausada",
      }));

      setTimeout(() => set({ success: null }), 3000);
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  resumeCampaign: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/backend/campaigns/${id}/resume`, {
        method: "POST",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error resuming campaign");

      set((state) => ({
        campaigns: state.campaigns.map((c) => (c._id === id ? { ...c, status: "running" } : c)),
        loading: false,
        success: "Campaña reanudada",
      }));

      setTimeout(() => set({ success: null }), 3000);
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));
