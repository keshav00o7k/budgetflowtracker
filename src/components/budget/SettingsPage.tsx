import { useRef } from "react";
import type { AppData } from "@/lib/budget/types";
import { Download, Upload, Trash2 } from "lucide-react";

interface Props {
  data: AppData;
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}

export default function SettingsPage({ data, onExport, onImport, onReset }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const expenseCount = data.expenses.length;
  const budgetCount = data.budgets.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Settings & Data</h2>
        <p className="text-sm text-muted-foreground">
          Manage backups and reset your local data.
        </p>
      </div>

      <div className="card-luxe p-5 sm:p-6">
        <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Storage Summary
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Expenses" value={expenseCount} />
          <Stat label="Budgets" value={budgetCount} />
          <Stat label="Past months" value={data.history.length} />
          <Stat label="Currency" value={data.settings.currency} />
        </div>
      </div>

      <div className="card-luxe p-5 sm:p-6">
        <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Backup & Restore
        </h3>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onExport}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background hover-lift"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-[#0a0a0a] px-4 py-2.5 text-sm hover-lift"
          >
            <Upload className="h-4 w-4" />
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="card-luxe p-5 sm:p-6">
        <h3 className="text-sm font-medium uppercase tracking-widest text-[oklch(0.75_0.22_25)]">
          Danger Zone
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Permanently delete all budgets, expenses, and history from this device.
        </p>
        <button
          onClick={() => {
            if (confirm("Delete ALL data? This cannot be undone.")) onReset();
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[oklch(0.4_0.18_25)] bg-[oklch(0.18_0.05_25)] px-4 py-2.5 text-sm text-[oklch(0.85_0.18_25)] hover-lift"
        >
          <Trash2 className="h-4 w-4" />
          Reset all data
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
