import { create } from "zustand";
import { devtools } from "zustand/middleware";

const NEST_API_URL = "http://localhost:8081";

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  avatar: string;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  botActivity: boolean;
  billingUpdates: boolean;
  newFeatures: boolean;
  marketing: boolean;
}

interface BillingInfo {
  subscription: {
    plan: string;
    price: string;
    interval: string;
    status: string;
    nextBillingDate: string;
    paymentMethod: {
      type: string;
      last4: string;
      brand: string;
    };
  };
  billingHistory: Array<{
    id: string;
    date: string;
    amount: string;
    status: string;
    downloadUrl: string;
  }>;
}

interface SettingsState {
  // Data
  profile: Profile;
  notifications: NotificationPreferences;
  billing: BillingInfo | null;
  currentUserId: string | null;

  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Actions
  setUserId: (userId: string) => void;
  fetchProfile: (userId?: string) => Promise<void>;
  updateProfile: (
    profileData: Partial<Profile>,
    userId?: string
  ) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string,
    userId?: string
  ) => Promise<void>;
  fetchNotifications: (userId?: string) => Promise<void>;
  updateNotifications: (
    preferences: NotificationPreferences,
    userId?: string
  ) => Promise<void>;
  fetchBilling: (userId?: string) => Promise<void>;
  deleteAccount: (userId?: string) => Promise<void>;
  fetchAllData: (userId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialProfile: Profile = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  avatar: "",
};

const initialNotifications: NotificationPreferences = {
  email: true,
  push: true,
  sms: false,
  botActivity: true,
  billingUpdates: true,
  newFeatures: true,
  marketing: false,
};

export const useSettingsStore = create<SettingsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      profile: initialProfile,
      notifications: initialNotifications,
      billing: null,
      currentUserId: null,
      isLoading: false,
      isSaving: false,
      error: null,

      // Actions
      setUserId: (userId: string) => {
        set({ currentUserId: userId });
      },

      fetchProfile: async (userId?: string) => {
        const targetUserId = userId || get().currentUserId;
        if (!targetUserId) {
          set({ error: "No user ID available" });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch(
            `${NEST_API_URL}/settings/profile?user_id=${targetUserId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          const data = await response.json();

          if (data.success) {
            set({
              profile: data.profile,
              isLoading: false,
            });
          } else {
            throw new Error(data.error || "Failed to fetch profile");
          }
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        }
      },

      updateProfile: async (profileData: Partial<Profile>, userId?: string) => {
        const targetUserId = userId || get().currentUserId;
        if (!targetUserId) {
          set({ error: "No user ID available" });
          return;
        }

        set({ isSaving: true, error: null });

        try {
          const currentProfile = get().profile;
          const updatedProfile = { ...currentProfile, ...profileData };

          const response = await fetch(`${NEST_API_URL}/settings/profile`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              user_id: targetUserId,
              ...updatedProfile,
            }),
          });

          const data = await response.json();

          if (data.success) {
            set({
              profile: data.profile,
              isSaving: false,
            });
          } else {
            throw new Error(data.error || "Failed to update profile");
          }
        } catch (error) {
          set({
            isSaving: false,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        }
      },

      updatePassword: async (
        currentPassword: string,
        newPassword: string,
        userId?: string
      ) => {
        const targetUserId = userId || get().currentUserId;
        if (!targetUserId) {
          set({ error: "No user ID available" });
          return;
        }

        set({ isSaving: true, error: null });

        try {
          const response = await fetch(`${NEST_API_URL}/settings/password`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              user_id: targetUserId,
              currentPassword,
              newPassword,
            }),
          });

          const data = await response.json();

          if (data.success) {
            set({ isSaving: false });
          } else {
            throw new Error(data.error || "Failed to update password");
          }
        } catch (error) {
          set({
            isSaving: false,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        }
      },

      fetchNotifications: async (userId?: string) => {
        const targetUserId = userId || get().currentUserId;
        if (!targetUserId) {
          set({ error: "No user ID available" });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch(
            `${NEST_API_URL}/settings/notifications?user_id=${targetUserId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          const data = await response.json();

          if (data.success) {
            set({
              notifications: data.notifications,
              isLoading: false,
            });
          } else {
            throw new Error(data.error || "Failed to fetch notifications");
          }
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        }
      },

      updateNotifications: async (
        preferences: NotificationPreferences,
        userId?: string
      ) => {
        const targetUserId = userId || get().currentUserId;
        if (!targetUserId) {
          set({ error: "No user ID available" });
          return;
        }

        set({ isSaving: true, error: null });

        try {
          const response = await fetch(
            `${NEST_API_URL}/settings/notifications`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                user_id: targetUserId,
                preferences,
              }),
            }
          );

          const data = await response.json();

          if (data.success) {
            set({
              notifications: data.notifications,
              isSaving: false,
            });
          } else {
            throw new Error(data.error || "Failed to update notifications");
          }
        } catch (error) {
          set({
            isSaving: false,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        }
      },

      fetchBilling: async (userId?: string) => {
        const targetUserId = userId || get().currentUserId;
        if (!targetUserId) {
          set({ error: "No user ID available" });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch(
            `${NEST_API_URL}/settings/billing?user_id=${targetUserId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          const data = await response.json();

          if (data.success) {
            set({
              billing: data.billing,
              isLoading: false,
            });
          } else {
            throw new Error(data.error || "Failed to fetch billing");
          }
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        }
      },

      deleteAccount: async (userId?: string) => {
        const targetUserId = userId || get().currentUserId;
        if (!targetUserId) {
          set({ error: "No user ID available" });
          return;
        }

        set({ isSaving: true, error: null });

        try {
          const response = await fetch(
            `${NEST_API_URL}/settings/account?user_id=${targetUserId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          const data = await response.json();

          if (data.success) {
            set({ isSaving: false });
            // Clear all data after successful deletion
            get().reset();
            // Redirect to login or home page
            window.location.href = "/";
          } else {
            throw new Error(data.error || "Failed to delete account");
          }
        } catch (error) {
          set({
            isSaving: false,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        }
      },

      // Convenience method to fetch all data at once
      fetchAllData: async (userId: string) => {
        set({ currentUserId: userId });

        // Fetch all data in parallel
        await Promise.all([
          get().fetchProfile(userId),
          get().fetchNotifications(userId),
          get().fetchBilling(userId),
        ]);
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set({
          profile: initialProfile,
          notifications: initialNotifications,
          billing: null,
          currentUserId: null,
          isLoading: false,
          isSaving: false,
          error: null,
        });
      },
    }),
    {
      name: "settings-store",
    }
  )
);

// Selector hooks for better performance
export const useSettingsProfile = () =>
  useSettingsStore((state) => state.profile);
export const useSettingsNotifications = () =>
  useSettingsStore((state) => state.notifications);
export const useSettingsBilling = () =>
  useSettingsStore((state) => state.billing);
export const useSettingsLoading = () =>
  useSettingsStore((state) => state.isLoading);
export const useSettingsSaving = () =>
  useSettingsStore((state) => state.isSaving);
export const useSettingsError = () => useSettingsStore((state) => state.error);
