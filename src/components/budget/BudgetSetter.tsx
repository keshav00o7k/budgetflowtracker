import { useState } from "react";
import { formatMoney } from "@/lib/budget/utils";

interface Props {
  initial: number;
  suggested: number;
  currency: string;
  onSave: (amount: number) => void;
  onCancel?: () => void;
}

export default function BudgetSetter({ initial, suggested, currency, onSave, onCancel }: Props) {
  const [value, setValue] = useState(String(initial || ""));

  const submit = () => {
    const n = Number(value);
    if (!isFinite(n) || n < 0) return;
    onSave(n);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center rounded-lg border border-border bg-[#0a0a0a] px-3">
        <span className="text-muted-foreground">{currency}</span>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter monthly budget"
          className="w-full bg-transparent px-3 py-3 text-base outline-none placeholder:text-muted-foreground"
        />
      </div>
      {suggested > 0 && (
        <button
          type="button"
          onClick={() => setValue(String(suggested))}
          className="rounded-lg border border-border bg-[#0a0a0a] px-4 py-3 text-sm text-muted-foreground hover-lift"
        >
          Use {formatMoney(suggested, currency)}
        </button>
      )}
      <button
        onClick={submit}
        className="rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background hover-lift"
      >
        Save budget
      </button>
      {onCancel && (
        <button
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground hover-lift"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
