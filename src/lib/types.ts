import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Sidebar navigation (shared across layout)
// ---------------------------------------------------------------------------
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// ---------------------------------------------------------------------------
// Challenge visualization types (used by Challenges Builder)
// ---------------------------------------------------------------------------
export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

// ---------------------------------------------------------------------------
// Proposal types (used by Proposal Builder)
// ---------------------------------------------------------------------------
export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

// ---------------------------------------------------------------------------
// Domain types — PropTech Rental Marketplace (Rental Resume platform)
// ---------------------------------------------------------------------------

// Renter's self-reported credit band (displayed as range, not exact score)
export type CreditRange = "580-619" | "620-679" | "680-719" | "720+";

// How the renter earns income
export type IncomeSource =
  | "employed"
  | "self-employed"
  | "HCV voucher"
  | "retired"
  | "student";

// Lifecycle status of a Rental Resume
export type ResumeStatus =
  | "Looking"
  | "Paused"
  | "Matched"
  | "Leased"
  | "Incomplete";

// Pipeline stages for a lead/inquiry between a PM and a prospective tenant
export type LeadStatus =
  | "New Match"
  | "Inquiry Sent"
  | "Showing Scheduled"
  | "Application Received"
  | "Under Review"
  | "Approved"
  | "Declined"
  | "Withdrew";

// Listing lifecycle status
export type ListingStatus = "Active" | "Pending" | "Filled";

// Pet policy on a listing
export type PetPolicy = "allowed" | "case-by-case" | "no pets";

// Screening report type
export type ReportType = "credit" | "background" | "eviction";

// Screening report status
export type ReportStatus = "Report Ready" | "Expired" | "Pending";

// Message sender role
export type MessageSenderRole = "manager" | "tenant";

// ---------------------------------------------------------------------------
// Rental Resume — the renter's self-reported profile
// ---------------------------------------------------------------------------
export interface PetInfo {
  type: string;        // "dog", "cat", "bird", etc.
  count: number;
  breed?: string;
}

export interface RentRange {
  min: number;
  max: number;
}

export interface RentalResume {
  id: string;                        // "rr_k8m2p"
  firstName: string;
  /** Last name anonymized in PM search view until inquiry is accepted */
  lastName: string;
  locationCity: string;
  locationState: string;
  /** Miles renter is willing to search from their base location */
  preferredRadius: 5 | 10 | 25 | 50;
  creditRange: CreditRange;
  /** Gross monthly income in USD */
  monthlyIncome: number;
  incomeSource: IncomeSource;
  /** Income-to-rent ratio (e.g. 3.4 means they earn 3.4x desired rent) */
  incomeToRentRatio: number;
  pets: PetInfo[] | null;
  hasEvictionHistory: boolean;
  hasBankruptcy: boolean;
  hasFelony: boolean;
  evictionDetails?: string | null;
  felonyDetails?: string | null;
  resumeStatus: ResumeStatus;
  createdAt: string;
  lastUpdated: string;
  /** Number of times this resume has been viewed by PMs */
  viewCount: number;
  preferredRentRange: RentRange;
  bedrooms: 1 | 2 | 3 | 4;
  /** Desired move-in date (ISO date string) */
  moveInDate: string;
}

// ---------------------------------------------------------------------------
// Property Manager — the demand-side user
// ---------------------------------------------------------------------------
export interface PropertyManager {
  id: string;                  // "pm_xf9m2"
  companyName: string;
  contactName: string;
  email: string;
  /** Total number of units under management */
  portfolioSize: number;
  activeListings: number;
  matchesMade: number;
  joinedDate: string;
}

// ---------------------------------------------------------------------------
// Active Listing — a unit a PM wants to fill
// ---------------------------------------------------------------------------
export interface ActiveListing {
  id: string;                  // "lst_p3k7n"
  managerId: string;           // → PropertyManager.id
  address: string;
  city: string;
  state: string;
  monthlyRent: number;
  bedrooms: 1 | 2 | 3 | 4;
  bathrooms: number;
  petPolicy: PetPolicy;
  acceptsVouchers: boolean;
  /** Minimum credit score band PM will consider */
  preferredCreditMin: CreditRange;
  availableDate: string;
  status: ListingStatus;
}

// ---------------------------------------------------------------------------
// Lead & Inquiry — the match pipeline record
// ---------------------------------------------------------------------------
export interface LeadAndInquiry {
  id: string;                  // "lead_b4n9s"
  listingId: string;           // → ActiveListing.id
  resumeId: string;            // → RentalResume.id
  managerId: string;           // → PropertyManager.id
  status: LeadStatus;
  initiatedDate: string;
  lastActivity: string;
  notes?: string | null;
}

// ---------------------------------------------------------------------------
// Screening Report — compliance/disclosure record
// ---------------------------------------------------------------------------
export interface ScreeningReport {
  id: string;                  // "rpt_m1r6t"
  resumeId: string;            // → RentalResume.id
  managerId: string;           // → PropertyManager.id
  reportType: ReportType;
  status: ReportStatus;
  requestedDate: string;
  completedDate?: string | null;
  /** ISO date string — date report data expires (usually 30-90 days) */
  expiresDate?: string | null;
  /** Whether the renter acknowledged the report request */
  acknowledged: boolean;
  acknowledgedDate?: string | null;
}

// ---------------------------------------------------------------------------
// Monthly Match Data — chart time-series
// ---------------------------------------------------------------------------
export interface MonthlyMatchData {
  month: string;               // "Jan", "Feb", etc.
  newResumes: number;
  inquiriesSent: number;
  leasesCompleted: number;
}

// ---------------------------------------------------------------------------
// Message — between matched PM and tenant
// ---------------------------------------------------------------------------
export interface Message {
  id: string;                  // "msg_c7v2w"
  leadId: string;              // → LeadAndInquiry.id
  senderId: string;            // manager id or resume id (depends on senderRole)
  senderRole: MessageSenderRole;
  content: string;
  timestamp: string;
  read: boolean;
}

// ---------------------------------------------------------------------------
// Dashboard Stats — KPI cards
// ---------------------------------------------------------------------------
export interface DashboardStats {
  /** Total active Rental Resumes on platform */
  totalRentalResumes: number;
  resumesChange: number;          // % change vs last month
  /** Total active listings across all PMs */
  activeListings: number;
  listingsChange: number;
  /** Matches that progressed to Showing Scheduled or beyond */
  qualifiedMatches: number;
  matchesChange: number;
  /** Leases completed this month */
  leasesThisMonth: number;
  leasesChange: number;
  /** % of inquiries that result in a showing */
  inquiryToShowingRate: number;
  inquiryToShowingChange: number;
  /** Average income-to-rent ratio of active resumes */
  avgIncomeToRentRatio: number;
}

// ---------------------------------------------------------------------------
// Chart data shapes
// ---------------------------------------------------------------------------
export interface MonthlyChartPoint {
  month: string;
  newResumes: number;
  inquiriesSent: number;
  leasesCompleted: number;
}

export interface ResumeStatusBreakdown {
  status: ResumeStatus;
  count: number;
  percentage: number;
}

export interface LeadFunnelStage {
  stage: string;
  count: number;
}

export interface CreditRangeBreakdown {
  range: CreditRange;
  count: number;
}
