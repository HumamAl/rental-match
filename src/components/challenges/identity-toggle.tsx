"use client";

import { useState } from "react";
import { X, Check, UserX, UserCheck, Eye, EyeOff } from "lucide-react";

interface StateItem {
  text: string;
  positive: boolean;
}

const beforeItems: StateItem[] = [
  { text: "Full name visible in all search results", positive: false },
  { text: "Contact info exposed before any match", positive: false },
  { text: "Eviction history shown to any searching PM", positive: false },
  { text: "Tenant has no control over who sees their data", positive: false },
  { text: "Cold contact from unvetted property managers", positive: false },
];

const afterItems: StateItem[] = [
  { text: "First name only in search results (e.g. 'Jordan M.')", positive: true },
  { text: "Contact details hidden until manager initiates contact", positive: true },
  { text: "Disclosures gated behind compliance acknowledgement", positive: true },
  { text: "Tenant controls what history they self-disclose", positive: true },
  { text: "Identity revealed only after match confirmation", positive: true },
];

export function IdentityToggle() {
  const [view, setView] = useState<"before" | "after">("before");

  const isBefore = view === "before";

  return (
    <div className="space-y-3">
      {/* Toggle control */}
      <div className="flex items-center gap-1 p-1 rounded-lg border border-border/60 bg-muted/30 w-fit">
        <button
          onClick={() => setView("before")}
          className={[
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
            isBefore
              ? "bg-destructive/10 text-destructive border border-destructive/20 shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          <UserX className="w-3.5 h-3.5" />
          Without anonymization
        </button>
        <button
          onClick={() => setView("after")}
          className={[
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
            !isBefore
              ? "bg-[color:var(--success)]/10 text-[color:var(--success)] border border-[color:var(--success)]/20 shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          <UserCheck className="w-3.5 h-3.5" />
          With anonymization
        </button>
      </div>

      {/* Content panel */}
      <div
        className="rounded-lg border p-4 transition-all duration-200"
        style={
          isBefore
            ? {
                backgroundColor: "color-mix(in oklch, var(--destructive) 5%, transparent)",
                borderColor: "color-mix(in oklch, var(--destructive) 20%, transparent)",
              }
            : {
                backgroundColor: "color-mix(in oklch, var(--success) 5%, transparent)",
                borderColor: "color-mix(in oklch, var(--success) 20%, transparent)",
              }
        }
      >
        {/* Panel header */}
        <div className="flex items-center gap-2 mb-3">
          {isBefore ? (
            <>
              <Eye className="w-4 h-4 text-destructive" />
              <span className="text-sm font-semibold text-destructive">
                Current approach — identity exposed
              </span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4 text-[color:var(--success)]" />
              <span className="text-sm font-semibold text-[color:var(--success)]">
                With Rental Resume — anonymized until match
              </span>
            </>
          )}
        </div>

        {/* Items list */}
        <ul className="space-y-2">
          {(isBefore ? beforeItems : afterItems).map((item) => (
            <li key={item.text} className="flex items-start gap-2">
              {item.positive ? (
                <Check className="w-3.5 h-3.5 text-[color:var(--success)] shrink-0 mt-0.5" />
              ) : (
                <X className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
              )}
              <span
                className={[
                  "text-xs leading-relaxed",
                  item.positive ? "text-[color:var(--success)]" : "text-destructive",
                ].join(" ")}
              >
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sample profile card — changes with toggle */}
      <div className="rounded-lg border border-border/60 bg-card p-3">
        <p className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground/60 mb-2">
          How tenant appears in PM search results
        </p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
            {isBefore ? "JC" : "J"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {isBefore ? "Jordan Chen" : "Jordan C."}
            </p>
            <p className="text-xs text-muted-foreground">
              {isBefore
                ? "jordan.chen@email.com · (415) 555-0192"
                : "Credit: 720+ · Income-to-rent: 3.8x · No contact info until match"}
            </p>
          </div>
          <div
            className="text-[10px] font-medium px-2 py-0.5 rounded-md"
            style={
              isBefore
                ? {
                    backgroundColor: "color-mix(in oklch, var(--destructive) 8%, transparent)",
                    color: "var(--destructive)",
                  }
                : {
                    backgroundColor: "color-mix(in oklch, var(--success) 8%, transparent)",
                    color: "var(--success)",
                  }
            }
          >
            {isBefore ? "Exposed" : "Anonymized"}
          </div>
        </div>
      </div>
    </div>
  );
}
