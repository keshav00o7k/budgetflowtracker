import type { AppData, Expense, MonthlyHistoryEntry } from "./types";

export function monthKey(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function currentMonth(): string {
  return monthKey(new Date());
}

export function formatMoney(n: number, currency = "₹"): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}${currency}${abs.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export function formatMonthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function getBudgetForMonth(data: AppData, month: string): number {
  return data.budgets.find((b) => b.month === month)?.budget ?? 0;
}

export function getExpensesForMonth(data: AppData, month: string): Expense[] {
  return data.expenses.filter((e) => monthKey(e.date) === month);
}

export function totalSpent(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function suggestNextBudget(budget: number, spent: number): number {
  const delta = budget - spent;
  return Math.max(0, budget + delta);
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Rebuild history entries for all past months (everything except current).
 */
export function rebuildHistory(data: AppData): MonthlyHistoryEntry[] {
  const cur = currentMonth();
  const months = new Set<string>();
  data.budgets.forEach((b) => months.add(b.month));
  data.expenses.forEach((e) => months.add(monthKey(e.date)));

  const past: MonthlyHistoryEntry[] = [];
  for (const m of months) {
    if (m >= cur) continue;
    const budget = getBudgetForMonth(data, m);
    const spent = totalSpent(getExpensesForMonth(data, m));
    past.push({
      month: m,
      budget,
      spent,
      delta: budget - spent,
      suggestedNext: suggestNextBudget(budget, spent),
    });
  }
  past.sort((a, b) => (a.month < b.month ? 1 : -1));
  return past;
}
