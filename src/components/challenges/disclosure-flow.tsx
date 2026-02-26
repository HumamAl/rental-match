"use client";

import { useState } from "react";
import { ShieldCheck, Eye, FileCheck, AlertTriangle, ArrowRight, CheckCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FlowStep {
  id: string;
  label: string;
  sublabel: string;
  icon: LucideIcon;
  variant: "neutral" | "warning" | "primary" | "success";
}

const steps: FlowStep[] = [
  {
    id: "search",
    label: "Search Results",
    sublabel: "Anonymized profiles only",
    icon: Eye,
    variant: "neutral",
  },
  {
    id: "gate",
    label: "View Disclosures",
    sublabel: "FCRA acknowledgement required",
    icon: ShieldCheck,
    variant: "primary",
  },
  {
    id: "consent",
    label: "Consent Logged",
    sublabel: "Timestamped, auditable",
    icon: FileCheck,
    variant: "warning",
  },
  {
    id: "reveal",
    label: "History Revealed",
    sublabel: "Self-disclosed only",
    icon: CheckCircle,
    variant: "success",
  },
];

const variantStyles: Record<FlowStep["variant"], { card: string; icon: string; label: string }> = {
  neutral: {
    card: "border-border/60 bg-card",
    icon: "text-muted-foreground",
    label: "text-foreground",
  },
  primary: {
    card: "border-primary/40 bg-primary/5",
    icon: "text-primary",
    label: "text-primary",
  },
  warning: {
    card: "border-[color:var(--warning)]/40",
    icon: "text-[color:var(--warning)]",
    label: "text-foreground",
  },
  success: {
    card: "border-[color:var(--success)]/40 bg-[color:var(--success)]/5",
    icon: "text-[color:var(--success)]",
    label: "text-foreground",
  },
};

export function DisclosureFlow() {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const descriptions: Record<string, string> = {
    search:
      "Property managers see first name, credit band, income-to-rent ratio, and bedroom preference. Last name, contact info, and history are hidden.",
    gate:
      "Clicking 'View Disclosures' triggers a Fair Housing Act acknowledgement modal. The manager must confirm they understand disparate-impact rules before the record is unlocked.",
    consent:
      "Each disclosure view is logged with manager ID, timestamp, and acknowledgement text. This creates an auditable paper trail satisfying FCRA § 604 written authorization.",
    reveal:
      "Only self-disclosed history the tenant opted to share becomes visible. Third-party credit pulls require a separate FCRA authorization flow.",
  };

  return (
    <div className="space-y-3">
      {/* Flow steps */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {steps.map((step, i) => {
          const styles = variantStyles[step.variant];
          const Icon = step.icon;
          const isActive = activeStep === step.id;

          return (
            <div key={step.id} className="flex items-center gap-2 flex-1 sm:flex-none">
              <button
                onClick={() => setActiveStep(isActive ? null : step.id)}
                className={[
                  "flex items-start sm:items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-all duration-200 w-full sm:w-auto",
                  styles.card,
                  isActive ? "ring-2 ring-primary/30 ring-offset-1" : "hover:shadow-sm",
                ].join(" ")}
              >
                <Icon className={["w-4 h-4 shrink-0 mt-0.5 sm:mt-0", styles.icon].join(" ")} />
                <div>
                  <p className={["text-xs font-semibold leading-tight", styles.label].join(" ")}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                    {step.sublabel}
                  </p>
                </div>
              </button>
              {i < steps.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 hidden sm:block" />
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded description — interactive reveal */}
      {activeStep && (
        <div
          className="rounded-lg px-4 py-3 border border-primary/20 text-sm text-muted-foreground leading-relaxed"
          style={{ backgroundColor: "color-mix(in oklch, var(--primary) 4%, transparent)" }}
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5" />
            <p>{descriptions[activeStep]}</p>
          </div>
        </div>
      )}

      {!activeStep && (
        <p className="text-[11px] text-muted-foreground/60 text-center">
          Click any step to see the compliance detail
        </p>
      )}
    </div>
  );
}
