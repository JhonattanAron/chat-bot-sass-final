import { create } from "zustand";

export interface AutomatedTask {
  id: string;
  name: string;
  category?: string;
  status: "active" | "inactive";
  [key: string]: any;
}

interface AutomatedTasksState {
  tasks: AutomatedTask[];
  currentTask: AutomatedTask | null;
  logs: any[];
  loading: boolean;
  error: string | null;

  createTask: (data: Partial<AutomatedTask>) => Promise<any>;
  getTasks: (user_id: string, filters?: Partial<AutomatedTask>) => Promise<any>;
  getTask: (id: string, user_id: string) => Promise<any>;
  updateTask: (
    id: string,
    user_id: string,
    data: Partial<AutomatedTask>
  ) => Promise<any>;
  deleteTask: (id: string, user_id: string) => Promise<any>;
  toggleTaskStatus: (id: string, user_id: string) => Promise<any>;
  executeTask: (id: string, user_id: string, context?: any) => Promise<any>;
  getTaskLogs: (id: string, user_id: string, limit?: number) => Promise<any>;
  testEmailConnection: (emailConfig: any) => Promise<any>;
  handleWebhook: (taskId: string, payload: any) => Promise<any>;
}
const NEST_API_URL = process.env.NEST_API_URL || "http://localhost:8081";

export const useAutomatedTasksStore = create<AutomatedTasksState>((set) => ({
  tasks: [],
  currentTask: null,
  logs: [],
  loading: false,
  error: null,

  createTask: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${NEST_API_URL}/automated-tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        set((state) => ({ tasks: [...state.tasks, json.task] }));
      }
      return json;
    } catch (err: any) {
      set({ error: err.message });
      return { success: false, error: err.message };
    } finally {
      set({ loading: false });
    }
  },

  getTasks: async (user_id, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams({
        user_id,
        ...filters,
      } as any).toString();
      const res = await fetch(`${NEST_API_URL}/automated-tasks?${params}`);
      const json = await res.json();
      if (json.success) {
        set({ tasks: json.tasks });
      }
      return json;
    } catch (err: any) {
      set({ error: err.message });
      return { success: false, error: err.message };
    } finally {
      set({ loading: false });
    }
  },

  getTask: async (id, user_id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `${NEST_API_URL}/automated-tasks/${id}?user_id=${user_id}`
      );
      const json = await res.json();
      if (json.success) {
        set({ currentTask: json.task });
      }
      return json;
    } catch (err: any) {
      set({ error: err.message });
      return { success: false, error: err.message };
    } finally {
      set({ loading: false });
    }
  },

  updateTask: async (id, user_id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `${NEST_API_URL}/automated-tasks/${id}?user_id=${user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const json = await res.json();
      if (json.success) {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...json.task } : t
          ),
        }));
      }
      return json;
    } catch (err: any) {
      set({ error: err.message });
      return { success: false, error: err.message };
    } finally {
      set({ loading: false });
    }
  },

  deleteTask: async (id, user_id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `${NEST_API_URL}/automated-tasks/${id}?user_id=${user_id}`,
        {
          method: "DELETE",
        }
      );
      const json = await res.json();
      if (json.success) {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      }
      return json;
    } catch (err: any) {
      set({ error: err.message });
      return { success: false, error: err.message };
    } finally {
      set({ loading: false });
    }
  },

  toggleTaskStatus: async (id, user_id) => {
    try {
      const res = await fetch(
        `${NEST_API_URL}/automated-tasks/${id}/toggle-status?user_id=${user_id}`,
        {
          method: "POST",
        }
      );
      const json = await res.json();
      if (json.success) {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: json.task.status } : t
          ),
        }));
      }
      return json;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  executeTask: async (id, user_id, context) => {
    try {
      const res = await fetch(
        `${NEST_API_URL}/automated-tasks/${id}/execute?user_id=${user_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(context || {}),
        }
      );
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  getTaskLogs: async (id, user_id, limit = 50) => {
    try {
      const res = await fetch(
        `${NEST_API_URL}/automated-tasks/${id}/logs?user_id=${user_id}&limit=${limit}`
      );
      const json = await res.json();
      if (json.success) {
        set({ logs: json.logs });
      }
      return json;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  testEmailConnection: async (emailConfig) => {
    try {
      const res = await fetch(`${NEST_API_URL}/automated-tasks/test-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailConfig),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  handleWebhook: async (taskId, payload) => {
    try {
      const res = await fetch(
        `${NEST_API_URL}/automated-tasks/webhook/${taskId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
}));
