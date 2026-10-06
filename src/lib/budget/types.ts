export type Category =
  | "Food"
  | "Grocery"
  | "Fuel"
  | "Shopping"
  | "Travel"
  | "Bills"
  | "Entertainment"
  | "Health"
  | "Other";

export const CATEGORIES: Category[] = [
  "Food",
  "Grocery",
  "Fuel",
  "Shopping",
  "Travel",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];

export interface Expense {
  id: string;
  amount: number;
  date: string; // ISO yyyy-mm-dd
  note: string;
  category: Category;
}

export interface MonthlyBudget {
  month: string; // yyyy-mm
  budget: number;
}

export interface MonthlyHistoryEntry {
  month: string; // yyyy-mm
  budget: number;
  spent: number;
  delta: number; // budget - spent (positive surplus, negative deficit)
  suggestedNext: number;
}

export interface AppData {
  budgets: MonthlyBudget[];
  expenses: Expense[];
  history: MonthlyHistoryEntry[];
  settings: { currency: string };
}
