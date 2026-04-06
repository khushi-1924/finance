export type Transaction = {
  id: number;
  date: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

export type Category = {
  name: string;
  color: string;
  type: "income" | "expense";
};

export type Role = "admin" | "viewer";