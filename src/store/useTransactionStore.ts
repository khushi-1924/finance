import { create } from "zustand";
import type { Category, Transaction } from "../types";

type Store = {
  transactions: Transaction[];
  categories: Category[];

  addTransaction: (t: Transaction) => void;
  updateTransaction: (t: Transaction) => void;
  deleteTransaction: (id: number) => void;

  setTransactions: (t: Transaction[]) => void;

  addCategory: (cat: Category) => void;
  setCategories: (cats: Category[]) => void;
};

export const useTransactionStore = create<Store>((set) => ({
  transactions: JSON.parse(localStorage.getItem("transactions") || "[]"),

  categories:
    JSON.parse(localStorage.getItem("categories") || "null") || [
      { name: "food", color: "#f87171", type: "expense" },
      { name: "travel", color: "#60a5fa", type: "expense" },
      { name: "salary", color: "#22c55e", type: "income" },
    ],

  // ---------------- TRANSACTIONS ----------------

  addTransaction: (t) =>
    set((state) => {
      const updated = [t, ...state.transactions];
      localStorage.setItem("transactions", JSON.stringify(updated));
      return { transactions: updated };
    }),

  updateTransaction: (updated) =>
    set((state) => {
      const newData = state.transactions.map((t) =>
        t.id === updated.id ? updated : t
      );
      localStorage.setItem("transactions", JSON.stringify(newData));
      return { transactions: newData };
    }),

  deleteTransaction: (id) =>
    set((state) => {
      const filtered = state.transactions.filter((t) => t.id !== id);
      localStorage.setItem("transactions", JSON.stringify(filtered));
      return { transactions: filtered };
    }),

  setTransactions: (t) => {
    localStorage.setItem("transactions", JSON.stringify(t));
    return set({ transactions: t });
  },

  // ---------------- CATEGORIES ----------------

  addCategory: (cat) =>
    set((state) => {
      const updated = [...state.categories, cat];
      localStorage.setItem("categories", JSON.stringify(updated));
      return { categories: updated };
    }),

  setCategories: (cats) => {
    localStorage.setItem("categories", JSON.stringify(cats));
    return set({ categories: cats });
  },
}));