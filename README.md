# CrossVal × SIC — Document Processing Demo

Tailored demo of CrossVal's document processing flow for **Sun International Corporation FZC L.L.C** (SIC), a cable management systems distributor based in Sharjah, UAE (est. 1966). Built from public data on [suncorpn.com](https://www.suncorpn.com).

## What it shows

Upload a supplier PO or delivery note, and the system:

1. Extracts line items
2. Posts a balanced double-entry journal to the **general ledger**
3. Routes the stock into the correct **warehouse** (SIC operates 3: Sharjah Saif Zone, Al Khabisi Deira, Jebel Ali FZ)
4. Links the shipment to a **project** or product approval

After "Confirm & Save", the user lands in a full app shell (Dashboard, Inventory, Warehouses, General Ledger, Projects, Documents).

## Data model

Everything is seeded with realistic SIC data:

- **13 SKUs** across cable glands (CMP, Hawke, CCG Peppers), lugs (JSL Industries), accessories (3M, Panduit, Band-It), trays & trunking (Legrand), conduits (OBO Bettermann) — each tagged to a specific warehouse.
- **15 ledger entries** across 5 POs from real cable-management suppliers (CMP Products UK, JSL Industries, 3M Emirates, Legrand ME, Peppers Gulf).
- **4 projects** drawn from SIC's public project list: Etihad Rail Stage 2 & 3, Al Maryah Vista, Bvlgari Promenade Marina Lofts, Business Bay Tower (BB.A02.016).
- **Consultants / customers** from the same list: Jacobs, Pioneer Engineering, Khatib & Alami, LACASA Architects.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo shortcuts

- `/#results` — jump straight to the extracted-document results preview
- `/#app` — jump straight into the app shell (skip the upload flow)

## Stack

Next.js 16.2.4 (Turbopack) · React 19 · Tailwind v4 · framer-motion · react-icons. Single-file frontend, no backend — all data is hardcoded constants in `app/page.js`.

## Companion repo

The original generic demo (Skyhawk Catering variant) lives at [ajinkyat86/doc-flow-demo](https://github.com/ajinkyat86/doc-flow-demo).
