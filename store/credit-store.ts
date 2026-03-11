import { create } from "zustand";

interface CreditStore {
  credits: number;
  addCredits: (amount: number) => void;
  removeCredits: (amount: number) => void;
  setCredits: (amount: number) => void;
}

export const useCreditStore = create<CreditStore>((set) => ({
  credits: 1000,
  addCredits: (amount) =>
    set((state) => ({
      credits: state.credits + amount,
    })),
  removeCredits: (amount) =>
    set((state) => ({
      credits: Math.max(0, state.credits - amount),
    })),
  setCredits: (amount) =>
    set(() => ({
      credits: Math.max(0, amount),
    })),
}));
