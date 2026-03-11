import { create } from "zustand";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  issuedDate: string;
  dueDate: string;
  createdAt: string;
  notes?: string;
  transactionId?: string;
  clientTransactionId?: string;
}

interface InvoicesState {
  invoices: Invoice[];
  loading: boolean;

  fetchInvoices: () => Promise<void>;
  fetchInvoiceByNumber: (invoiceNumber: string) => Promise<Invoice | null>;
}

export const useInvoicesStore = create<InvoicesState>((set, get) => ({
  invoices: [],
  loading: false,

  fetchInvoices: async () => {
    set({ loading: true });

    try {
      const res = await fetch("/api/backend/invoices", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      set({
        invoices: data,
      });
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchInvoiceByNumber: async (invoiceNumber: string) => {
    set({ loading: true });

    try {
      const res = await fetch(`/api/backend/invoices/number/${invoiceNumber}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Factura no encontrada");
      }

      const invoice = await res.json();

      // opcional: agregarla al store si no existe
      const currentInvoices = get().invoices;
      const exists = currentInvoices.find((i) => i._id === invoice._id);

      if (!exists) {
        set({
          invoices: [...currentInvoices, invoice],
        });
      }

      return invoice;
    } catch (error) {
      console.error("Error fetching invoice:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));
