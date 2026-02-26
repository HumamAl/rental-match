// ---------------------------------------------------------------------------
// RentalMatch — Mock Data
// Domain: PropTech two-sided rental marketplace ("Reverse Search")
// Primary entity: Rental Resume (NOT "profile" or "application")
// Demand side: Property Managers (PMs)
// Supply side: Renters / Prospective Tenants
// ---------------------------------------------------------------------------

import type {
  RentalResume,
  PropertyManager,
  ActiveListing,
  LeadAndInquiry,
  ScreeningReport,
  MonthlyMatchData,
  Message,
  DashboardStats,
  ResumeStatusBreakdown,
  LeadFunnelStage,
  CreditRangeBreakdown,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Dataset 1: Rental Resumes (20 records)
// Edge cases:
//   - prior eviction (rr_ev84n)
//   - HCV/Section 8 voucher holder (rr_hcv3x)
//   - Incomplete resume — status "Incomplete" (rr_inc7q)
//   - High-demand renter viewed 14x (rr_hi9f2)
//   - Self-employed with self-reported income (rr_se5m1)
//   - Guarantor-backed student with low personal income (rr_stu2k)
//   - Prior felony with certificate of relief (rr_z3v6q)
//   - Prior bankruptcy (rr_d2m8z)
// ---------------------------------------------------------------------------
export const rentalResumes: RentalResume[] = [
  {
    id: "rr_k8m2p",
    firstName: "Marcus",
    lastName: "Okafor",
    locationCity: "Austin",
    locationState: "TX",
    preferredRadius: 10,
    creditRange: "720+",
    monthlyIncome: 8_450.00,
    incomeSource: "employed",
    incomeToRentRatio: 4.1,
    pets: null,
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Looking",
    createdAt: "2026-01-14T09:23:41Z",
    lastUpdated: "2026-02-18T11:04:22Z",
    viewCount: 6,
    preferredRentRange: { min: 1800, max: 2200 },
    bedrooms: 2,
    moveInDate: "2026-03-01",
  },
  {
    id: "rr_hi9f2",
    firstName: "Priya",
    lastName: "Chandrasekaran",
    locationCity: "Denver",
    locationState: "CO",
    preferredRadius: 10,
    creditRange: "720+",
    monthlyIncome: 12_800.00,
    incomeSource: "employed",
    incomeToRentRatio: 4.8,
    pets: null,
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Looking",
    createdAt: "2026-01-08T14:37:19Z",
    lastUpdated: "2026-02-24T08:50:11Z",
    viewCount: 14, // high-demand — edge case: 14 PM views
    preferredRentRange: { min: 2200, max: 2800 },
    bedrooms: 2,
    moveInDate: "2026-03-15",
  },
  {
    id: "rr_hcv3x",
    firstName: "Darnell",
    lastName: "Washington",
    locationCity: "Atlanta",
    locationState: "GA",
    preferredRadius: 25,
    creditRange: "620-679",
    monthlyIncome: 2_840.00, // HCV supplement covers remainder of rent
    incomeSource: "HCV voucher",
    incomeToRentRatio: 1.8, // ratio based on tenant portion only; voucher covers the rest
    pets: [{ type: "dog", count: 1, breed: "Labrador Retriever" }],
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Looking",
    createdAt: "2026-01-22T10:15:07Z",
    lastUpdated: "2026-02-20T16:32:44Z",
    viewCount: 3,
    preferredRentRange: { min: 1100, max: 1500 },
    bedrooms: 2,
    moveInDate: "2026-03-01",
  },
  {
    id: "rr_ev84n",
    firstName: "Tamara",
    lastName: "Ruiz",
    locationCity: "Phoenix",
    locationState: "AZ",
    preferredRadius: 25,
    creditRange: "580-619",
    monthlyIncome: 4_200.00,
    incomeSource: "employed",
    incomeToRentRatio: 3.0,
    pets: [{ type: "cat", count: 2 }],
    hasEvictionHistory: true, // edge case: prior eviction
    hasBankruptcy: false,
    hasFelony: false,
    evictionDetails: "Eviction in 2021 — non-payment during COVID layoff; judgment paid in full",
    resumeStatus: "Looking",
    createdAt: "2026-02-01T08:04:55Z",
    lastUpdated: "2026-02-21T13:18:30Z",
    viewCount: 2,
    preferredRentRange: { min: 1200, max: 1500 },
    bedrooms: 2,
    moveInDate: "2026-03-15",
  },
  {
    id: "rr_se5m1",
    firstName: "Jordan",
    lastName: "Mercer",
    locationCity: "Nashville",
    locationState: "TN",
    preferredRadius: 10,
    creditRange: "680-719",
    monthlyIncome: 7_600.00, // self-reported; no W-2; PMs must request 1099s or bank statements
    incomeSource: "self-employed",
    incomeToRentRatio: 3.6,
    pets: [{ type: "dog", count: 1, breed: "French Bulldog" }],
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Looking",
    createdAt: "2026-01-31T07:44:33Z",
    lastUpdated: "2026-02-22T09:27:15Z",
    viewCount: 5,
    preferredRentRange: { min: 1800, max: 2200 },
    bedrooms: 2,
    moveInDate: "2026-04-01",
  },
  {
    id: "rr_stu2k",
    firstName: "Emily",
    lastName: "Tanaka",
    locationCity: "Charlotte",
    locationState: "NC",
    preferredRadius: 5,
    creditRange: "620-679",
    monthlyIncome: 1_400.00, // student income; guarantor co-signer covers gap
    incomeSource: "student",
    incomeToRentRatio: 1.1, // low personal ratio; qualifying via guarantor
    pets: null,
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Looking",
    createdAt: "2026-02-03T15:51:09Z",
    lastUpdated: "2026-02-19T10:40:00Z",
    viewCount: 1,
    preferredRentRange: { min: 900, max: 1300 },
    bedrooms: 1,
    moveInDate: "2026-05-15",
  },
  {
    id: "rr_inc7q",
    firstName: "Brian",
    lastName: "Delgado",
    locationCity: "Tampa",
    locationState: "FL",
    preferredRadius: 10,
    creditRange: "680-719",
    monthlyIncome: 5_100.00,
    incomeSource: "employed",
    incomeToRentRatio: 3.2,
    pets: null,
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Incomplete", // edge case: resume not finished — not surfaced in PM search
    createdAt: "2026-02-10T12:09:47Z",
    lastUpdated: "2026-02-10T12:09:47Z",
    viewCount: 0,
    preferredRentRange: { min: 1400, max: 1700 },
    bedrooms: 2,
    moveInDate: "2026-04-01",
  },
  {
    id: "rr_p9t4w",
    firstName: "Sofia",
    lastName: "Andersen",
    locationCity: "Seattle",
    locationState: "WA",
    preferredRadius: 10,
    creditRange: "720+",
    monthlyIncome: 9_750.00,
    incomeSource: "employed",
    incomeToRentRatio: 4.3,
    pets: [{ type: "cat", count: 1 }],
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Matched",
    createdAt: "2025-12-18T08:33:21Z",
    lastUpdated: "2026-02-14T17:05:38Z",
    viewCount: 8,
    preferredRentRange: { min: 2000, max: 2600 },
    bedrooms: 2,
    moveInDate: "2026-03-01",
  },
  {
    id: "rr_n3q7r",
    firstName: "Malik",
    lastName: "Johnson",
    locationCity: "Charlotte",
    locationState: "NC",
    preferredRadius: 25,
    creditRange: "720+",
    monthlyIncome: 6_880.00,
    incomeSource: "employed",
    incomeToRentRatio: 3.9,
    pets: null,
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Leased",
    createdAt: "2025-11-30T09:12:44Z",
    lastUpdated: "2026-01-28T14:22:57Z",
    viewCount: 7,
    preferredRentRange: { min: 1500, max: 1900 },
    bedrooms: 2,
    moveInDate: "2026-02-01",
  },
  {
    id: "rr_f7c1v",
    firstName: "Rachel",
    lastName: "Goldstein",
    locationCity: "Portland",
    locationState: "OR",
    preferredRadius: 10,
    creditRange: "680-719",
    monthlyIncome: 5_640.00,
    incomeSource: "employed",
    incomeToRentRatio: 3.3,
    pets: [{ type: "dog", count: 1, breed: "Border Collie" }],
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Looking",
    createdAt: "2026-01-19T11:48:03Z",
    lastUpdated: "2026-02-17T08:15:20Z",
    viewCount: 4,
    preferredRentRange: { min: 1500, max: 1900 },
    bedrooms: 2,
    moveInDate: "2026-03-15",
  },
  {
    id: "rr_d2m8z",
    firstName: "Carlos",
    lastName: "Restrepo",
    locationCity: "Miami",
    locationState: "FL",
    preferredRadius: 10,
    creditRange: "620-679",
    monthlyIncome: 4_850.00,
    incomeSource: "employed",
    incomeToRentRatio: 2.9,
    pets: null,
    hasEvictionHistory: false,
    hasBankruptcy: true, // edge case: prior bankruptcy
    hasFelony: false,
    resumeStatus: "Paused",
    createdAt: "2025-12-05T16:40:12Z",
    lastUpdated: "2026-02-02T09:33:00Z",
    viewCount: 2,
    preferredRentRange: { min: 1400, max: 1800 },
    bedrooms: 2,
    moveInDate: "2026-04-01",
  },
  {
    id: "rr_w5j9b",
    firstName: "Aisha",
    lastName: "Mohammed",
    locationCity: "Houston",
    locationState: "TX",
    preferredRadius: 25,
    creditRange: "720+",
    monthlyIncome: 11_200.00,
    incomeSource: "employed",
    incomeToRentRatio: 4.6,
    pets: null,
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Looking",
    createdAt: "2026-02-07T07:58:26Z",
    lastUpdated: "2026-02-25T10:45:00Z",
    viewCount: 9,
    preferredRentRange: { min: 2000, max: 2600 },
    bedrooms: 3,
    moveInDate: "2026-03-15",
  },
  {
    id: "rr_q1h6k",
    firstName: "Tyler",
    lastName: "Breckenridge",
    locationCity: "Salt Lake City",
    locationState: "UT",
    preferredRadius: 10,
    creditRange: "680-719",
    monthlyIncome: 6_200.00,
    incomeSource: "employed",
    incomeToRentRatio: 3.5,
    pets: [{ type: "dog", count: 2, breed: "Golden Retriever" }],
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Looking",
    createdAt: "2026-01-27T14:22:10Z",
    lastUpdated: "2026-02-23T16:11:44Z",
    viewCount: 5,
    preferredRentRange: { min: 1500, max: 1900 },
    bedrooms: 3,
    moveInDate: "2026-03-01",
  },
  {
    id: "rr_a8p3x",
    firstName: "Linda",
    lastName: "Bjornsen",
    locationCity: "Minneapolis",
    locationState: "MN",
    preferredRadius: 10,
    creditRange: "720+",
    monthlyIncome: 7_350.00,
    incomeSource: "retired",
    incomeToRentRatio: 4.0,
    pets: [{ type: "cat", count: 1 }],
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Looking",
    createdAt: "2026-02-05T09:07:52Z",
    lastUpdated: "2026-02-21T11:28:33Z",
    viewCount: 3,
    preferredRentRange: { min: 1600, max: 2000 },
    bedrooms: 2,
    moveInDate: "2026-04-01",
  },
  {
    id: "rr_t6e0n",
    firstName: "Omar",
    lastName: "Farouk",
    locationCity: "Dallas",
    locationState: "TX",
    preferredRadius: 25,
    creditRange: "720+",
    monthlyIncome: 15_400.00,
    incomeSource: "self-employed",
    incomeToRentRatio: 5.2,
    pets: null,
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Matched",
    createdAt: "2025-12-22T13:55:04Z",
    lastUpdated: "2026-02-16T08:44:19Z",
    viewCount: 11,
    preferredRentRange: { min: 2500, max: 3200 },
    bedrooms: 3,
    moveInDate: "2026-03-01",
  },
  {
    id: "rr_y4r7g",
    firstName: "Elena",
    lastName: "Vasquez",
    locationCity: "San Antonio",
    locationState: "TX",
    preferredRadius: 10,
    creditRange: "620-679",
    monthlyIncome: 3_900.00,
    incomeSource: "HCV voucher",
    incomeToRentRatio: 1.6,
    pets: null,
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Looking",
    createdAt: "2026-01-15T10:30:57Z",
    lastUpdated: "2026-02-18T14:03:41Z",
    viewCount: 2,
    preferredRentRange: { min: 900, max: 1300 },
    bedrooms: 2,
    moveInDate: "2026-03-15",
  },
  {
    id: "rr_m2s5c",
    firstName: "Nathan",
    lastName: "Reeves",
    locationCity: "Raleigh",
    locationState: "NC",
    preferredRadius: 10,
    creditRange: "680-719",
    monthlyIncome: 5_850.00,
    incomeSource: "employed",
    incomeToRentRatio: 3.4,
    pets: null,
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Looking",
    createdAt: "2026-02-12T08:21:36Z",
    lastUpdated: "2026-02-24T15:09:22Z",
    viewCount: 4,
    preferredRentRange: { min: 1500, max: 1800 },
    bedrooms: 2,
    moveInDate: "2026-04-01",
  },
  {
    id: "rr_b9u1d",
    firstName: "Patricia",
    lastName: "Reyes",
    locationCity: "Orlando",
    locationState: "FL",
    preferredRadius: 25,
    creditRange: "720+",
    monthlyIncome: 8_100.00,
    incomeSource: "employed",
    incomeToRentRatio: 4.2,
    pets: [{ type: "dog", count: 1, breed: "Poodle" }],
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Leased",
    createdAt: "2025-11-14T11:44:28Z",
    lastUpdated: "2026-01-10T09:15:00Z",
    viewCount: 9,
    preferredRentRange: { min: 1700, max: 2100 },
    bedrooms: 2,
    moveInDate: "2026-01-15",
  },
  {
    id: "rr_z3v6q",
    firstName: "James",
    lastName: "Whitfield",
    locationCity: "Columbus",
    locationState: "OH",
    preferredRadius: 10,
    creditRange: "580-619",
    monthlyIncome: 3_600.00,
    incomeSource: "employed",
    incomeToRentRatio: 2.7,
    pets: null,
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: true, // edge case: felony record with certificate of relief
    felonyDetails: "Non-violent drug offense 2018 — sentence completed; certificate of relief issued",
    resumeStatus: "Paused",
    createdAt: "2026-01-05T15:12:09Z",
    lastUpdated: "2026-02-08T11:30:44Z",
    viewCount: 1,
    preferredRentRange: { min: 1000, max: 1400 },
    bedrooms: 1,
    moveInDate: "2026-04-01",
  },
  {
    id: "rr_l7o2f",
    firstName: "Yuki",
    lastName: "Nakamura",
    locationCity: "Chicago",
    locationState: "IL",
    preferredRadius: 10,
    creditRange: "720+",
    monthlyIncome: 10_500.00,
    incomeSource: "employed",
    incomeToRentRatio: 4.5,
    pets: null,
    hasEvictionHistory: false,
    hasBankruptcy: false,
    hasFelony: false,
    resumeStatus: "Looking",
    createdAt: "2026-02-09T07:35:50Z",
    lastUpdated: "2026-02-25T12:17:30Z",
    viewCount: 7,
    preferredRentRange: { min: 2000, max: 2600 },
    bedrooms: 2,
    moveInDate: "2026-03-15",
  },
];

// ---------------------------------------------------------------------------
// Dataset 2: Property Managers (6 records)
// ---------------------------------------------------------------------------
export const propertyManagers: PropertyManager[] = [
  {
    id: "pm_xf9m2",
    companyName: "Apex Property Management",
    contactName: "Brendan O'Sullivan",
    email: "brendan@apexpm.com",
    portfolioSize: 412,
    activeListings: 8,
    matchesMade: 31,
    joinedDate: "2025-06-14T00:00:00Z",
  },
  {
    id: "pm_p3k7n",
    companyName: "Cornerstone Residential",
    contactName: "Latasha Kimber",
    email: "l.kimber@cornerstoneresidential.com",
    portfolioSize: 287,
    activeListings: 5,
    matchesMade: 19,
    joinedDate: "2025-08-02T00:00:00Z",
  },
  {
    id: "pm_r1t5w",
    companyName: "Horizon PM Group",
    contactName: "Shane Kowalski",
    email: "shane@horizonpmgroup.com",
    portfolioSize: 634,
    activeListings: 11,
    matchesMade: 47,
    joinedDate: "2025-04-18T00:00:00Z",
  },
  {
    id: "pm_c6q4s",
    companyName: "Summit Realty Management",
    contactName: "Rosa Mendez",
    email: "r.mendez@summitrealtymgmt.com",
    portfolioSize: 158,
    activeListings: 3,
    matchesMade: 8,
    joinedDate: "2025-10-07T00:00:00Z",
  },
  {
    id: "pm_h8d2v",
    companyName: "Clearwater Property Partners",
    contactName: "Marcus Webb",
    email: "mwebb@clearwaterproperty.com",
    portfolioSize: 521,
    activeListings: 7,
    matchesMade: 28,
    joinedDate: "2025-07-21T00:00:00Z",
  },
  {
    id: "pm_j0b9u",
    companyName: "Vantage Leasing Services",
    contactName: "Kenji Fujimoto",
    email: "k.fujimoto@vantageleasing.com",
    portfolioSize: 93,
    activeListings: 2,
    matchesMade: 4,
    joinedDate: "2025-12-01T00:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// Dataset 3: Active Listings (15 records)
// Spread across all 6 PMs. Edge cases:
//   - Listing accepting HCV/Section 8 vouchers (lst_hcv2a)
//   - "case-by-case" pet policy (lst_pet5b)
//   - Filled listing — realistic not all are Active (lst_fil3c)
//   - Very low preferredCreditMin — inclusive (lst_low8d)
// ---------------------------------------------------------------------------
export const activeListings: ActiveListing[] = [
  {
    id: "lst_q8w3p",
    managerId: "pm_xf9m2",
    address: "4821 Ridgecrest Dr, Unit 204",
    city: "Austin",
    state: "TX",
    monthlyRent: 2_150.00,
    bedrooms: 2,
    bathrooms: 2,
    petPolicy: "allowed",
    acceptsVouchers: false,
    preferredCreditMin: "680-719",
    availableDate: "2026-03-01",
    status: "Active",
  },
  {
    id: "lst_m4r7k",
    managerId: "pm_xf9m2",
    address: "901 S Congress Ave, Unit 12",
    city: "Austin",
    state: "TX",
    monthlyRent: 1_895.00,
    bedrooms: 1,
    bathrooms: 1,
    petPolicy: "no pets",
    acceptsVouchers: false,
    preferredCreditMin: "680-719",
    availableDate: "2026-03-15",
    status: "Active",
  },
  {
    id: "lst_hcv2a",
    managerId: "pm_r1t5w",
    address: "3340 Peachtree Rd NE, Apt 88",
    city: "Atlanta",
    state: "GA",
    monthlyRent: 1_450.00,
    bedrooms: 2,
    bathrooms: 1,
    petPolicy: "case-by-case",
    acceptsVouchers: true, // HCV/Section 8 accepted
    preferredCreditMin: "620-679",
    availableDate: "2026-03-01",
    status: "Active",
  },
  {
    id: "lst_pet5b",
    managerId: "pm_r1t5w",
    address: "7712 Glenwood Ave, Unit 5",
    city: "Raleigh",
    state: "NC",
    monthlyRent: 1_750.00,
    bedrooms: 2,
    bathrooms: 2,
    petPolicy: "case-by-case",
    acceptsVouchers: false,
    preferredCreditMin: "680-719",
    availableDate: "2026-04-01",
    status: "Active",
  },
  {
    id: "lst_n9v6d",
    managerId: "pm_r1t5w",
    address: "2201 Market St, Suite 310",
    city: "Charlotte",
    state: "NC",
    monthlyRent: 1_625.00,
    bedrooms: 1,
    bathrooms: 1,
    petPolicy: "no pets",
    acceptsVouchers: false,
    preferredCreditMin: "680-719",
    availableDate: "2026-03-15",
    status: "Active",
  },
  {
    id: "lst_a3e5t",
    managerId: "pm_p3k7n",
    address: "5509 Westheimer Rd, Unit 207",
    city: "Houston",
    state: "TX",
    monthlyRent: 2_480.00,
    bedrooms: 3,
    bathrooms: 2,
    petPolicy: "allowed",
    acceptsVouchers: false,
    preferredCreditMin: "720+",
    availableDate: "2026-03-15",
    status: "Active",
  },
  {
    id: "lst_low8d",
    managerId: "pm_h8d2v",
    address: "1102 E Magnolia Blvd, Apt 4",
    city: "Tampa",
    state: "FL",
    monthlyRent: 1_295.00,
    bedrooms: 2,
    bathrooms: 1,
    petPolicy: "no pets",
    acceptsVouchers: true,
    preferredCreditMin: "580-619", // inclusive — lowest credit minimum
    availableDate: "2026-04-01",
    status: "Active",
  },
  {
    id: "lst_b6y1m",
    managerId: "pm_h8d2v",
    address: "8840 N Dale Mabry Hwy, Unit 33",
    city: "Tampa",
    state: "FL",
    monthlyRent: 1_740.00,
    bedrooms: 2,
    bathrooms: 2,
    petPolicy: "allowed",
    acceptsVouchers: false,
    preferredCreditMin: "680-719",
    availableDate: "2026-03-01",
    status: "Pending",
  },
  {
    id: "lst_fil3c",
    managerId: "pm_h8d2v",
    address: "4407 Henderson Blvd, Apt 110",
    city: "Tampa",
    state: "FL",
    monthlyRent: 1_580.00,
    bedrooms: 1,
    bathrooms: 1,
    petPolicy: "no pets",
    acceptsVouchers: false,
    preferredCreditMin: "680-719",
    availableDate: "2026-02-01",
    status: "Filled", // edge case: already filled
  },
  {
    id: "lst_u5c2n",
    managerId: "pm_c6q4s",
    address: "920 S Colorado Blvd, Unit 14",
    city: "Denver",
    state: "CO",
    monthlyRent: 2_350.00,
    bedrooms: 2,
    bathrooms: 2,
    petPolicy: "case-by-case",
    acceptsVouchers: false,
    preferredCreditMin: "720+",
    availableDate: "2026-03-01",
    status: "Active",
  },
  {
    id: "lst_o7p4q",
    managerId: "pm_c6q4s",
    address: "1850 Larimer St, Unit 401",
    city: "Denver",
    state: "CO",
    monthlyRent: 2_890.00,
    bedrooms: 3,
    bathrooms: 2,
    petPolicy: "allowed",
    acceptsVouchers: false,
    preferredCreditMin: "720+",
    availableDate: "2026-04-15",
    status: "Active",
  },
  {
    id: "lst_r2w8f",
    managerId: "pm_xf9m2",
    address: "3310 N Lamar Blvd, Unit 2B",
    city: "Austin",
    state: "TX",
    monthlyRent: 2_750.00,
    bedrooms: 3,
    bathrooms: 2,
    petPolicy: "allowed",
    acceptsVouchers: false,
    preferredCreditMin: "720+",
    availableDate: "2026-03-15",
    status: "Active",
  },
  {
    id: "lst_s4k6h",
    managerId: "pm_r1t5w",
    address: "670 Collier Ave, Unit 9",
    city: "Charlotte",
    state: "NC",
    monthlyRent: 1_350.00,
    bedrooms: 1,
    bathrooms: 1,
    petPolicy: "no pets",
    acceptsVouchers: true,
    preferredCreditMin: "620-679",
    availableDate: "2026-03-01",
    status: "Active",
  },
  {
    id: "lst_x1d9j",
    managerId: "pm_j0b9u",
    address: "2090 Brickell Ave, Suite 520",
    city: "Miami",
    state: "FL",
    monthlyRent: 3_100.00,
    bedrooms: 2,
    bathrooms: 2,
    petPolicy: "no pets",
    acceptsVouchers: false,
    preferredCreditMin: "720+",
    availableDate: "2026-04-01",
    status: "Active",
  },
  {
    id: "lst_v3g5c",
    managerId: "pm_j0b9u",
    address: "411 NW 2nd Ave, Unit 7",
    city: "Miami",
    state: "FL",
    monthlyRent: 2_240.00,
    bedrooms: 2,
    bathrooms: 1,
    petPolicy: "case-by-case",
    acceptsVouchers: false,
    preferredCreditMin: "680-719",
    availableDate: "2026-03-15",
    status: "Pending",
  },
];

// ---------------------------------------------------------------------------
// Dataset 4: Leads & Inquiries (25 records)
// Pipeline from PM + Renter match. Status distribution:
//   ~20% New Match, ~20% Inquiry Sent, ~16% Showing Scheduled,
//   ~16% Application Received, ~8% Under Review,
//   ~10% Approved, ~6% Declined, ~4% Withdrew
// Edge cases:
//   - Withdrew (renter backed out) (lead_wdw2k)
//   - Declined with note explaining reason (lead_dcl4p)
//   - Very recent match with no activity yet (lead_new8r, lead_u3j9q)
// ---------------------------------------------------------------------------
export const leadsAndInquiries: LeadAndInquiry[] = [
  { id: "lead_a1m8p", listingId: "lst_q8w3p", resumeId: "rr_k8m2p",  managerId: "pm_xf9m2", status: "Showing Scheduled",    initiatedDate: "2026-02-14T10:00:00Z", lastActivity: "2026-02-24T14:30:00Z", notes: "Showing confirmed for Feb 28 at 10am" },
  { id: "lead_b2t4n", listingId: "lst_m4r7k", resumeId: "rr_hi9f2",  managerId: "pm_xf9m2", status: "Application Received",  initiatedDate: "2026-02-07T09:15:00Z", lastActivity: "2026-02-22T11:20:00Z", notes: "Full application submitted; references sent" },
  { id: "lead_c3r9q", listingId: "lst_hcv2a", resumeId: "rr_hcv3x",  managerId: "pm_r1t5w", status: "Inquiry Sent",           initiatedDate: "2026-02-19T08:40:00Z", lastActivity: "2026-02-19T08:40:00Z", notes: null },
  { id: "lead_d4k7s", listingId: "lst_a3e5t", resumeId: "rr_w5j9b",  managerId: "pm_p3k7n", status: "Under Review",           initiatedDate: "2026-02-10T13:25:00Z", lastActivity: "2026-02-23T16:00:00Z", notes: "Income verification docs requested" },
  { id: "lead_e5v2w", listingId: "lst_u5c2n", resumeId: "rr_hi9f2",  managerId: "pm_c6q4s", status: "Approved",               initiatedDate: "2026-01-28T09:00:00Z", lastActivity: "2026-02-21T10:15:00Z", notes: "Lease signing scheduled for Mar 1" },
  { id: "lead_f6j1b", listingId: "lst_pet5b", resumeId: "rr_f7c1v",  managerId: "pm_r1t5w", status: "Showing Scheduled",    initiatedDate: "2026-02-18T11:30:00Z", lastActivity: "2026-02-25T09:00:00Z", notes: "PM confirmed showing on Mar 2" },
  { id: "lead_g7z4c", listingId: "lst_r2w8f", resumeId: "rr_t6e0n",  managerId: "pm_xf9m2", status: "Application Received",  initiatedDate: "2026-02-11T15:45:00Z", lastActivity: "2026-02-24T13:00:00Z", notes: null },
  { id: "lead_h8x6d", listingId: "lst_o7p4q", resumeId: "rr_w5j9b",  managerId: "pm_c6q4s", status: "New Match",              initiatedDate: "2026-02-25T07:55:00Z", lastActivity: "2026-02-25T07:55:00Z", notes: null },
  { id: "lead_i9y3e", listingId: "lst_q8w3p", resumeId: "rr_se5m1",  managerId: "pm_xf9m2", status: "Inquiry Sent",           initiatedDate: "2026-02-20T10:10:00Z", lastActivity: "2026-02-20T10:10:00Z", notes: "Awaiting renter response" },
  { id: "lead_j1u7f", listingId: "lst_low8d", resumeId: "rr_ev84n",  managerId: "pm_h8d2v", status: "Inquiry Sent",           initiatedDate: "2026-02-17T14:00:00Z", lastActivity: "2026-02-17T14:00:00Z", notes: "PM acknowledged eviction disclosure" },
  { id: "lead_k2w5g", listingId: "lst_b6y1m", resumeId: "rr_q1h6k",  managerId: "pm_h8d2v", status: "Showing Scheduled",    initiatedDate: "2026-02-13T09:30:00Z", lastActivity: "2026-02-24T12:00:00Z", notes: "Pet inspection included in showing" },
  { id: "lead_l3e8h", listingId: "lst_s4k6h", resumeId: "rr_hcv3x",  managerId: "pm_r1t5w", status: "Application Received",  initiatedDate: "2026-02-08T11:00:00Z", lastActivity: "2026-02-23T14:30:00Z", notes: "HCV paperwork packet sent to housing authority" },
  { id: "lead_m4r1i", listingId: "lst_n9v6d", resumeId: "rr_m2s5c",  managerId: "pm_r1t5w", status: "New Match",              initiatedDate: "2026-02-24T16:20:00Z", lastActivity: "2026-02-24T16:20:00Z", notes: null },
  { id: "lead_n5t4j", listingId: "lst_x1d9j", resumeId: "rr_l7o2f",  managerId: "pm_j0b9u", status: "Inquiry Sent",           initiatedDate: "2026-02-21T08:00:00Z", lastActivity: "2026-02-21T08:00:00Z", notes: null },
  { id: "lead_o6s9k", listingId: "lst_a3e5t", resumeId: "rr_t6e0n",  managerId: "pm_p3k7n", status: "Approved",               initiatedDate: "2026-01-20T13:00:00Z", lastActivity: "2026-02-12T09:45:00Z", notes: "Lease executed — move-in Mar 1" },
  { id: "lead_p7q2l", listingId: "lst_v3g5c", resumeId: "rr_a8p3x",  managerId: "pm_j0b9u", status: "Under Review",           initiatedDate: "2026-02-15T10:30:00Z", lastActivity: "2026-02-25T11:00:00Z", notes: "Background check ordered" },
  { id: "lead_wdw2k", listingId: "lst_u5c2n", resumeId: "rr_f7c1v",  managerId: "pm_c6q4s", status: "Withdrew",               initiatedDate: "2026-02-05T09:00:00Z", lastActivity: "2026-02-16T15:30:00Z", notes: "Renter withdrew — found another unit" },
  { id: "lead_dcl4p", listingId: "lst_x1d9j", resumeId: "rr_d2m8z",  managerId: "pm_j0b9u", status: "Declined",               initiatedDate: "2026-01-29T11:00:00Z", lastActivity: "2026-02-10T09:00:00Z", notes: "PM declined — credit below minimum threshold for this listing" },
  { id: "lead_new8r", listingId: "lst_o7p4q", resumeId: "rr_a8p3x",  managerId: "pm_c6q4s", status: "New Match",              initiatedDate: "2026-02-26T06:30:00Z", lastActivity: "2026-02-26T06:30:00Z", notes: null },
  { id: "lead_q8p5m", listingId: "lst_r2w8f", resumeId: "rr_l7o2f",  managerId: "pm_xf9m2", status: "Showing Scheduled",    initiatedDate: "2026-02-17T09:45:00Z", lastActivity: "2026-02-25T14:00:00Z", notes: "Showing Feb 28 at 2pm" },
  { id: "lead_r9c6n", listingId: "lst_hcv2a", resumeId: "rr_y4r7g",  managerId: "pm_r1t5w", status: "Application Received",  initiatedDate: "2026-02-12T10:00:00Z", lastActivity: "2026-02-24T09:30:00Z", notes: "HCV inspection scheduled Mar 5" },
  { id: "lead_s1d7o", listingId: "lst_q8w3p", resumeId: "rr_n3q7r",  managerId: "pm_xf9m2", status: "Approved",               initiatedDate: "2025-12-10T08:00:00Z", lastActivity: "2026-01-28T14:00:00Z", notes: "Lease signed — Jan 28 move-in" },
  { id: "lead_t2k8p", listingId: "lst_m4r7k", resumeId: "rr_b9u1d",  managerId: "pm_xf9m2", status: "Approved",               initiatedDate: "2025-12-28T13:00:00Z", lastActivity: "2026-01-10T10:00:00Z", notes: "Approved — lease sent for signature" },
  { id: "lead_u3j9q", listingId: "lst_pet5b", resumeId: "rr_q1h6k",  managerId: "pm_r1t5w", status: "New Match",              initiatedDate: "2026-02-26T07:10:00Z", lastActivity: "2026-02-26T07:10:00Z", notes: null },
  { id: "lead_v4h2r", listingId: "lst_low8d", resumeId: "rr_z3v6q",  managerId: "pm_h8d2v", status: "Declined",               initiatedDate: "2026-02-03T09:30:00Z", lastActivity: "2026-02-11T14:00:00Z", notes: "PM declined felony disclosure per company policy" },
];

// ---------------------------------------------------------------------------
// Dataset 5: Screening Reports (10 records)
// Edge cases:
//   - Expired report (rpt_exp4z) — common when renter takes too long to commit
//   - Pending report with no completedDate (rpt_pen1w)
//   - Report not acknowledged by renter (acknowledged: false) (rpt_f4j9c)
// ---------------------------------------------------------------------------
export const screeningReports: ScreeningReport[] = [
  { id: "rpt_q8w3m", resumeId: "rr_hi9f2",  managerId: "pm_xf9m2", reportType: "credit",     status: "Report Ready", requestedDate: "2026-02-08T10:00:00Z", completedDate: "2026-02-09T14:22:00Z", expiresDate: "2026-05-09", acknowledged: true,  acknowledgedDate: "2026-02-09T16:00:00Z" },
  { id: "rpt_a3r7n", resumeId: "rr_hi9f2",  managerId: "pm_c6q4s", reportType: "background", status: "Report Ready", requestedDate: "2026-01-30T11:00:00Z", completedDate: "2026-01-31T15:40:00Z", expiresDate: "2026-04-30", acknowledged: true,  acknowledgedDate: "2026-01-31T17:00:00Z" },
  { id: "rpt_b9k5s", resumeId: "rr_hcv3x",  managerId: "pm_r1t5w", reportType: "credit",     status: "Report Ready", requestedDate: "2026-02-09T09:30:00Z", completedDate: "2026-02-10T13:15:00Z", expiresDate: "2026-05-10", acknowledged: true,  acknowledgedDate: "2026-02-10T15:00:00Z" },
  { id: "rpt_c1t8p", resumeId: "rr_ev84n",  managerId: "pm_h8d2v", reportType: "eviction",   status: "Report Ready", requestedDate: "2026-02-18T10:00:00Z", completedDate: "2026-02-19T11:30:00Z", expiresDate: "2026-05-19", acknowledged: true,  acknowledgedDate: "2026-02-19T12:45:00Z" },
  { id: "rpt_exp4z", resumeId: "rr_n3q7r",  managerId: "pm_xf9m2", reportType: "credit",     status: "Expired",      requestedDate: "2025-11-15T08:00:00Z", completedDate: "2025-11-16T10:00:00Z", expiresDate: "2026-02-15", acknowledged: true,  acknowledgedDate: "2025-11-16T12:00:00Z" },
  { id: "rpt_pen1w", resumeId: "rr_l7o2f",  managerId: "pm_j0b9u", reportType: "background", status: "Pending",      requestedDate: "2026-02-22T09:00:00Z", completedDate: null,                   expiresDate: null,         acknowledged: false, acknowledgedDate: null },
  { id: "rpt_d6m2q", resumeId: "rr_t6e0n",  managerId: "pm_p3k7n", reportType: "credit",     status: "Report Ready", requestedDate: "2026-01-21T14:00:00Z", completedDate: "2026-01-22T09:20:00Z", expiresDate: "2026-04-22", acknowledged: true,  acknowledgedDate: "2026-01-22T11:00:00Z" },
  { id: "rpt_e7v4r", resumeId: "rr_w5j9b",  managerId: "pm_p3k7n", reportType: "background", status: "Report Ready", requestedDate: "2026-02-11T10:30:00Z", completedDate: "2026-02-12T14:00:00Z", expiresDate: "2026-05-12", acknowledged: true,  acknowledgedDate: "2026-02-12T16:30:00Z" },
  { id: "rpt_f4j9c", resumeId: "rr_d2m8z",  managerId: "pm_j0b9u", reportType: "credit",     status: "Report Ready", requestedDate: "2026-01-30T09:00:00Z", completedDate: "2026-01-31T11:45:00Z", expiresDate: "2026-04-30", acknowledged: false, acknowledgedDate: null },
  { id: "rpt_g2u6d", resumeId: "rr_p9t4w",  managerId: "pm_xf9m2", reportType: "background", status: "Report Ready", requestedDate: "2026-02-15T11:00:00Z", completedDate: "2026-02-16T13:00:00Z", expiresDate: "2026-05-16", acknowledged: true,  acknowledgedDate: "2026-02-16T14:30:00Z" },
];

// ---------------------------------------------------------------------------
// Dataset 6: Messages (18 records)
// Between matched PMs and tenants across active leads
// ---------------------------------------------------------------------------
export const messages: Message[] = [
  { id: "msg_a1q8w", leadId: "lead_a1m8p", senderId: "pm_xf9m2",  senderRole: "manager", content: "Hi Marcus — great Rental Resume. I'd love to schedule a showing for the Ridgecrest unit. Are you available Sat Feb 28 at 10am?",                                                 timestamp: "2026-02-14T10:05:00Z", read: true  },
  { id: "msg_b2r4e", leadId: "lead_a1m8p", senderId: "rr_k8m2p",  senderRole: "tenant",  content: "Yes, that works perfectly. I'll be there. Should I bring anything?",                                                                                                              timestamp: "2026-02-14T11:22:00Z", read: true  },
  { id: "msg_c3t7y", leadId: "lead_a1m8p", senderId: "pm_xf9m2",  senderRole: "manager", content: "Just a valid ID. We'll do the full walkthrough — about 30 minutes. See you then!",                                                                                               timestamp: "2026-02-14T12:00:00Z", read: true  },
  { id: "msg_d4u1i", leadId: "lead_b2t4n", senderId: "pm_xf9m2",  senderRole: "manager", content: "Priya, I've reviewed your application. Your income-to-rent ratio is excellent at 4.8x. Moving to final review — should have an answer by Mon.",                                 timestamp: "2026-02-22T11:30:00Z", read: true  },
  { id: "msg_e5v6o", leadId: "lead_b2t4n", senderId: "rr_hi9f2",  senderRole: "tenant",  content: "Thank you! Looking forward to hearing back. Happy to provide any additional documents if needed.",                                                                                timestamp: "2026-02-22T13:45:00Z", read: true  },
  { id: "msg_f6w2p", leadId: "lead_c3r9q", senderId: "pm_r1t5w",  senderRole: "manager", content: "Hello Darnell — we accept HCV vouchers on this unit. Can you confirm your voucher amount and contact your housing authority to start the paperwork?",                            timestamp: "2026-02-19T08:45:00Z", read: false },
  { id: "msg_g7x9a", leadId: "lead_d4k7s", senderId: "pm_p3k7n",  senderRole: "manager", content: "Hi Aisha — the 3BR on Westheimer is a strong match. We'll need 2 months of bank statements to verify income. Can you upload those through the portal?",                         timestamp: "2026-02-23T16:05:00Z", read: true  },
  { id: "msg_h8y3s", leadId: "lead_d4k7s", senderId: "rr_w5j9b",  senderRole: "tenant",  content: "Absolutely — uploading now. I have direct deposit statements from my employer as well if that helps.",                                                                           timestamp: "2026-02-23T17:30:00Z", read: true  },
  { id: "msg_i9z7d", leadId: "lead_e5v2w", senderId: "pm_c6q4s",  senderRole: "manager", content: "Priya — you're approved for the S Colorado unit! Lease will be emailed within 24 hours. Move-in confirmed March 1.",                                                            timestamp: "2026-02-21T10:20:00Z", read: true  },
  { id: "msg_j1a5f", leadId: "lead_e5v2w", senderId: "rr_hi9f2",  senderRole: "tenant",  content: "This is fantastic news — thank you! I'll review the lease right away.",                                                                                                          timestamp: "2026-02-21T11:00:00Z", read: true  },
  { id: "msg_k2b4g", leadId: "lead_f6j1b", senderId: "pm_r1t5w",  senderRole: "manager", content: "Rachel — we're pet-friendly on a case-by-case basis. Your Border Collie sounds great. Looking forward to meeting you both at the showing.",                                     timestamp: "2026-02-25T09:10:00Z", read: true  },
  { id: "msg_l3c8h", leadId: "lead_g7z4c", senderId: "pm_xf9m2",  senderRole: "manager", content: "Omar — your application for N Lamar is in. With your income-to-rent ratio at 5.2x you're well qualified. Expect a decision by end of week.",                                   timestamp: "2026-02-24T13:05:00Z", read: true  },
  { id: "msg_m4d1j", leadId: "lead_j1u7f", senderId: "pm_h8d2v",  senderRole: "manager", content: "Tamara — we reviewed your Rental Resume and appreciate your transparency about the 2021 eviction. We'd like to discuss further. Are you available for a quick call?",           timestamp: "2026-02-17T14:15:00Z", read: true  },
  { id: "msg_n5e6k", leadId: "lead_j1u7f", senderId: "rr_ev84n",  senderRole: "tenant",  content: "Yes — I can take a call anytime this week. Thank you for considering my application.",                                                                                           timestamp: "2026-02-17T15:00:00Z", read: true  },
  { id: "msg_o6f2l", leadId: "lead_k2w5g", senderId: "pm_h8d2v",  senderRole: "manager", content: "Tyler — two dogs is fine on this unit. Showing includes a pet review and a $300 pet deposit if approved. Does that work?",                                                      timestamp: "2026-02-24T12:05:00Z", read: true  },
  { id: "msg_p7g9m", leadId: "lead_l3e8h", senderId: "pm_r1t5w",  senderRole: "manager", content: "Darnell — your application for the Collier Ave unit is complete. We've notified the housing authority. Inspection is scheduled for March 5.",                                   timestamp: "2026-02-23T14:35:00Z", read: true  },
  { id: "msg_q8h4n", leadId: "lead_p7q2l", senderId: "pm_j0b9u",  senderRole: "manager", content: "Linda — background check is ordered. Should be complete within 2-3 business days. I'll reach out as soon as results come in.",                                                  timestamp: "2026-02-25T11:10:00Z", read: false },
  { id: "msg_r9i7o", leadId: "lead_q8p5m", senderId: "rr_l7o2f",  senderRole: "tenant",  content: "Confirmed for Friday at 2pm. Very excited about the N Lamar unit — the layout looks perfect.",                                                                                  timestamp: "2026-02-25T14:30:00Z", read: true  },
];

// ---------------------------------------------------------------------------
// Dataset 7: Monthly Match Data (12 months, Mar 2025 – Feb 2026)
// PropTech rental marketplace seasonality:
//   Spring (Mar-Jun): peak lease season — surge in new resumes and inquiries
//   Summer (Jul-Aug): plateau then slight dip
//   Fall-Winter (Sep-Dec): declining activity, holiday slowdown
//   Jan-Feb: new year recovery, spring ramp beginning
// ---------------------------------------------------------------------------
export const monthlyMatchData: MonthlyMatchData[] = [
  { month: "Mar", newResumes: 142, inquiriesSent: 89,  leasesCompleted: 18 }, // spring lease surge
  { month: "Apr", newResumes: 167, inquiriesSent: 104, leasesCompleted: 24 }, // peak spring search
  { month: "May", newResumes: 183, inquiriesSent: 118, leasesCompleted: 29 }, // peak lease signing
  { month: "Jun", newResumes: 174, inquiriesSent: 111, leasesCompleted: 31 }, // summer peak
  { month: "Jul", newResumes: 158, inquiriesSent: 97,  leasesCompleted: 27 }, // mid-summer plateau
  { month: "Aug", newResumes: 144, inquiriesSent: 88,  leasesCompleted: 22 }, // late summer dip
  { month: "Sep", newResumes: 131, inquiriesSent: 79,  leasesCompleted: 17 }, // back-to-school slowdown
  { month: "Oct", newResumes: 119, inquiriesSent: 72,  leasesCompleted: 14 }, // fall trough
  { month: "Nov", newResumes: 108, inquiriesSent: 64,  leasesCompleted: 11 }, // holiday slowdown
  { month: "Dec", newResumes: 97,  inquiriesSent: 58,  leasesCompleted: 9  }, // seasonal low
  { month: "Jan", newResumes: 124, inquiriesSent: 76,  leasesCompleted: 13 }, // new year recovery
  { month: "Feb", newResumes: 149, inquiriesSent: 93,  leasesCompleted: 19 }, // spring ramp beginning
];

// ---------------------------------------------------------------------------
// Dashboard Stats — PropTech marketplace KPIs
// ---------------------------------------------------------------------------
export const dashboardStats: DashboardStats = {
  totalRentalResumes: 1_847,
  resumesChange: 12.4,
  activeListings: 94,
  listingsChange: 7.1,
  qualifiedMatches: 318,
  matchesChange: 9.7,
  leasesThisMonth: 19,
  leasesChange: 46.2,          // vs 13 in January — strong spring uptick
  inquiryToShowingRate: 41.3,  // percentage
  inquiryToShowingChange: 2.8,
  avgIncomeToRentRatio: 3.6,
};

// ---------------------------------------------------------------------------
// Chart Data: Resume Status Breakdown (categorical)
// ---------------------------------------------------------------------------
export const resumeStatusBreakdown: ResumeStatusBreakdown[] = [
  { status: "Looking",    count: 1_024, percentage: 55.4 },
  { status: "Matched",    count: 312,   percentage: 16.9 },
  { status: "Paused",     count: 218,   percentage: 11.8 },
  { status: "Leased",     count: 181,   percentage: 9.8  },
  { status: "Incomplete", count: 112,   percentage: 6.1  },
];

// ---------------------------------------------------------------------------
// Chart Data: Lead Funnel Stages (categorical — pipeline conversion)
// ---------------------------------------------------------------------------
export const leadFunnelData: LeadFunnelStage[] = [
  { stage: "New Match",            count: 847 },
  { stage: "Inquiry Sent",         count: 523 },
  { stage: "Showing Scheduled",    count: 291 },
  { stage: "Application Received", count: 174 },
  { stage: "Under Review",         count: 98  },
  { stage: "Approved",             count: 61  },
];

// ---------------------------------------------------------------------------
// Chart Data: Credit Range Distribution (categorical)
// ---------------------------------------------------------------------------
export const creditRangeBreakdown: CreditRangeBreakdown[] = [
  { range: "720+",    count: 682 },
  { range: "680-719", count: 594 },
  { range: "620-679", count: 421 },
  { range: "580-619", count: 150 },
];

// ---------------------------------------------------------------------------
// Lookup Helpers
// ---------------------------------------------------------------------------
export const getResumeById = (id: string) =>
  rentalResumes.find((r) => r.id === id);

export const getPropertyManagerById = (id: string) =>
  propertyManagers.find((pm) => pm.id === id);

export const getListingById = (id: string) =>
  activeListings.find((l) => l.id === id);

export const getListingsByManager = (managerId: string) =>
  activeListings.filter((l) => l.managerId === managerId);

export const getLeadsByListing = (listingId: string) =>
  leadsAndInquiries.filter((lead) => lead.listingId === listingId);

export const getLeadsByResume = (resumeId: string) =>
  leadsAndInquiries.filter((lead) => lead.resumeId === resumeId);

export const getMessagesByLead = (leadId: string) =>
  messages.filter((m) => m.leadId === leadId);

export const getScreeningReportsByResume = (resumeId: string) =>
  screeningReports.filter((r) => r.resumeId === resumeId);
