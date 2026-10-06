import { useMemo, useState } from "react";
import type { AppData, Expense } from "@/lib/budget/types";
import {
  formatMoney,
  formatMonthLabel,
  suggestNextBudget,
} from "@/lib/budget/utils";
import BudgetSetter from "./BudgetSetter";
import QuickExpenseForm from "./QuickExpenseForm";
import { TrendingDown, TrendingUp, Wallet, Target } from "lucide-react";

interface Props {
  data: AppData;
  month: string;
  budget: number;
  spent: number;
  monthExpenses: Expense[];
  onSetBudget: (amount: number) => void;
  onAddExpense: (e: Omit<Expense, "id">) => void;
}

export default function Dashboard({
  data,
  month,
  budget,
  spent,
  monthExpenses,
  onSetBudget,
  onAddExpense,
}: Props) {
  const [editingBudget, setEditingBudget] = useState(budget === 0);
  const currency = data.settings.currency;
  const remaining = budget - spent;
  const isOver = remaining < 0;
  const progress = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;

  const lastMonth = data.history[0];
  const suggestedFromLast = lastMonth
    ? suggestNextBudget(lastMonth.budget, lastMonth.spent)
    : 0;

  const recent = useMemo(() => monthExpenses.slice(0, 5), [monthExpenses]);

  return (
    <div className="space-y-6">
      <section className="card-luxe p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {formatMonthLabel(month)}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Monthly Budget
            </h2>
            {lastMonth && (
              <p className="mt-1 text-sm text-muted-foreground">
                Suggested from last month: {formatMoney(suggestedFromLast, currency)}
              </p>
            )}
          </div>
          {!editingBudget && budget > 0 && (
            <button
              onClick={() => setEditingBudget(true)}
              className="rounded-lg border border-border bg-[#0a0a0a] px-4 py-2 text-sm hover-lift"
            >
              Edit budget
            </button>
          )}
        </div>
        {editingBudget || budget === 0 ? (
          <div className="mt-5">
            <BudgetSetter
              initial={budget || suggestedFromLast}
              suggested={suggestedFromLast}
              currency={currency}
              onSave={(amount) => {
                onSetBudget(amount);
                setEditingBudget(false);
              }}
              onCancel={budget > 0 ? () => setEditingBudget(false) : undefined}
            />
          </div>
        ) : null}
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Budget"
          value={formatMoney(budget, currency)}
        />
        <StatCard
          icon={<Wallet className="h-4 w-4" />}
          label="Spent"
          value={formatMoney(spent, currency)}
        />
        <StatCard
          icon={isOver ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
          label="Remaining"
          value={formatMoney(remaining, currency)}
          tone={isOver ? "negative" : "positive"}
        />
        <StatCard
          icon={isOver ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
          label="Status"
          value={
            budget === 0
              ? "—"
              : isOver
                ? `${formatMoney(Math.abs(remaining), currency)} Over`
                : `${formatMoney(remaining, currency)} Saved`
          }
          tone={budget === 0 ? "neutral" : isOver ? "negative" : "positive"}
        />
      </section>

      <section className="card-luxe p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Budget Utilization
          </h3>
          <span className="text-sm font-semibold">{progress.toFixed(0)}%</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#101010] border border-border">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: isOver
                ? "linear-gradient(90deg, oklch(0.55 0.22 25), oklch(0.7 0.22 25))"
                : "linear-gradient(90deg, oklch(0.65 0.16 150), oklch(0.8 0.18 150))",
            }}
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {budget === 0
            ? "Set a budget to begin tracking."
            : isOver
              ? `You are ${formatMoney(Math.abs(remaining), currency)} over budget this month.`
              : `${formatMoney(remaining, currency)} remaining this month.`}
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card-luxe p-5 sm:p-6">
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Quick Add Expense
          </h3>
          <div className="mt-4">
            <QuickExpenseForm onAdd={onAddExpense} />
          </div>
        </div>

        <div className="card-luxe p-5 sm:p-6">
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Recent Expenses
          </h3>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No expenses yet this month.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {recent.map((e) => (
                <li key={e.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {e.note || e.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {e.category} · {new Date(e.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="ml-3 text-sm font-semibold">
                    {formatMoney(e.amount, currency)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "positive" | "negative" | "neutral";
}) {
  const color =
    tone === "positive"
      ? "text-[oklch(0.78_0.17_150)]"
      : tone === "negative"
        ? "text-[oklch(0.72_0.22_25)]"
        : "text-foreground";
  return (
    <div className="card-luxe hover-lift p-4 sm:p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs uppercase tracking-widest">{label}</span>
      </div>
      <p className={`mt-2 text-lg font-semibold tracking-tight sm:text-xl ${color}`}>
        {value}
      </p>
    </div>
  );
}
