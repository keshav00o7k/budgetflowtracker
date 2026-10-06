import type { AppData } from "@/lib/budget/types";
import { formatMoney, formatMonthLabel } from "@/lib/budget/utils";

export default function HistoryPage({ data }: { data: AppData }) {
  const currency = data.settings.currency;
  const history = data.history;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Monthly History</h2>
        <p className="text-sm text-muted-foreground">
          Past months with surplus, deficit, and next-budget suggestions.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="card-luxe p-10 text-center">
          <p className="text-sm text-muted-foreground">No past months yet. Come back later.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {history.map((h) => {
            const positive = h.delta >= 0;
            return (
              <div key={h.month} className="card-luxe hover-lift p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {formatMonthLabel(h.month)}
                  </h3>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs ${
                      positive
                        ? "border-[oklch(0.4_0.15_150)] text-[oklch(0.78_0.17_150)]"
                        : "border-[oklch(0.4_0.18_25)] text-[oklch(0.75_0.22_25)]"
                    }`}
                  >
                    {positive ? "Surplus" : "Deficit"}
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Stat label="Budget" value={formatMoney(h.budget, currency)} />
                  <Stat label="Spent" value={formatMoney(h.spent, currency)} />
                  <Stat
                    label={positive ? "Saved" : "Overspent"}
                    value={formatMoney(Math.abs(h.delta), currency)}
                    tone={positive ? "positive" : "negative"}
                  />
                  <Stat
                    label="Suggested next"
                    value={formatMoney(h.suggestedNext, currency)}
                  />
                </dl>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "positive" | "negative" | "neutral";
}) {
  const color =
    tone === "positive"
      ? "text-[oklch(0.78_0.17_150)]"
      : tone === "negative"
        ? "text-[oklch(0.75_0.22_25)]"
        : "text-foreground";
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className={`mt-1 font-medium ${color}`}>{value}</dd>
    </div>
  );
}
