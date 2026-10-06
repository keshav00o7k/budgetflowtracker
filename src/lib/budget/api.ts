import type { AppData, Expense } from "./types";
import { loadData, saveData } from "./storage";

export async function fetchAppData(): Promise<AppData> {
  try {
    const res = await fetch("/api/data", { cache: "no-store" });
    if (!res.ok) throw new Error("Backend offline");
    const json = await res.json();
    if (json.success && json.data) {
      saveData(json.data);
      return json.data;
    }
  } catch {
    // Fallback to local storage if MongoDB/backend is not yet reachable
  }
  return loadData();
}

export async function createExpenseApi(expense: Omit<Expense, "id">): Promise<Expense | null> {
  try {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch {
    // Handled by optimistic local update
  }
  return null;
}

export async function updateExpenseApi(id: string, patch: Partial<Expense>): Promise<boolean> {
  try {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteExpenseApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function saveBudgetApi(month: string, budget: number): Promise<boolean> {
  try {
    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, budget }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function resetAllDataApi(): Promise<boolean> {
  try {
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function importDataApi(data: AppData): Promise<boolean> {
  try {
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "import", data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
