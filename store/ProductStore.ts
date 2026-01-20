import { create } from "zustand";

export interface Product {
  _id: string;
  name: string;
  price: string;
  description: string;
  tags?: string[];
  available?: boolean;
  [key: string]: any;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  AddProduct: (
    product: Product,
    user_id: string,
    assistant_id: string
  ) => Promise<void>;
  fetchProducts: (user_id: string, assistant_id: string) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  updateProduct: (
    id: string,
    data: Partial<Product>,
    user_id: string
  ) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setProducts: (products: Product[]) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setError: (error) => set({ error }),

  AddProduct: async (product, user_id, assistant_id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `/api/products-tasks?user_id=${encodeURIComponent(
          user_id
        )}&assistant_id=${encodeURIComponent(assistant_id)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error fetching products");
      set({ products: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchProducts: async (user_id, assistant_id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `/api/products-tasks?user_id=${encodeURIComponent(
          user_id
        )}&assistant_id=${encodeURIComponent(assistant_id)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error fetching products");
      set({ products: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `/api/products-tasks?id=${encodeURIComponent(id)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error fetching product");
      set({ loading: false });
      return data;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  updateProduct: async (id, data, user_id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `/api/products-tasks?id=${encodeURIComponent(
          id
        )}&user_id=${encodeURIComponent(user_id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error updating product");
      // Opcional: refresca productos
      // await get().fetchProducts(user_id);
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `/api/products-tasks?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error deleting product");
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
