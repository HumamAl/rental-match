// No "use client" — pure JSX, no hooks

import type { ReactNode } from "react";
import { OutcomeStatement } from "./outcome-statement";

interface ChallengeData {
  id: string;
  title: string;
  description: string;
  outcome: string;
}

interface ChallengeCardProps {
  challenge: ChallengeData;
  index: number;
  visualization?: ReactNode;
}

export function ChallengeCard({ challenge, index, visualization }: ChallengeCardProps) {
  const stepNumber = String(index + 1).padStart(2, "0");

  return (
    <div
      className="aesthetic-card p-6 space-y-4"
      style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--accent) 30%, var(--card)), var(--card))" }}
    >
      {/* Header */}
      <div>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-mono text-sm font-medium text-primary/60 w-6 shrink-0 tabular-nums">
            {stepNumber}
          </span>
          <h3 className="text-base font-semibold leading-snug">{challenge.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground pl-[calc(1.5rem+0.75rem)] leading-relaxed">
          {challenge.description}
        </p>
      </div>

      {/* Visualization */}
      {visualization && (
        <div className="pl-[calc(1.5rem+0.75rem)]">{visualization}</div>
      )}

      {/* Outcome */}
      <div className="pl-[calc(1.5rem+0.75rem)]">
        <OutcomeStatement outcome={challenge.outcome} />
      </div>
    </div>
  );
}
