import { useEffect, useMemo, useState } from "react";
import type { AppData, Expense } from "@/lib/budget/types";
import { loadData, saveData, resetData } from "@/lib/budget/storage";
import {
  fetchAppData,
  createExpenseApi,
  updateExpenseApi,
  deleteExpenseApi,
  saveBudgetApi,
  resetAllDataApi,
  importDataApi,
} from "@/lib/budget/api";
import {
  currentMonth,
  getBudgetForMonth,
  getExpensesForMonth,
  rebuildHistory,
  totalSpent,
  uid,
} from "@/lib/budget/utils";
import Dashboard from "./Dashboard";
import ExpensesPage from "./ExpensesPage";
import HistoryPage from "./HistoryPage";
import AnalyticsPage from "./AnalyticsPage";
import SettingsPage from "./SettingsPage";
import { LayoutDashboard, Receipt, History, BarChart3, Settings } from "lucide-react";

type Tab = "dashboard" | "expenses" | "history" | "analytics" | "settings";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "history", label: "History", icon: History },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function BudgetApp() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [tab, setTab] = useState<Tab>("dashboard");
  const month = currentMonth();

  // Load from MongoDB Backend on mount
  useEffect(() => {
    fetchAppData().then((backendData) => {
      setData(backendData);
    });
  }, []);

  useEffect(() => {
    const refreshed = { ...data, history: rebuildHistory(data) };
    saveData(refreshed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.budgets, data.expenses]);

  const update = (next: AppData) => setData(next);

  const setBudget = async (amount: number) => {
    const others = data.budgets.filter((b) => b.month !== month);
    update({ ...data, budgets: [...others, { month, budget: amount }] });
    await saveBudgetApi(month, amount);
  };

  const addExpense = async (e: Omit<Expense, "id">) => {
    const tempId = uid();
    update({ ...data, expenses: [{ ...e, id: tempId }, ...data.expenses] });
    const saved = await createExpenseApi(e);
    if (saved?.id) {
      setData((prev) => ({
        ...prev,
        expenses: prev.expenses.map((item) => (item.id === tempId ? saved : item)),
      }));
    }
  };

  const updateExpense = async (id: string, patch: Partial<Expense>) => {
    update({
      ...data,
      expenses: data.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
    await updateExpenseApi(id, patch);
  };

  const deleteExpense = async (id: string) => {
    update({ ...data, expenses: data.expenses.filter((e) => e.id !== id) });
    await deleteExpenseApi(id);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-flow-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AppData;
        const nextData: AppData = {
          budgets: parsed.budgets ?? [],
          expenses: parsed.expenses ?? [],
          history: parsed.history ?? [],
          settings: parsed.settings ?? { currency: "₹" },
        };
        update(nextData);
        await importDataApi(nextData);
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const resetAll = async () => {
    resetData();
    setData({ budgets: [], expenses: [], history: [], settings: { currency: "₹" } });
    await resetAllDataApi();
  };

  const budget = getBudgetForMonth(data, month);
  const monthExpenses = useMemo(() => getExpensesForMonth(data, month), [data, month]);
  const spent = totalSpent(monthExpenses);

  return (
    <div className="min-h-screen bg-black text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-[#050505]">
              <span className="text-sm font-bold tracking-tight">BF</span>
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight sm:text-lg">Budget Flow</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Personal finance, refined.
              </p>
            </div>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">This Month</p>
            <p className="text-sm font-medium">
              {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <nav className="mx-auto max-w-7xl overflow-x-auto px-2 sm:px-4">
          <div className="flex min-w-max gap-1 pb-2">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-[#0e0e0e] text-foreground border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div key={tab} className="animate-fade-up">
          {tab === "dashboard" && (
            <Dashboard
              data={data}
              month={month}
              budget={budget}
              spent={spent}
              monthExpenses={monthExpenses}
              onSetBudget={setBudget}
              onAddExpense={addExpense}
            />
          )}
          {tab === "expenses" && (
            <ExpensesPage
              data={data}
              onAdd={addExpense}
              onUpdate={updateExpense}
              onDelete={deleteExpense}
            />
          )}
          {tab === "history" && <HistoryPage data={data} />}
          {tab === "analytics" && <AnalyticsPage data={data} />}
          {tab === "settings" && (
            <SettingsPage
              data={data}
              onExport={exportJson}
              onImport={importJson}
              onReset={resetAll}
            />
          )}
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Budget Flow · Fullstack Next.js & MongoDB
      </footer>
    </div>
  );
}
