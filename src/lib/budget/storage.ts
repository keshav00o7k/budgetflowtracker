import type { AppData } from "./types";

const KEY = "budget-flow-v1";

const empty: AppData = {
  budgets: [],
  expenses: [],
  history: [],
  settings: { currency: "₹" },
};

export function loadData(): AppData {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as AppData;
    return { ...empty, ...parsed };
  } catch {
    return empty;
  }
}

export function saveData(data: AppData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function resetData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
