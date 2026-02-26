"use client";

import { useState, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Eye,
  PawPrint,
  AlertTriangle,
  FileText,
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
import { rentalResumes } from "@/data/mock-data";
import type { RentalResume, ResumeStatus } from "@/lib/types";

type SortKey = "monthlyIncome" | "creditRange" | "viewCount" | "lastUpdated";

function StatusBadge({ status }: { status: ResumeStatus }) {
  const config: Record<
    ResumeStatus,
    { color: "success" | "warning" | "destructive" | "muted" }
  > = {
    Looking: { color: "success" },
    Matched: { color: "success" },
    Paused: { color: "warning" },
    Leased: { color: "muted" },
    Incomplete: { color: "destructive" },
  };

  const c = config[status] ?? { color: "muted" };

  const colorClass = {
    success: "text-[color:var(--success)] bg-[color:var(--success)]/10",
    warning: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    destructive: "text-destructive bg-destructive/10",
    muted: "text-muted-foreground bg-muted",
  }[c.color];

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium border-0 rounded-full", colorClass)}
    >
      {status}
    </Badge>
  );
}

function IncomeBadge({ source }: { source: RentalResume["incomeSource"] }) {
  const labels: Record<RentalResume["incomeSource"], string> = {
    employed: "Employed",
    "self-employed": "Self-Employed",
    "HCV voucher": "HCV Voucher",
    retired: "Retired",
    student: "Student",
  };

  const isVoucher = source === "HCV voucher";

  return (
    <span
      className={cn(
        "text-xs px-2 py-0.5 rounded-full font-medium",
        isVoucher
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      )}
    >
      {labels[source]}
    </span>
  );
}

const creditOrder: Record<string, number> = {
  "580-619": 1,
  "620-679": 2,
  "680-719": 3,
  "720+": 4,
};

export default function RentalResumesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("lastUpdated");
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

  const displayed = useMemo(() => {
    return rentalResumes
      .filter((r) => {
        const matchesStatus =
          statusFilter === "all" || r.resumeStatus === statusFilter;
        const matchesSearch =
          search === "" ||
          `${r.firstName} ${r.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          r.locationCity.toLowerCase().includes(search.toLowerCase()) ||
          r.locationState.toLowerCase().includes(search.toLowerCase()) ||
          r.id.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        let av: number, bv: number;
        if (sortKey === "creditRange") {
          av = creditOrder[a.creditRange] ?? 0;
          bv = creditOrder[b.creditRange] ?? 0;
        } else if (sortKey === "monthlyIncome") {
          av = a.monthlyIncome;
          bv = b.monthlyIncome;
        } else if (sortKey === "viewCount") {
          av = a.viewCount;
          bv = b.viewCount;
        } else {
          av = new Date(a.lastUpdated).getTime();
          bv = new Date(b.lastUpdated).getTime();
        }
        return sortDir === "asc" ? av - bv : bv - av;
      });
  }, [search, statusFilter, sortKey, sortDir]);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatCurrency(n: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  }

  const columns: {
    key: SortKey;
    label: string;
    sortable: boolean;
    align?: "right";
  }[] = [
    { key: "lastUpdated", label: "Tenant", sortable: false },
    { key: "lastUpdated", label: "Location", sortable: false },
    { key: "creditRange", label: "Credit Range", sortable: true },
    { key: "monthlyIncome", label: "Mo. Income", sortable: true, align: "right" },
    { key: "lastUpdated", label: "Income Source", sortable: false },
    { key: "viewCount", label: "Views", sortable: true, align: "right" },
    { key: "lastUpdated", label: "Status", sortable: true },
    { key: "lastUpdated", label: "Updated", sortable: true },
  ];

  const sortableKeys: SortKey[] = ["creditRange", "monthlyIncome", "viewCount", "lastUpdated"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rental Resumes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tenant credentials, income verification, and housing history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-mono">
            {rentalResumes.length} total resumes
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, city, or ID..."
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
            <SelectItem value="Looking">Looking</SelectItem>
            <SelectItem value="Matched">Matched</SelectItem>
            <SelectItem value="Paused">Paused</SelectItem>
            <SelectItem value="Leased">Leased</SelectItem>
            <SelectItem value="Incomplete">Incomplete</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length} {displayed.length === 1 ? "resume" : "resumes"}
        </span>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden shadow-md border border-border/40">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-muted/40 text-xs font-medium text-muted-foreground pl-4">
                  Tenant
                </TableHead>
                <TableHead className="bg-muted/40 text-xs font-medium text-muted-foreground">
                  Location
                </TableHead>
                {(["creditRange", "monthlyIncome"] as SortKey[]).map((key) => (
                  <TableHead
                    key={key}
                    className="bg-muted/40 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors duration-150"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center gap-1">
                      {key === "creditRange" ? "Credit Range" : "Mo. Income"}
                      {sortKey === key ? (
                        sortDir === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : null}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="bg-muted/40 text-xs font-medium text-muted-foreground">
                  Income Source
                </TableHead>
                <TableHead
                  className="bg-muted/40 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors duration-150"
                  onClick={() => handleSort("viewCount")}
                >
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Views
                    {sortKey === "viewCount" ? (
                      sortDir === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    ) : null}
                  </div>
                </TableHead>
                <TableHead className="bg-muted/40 text-xs font-medium text-muted-foreground">
                  Flags
                </TableHead>
                <TableHead className="bg-muted/40 text-xs font-medium text-muted-foreground">
                  Status
                </TableHead>
                <TableHead
                  className="bg-muted/40 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors duration-150"
                  onClick={() => handleSort("lastUpdated")}
                >
                  <div className="flex items-center gap-1">
                    Updated
                    {sortKey === "lastUpdated" ? (
                      sortDir === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    ) : null}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No rental resumes match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((resume) => (
                  <>
                    <TableRow
                      key={resume.id}
                      className="hover:bg-[color:var(--surface-hover)] transition-colors duration-150 cursor-pointer"
                      onClick={() =>
                        setExpandedId(
                          expandedId === resume.id ? null : resume.id
                        )
                      }
                    >
                      {/* Tenant */}
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                            {resume.firstName[0]}
                            {resume.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {resume.firstName} {resume.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {resume.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Location */}
                      <TableCell className="text-sm text-muted-foreground">
                        {resume.locationCity}, {resume.locationState}
                        <span className="text-xs ml-1 opacity-60">
                          ±{resume.preferredRadius}mi
                        </span>
                      </TableCell>

                      {/* Credit Range */}
                      <TableCell>
                        <span className="font-mono text-sm font-medium">
                          {resume.creditRange}
                        </span>
                      </TableCell>

                      {/* Monthly Income */}
                      <TableCell className="font-mono text-sm tabular-nums text-right">
                        {formatCurrency(resume.monthlyIncome)}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({resume.incomeToRentRatio}x)
                        </span>
                      </TableCell>

                      {/* Income Source */}
                      <TableCell>
                        <IncomeBadge source={resume.incomeSource} />
                      </TableCell>

                      {/* Views */}
                      <TableCell className="font-mono text-sm text-right tabular-nums">
                        {resume.viewCount > 8 ? (
                          <span className="text-primary font-semibold">
                            {resume.viewCount}
                          </span>
                        ) : (
                          resume.viewCount
                        )}
                      </TableCell>

                      {/* Flags */}
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {resume.pets && resume.pets.length > 0 && (
                            <span
                              title={`${resume.pets
                                .map((p) => `${p.count} ${p.type}`)
                                .join(", ")}`}
                            >
                              <PawPrint className="w-3.5 h-3.5 text-muted-foreground" />
                            </span>
                          )}
                          {resume.hasEvictionHistory && (
                            <span title="Prior eviction">
                              <AlertTriangle className="w-3.5 h-3.5 text-[color:var(--warning)]" />
                            </span>
                          )}
                          {resume.hasFelony && (
                            <span title="Criminal history — certificate of relief">
                              <FileText className="w-3.5 h-3.5 text-destructive" />
                            </span>
                          )}
                          {resume.hasBankruptcy && (
                            <span title="Prior bankruptcy">
                              <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                            </span>
                          )}
                          {!resume.pets &&
                            !resume.hasEvictionHistory &&
                            !resume.hasFelony &&
                            !resume.hasBankruptcy && (
                              <span className="text-xs text-muted-foreground/50">
                                —
                              </span>
                            )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={resume.resumeStatus} />
                      </TableCell>

                      {/* Updated */}
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {formatDate(resume.lastUpdated)}
                      </TableCell>
                    </TableRow>

                    {/* Expanded detail row */}
                    {expandedId === resume.id && (
                      <TableRow key={`${resume.id}-expanded`}>
                        <TableCell
                          colSpan={8}
                          className="bg-muted/20 p-4 border-t border-border/30"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Rent Budget
                              </p>
                              <p className="font-mono font-medium">
                                {formatCurrency(resume.preferredRentRange.min)}{" "}
                                – {formatCurrency(resume.preferredRentRange.max)}
                                /mo
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Bedrooms Needed
                              </p>
                              <p className="font-mono font-medium">
                                {resume.bedrooms}BR
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Target Move-In
                              </p>
                              <p className="font-mono font-medium">
                                {new Date(
                                  resume.moveInDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Search Radius
                              </p>
                              <p className="font-mono font-medium">
                                {resume.preferredRadius} miles
                              </p>
                            </div>
                            {resume.evictionDetails && (
                              <div className="col-span-2 md:col-span-4">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                  Eviction Disclosure
                                </p>
                                <p className="text-sm text-[color:var(--warning)] bg-[color:var(--warning)]/5 rounded-md p-2 border border-[color:var(--warning)]/20">
                                  {resume.evictionDetails}
                                </p>
                              </div>
                            )}
                            {resume.felonyDetails && (
                              <div className="col-span-2 md:col-span-4">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                  Criminal History Disclosure
                                </p>
                                <p className="text-sm text-destructive bg-destructive/5 rounded-md p-2 border border-destructive/20">
                                  {resume.felonyDetails}
                                </p>
                              </div>
                            )}
                            {resume.pets && resume.pets.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                  Pets
                                </p>
                                <p>
                                  {resume.pets
                                    .map(
                                      (p) =>
                                        `${p.count} ${p.type}${
                                          p.breed ? ` (${p.breed})` : ""
                                        }`
                                    )
                                    .join(", ")}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Resume Created
                              </p>
                              <p className="font-mono text-muted-foreground">
                                {formatDate(resume.createdAt)}
                              </p>
                            </div>
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
  );
}
