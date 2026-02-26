"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { MonthlyMatchData } from "@/lib/types";

interface TooltipEntry {
  color?: string;
  name?: string;
  value?: number | string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-background p-3 text-sm shadow-md">
      <p className="font-semibold mb-2 text-foreground">{label}</p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="flex items-center gap-2 text-muted-foreground leading-6"
        >
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs">{entry.name}:</span>
          <span className="font-mono font-semibold text-foreground ml-auto pl-4">
            {entry.value}
          </span>
        </p>
      ))}
    </div>
  );
};

export function MatchActivityChart({ data }: { data: MonthlyMatchData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 4, right: 12, bottom: 0, left: -8 }}>
        <defs>
          <linearGradient id="fillResumes" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.22} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillInquiries" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.22} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillLeases" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.28} />
            <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.5}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
          formatter={(value) => (
            <span style={{ color: "var(--muted-foreground)" }}>{value}</span>
          )}
        />
        <Area
          type="monotone"
          dataKey="newResumes"
          name="New Resumes"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#fillResumes)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="inquiriesSent"
          name="Inquiries Sent"
          stroke="var(--chart-2)"
          strokeWidth={2}
          fill="url(#fillInquiries)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="leasesCompleted"
          name="Leases Completed"
          stroke="var(--chart-3)"
          strokeWidth={2}
          fill="url(#fillLeases)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
