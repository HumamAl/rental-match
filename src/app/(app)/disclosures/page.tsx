"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  screeningReports,
  rentalResumes,
  propertyManagers,
} from "@/data/mock-data";
import type { ReportStatus, ReportType } from "@/lib/types";

type SortKey = "requestedDate" | "completedDate" | "status";

function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const config: Record<
    ReportStatus,
    {
      label: string;
      color: "success" | "warning" | "destructive";
      icon: typeof CheckCircle2;
    }
  > = {
    "Report Ready": { label: "Report Ready", color: "success", icon: CheckCircle2 },
    Pending: { label: "Pending", color: "warning", icon: Clock },
    Expired: { label: "Expired", color: "destructive", icon: AlertTriangle },
  };

  const c = config[status];
  const colorClass = {
    success: "text-[color:var(--success)] bg-[color:var(--success)]/10",
    warning: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    destructive: "text-destructive bg-destructive/10",
  }[c.color];

  const Icon = c.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border-0 rounded-full flex items-center gap-1",
        colorClass
      )}
    >
      <Icon className="w-3 h-3" />
      {c.label}
    </Badge>
  );
}

function ReportTypeBadge({ type }: { type: ReportType }) {
  const labels: Record<ReportType, string> = {
    credit: "Credit",
    background: "Background",
    eviction: "Eviction",
  };
  const icons: Record<ReportType, typeof FileText> = {
    credit: FileText,
    background: ShieldCheck,
    eviction: AlertTriangle,
  };
  const Icon = icons[type];

  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <Icon className="w-3.5 h-3.5" />
      {labels[type]}
    </span>
  );
}

function AcknowledgedBadge({ acknowledged }: { acknowledged: boolean }) {
  if (acknowledged) {
    return (
      <span className="flex items-center gap-1 text-xs text-[color:var(--success)]">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Acknowledged
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-[color:var(--warning)]">
      <Clock className="w-3.5 h-3.5" />
      Awaiting
    </span>
  );
}

// Summary stat card
function StatCard({
  label,
  value,
  sublabel,
  color,
}: {
  label: string;
  value: number | string;
  sublabel?: string;
  color?: "success" | "warning" | "destructive";
}) {
  const colorClass = color
    ? {
        success: "text-[color:var(--success)]",
        warning: "text-[color:var(--warning)]",
        destructive: "text-destructive",
      }[color]
    : "text-foreground";

  return (
    <Card className="shadow-md border border-border/40 p-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={cn("text-2xl font-bold tabular-nums font-mono", colorClass)}>
        {value}
      </p>
      {sublabel && (
        <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
      )}
    </Card>
  );
}

export default function DisclosuresPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("requestedDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  // Enrich screening reports with tenant and PM names
  const enriched = useMemo(() => {
    return screeningReports.map((r) => {
      const resume = rentalResumes.find((rr) => rr.id === r.resumeId);
      const pm = propertyManagers.find((p) => p.id === r.managerId);
      return {
        ...r,
        tenantName: resume
          ? `${resume.firstName} ${resume.lastName}`
          : "Unknown",
        pmName: pm?.contactName ?? "Unknown",
        pmCompany: pm?.companyName ?? "",
      };
    });
  }, []);

  const displayed = useMemo(() => {
    return enriched
      .filter((r) => {
        const matchStatus =
          statusFilter === "all" || r.status === statusFilter;
        const matchType = typeFilter === "all" || r.reportType === typeFilter;
        const matchSearch =
          search === "" ||
          r.tenantName.toLowerCase().includes(search.toLowerCase()) ||
          r.pmName.toLowerCase().includes(search.toLowerCase()) ||
          r.id.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchType && matchSearch;
      })
      .sort((a, b) => {
        let av: number, bv: number;
        if (sortKey === "completedDate") {
          av = a.completedDate ? new Date(a.completedDate).getTime() : 0;
          bv = b.completedDate ? new Date(b.completedDate).getTime() : 0;
        } else if (sortKey === "status") {
          const order: Record<ReportStatus, number> = {
            "Report Ready": 1,
            Pending: 2,
            Expired: 3,
          };
          av = order[a.status];
          bv = order[b.status];
        } else {
          av = new Date(a.requestedDate).getTime();
          bv = new Date(b.requestedDate).getTime();
        }
        return sortDir === "asc" ? av - bv : bv - av;
      });
  }, [enriched, search, statusFilter, typeFilter, sortKey, sortDir]);

  function formatDate(iso: string | null | undefined) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Audit trail events derived from report data
  const auditEvents = useMemo(() => {
    const events: { date: string; description: string; type: "request" | "complete" | "acknowledge" | "expire" }[] = [];
    enriched.forEach((r) => {
      events.push({
        date: r.requestedDate,
        description: `${r.reportType.charAt(0).toUpperCase() + r.reportType.slice(1)} report requested for ${r.tenantName} by ${r.pmCompany}`,
        type: "request",
      });
      if (r.completedDate) {
        events.push({
          date: r.completedDate,
          description: `${r.reportType.charAt(0).toUpperCase() + r.reportType.slice(1)} report completed for ${r.tenantName}`,
          type: "complete",
        });
      }
      if (r.acknowledgedDate) {
        events.push({
          date: r.acknowledgedDate,
          description: `${r.tenantName} acknowledged disclosure request`,
          type: "acknowledge",
        });
      }
      if (r.status === "Expired" && r.expiresDate) {
        events.push({
          date: r.expiresDate,
          description: `${r.reportType} report for ${r.tenantName} expired`,
          type: "expire",
        });
      }
    });
    return events.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [enriched]);

  // Summary stats
  const totalReady = screeningReports.filter((r) => r.status === "Report Ready").length;
  const totalPending = screeningReports.filter((r) => r.status === "Pending").length;
  const totalExpired = screeningReports.filter((r) => r.status === "Expired").length;
  const notAcknowledged = screeningReports.filter((r) => !r.acknowledged).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Disclosures &amp; Screening</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compliance audit log for screening reports, acknowledgements, and disclosure history
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Fair Housing Act compliant</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Reports Ready"
          value={totalReady}
          sublabel="Available for review"
          color="success"
        />
        <StatCard
          label="Pending Reports"
          value={totalPending}
          sublabel="Awaiting completion"
          color="warning"
        />
        <StatCard
          label="Expired Reports"
          value={totalExpired}
          sublabel="Renewal required"
          color="destructive"
        />
        <StatCard
          label="Unacknowledged"
          value={notAcknowledged}
          sublabel="Tenant action needed"
          color={notAcknowledged > 0 ? "warning" : undefined}
        />
      </div>

      {/* Screening Reports Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Screening Reports</h2>

        {/* Filter bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by tenant, PM, or report ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Report Ready">Report Ready</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Report Types</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="background">Background</SelectItem>
              <SelectItem value="eviction">Eviction</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground shrink-0">
            {displayed.length} {displayed.length === 1 ? "report" : "reports"}
          </span>
        </div>

        {/* Table */}
        <Card className="p-0 overflow-hidden shadow-md border border-border/40">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-muted/40 text-xs font-medium text-muted-foreground pl-4">
                    Report ID
                  </TableHead>
                  <TableHead className="bg-muted/40 text-xs font-medium text-muted-foreground">
                    Tenant
                  </TableHead>
                  <TableHead className="bg-muted/40 text-xs font-medium text-muted-foreground">
                    Requested By
                  </TableHead>
                  <TableHead className="bg-muted/40 text-xs font-medium text-muted-foreground">
                    Report Type
                  </TableHead>
                  <TableHead
                    className="bg-muted/40 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors duration-150"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortKey === "status" ? (
                        sortDir === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : null}
                    </div>
                  </TableHead>
                  <TableHead className="bg-muted/40 text-xs font-medium text-muted-foreground">
                    Acknowledged
                  </TableHead>
                  <TableHead
                    className="bg-muted/40 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors duration-150"
                    onClick={() => handleSort("requestedDate")}
                  >
                    <div className="flex items-center gap-1">
                      Requested
                      {sortKey === "requestedDate" ? (
                        sortDir === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : null}
                    </div>
                  </TableHead>
                  <TableHead
                    className="bg-muted/40 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors duration-150"
                    onClick={() => handleSort("completedDate")}
                  >
                    <div className="flex items-center gap-1">
                      Completed
                      {sortKey === "completedDate" ? (
                        sortDir === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : null}
                    </div>
                  </TableHead>
                  <TableHead className="bg-muted/40 text-xs font-medium text-muted-foreground">
                    Expires
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-32 text-center text-sm text-muted-foreground"
                    >
                      No screening reports match this filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayed.map((report) => (
                    <>
                      <TableRow
                        key={report.id}
                        className="hover:bg-[color:var(--surface-hover)] transition-colors duration-150 cursor-pointer"
                        onClick={() =>
                          setExpandedId(
                            expandedId === report.id ? null : report.id
                          )
                        }
                      >
                        <TableCell className="pl-4">
                          <div className="flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5 text-muted-foreground/40" />
                            <span className="font-mono text-xs text-muted-foreground">
                              {report.id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium">{report.tenantName}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground">{report.pmName}</p>
                          <p className="text-xs text-muted-foreground/60">{report.pmCompany}</p>
                        </TableCell>
                        <TableCell>
                          <ReportTypeBadge type={report.reportType} />
                        </TableCell>
                        <TableCell>
                          <ReportStatusBadge status={report.status} />
                        </TableCell>
                        <TableCell>
                          <AcknowledgedBadge acknowledged={report.acknowledged} />
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {formatDate(report.requestedDate)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {formatDate(report.completedDate)}
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {report.expiresDate ? (
                            <span
                              className={cn(
                                report.status === "Expired"
                                  ? "text-destructive"
                                  : "text-muted-foreground"
                              )}
                            >
                              {formatDate(report.expiresDate)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedId === report.id && (
                        <TableRow key={`${report.id}-detail`}>
                          <TableCell
                            colSpan={9}
                            className="bg-muted/20 p-4 border-t border-border/30"
                          >
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                  Tenant Resume ID
                                </p>
                                <p className="font-mono text-xs">{report.resumeId}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                  Requesting PM ID
                                </p>
                                <p className="font-mono text-xs">{report.managerId}</p>
                              </div>
                              {report.acknowledgedDate && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                    Acknowledged On
                                  </p>
                                  <p className="font-mono text-xs text-[color:var(--success)]">
                                    {formatDate(report.acknowledgedDate)}
                                  </p>
                                </div>
                              )}
                              {!report.acknowledged && (
                                <div className="col-span-2 md:col-span-3">
                                  <div className="flex items-center gap-2 text-xs text-[color:var(--warning)] bg-[color:var(--warning)]/5 rounded-md px-3 py-2 border border-[color:var(--warning)]/20">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    Tenant has not yet acknowledged this disclosure request. A reminder can be sent through the Messages tab.
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Audit Trail */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Compliance Audit Trail</h2>
          <Badge
            variant="outline"
            className="text-xs font-mono text-muted-foreground border-border/60"
          >
            {auditEvents.length} events
          </Badge>
        </div>

        <Card className="shadow-md border border-border/40 p-4">
          <div className="space-y-0">
            {auditEvents.slice(0, 12).map((event, index) => {
              const iconMap = {
                request: <FileText className="w-3.5 h-3.5 text-muted-foreground" />,
                complete: <CheckCircle2 className="w-3.5 h-3.5 text-[color:var(--success)]" />,
                acknowledge: <ShieldCheck className="w-3.5 h-3.5 text-primary" />,
                expire: <AlertTriangle className="w-3.5 h-3.5 text-destructive" />,
              };
              const lineColorMap = {
                request: "border-border/40",
                complete: "border-[color:var(--success)]/30",
                acknowledge: "border-primary/30",
                expire: "border-destructive/30",
              };

              return (
                <div key={index} className="flex items-start gap-3 py-2.5 relative">
                  {/* Timeline line */}
                  {index < auditEvents.slice(0, 12).length - 1 && (
                    <div
                      className={cn(
                        "absolute left-[15px] top-8 bottom-0 w-px border-l",
                        lineColorMap[event.type]
                      )}
                    />
                  )}

                  {/* Icon */}
                  <div className="w-8 h-8 rounded-full bg-muted/50 border border-border/40 flex items-center justify-center shrink-0 z-10">
                    {iconMap[event.type]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm text-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {auditEvents.length > 12 && (
            <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border/40 mt-2">
              Showing 12 of {auditEvents.length} audit events
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
