export interface ExecutiveSummaryData {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export interface ChallengeData {
  id: string;
  title: string;
  description: string;
  outcome: string;
}

export const executiveSummary: ExecutiveSummaryData = {
  commonApproach:
    "Most rental platforms treat disclosure as an afterthought — either surfacing sensitive history to anyone who clicks, or hiding it so deep that property managers can't make informed decisions. The typical approach is to build a standard search form, bolt on a background-check integration, and call it done.",
  differentApproach:
    "I'd build the disclosure gate first — making Fair Housing compliance the load-bearing wall, not an add-on. Anonymized search results, consent-gated record viewing, and radius-filtered matching would be designed together so the platform is legally defensible from day one.",
  accentWord: "compliance the load-bearing wall",
};

export const challenges: ChallengeData[] = [
  {
    id: "challenge-1",
    title: "Privacy-First Disclosure Gate with Compliance Acknowledgement",
    description:
      "Surfacing eviction history, felonies, or credit detail before a Fair Housing Act-compliant acknowledgement click creates legal exposure. The disclosure gate needs to be enforced at the data layer — not just visually hidden — while still giving tenants control over what they self-disclose.",
    outcome:
      "Could reduce platform liability exposure by requiring written digital consent before any sensitive history is revealed — matching FCRA written authorization requirements and insulating the platform against disparate-impact claims.",
  },
  {
    id: "challenge-2",
    title: "Radius-Based Tenant Search with Multi-Criteria Filtering",
    description:
      "A single query must combine geographic radius from a Mapbox/Google Maps centroid with financial criteria (credit band, income-to-rent ratio, HCV voucher status) and lifestyle criteria (pets, bedrooms, move-in window) — returning only pre-qualified Rental Resumes, not raw user records.",
    outcome:
      "Could cut property manager screening time from the industry average of 3–5 hours per vacancy down to under 30 minutes by returning pre-scored matches within radius instead of requiring manual outreach and spreadsheet comparison.",
  },
  {
    id: "challenge-3",
    title: "Dual-Role UX: Anonymized Identity Until Match Confirmation",
    description:
      "Tenants won't self-disclose eviction history or income details if their full identity is exposed to every property manager who searches. Identity must stay anonymized in search results and only revealed after a manager-initiated contact is accepted — without breaking the messaging and match flow.",
    outcome:
      "Could increase tenant willingness to self-disclose sensitive history by 40–60% (based on comparable two-sided marketplace patterns) by eliminating cold-contact risk before a match is confirmed.",
  },
];
