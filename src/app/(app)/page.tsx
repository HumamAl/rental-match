"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  FileText,
  Users,
  TrendingUp,
  Home,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Star,
  MapPin,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";
import {
  dashboardStats,
  monthlyMatchData,
  resumeStatusBreakdown,
  rentalResumes,
  leadsAndInquiries,
} from "@/data/mock-data";
import type { RentalResume, LeadAndInquiry } from "@/lib/types";

// ─── SSR-safe chart imports ───────────────────────────────────────────────────
const MatchActivityChart = dynamic(
  () =>
    import("@/components/dashboard/match-activity-chart").then(
      (m) => m.MatchActivityChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] rounded-lg bg-muted/30 animate-pulse" />
    ),
  }
);

const ResumeStatusChart = dynamic(
  () =>
    import("@/components/dashboard/resume-status-chart").then(
      (m) => m.ResumeStatusChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] rounded-lg bg-muted/30 animate-pulse" />
    ),
  }
);

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ─── Stat card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: number;
  format?: "number" | "percent" | "ratio" | "days";
  change: number;
  description: string;
  icon: React.ReactNode;
  index: number;
}

function StatCard({
  title,
  value,
  format = "number",
  change,
  description,
  icon,
  index,
}: StatCardProps) {
  const { count, ref } = useCountUp(value, 1100 + index * 80);
  const isPositive = change >= 0;

  function formatCount(n: number): string {
    if (format === "percent") return `${n.toFixed(1)}%`;
    if (format === "ratio") return `${n.toFixed(1)}x`;
    if (format === "days") return `${n}d`;
    if (n >= 1000) return n.toLocaleString();
    return n.toString();
  }

  // For decimals we display the live count but snap to real value for ratio/percent
  const displayValue =
    format === "percent" || format === "ratio"
      ? formatCount(count / 10)
      : formatCount(count);

  return (
    <div
      ref={ref}
      className="aesthetic-card p-5 animate-fade-up-in"
      style={{ animationDelay: `${index * 50}ms`, animationDuration: "150ms" }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground leading-tight">
          {title}
        </p>
        <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0 ml-2">
          {icon}
        </div>
      </div>

      <div className="text-3xl font-bold font-mono tabular-nums bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-none mb-2">
        {displayValue}
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        {isPositive ? (
          <ArrowUpRight className="w-3.5 h-3.5 text-success shrink-0" />
        ) : (
          <ArrowDownRight className="w-3.5 h-3.5 text-destructive shrink-0" />
        )}
        <span
          className={cn(
            "font-medium font-mono",
            isPositive ? "text-success" : "text-destructive"
          )}
        >
          {isPositive ? "+" : ""}
          {change.toFixed(1)}%
        </span>
        <span className="text-muted-foreground">&middot; {description}</span>
      </div>
    </div>
  );
}

// ─── Today's match feed ───────────────────────────────────────────────────────
function getCreditColor(range: RentalResume["creditRange"]): string {
  if (range === "720+") return "text-success";
  if (range === "680-719") return "text-warning";
  return "text-muted-foreground";
}

function getStatusBadgeClass(status: RentalResume["resumeStatus"]): string {
  if (status === "Looking")
    return "bg-primary/10 text-primary border border-primary/20";
  if (status === "Matched")
    return "bg-success/10 text-success border border-success/20";
  if (status === "Paused")
    return "bg-warning/10 text-warning-foreground border border-warning/20";
  if (status === "Leased")
    return "bg-muted text-muted-foreground border border-border/60";
  return "bg-muted text-muted-foreground border border-border/60";
}

function getLeadStatusBadge(status: LeadAndInquiry["status"]): string {
  if (status === "Approved") return "text-success";
  if (status === "New Match" || status === "Inquiry Sent") return "text-primary";
  if (status === "Declined" || status === "Withdrew") return "text-destructive";
  return "text-muted-foreground";
}

// ─── Main page ────────────────────────────────────────────────────────────────
type Period = "7d" | "30d" | "90d";
type FeedFilter = "All" | "Looking" | "Matched";

const PERIOD_LABELS: Record<Period, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("All");

  // Chart data filtered by period
  const chartData = useMemo(() => {
    if (period === "7d") return monthlyMatchData.slice(-2); // last 2 months as proxy
    if (period === "30d") return monthlyMatchData.slice(-6);
    return monthlyMatchData;
  }, [period]);

  // Today's matches feed — filtered
  const matchesFeed = useMemo(() => {
    const active = rentalResumes.filter(
      (r) => r.resumeStatus !== "Incomplete" && r.resumeStatus !== "Leased"
    );
    if (feedFilter === "All") return active.slice(0, 8);
    return active.filter((r) => r.resumeStatus === feedFilter).slice(0, 8);
  }, [feedFilter]);

  // Pipeline recent activity
  const recentActivity = useMemo(() => {
    return leadsAndInquiries
      .slice()
      .sort(
        (a, b) =>
          new Date(b.lastActivity).getTime() -
          new Date(a.lastActivity).getTime()
      )
      .slice(0, 6);
  }, []);

  const stats = [
    {
      title: "Active Rental Resumes",
      value: dashboardStats.totalRentalResumes,
      format: "number" as const,
      change: dashboardStats.resumesChange,
      description: "1,024 actively searching",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      title: "Qualified Matches",
      value: dashboardStats.qualifiedMatches,
      format: "number" as const,
      change: dashboardStats.matchesChange,
      description: "showing stage or beyond",
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: "Leases Completed",
      value: dashboardStats.leasesThisMonth,
      format: "number" as const,
      change: dashboardStats.leasesChange,
      description: "vs 13 last month — spring ramp",
      icon: <Home className="w-4 h-4" />,
    },
    {
      title: "Inquiry-to-Showing Rate",
      value: Math.round(dashboardStats.inquiryToShowingRate * 10),
      format: "percent" as const,
      change: dashboardStats.inquiryToShowingChange,
      description: "platform benchmark 38%",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      title: "Avg Income-to-Rent Ratio",
      value: Math.round(dashboardStats.avgIncomeToRentRatio * 10),
      format: "ratio" as const,
      change: 4.2,
      description: "above 3x recommended floor",
      icon: <Star className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Match Pipeline Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your property portfolio · {dashboardStats.activeListings} active
            listings · Feb 2026
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
          <span className="text-xs text-muted-foreground">Live platform data</span>
        </div>
      </div>

      {/* ── KPI Stat Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            format={stat.format}
            change={stat.change}
            description={stat.description}
            icon={stat.icon ?? <Users className="w-4 h-4" />}
            index={index}
          />
        ))}
      </div>

      {/* ── Period Filter + Primary Chart ───────────────────────────── */}
      <div className="aesthetic-card p-0 overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Match Activity Trends</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              New Rental Resumes vs. Inquiries Sent vs. Leases Completed
            </p>
          </div>
          <div className="flex gap-1.5">
            {(["7d", "30d", "90d"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-md border transition-colors",
                  "duration-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  period === p
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/60 text-muted-foreground hover:bg-muted/50"
                )}
                style={{ transitionDuration: "var(--dur-fast)" }}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 pt-4 pb-6">
          <MatchActivityChart data={chartData} />
        </div>
      </div>

      {/* ── Bottom row: matches feed + pipeline activity ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Today's New Matches Feed (3/5) */}
        <div className="lg:col-span-3 aesthetic-card p-0 overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-border/40 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Today's New Matches</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Rental Resumes matching your listing criteria
              </p>
            </div>
            {/* Feed filter */}
            <div className="flex gap-1">
              {(["All", "Looking", "Matched"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFeedFilter(f)}
                  className={cn(
                    "px-2.5 py-1 text-xs rounded-md transition-colors duration-100",
                    feedFilter === f
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  style={{ transitionDuration: "var(--dur-fast)" }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border/40">
            {matchesFeed.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No resumes match this filter.
              </div>
            ) : (
              matchesFeed.map((resume) => (
                <div
                  key={resume.id}
                  className="px-5 py-3.5 flex items-start gap-3 aesthetic-hover cursor-pointer"
                >
                  {/* Avatar initial */}
                  <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-semibold shrink-0 mt-0.5">
                    {resume.firstName[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">
                        {resume.firstName}{" "}
                        <span className="text-muted-foreground text-xs">
                          {resume.lastName[0]}.
                        </span>
                      </span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          getStatusBadgeClass(resume.resumeStatus)
                        )}
                      >
                        {resume.resumeStatus}
                      </span>
                      {resume.hasEvictionHistory && (
                        <span className="text-xs text-warning flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" />
                          Eviction
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {resume.locationCity}, {resume.locationState}
                      </span>
                      <span className="flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" />
                        <span className={getCreditColor(resume.creditRange)}>
                          {resume.creditRange}
                        </span>
                      </span>
                      <span>
                        {resume.incomeToRentRatio}x income ratio
                      </span>
                      <span>
                        ${resume.preferredRentRange.min.toLocaleString()}–$
                        {resume.preferredRentRange.max.toLocaleString()}/mo
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground shrink-0 text-right">
                    <div>{resume.bedrooms}BR</div>
                    <div className="mt-0.5">
                      {resume.viewCount} view{resume.viewCount !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column: Resume Status + Pipeline Activity (2/5) */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Resume Status Breakdown */}
          <div className="aesthetic-card p-0 overflow-hidden flex-1">
            <div className="px-5 pt-4 pb-3 border-b border-border/40">
              <h2 className="text-base font-semibold">Resume Status Breakdown</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {(1847).toLocaleString()} total active resumes
              </p>
            </div>
            <div className="px-3 pt-3 pb-4">
              <ResumeStatusChart data={resumeStatusBreakdown} />
            </div>
          </div>

          {/* Recent Pipeline Activity */}
          <div className="aesthetic-card p-0 overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-border/40">
              <h2 className="text-base font-semibold">Pipeline Activity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Latest lead status changes
              </p>
            </div>
            <div className="divide-y divide-border/40">
              {recentActivity.map((lead) => {
                const resume = rentalResumes.find(
                  (r) => r.id === lead.resumeId
                );
                return (
                  <div
                    key={lead.id}
                    className="px-5 py-2.5 flex items-center justify-between gap-2 aesthetic-hover cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">
                        {resume ? `${resume.firstName} ${resume.lastName[0]}.` : lead.resumeId}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 shrink-0" />
                        {new Date(lead.lastActivity).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium shrink-0",
                        getLeadStatusBadge(lead.status)
                      )}
                    >
                      {lead.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Proposal Banner ─────────────────────────────────────────── */}
      <div className="linear-card p-4 border-primary/15 bg-gradient-to-r from-primary/5 to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">
            This is a live demo built for{" "}
            {APP_CONFIG.clientName ?? APP_CONFIG.projectName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Humam · Full-Stack Developer · Available now
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/challenges"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            My approach &rarr;
          </a>
          <a
            href="/proposal"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            Work with me
          </a>
        </div>
      </div>
    </div>
  );
}
