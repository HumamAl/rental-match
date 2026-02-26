# Screening Answers

## Q1: Examples of two-sided marketplaces or search-based apps you have built

Most relevant: Rental PM Connect — a two-sided matching platform with separate owner/PM dashboards, a matching algorithm, and vetting workflows.

Built a working version for your reverse-search concept specifically: https://rental-match-two.vercel.app

Also built Lynt Marketplace — full vendor onboarding, listing management, and transaction tracking.

---

## Q2: A brief explanation of how you would handle radius-based searching and data privacy

Radius search via geocoding + Haversine distance (or PostGIS if you want indexed performance at scale). Privacy: tenant profiles return anonymized in search results — no name, no photo — until a Property Manager initiates contact and accepts a Fair Housing compliance acknowledgement, which is the same gate you described for eviction and felony disclosures.

The demo shows this flow: https://rental-match-two.vercel.app

---

## Q3: Your preferred tech stack for a fast, scalable MVP

Next.js App Router + Supabase — your preferred stack. Supabase handles auth, Postgres row-level security to isolate tenant/manager data, and Realtime for in-app messaging. Mapbox for radius search. Fast to ship, easy to extend.

Demo built on this stack: https://rental-match-two.vercel.app
