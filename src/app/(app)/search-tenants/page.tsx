"use client";

import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  PawPrint,
  Eye,
  Home,
  DollarSign,
  MapPin,
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { rentalResumes } from "@/data/mock-data";
import type { RentalResume, CreditRange } from "@/lib/types";

// Credit order for filtering
const creditOrder: Record<CreditRange, number> = {
  "580-619": 1,
  "620-679": 2,
  "680-719": 3,
  "720+": 4,
};

function anonymizeName(first: string, last: string) {
  return `${first} ${last[0]}.`;
}

function computeMatchScore(resume: RentalResume): number {
  let score = 50;
  // Credit quality
  score += creditOrder[resume.creditRange] * 8;
  // Income ratio
  score += Math.min(resume.incomeToRentRatio * 5, 20);
  // View count (social proof)
  score += Math.min(resume.viewCount * 1.5, 10);
  // Deductions
  if (resume.hasEvictionHistory) score -= 15;
  if (resume.hasFelony) score -= 10;
  if (resume.hasBankruptcy) score -= 8;
  if (resume.resumeStatus === "Incomplete") score -= 20;
  return Math.min(Math.max(Math.round(score), 10), 98);
}

function MatchScorePill({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-[color:var(--success)] bg-[color:var(--success)]/10"
      : score >= 60
      ? "text-[color:var(--warning)] bg-[color:var(--warning)]/10"
      : "text-destructive bg-destructive/10";

  return (
    <div className={cn("px-2.5 py-1 rounded-full text-xs font-semibold tabular-nums font-mono", color)}>
      {score}% match
    </div>
  );
}

function DisclosureModal({
  resume,
  open,
  onClose,
}: {
  resume: RentalResume;
  open: boolean;
  onClose: () => void;
}) {
  const [acknowledged, setAcknowledged] = useState(false);

  const hasFlags =
    resume.hasEvictionHistory || resume.hasFelony || resume.hasBankruptcy;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); setAcknowledged(false); } }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Screening Disclosures
          </DialogTitle>
        </DialogHeader>

        {!acknowledged ? (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
              <p className="font-medium text-foreground">Compliance Acknowledgement Required</p>
              <p className="text-muted-foreground leading-relaxed">
                By viewing this tenant&apos;s full disclosure history, you confirm that:
              </p>
              <ul className="text-muted-foreground space-y-1 list-disc list-inside text-xs leading-relaxed">
                <li>You will use this information solely for lawful housing screening</li>
                <li>Decisions will comply with the Fair Housing Act and applicable local laws</li>
                <li>You will not discriminate based on protected class characteristics</li>
                <li>Criminal history will be considered per individualized assessment guidelines</li>
              </ul>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[color:var(--warning)] shrink-0" />
              <p className="text-xs text-muted-foreground">
                This acknowledgement is logged in your compliance audit trail.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={() => setAcknowledged(true)}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Acknowledge &amp; View
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-[color:var(--success)] font-medium bg-[color:var(--success)]/10 rounded-md px-3 py-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Compliance acknowledgement recorded
            </div>

            {/* Full identity */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Full Name
              </p>
              <p className="font-semibold text-lg">
                {resume.firstName} {resume.lastName}
              </p>
            </div>

            {/* Disclosures */}
            {!hasFlags ? (
              <div className="bg-[color:var(--success)]/5 border border-[color:var(--success)]/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-[color:var(--success)]">
                  <CheckCircle2 className="w-4 h-4" />
                  <p className="text-sm font-medium">No adverse history disclosed</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tenant self-reports no eviction, bankruptcy, or criminal history.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {resume.hasEvictionHistory && (
                  <div className="bg-[color:var(--warning)]/5 border border-[color:var(--warning)]/20 rounded-lg p-3">
                    <p className="text-xs font-semibold text-[color:var(--warning)] uppercase tracking-wide mb-1">
                      Eviction History
                    </p>
                    <p className="text-sm text-foreground">
                      {resume.evictionDetails ?? "Prior eviction on record."}
                    </p>
                  </div>
                )}
                {resume.hasFelony && (
                  <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                    <p className="text-xs font-semibold text-destructive uppercase tracking-wide mb-1">
                      Criminal History
                    </p>
                    <p className="text-sm text-foreground">
                      {resume.felonyDetails ?? "Criminal record on file."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: Fair Chance Housing laws apply in many jurisdictions. Consider individualized assessment.
                    </p>
                  </div>
                )}
                {resume.hasBankruptcy && (
                  <div className="bg-[color:var(--warning)]/5 border border-[color:var(--warning)]/20 rounded-lg p-3">
                    <p className="text-xs font-semibold text-[color:var(--warning)] uppercase tracking-wide mb-1">
                      Bankruptcy History
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Prior bankruptcy on record. Tenant self-reports; verify through credit report.
                    </p>
                  </div>
                )}
              </div>
            )}

            <Button variant="outline" className="w-full" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function TenantCard({
  resume,
  matchScore,
  onViewDisclosures,
}: {
  resume: RentalResume;
  matchScore: number;
  onViewDisclosures: () => void;
}) {
  const hasFlags =
    resume.hasEvictionHistory || resume.hasFelony || resume.hasBankruptcy;

  function formatCurrency(n: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  }

  return (
    <Card className="shadow-md border border-border/40 hover:shadow-lg hover:border-primary/20 transition-all duration-150 overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
              {resume.firstName[0]}
            </div>
            <div>
              <p className="font-semibold text-sm">{anonymizeName(resume.firstName, resume.lastName)}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {resume.locationCity}, {resume.locationState}
                <span className="opacity-60">· ±{resume.preferredRadius}mi</span>
              </p>
            </div>
          </div>
          <MatchScorePill score={matchScore} />
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-3">
        {/* Key metrics grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Credit</p>
            <p className="font-mono font-semibold text-sm">{resume.creditRange}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Income</p>
            <p className="font-mono font-semibold text-sm">{resume.incomeToRentRatio}x</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Bedrooms</p>
            <p className="font-mono font-semibold text-sm">{resume.bedrooms}BR</p>
          </div>
        </div>

        {/* Budget + move-in */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {formatCurrency(resume.preferredRentRange.min)}–{formatCurrency(resume.preferredRentRange.max)}/mo
          </span>
          <span className="flex items-center gap-1">
            <Home className="w-3 h-3" />
            Available{" "}
            {new Date(resume.moveInDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Tags row */}
        <div className="flex items-center gap-2 flex-wrap">
          {resume.incomeSource === "HCV voucher" && (
            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
              HCV Voucher
            </Badge>
          )}
          {resume.incomeSource === "self-employed" && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              Self-Employed
            </Badge>
          )}
          {resume.pets && resume.pets.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <PawPrint className="w-3 h-3" />
              Pets
            </span>
          )}
          {resume.viewCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <Eye className="w-3 h-3" />
              {resume.viewCount} {resume.viewCount === 1 ? "view" : "views"}
            </span>
          )}
        </div>

        {/* Flags indicator */}
        {hasFlags && (
          <div className="flex items-center gap-1.5 text-xs text-[color:var(--warning)] bg-[color:var(--warning)]/5 rounded-md px-2 py-1.5 border border-[color:var(--warning)]/20">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Disclosures on file — view before screening
          </div>
        )}

        {/* CTA */}
        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs hover:border-primary/30 hover:text-primary transition-colors duration-150"
          onClick={onViewDisclosures}
        >
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
          View Disclosures
        </Button>
      </CardContent>
    </Card>
  );
}

export default function SearchTenantsPage() {
  const [search, setSearch] = useState("");
  const [radiusFilter, setRadiusFilter] = useState<string>("all");
  const [creditFilter, setCreditFilter] = useState<string>("all");
  const [voucherOnly, setVoucherOnly] = useState(false);
  const [petsOk, setPetsOk] = useState(false);
  const [selectedResume, setSelectedResume] = useState<RentalResume | null>(null);
  const [sortBy, setSortBy] = useState<"match" | "income" | "credit">("match");

  const displayed = useMemo(() => {
    return rentalResumes
      .filter((r) => {
        // Exclude incomplete resumes from PM search (platform rule)
        if (r.resumeStatus === "Incomplete") return false;
        // Exclude already leased
        if (r.resumeStatus === "Leased") return false;

        if (radiusFilter !== "all" && r.preferredRadius !== Number(radiusFilter)) return false;
        if (creditFilter !== "all" && creditOrder[r.creditRange] < creditOrder[creditFilter as CreditRange]) return false;
        if (voucherOnly && r.incomeSource !== "HCV voucher") return false;
        if (petsOk && (!r.pets || r.pets.length === 0)) return false;
        if (search) {
          const q = search.toLowerCase();
          if (
            !r.locationCity.toLowerCase().includes(q) &&
            !r.locationState.toLowerCase().includes(q) &&
            !r.firstName.toLowerCase().includes(q)
          )
            return false;
        }
        return true;
      })
      .map((r) => ({ ...r, _matchScore: computeMatchScore(r) }))
      .sort((a, b) => {
        if (sortBy === "match") return b._matchScore - a._matchScore;
        if (sortBy === "income") return b.monthlyIncome - a.monthlyIncome;
        return creditOrder[b.creditRange] - creditOrder[a.creditRange];
      });
  }, [search, radiusFilter, creditFilter, voucherOnly, petsOk, sortBy]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Search Tenants</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Find pre-qualified renters whose criteria match your vacancies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[color:var(--success)]/10 text-[color:var(--success)] text-xs font-medium px-3 py-1.5 rounded-full">
            {displayed.length} qualified {displayed.length === 1 ? "renter" : "renters"} available
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <Card className="shadow-md border border-border/40 p-4">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Search Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Location search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="City or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Search radius */}
          <Select value={radiusFilter} onValueChange={setRadiusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Any radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Search Radius</SelectItem>
              <SelectItem value="5">5 mi radius</SelectItem>
              <SelectItem value="10">10 mi radius</SelectItem>
              <SelectItem value="25">25 mi radius</SelectItem>
              <SelectItem value="50">50 mi radius</SelectItem>
            </SelectContent>
          </Select>

          {/* Min credit */}
          <Select value={creditFilter} onValueChange={setCreditFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Any credit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Credit Band</SelectItem>
              <SelectItem value="580-619">580–619+</SelectItem>
              <SelectItem value="620-679">620–679+</SelectItem>
              <SelectItem value="680-719">680–719+</SelectItem>
              <SelectItem value="720+">720+</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Sort: Best Match</SelectItem>
              <SelectItem value="income">Sort: Highest Income</SelectItem>
              <SelectItem value="credit">Sort: Strongest Credit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggle filters */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <button
            onClick={() => setVoucherOnly((v) => !v)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150",
              voucherOnly
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border/60 text-muted-foreground hover:border-primary/30 hover:text-primary"
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            HCV Vouchers Only
          </button>
          <button
            onClick={() => setPetsOk((v) => !v)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150",
              petsOk
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border/60 text-muted-foreground hover:border-primary/30 hover:text-primary"
            )}
          >
            <PawPrint className="w-3.5 h-3.5" />
            Has Pets
          </button>

          {(voucherOnly || petsOk || radiusFilter !== "all" || creditFilter !== "all" || search) && (
            <button
              onClick={() => {
                setVoucherOnly(false);
                setPetsOk(false);
                setRadiusFilter("all");
                setCreditFilter("all");
                setSearch("");
              }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 ml-auto"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* Results Grid */}
      {displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <Search className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            No qualified renters match your search criteria.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Try widening your credit range or removing a filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((resume, index) => (
            <div
              key={resume.id}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <TenantCard
                resume={resume}
                matchScore={resume._matchScore}
                onViewDisclosures={() => setSelectedResume(resume)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Disclosure Modal */}
      {selectedResume && (
        <DisclosureModal
          resume={selectedResume}
          open={!!selectedResume}
          onClose={() => setSelectedResume(null)}
        />
      )}
    </div>
  );
}
