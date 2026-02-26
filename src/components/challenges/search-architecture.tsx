// No "use client" — pure JSX, no hooks

import { MapPin, Filter, Database, Search, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ArchLayer {
  id: string;
  layer: string;
  label: string;
  detail: string;
  icon: LucideIcon;
  variant: "frontend" | "backend" | "external" | "database";
}

const layers: ArchLayer[] = [
  {
    id: "input",
    layer: "PM Search UI",
    label: "Radius + Filter Inputs",
    detail: "Address centroid, radius slider (5–50 mi), credit band, income ratio, HCV, pets, bedrooms",
    icon: Filter,
    variant: "frontend",
  },
  {
    id: "geo",
    layer: "Geo Layer",
    label: "Mapbox / Google Maps API",
    detail: "Geocode address → lat/lng centroid, compute bounding box for initial DB pass",
    icon: MapPin,
    variant: "external",
  },
  {
    id: "query",
    layer: "Query Engine",
    label: "Composite Search Query",
    detail: "Haversine distance filter + credit/income/lifestyle predicates in a single indexed query",
    icon: Search,
    variant: "backend",
  },
  {
    id: "db",
    layer: "Data Store",
    label: "Rental Resume Records",
    detail: "Anonymized profiles with geo-indexed coordinates, pre-computed income-to-rent ratios",
    icon: Database,
    variant: "database",
  },
];

const variantStyles: Record<ArchLayer["variant"], { card: string; layer: string; icon: string }> = {
  frontend: {
    card: "border-primary/30 bg-primary/5",
    layer: "text-primary",
    icon: "text-primary",
  },
  external: {
    card: "border-border/60 bg-muted/40",
    layer: "text-muted-foreground",
    icon: "text-muted-foreground",
  },
  backend: {
    card: "border-[color:var(--warning)]/30",
    layer: "text-[color:var(--warning)]",
    icon: "text-[color:var(--warning)]",
  },
  database: {
    card: "border-[color:var(--success)]/30 bg-[color:var(--success)]/5",
    layer: "text-[color:var(--success)]",
    icon: "text-[color:var(--success)]",
  },
};

export function SearchArchitecture() {
  return (
    <div className="space-y-2">
      {/* Horizontal connector strip — desktop */}
      <div className="hidden sm:flex items-center gap-1">
        {layers.map((layer, i) => {
          const styles = variantStyles[layer.variant];
          const Icon = layer.icon;

          return (
            <div key={layer.id} className="flex items-center gap-1 flex-1">
              <div
                className={[
                  "flex-1 rounded-lg border px-3 py-2.5 space-y-1",
                  styles.card,
                ].join(" ")}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className={["w-3.5 h-3.5 shrink-0", styles.icon].join(" ")} />
                  <span
                    className={[
                      "font-mono text-[9px] uppercase tracking-wide font-semibold",
                      styles.layer,
                    ].join(" ")}
                  >
                    {layer.layer}
                  </span>
                </div>
                <p className="text-xs font-medium text-foreground leading-tight">{layer.label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{layer.detail}</p>
              </div>
              {i < layers.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Vertical stack — mobile */}
      <div className="sm:hidden space-y-2">
        {layers.map((layer, i) => {
          const styles = variantStyles[layer.variant];
          const Icon = layer.icon;

          return (
            <div key={layer.id} className="space-y-1">
              <div
                className={[
                  "rounded-lg border px-3 py-2.5",
                  styles.card,
                ].join(" ")}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={["w-3.5 h-3.5 shrink-0", styles.icon].join(" ")} />
                  <span
                    className={[
                      "font-mono text-[9px] uppercase tracking-wide font-semibold",
                      styles.layer,
                    ].join(" ")}
                  >
                    {layer.layer}
                  </span>
                </div>
                <p className="text-xs font-medium text-foreground">{layer.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{layer.detail}</p>
              </div>
              {i < layers.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-px h-3 bg-border/60" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Result badge */}
      <div
        className="rounded-lg px-3 py-2 border text-xs flex items-center gap-2"
        style={{
          backgroundColor: "color-mix(in oklch, var(--success) 6%, transparent)",
          borderColor: "color-mix(in oklch, var(--success) 20%, transparent)",
        }}
      >
        <Search className="w-3.5 h-3.5 text-[color:var(--success)] shrink-0" />
        <span className="text-[color:var(--success)] font-medium">
          Result: anonymized Rental Resume cards sorted by match score — not raw user records
        </span>
      </div>
    </div>
  );
}
