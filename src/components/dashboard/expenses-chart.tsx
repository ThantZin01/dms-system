"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Receipt } from "lucide-react";

interface ChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export function ExpensesChart({ data }: ChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center py-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--muted)] text-slate-400 mb-2.5">
          <Receipt className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-[var(--foreground)]">No expenses logged yet</p>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          Expense distribution by category will appear here.
        </p>
      </div>
    );
  }

  const isDark = mounted && resolvedTheme === "dark";
  const gridColor = isDark ? "rgba(148, 163, 184, 0.12)" : "#E2E8F0";
  const axisColor = isDark ? "#94A3B8" : "#64748B";
  const barColors = isDark
    ? ["#2D7DD2", "#2CA548", "#3B82F6", "#10B981", "#64748B"]
    : ["#002B5B", "#146B26", "#0A4D8C", "#1E8A35", "#475569"];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 4 }} barCategoryGap="24%">
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
        <XAxis
          dataKey="name"
          stroke={axisColor}
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          stroke={axisColor}
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={68}
          tickFormatter={(value) =>
            value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
          }
        />
        <Tooltip
          cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,43,91,0.04)", radius: 6 }}
          content={({ active, payload, label }) => {
            if (!active || !payload || !payload.length) return null;
            return (
              <div className="surface-elevated rounded-xl px-3.5 py-2.5 text-xs">
                <p className="font-semibold text-[var(--muted-foreground)] mb-1">{label}</p>
                <p className="text-sm font-bold text-[var(--foreground)] tabular-nums">
                  {Number(payload[0].value).toLocaleString()} Ks
                </p>
              </div>
            );
          }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={44}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
