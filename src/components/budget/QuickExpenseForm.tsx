import { useState } from "react";
import type { Category, Expense } from "@/lib/budget/types";
import { CATEGORIES } from "@/lib/budget/types";

interface Props {
  onAdd: (e: Omit<Expense, "id">) => void;
  initial?: Partial<Expense>;
  submitLabel?: string;
  onCancel?: () => void;
}

export default function QuickExpenseForm({
  onAdd,
  initial,
  submitLabel = "Add expense",
  onCancel,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [amount, setAmount] = useState(initial?.amount ? String(initial.amount) : "");
  const [date, setDate] = useState(initial?.date ?? today);
  const [note, setNote] = useState(initial?.note ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? "Food");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(amount);
    if (!isFinite(n) || n <= 0) return;
    onAdd({ amount: n, date, note: note.trim(), category });
    if (!initial) {
      setAmount("");
      setNote("");
    }
  };

  const inputCls =
    "w-full rounded-lg border border-border bg-[#0a0a0a] px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-[oklch(0.45_0_0)]";

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <input
        type="number"
        inputMode="decimal"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className={inputCls}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={inputCls}
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        className={inputCls}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (optional)"
        className={inputCls}
      />
      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background hover-lift"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground hover-lift"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
