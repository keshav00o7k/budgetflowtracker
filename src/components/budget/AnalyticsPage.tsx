import { useMemo } from "react";
import type { AppData } from "@/lib/budget/types";
import { CATEGORIES } from "@/lib/budget/types";
import {
  currentMonth,
  formatMoney,
  formatMonthLabel,
  getBudgetForMonth,
  getExpensesForMonth,
  monthKey,
  totalSpent,
} from "@/lib/budget/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "oklch(0.78 0.15 80)",
  "oklch(0.7 0.17 200)",
  "oklch(0.72 0.18 150)",
  "oklch(0.7 0.2 320)",
  "oklch(0.75 0.2 30)",
  "oklch(0.8 0.14 100)",
  "oklch(0.65 0.18 260)",
  "oklch(0.7 0.2 10)",
  "oklch(0.6 0.05 260)",
];

export default function AnalyticsPage({ data }: { data: AppData }) {
  const currency = data.settings.currency;
  const cur = currentMonth();

  const byCategory = useMemo(() => {
    const monthExp = getExpensesForMonth(data, cur);
    return CATEGORIES.map((c) => ({
      name: c,
      value: monthExp.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0),
    })).filter((r) => r.value > 0);
  }, [data, cur]);

  const trend = useMemo(() => {
    const months = new Set<string>();
    data.expenses.forEach((e) => months.add(monthKey(e.date)));
    data.budgets.forEach((b) => months.add(b.month));
    months.add(cur);
    return Array.from(months)
      .sort()
      .slice(-12)
      .map((m) => ({
        month: m.slice(5),
        full: m,
        spent: totalSpent(getExpensesForMonth(data, m)),
        budget: getBudgetForMonth(data, m),
      }));
  }, [data, cur]);

  const empty = data.expenses.length === 0;

  if (empty) {
    return (
      <div className="card-luxe p-10 text-center">
        <h2 className="text-xl font-semibold tracking-tight">Analytics</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add expenses to see spending breakdowns and trends.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Visualize spending patterns and budget performance.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card-luxe p-5">
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Spending by Category · {formatMonthLabel(cur)}
          </h3>
          <div className="mt-4 h-72">
            {byCategory.length === 0 ? (
              <EmptyChart text="No spending this month yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#000" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => formatMoney(v, currency)}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#aaa" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card-luxe p-5">
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Monthly Spending Trend
          </h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid stroke="#1a1a1a" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#666" tick={{ fontSize: 12 }} />
                <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number) => formatMoney(v, currency)}
                />
                <Line
                  type="monotone"
                  dataKey="spent"
                  stroke="oklch(0.78 0.15 80)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-luxe p-5 lg:col-span-2">
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Budget vs Actual
          </h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid stroke="#1a1a1a" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#666" tick={{ fontSize: 12 }} />
                <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number) => formatMoney(v, currency)}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#aaa" }} />
                <Bar dataKey="budget" fill="oklch(0.5 0 0)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" fill="oklch(0.78 0.15 80)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  background: "#050505",
  border: "1px solid #222",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
};

function EmptyChart({ text }: { text: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
