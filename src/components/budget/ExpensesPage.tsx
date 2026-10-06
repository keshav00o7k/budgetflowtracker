import { useMemo, useState } from "react";
import type { AppData, Category, Expense } from "@/lib/budget/types";
import { CATEGORIES } from "@/lib/budget/types";
import { formatMoney, monthKey } from "@/lib/budget/utils";
import QuickExpenseForm from "./QuickExpenseForm";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

interface Props {
  data: AppData;
  onAdd: (e: Omit<Expense, "id">) => void;
  onUpdate: (id: string, patch: Partial<Expense>) => void;
  onDelete: (id: string) => void;
}

export default function ExpensesPage({ data, onAdd, onUpdate, onDelete }: Props) {
  const currency = data.settings.currency;
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<"all" | Category>("all");
  const [month, setMonth] = useState<string>("all");

  const months = useMemo(() => {
    const s = new Set<string>();
    data.expenses.forEach((e) => s.add(monthKey(e.date)));
    return Array.from(s).sort((a, b) => (a < b ? 1 : -1));
  }, [data.expenses]);

  const filtered = useMemo(() => {
    return data.expenses
      .filter((e) => (cat === "all" ? true : e.category === cat))
      .filter((e) => (month === "all" ? true : monthKey(e.date) === month))
      .filter((e) =>
        search.trim()
          ? (e.note + " " + e.category).toLowerCase().includes(search.toLowerCase())
          : true,
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [data.expenses, cat, month, search]);

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const inputCls =
    "rounded-lg border border-border bg-[#0a0a0a] px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-[oklch(0.45_0_0)]";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Expenses</h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length} entries · {formatMoney(total, currency)} total
          </p>
        </div>
        <button
          onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background hover-lift"
        >
          <Plus className="h-4 w-4" />
          {adding ? "Close" : "New expense"}
        </button>
      </div>

      {adding && (
        <div className="card-luxe p-5">
          <QuickExpenseForm
            onAdd={(e) => {
              onAdd(e);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      <div className="card-luxe p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes or category"
              className={`${inputCls} w-full pl-9`}
            />
          </div>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value as Category | "all")}
            className={inputCls}
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={inputCls}
          >
            <option value="all">All months</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card-luxe overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-muted-foreground">No expenses match your filters.</p>
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[110px_140px_1fr_120px_100px] gap-2 border-b border-border px-5 py-3 text-xs uppercase tracking-widest text-muted-foreground sm:grid">
              <span>Date</span>
              <span>Category</span>
              <span>Note</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Actions</span>
            </div>
            <ul className="divide-y divide-border">
              {filtered.map((e) =>
                editingId === e.id ? (
                  <li key={e.id} className="p-5 bg-[#070707]">
                    <QuickExpenseForm
                      initial={e}
                      submitLabel="Save changes"
                      onAdd={(patch) => {
                        onUpdate(e.id, patch);
                        setEditingId(null);
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  </li>
                ) : (
                  <li
                    key={e.id}
                    className="grid grid-cols-2 gap-2 px-4 py-3 sm:grid-cols-[110px_140px_1fr_120px_100px] sm:px-5"
                  >
                    <span className="text-sm text-muted-foreground">
                      {new Date(e.date).toLocaleDateString()}
                    </span>
                    <span className="text-sm">{e.category}</span>
                    <span className="col-span-2 truncate text-sm sm:col-span-1">
                      {e.note || <span className="text-muted-foreground">—</span>}
                    </span>
                    <span className="text-sm font-semibold sm:text-right">
                      {formatMoney(e.amount, currency)}
                    </span>
                    <div className="col-span-2 flex items-center justify-end gap-2 sm:col-span-1">
                      <button
                        onClick={() => setEditingId(e.id)}
                        className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this expense?")) onDelete(e.id);
                        }}
                        className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-[oklch(0.72_0.22_25)]"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ),
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
