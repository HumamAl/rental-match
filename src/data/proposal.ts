// Proposal data for Tab 3 — "Work With Me"
// All portfolio outcomes sourced from references/developer-profile.md — never inflated.

export const proposalData = {
  hero: {
    name: "Humam",
    valueProp:
      "I build two-sided rental marketplaces — tenant-facing resume flows, PM dashboards with radius search, privacy-first disclosure logic, and in-app messaging — and I've already built a working version for your review in Tab 1.",
    badge: "Built this demo for your project",
    stats: [
      { value: "24+", label: "Projects Shipped" },
      { value: "< 48hr", label: "Demo Turnaround" },
      { value: "15+", label: "Industries" },
    ],
  },

  portfolioProjects: [
    {
      name: "Rental PM Connect",
      description:
        "SaaS platform connecting rental property owners with vetted property management companies. Separate owner and PM dashboards, matching algorithm, vetting workflows, and a review system — the closest architectural cousin to your reverse-search marketplace.",
      outcome:
        "Two-sided matching platform with vetting workflows, review tracking, and separate owner/PM dashboards",
      tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
      url: "https://rental-pm-connect.vercel.app",
      relevance:
        "Direct domain match — dual-role dashboards, matching engine, and vetting logic map directly to your PM/tenant architecture.",
    },
    {
      name: "Lynt Marketplace",
      description:
        "Full marketplace architecture with vendor onboarding, listing management, and transaction tracking. Built the complete two-sided flow from seller sign-up to buyer discovery — production-ready architecture at launch.",
      outcome:
        "Full marketplace architecture — vendor onboarding, listing management, and transaction tracking ready for production",
      tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
      url: "https://lynt-marketplace.vercel.app",
      relevance:
        "Two-sided marketplace scaffolding — same pattern your platform needs for PM and tenant onboarding flows.",
    },
    {
      name: "Tri-Gear Market",
      description:
        "Verified triathlon equipment marketplace with seller verification, gear categorization, and listing management. Built identity-gating and tiered disclosure into the listing flow — similar to the FHA-compliant screening disclosure logic your platform requires.",
      outcome:
        "Niche marketplace with seller verification, gear categorization, and listing management",
      tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
      url: "https://tri-gear-market.vercel.app",
      relevance:
        "Seller verification patterns apply directly to PM vetting and privacy-first credential disclosure.",
    },
    {
      name: "Lead Intake CRM",
      description:
        "Custom lead intake system with pipeline management, lead scoring, and configurable automation rules. The inquiry-to-showing pipeline your platform needs is essentially a CRM flow — this demonstrates the full lifecycle from first contact to conversion.",
      outcome:
        "End-to-end lead flow — public intake form to scored pipeline with configurable automation rules",
      tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
      url: null,
      relevance:
        "Inquiry-to-showing pipeline and match status tracking mirror what I built here.",
    },
  ],

  approach: [
    {
      step: "01",
      title: "Map Both Sides",
      description:
        "Start by mapping the full tenant and PM journeys separately — what each side needs to see, what stays private, and where the match moment happens. The one question that unlocks the architecture: who initiates, and what do they see before they commit?",
      timeline: "Week 1",
    },
    {
      step: "02",
      title: "Design the Match Engine",
      description:
        "Radius-based search with Mapbox, FHA-compliant disclosure sequencing, and the privacy logic that controls what PMs see before a tenant accepts. Working search and match flow before any production auth is wired.",
      timeline: "Weeks 2–4",
    },
    {
      step: "03",
      title: "Build Dual Dashboards",
      description:
        "Tenant resume builder and PM listing/lead pipeline as fully separate Next.js route groups, each with role-appropriate data access. Supabase RLS enforces the privacy boundary at the database layer — not just the UI.",
      timeline: "Weeks 5–9",
    },
    {
      step: "04",
      title: "Ship Compliance-Ready MVP",
      description:
        "Production deploy on Vercel with Supabase Postgres, Auth0 role separation, in-app messaging, and the full FHA disclosure audit trail. Clean TypeScript, documented codebase you can hand to a future dev without a handoff meeting.",
      timeline: "Weeks 10–12",
    },
  ],

  skills: [
    {
      category: "Frontend",
      items: ["Next.js (App Router)", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Mobile-first responsive"],
    },
    {
      category: "Backend & Database",
      items: ["Supabase (Postgres, RLS, Realtime)", "Auth0", "Firebase", "REST API design", "Row-Level Security"],
    },
    {
      category: "Geospatial & Mapping",
      items: ["Mapbox GL", "Radius-based search", "Geospatial indexing"],
    },
    {
      category: "Marketplace Architecture",
      items: ["Two-sided platform design", "Dual-role dashboards", "Privacy-first disclosure", "Matching algorithms"],
    },
    {
      category: "Deployment",
      items: ["Vercel", "GitHub Actions", "TypeScript strict mode"],
    },
  ],

  cta: {
    headline: "Ready to replace manual landlord cold-calls with a platform tenants actually want to use.",
    body: "I built the demo in Tab 1 to show you exactly how the dual dashboards, radius search, and privacy logic work together. The real build ships with Supabase RLS, Auth0 role separation, and a full FHA audit trail — ready to handle real users from day one.",
    action: "Reply on Upwork to start",
    availability: "Currently available for new projects",
  },
};
