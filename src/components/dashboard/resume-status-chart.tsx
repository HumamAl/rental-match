"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import type { ResumeStatusBreakdown } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  Looking: "var(--chart-1)",
  Matched: "var(--chart-3)",
  Paused: "var(--chart-5)",
  Leased: "var(--success)",
  Incomplete: "var(--muted-foreground)",
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value?: number | string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-background p-3 text-sm shadow-md">
      <p className="font-semibold mb-1 text-foreground">{label}</p>
      <p className="text-muted-foreground">
        <span className="font-mono font-semibold text-foreground">
          {payload[0]?.value?.toLocaleString()}
        </span>{" "}
        resumes
      </p>
    </div>
  );
};

export function ResumeStatusChart({ data }: { data: ResumeStatusBreakdown[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 12, bottom: 0, left: -8 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.5}
          vertical={false}
        />
        <XAxis
          dataKey="status"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--surface-hover)" }} />
        <Bar dataKey="count" name="Resumes" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.status}
              fill={STATUS_COLORS[entry.status] ?? "var(--chart-1)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
