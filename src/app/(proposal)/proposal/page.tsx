import { ExternalLink, TrendingUp } from "lucide-react";
import { proposalData } from "@/data/proposal";

export default function ProposalPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">

      {/* ── Section 1: Hero (Project Brief) ── */}
      <section
        className="relative rounded-2xl overflow-hidden"
        style={{ background: `oklch(0.10 0.02 var(--primary-h, 80))` }}
      >
        {/* Radial highlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top, oklch(0.72 0.16 80 / 0.12), transparent 65%)",
          }}
        />

        <div className="relative z-10 p-8 md:p-12">
          {/* Effort badge — mandatory */}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 border border-white/10 text-white/80 px-3 py-1 rounded-full mb-6">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            {proposalData.hero.badge}
          </span>

          {/* Role prefix */}
          <p className="font-mono text-xs tracking-widest uppercase text-white/50 mb-4">
            Full-Stack Developer · PropTech Marketplace Specialist
          </p>

          {/* Headline with weight contrast */}
          <h1 className="text-5xl md:text-6xl tracking-tight leading-none mb-4">
            <span className="font-light text-white/80">Hi, I&apos;m</span>{" "}
            <span className="font-black text-white">{proposalData.hero.name}</span>
          </h1>

          {/* Tailored value prop */}
          <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            {proposalData.hero.valueProp}
          </p>
        </div>

        {/* Stats shelf */}
        <div className="relative z-10 border-t border-white/10 bg-white/5 px-8 md:px-12 py-5">
          <div className="grid grid-cols-3 gap-4">
            {proposalData.hero.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Proof of Work ── */}
      <section className="space-y-5">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
            Proof of Work
          </p>
          <h2 className="text-2xl font-bold tracking-tight">Relevant Projects</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {proposalData.portfolioProjects.map((project) => (
            <div
              key={project.name}
              className="aesthetic-card p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold leading-snug">
                  {project.name}
                </h3>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                    style={{ transitionDuration: "var(--dur-fast)" }}
                    aria-label={`View ${project.name} live`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {/* Outcome badge */}
              <div className="flex items-start gap-2 text-sm text-[color:var(--success)]">
                <TrendingUp className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span className="leading-snug">{project.outcome}</span>
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-muted text-xs font-mono text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Relevance note */}
              {project.relevance && (
                <p className="text-xs text-primary/80 italic leading-relaxed border-t border-border/40 pt-2">
                  {project.relevance}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: How I Work ── */}
      <section className="space-y-5">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
            Process
          </p>
          <h2 className="text-2xl font-bold tracking-tight">How I Work</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {proposalData.approach.map((step) => (
            <div key={step.step} className="aesthetic-card p-5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                  Step {step.step}
                </span>
                <span className="font-mono text-xs text-muted-foreground/60">
                  {step.timeline}
                </span>
              </div>
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Skills Grid ── */}
      <section className="space-y-5">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
            Tech Stack
          </p>
          <h2 className="text-2xl font-bold tracking-tight">What I Build With</h2>
        </div>

        <div className="space-y-3">
          {proposalData.skills.map((category) => (
            <div key={category.category} className="aesthetic-card p-4 space-y-2.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {category.category}
              </p>
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md border border-border/60 text-sm font-mono text-foreground/80 bg-muted/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: CTA ── */}
      <section
        className="relative rounded-2xl overflow-hidden text-center"
        style={{ background: `oklch(0.10 0.02 var(--primary-h, 80))` }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at bottom, oklch(0.72 0.16 80 / 0.10), transparent 65%)",
          }}
        />

        <div className="relative z-10 p-8 md:p-12 space-y-4">
          {/* Pulsing availability indicator */}
          <div className="flex items-center justify-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[color:var(--success)]" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
            </span>
            <span
              className="text-sm"
              style={{
                color: "color-mix(in oklch, var(--success) 80%, white)",
              }}
            >
              {proposalData.cta.availability}
            </span>
          </div>

          {/* Tailored headline */}
          <h2 className="text-2xl font-bold text-white max-w-xl mx-auto leading-tight">
            {proposalData.cta.headline}
          </h2>

          {/* Specific body copy */}
          <p className="text-white/70 max-w-lg mx-auto leading-relaxed">
            {proposalData.cta.body}
          </p>

          {/* Primary action — text, not a dead-end button */}
          <p className="text-lg font-semibold text-white pt-2">
            {proposalData.cta.action}
          </p>

          {/* Back-link to demo */}
          <a
            href="/"
            className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white/70 transition-colors"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            ← Back to the demo
          </a>

          {/* Signature */}
          <p className="pt-4 text-sm text-white/40 border-t border-white/10 mt-4">
            — Humam
          </p>
        </div>
      </section>

    </div>
  );
}
