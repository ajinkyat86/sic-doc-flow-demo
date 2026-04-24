"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCloudUploadOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircle,
  IoArrowForward,
  IoReceiptOutline,
  IoCubeOutline,
  IoGridOutline,
  IoFolderOpenOutline,
  IoAddCircleOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoChevronDown,
  IoChevronForward,
  IoConstructOutline,
  IoStatsChartOutline,
  IoNotificationsOutline,
  IoGlobeOutline,
  IoLayersOutline,
  IoBusinessOutline,
  IoLocationOutline,
  IoPencilOutline,
  IoShieldCheckmarkOutline,
  IoAlertCircleOutline,
  IoSwapHorizontalOutline,
  IoArrowUpCircleOutline,
  IoArrowDownCircleOutline,
  IoClose,
  IoFlashOutline,
} from "react-icons/io5";

// ─── Company ────────────────────────────────────────────────────────────
const COMPANY = {
  legalName: "Sun International Corporation FZC L.L.C",
  short: "SIC",
  tagline: "Cable Management Systems Distributor · Est. 1966",
};

// ─── Warehouses ─────────────────────────────────────────────────────────
const WAREHOUSES = [
  { id: "WH-SHJ",  name: "Sharjah Saif Zone",  short: "Sharjah HQ",   address: "Saif Zone, Sharjah",              role: "Head Office · Main Warehouse" },
  { id: "WH-DXB",  name: "Al Khabisi, Deira",  short: "Dubai Branch", address: "Al Khabisi, Deira, Dubai",        role: "Branch · Technical Office" },
  { id: "WH-JAFZ", name: "Jebel Ali FZ",       short: "Jebel Ali",    address: "Jebel Ali Free Zone, Dubai",      role: "Bulk Storage" },
];
const WH_LABEL = Object.fromEntries(WAREHOUSES.map((w) => [w.id, w.short]));

// ─── Inventory (with minQty for reorder alerts) ─────────────────────────
const EXISTING_INVENTORY = [
  { id: "INV-001", section: "CABLE GLANDS",     productName: "CMP A2F BRASS CABLE GLAND 20MM",          prdCat: "INDUSTRIAL",       brand: "CMP Products",       warehouse: "WH-SHJ",  package: "PC",       qty: 250,  minQty: 150, price: 12.50,  inventoryValue: 3125.00  },
  { id: "INV-002", section: "CABLE GLANDS",     productName: "HAWKE ICG-623 EXD GLAND M20",             prdCat: "EXPLOSION PROOF",  brand: "Hawke International",warehouse: "WH-SHJ",  package: "PC",       qty: 80,   minQty: 100, price: 145.00, inventoryValue: 11600.00 },
  { id: "INV-003", section: "LUGS & TERMINALS", productName: "COPPER LUG 16MM² CU",                     prdCat: "TERMINATION",      brand: "JSL Industries",     warehouse: "WH-DXB",  package: "PC",       qty: 2000, minQty: 1000,price: 1.80,   inventoryValue: 3600.00  },
  { id: "INV-004", section: "LUGS & TERMINALS", productName: "ALUMINUM LUG 35MM² AL",                   prdCat: "TERMINATION",      brand: "JSL Industries",     warehouse: "WH-DXB",  package: "PC",       qty: 1500, minQty: 800, price: 2.50,   inventoryValue: 3750.00  },
  { id: "INV-005", section: "LUGS & TERMINALS", productName: "INSULATED RING TERMINAL 6MM² RED",        prdCat: "TERMINATION",      brand: "Panduit",            warehouse: "WH-DXB",  package: "PACK/100", qty: 45,   minQty: 50,  price: 28.00,  inventoryValue: 1260.00  },
  { id: "INV-006", section: "ACCESSORIES",      productName: "3M HEAT SHRINK SLEEVE 12MM BLACK",        prdCat: "SLEEVES",          brand: "3M",                 warehouse: "WH-SHJ",  package: "METER",    qty: 500,  minQty: 300, price: 4.80,   inventoryValue: 2400.00  },
  { id: "INV-007", section: "ACCESSORIES",      productName: "NYLON CABLE TIE 200MM BLACK UV",          prdCat: "TIES",             brand: "Panduit",            warehouse: "WH-DXB",  package: "PACK/100", qty: 60,   minQty: 40,  price: 18.00,  inventoryValue: 1080.00  },
  { id: "INV-008", section: "ACCESSORIES",      productName: "SS316 CABLE TIE 360MM",                    prdCat: "TIES",             brand: "Band-It",            warehouse: "WH-JAFZ", package: "PACK/100", qty: 25,   minQty: 30,  price: 92.00,  inventoryValue: 2300.00  },
  { id: "INV-009", section: "ACCESSORIES",      productName: "CABLE MARKER SET EC1 0-9",                 prdCat: "MARKERS",          brand: "Panduit",            warehouse: "WH-DXB",  package: "SET",      qty: 40,   minQty: 25,  price: 65.00,  inventoryValue: 2600.00  },
  { id: "INV-010", section: "TRAYS & TRUNKING", productName: "HDG CABLE TRAY 300MM PERFORATED",          prdCat: "TRAYS",            brand: "Legrand",            warehouse: "WH-JAFZ", package: "METER",    qty: 180,  minQty: 120, price: 95.00,  inventoryValue: 17100.00 },
  { id: "INV-011", section: "TRAYS & TRUNKING", productName: "PRG TRUNKING 100X100 HDG",                 prdCat: "TRUNKING",         brand: "Legrand",            warehouse: "WH-JAFZ", package: "METER",    qty: 300,  minQty: 150, price: 48.00,  inventoryValue: 14400.00 },
  { id: "INV-012", section: "CONDUITS",         productName: "GI CONDUIT 25MM HEAVY GAUGE",              prdCat: "RIGID",            brand: "OBO Bettermann",     warehouse: "WH-SHJ",  package: "METER",    qty: 600,  minQty: 400, price: 8.40,   inventoryValue: 5040.00  },
];

const NEW_INVENTORY_ENTRY = {
  id: "INV-013", section: "CABLE GLANDS", productName: "CCG PEPPERS A2F NI-PLATED BRASS GLAND 25MM", prdCat: "INDUSTRIAL", brand: "CCG Peppers", warehouse: "WH-SHJ", package: "PC", qty: 100, minQty: 50, price: 28.50, inventoryValue: 2850.00, isNew: true,
};

// ─── Ledger ─────────────────────────────────────────────────────────────
const EXISTING_LEDGER = [
  { date: "01/04/2026", ref: "PO-72401", account: "Inventory — Electrical Components", description: "Cable glands restock — CMP Products UK", debit: 18450.00, credit: null },
  { date: "01/04/2026", ref: "PO-72401", account: "VAT Input Tax (5%)",                 description: "Tax on PO-72401",                         debit: 922.50,   credit: null },
  { date: "01/04/2026", ref: "PO-72401", account: "Accounts Payable — CMP Products",    description: "Cable glands restock — CMP Products UK", debit: null,     credit: 19372.50 },
  { date: "08/04/2026", ref: "PO-72415", account: "Inventory — Electrical Components", description: "Copper & aluminum lugs — JSL Industries",debit: 7350.00,  credit: null },
  { date: "08/04/2026", ref: "PO-72415", account: "VAT Input Tax (5%)",                 description: "Tax on PO-72415",                         debit: 367.50,   credit: null },
  { date: "08/04/2026", ref: "PO-72415", account: "Accounts Payable — JSL Industries",  description: "Copper & aluminum lugs — JSL Industries",debit: null,     credit: 7717.50 },
  { date: "14/04/2026", ref: "PO-72428", account: "Inventory — Electrical Components", description: "Heat shrink sleeves & markers — 3M / Panduit", debit: 4280.00, credit: null },
  { date: "14/04/2026", ref: "PO-72428", account: "VAT Input Tax (5%)",                 description: "Tax on PO-72428",                         debit: 214.00,   credit: null },
  { date: "14/04/2026", ref: "PO-72428", account: "Accounts Payable — 3M Emirates",     description: "Heat shrink sleeves & markers — 3M / Panduit", debit: null, credit: 4494.00 },
  { date: "20/04/2026", ref: "PO-72441", account: "Inventory — Electrical Components", description: "HDG cable trays & PRG trunking — Legrand ME", debit: 31500.00, credit: null },
  { date: "20/04/2026", ref: "PO-72441", account: "VAT Input Tax (5%)",                 description: "Tax on PO-72441",                         debit: 1575.00,  credit: null },
  { date: "20/04/2026", ref: "PO-72441", account: "Accounts Payable — Legrand ME",      description: "HDG cable trays & PRG trunking — Legrand ME", debit: null, credit: 33075.00 },
];

const INBOUND_LEDGER_ENTRIES = [
  { date: "23/04/2026", ref: "PO-72458", account: "Inventory — Electrical Components", description: "CCG Peppers A2F Ni-Plated Brass Cable Gland 25mm — 100pc", debit: 2850.00, credit: null,    isNew: true, flow: "inbound" },
  { date: "23/04/2026", ref: "PO-72458", account: "VAT Input Tax (5%)",                 description: "Tax on PO-72458",                                          debit: 142.50,  credit: null,    isNew: true, flow: "inbound" },
  { date: "23/04/2026", ref: "PO-72458", account: "Accounts Payable — Peppers Gulf",    description: "CCG Peppers A2F Ni-Plated Brass Cable Gland 25mm — 100pc", debit: null,    credit: 2992.50, isNew: true, flow: "inbound" },
];

const OUTBOUND_LEDGER_ENTRIES = [
  { date: "24/04/2026", ref: "INV-44291", account: "Accounts Receivable — ALEC",              description: "HDG trays & trunking delivered — Bvlgari Marina Lofts", debit: 6352.50, credit: null,    isNew: true, flow: "outbound" },
  { date: "24/04/2026", ref: "INV-44291", account: "Sales Revenue — Cable Management",        description: "HDG trays & trunking delivered — Bvlgari Marina Lofts", debit: null,    credit: 6050.00, isNew: true, flow: "outbound" },
  { date: "24/04/2026", ref: "INV-44291", account: "VAT Output Tax (5%)",                     description: "Tax on INV-44291",                                      debit: null,    credit: 302.50,  isNew: true, flow: "outbound" },
];

// ─── Projects ───────────────────────────────────────────────────────────
const PROJECTS = [
  { id: "PRJ-001", name: "Etihad Rail Stage 2 & 3 — Package 2F2 Freight Facilities",       client: "Jacobs",                                         location: "Abu Dhabi", productScope: "Cable Glands & Lugs",        status: "active",  startDate: "01/03/2026", endDate: "31/12/2026", budget: 185000.00, spent: 78500.00, inventoryAllocated: ["INV-001","INV-002","INV-003","INV-004"], ledgerRefs: ["PO-72401","PO-72415"], completion: 42 },
  { id: "PRJ-002", name: "Al Maryah Vista SB13 — Island M15",                               client: "Pioneer Engineering Consultancy",                location: "Abu Dhabi", productScope: "GI Conduits & Accessories", status: "active",  startDate: "01/02/2026", endDate: "30/06/2026", budget: 78000.00,  spent: 52300.00, inventoryAllocated: ["INV-006","INV-007","INV-009","INV-012"], ledgerRefs: ["PO-72428"],            completion: 67 },
  { id: "PRJ-003", name: "Bvlgari Promenade & Ocean View Residences — Marina Lofts",        client: "Khatib & Alami",                                 location: "Dubai",     productScope: "HDG Cable Trays & Trunking",status: "active",  startDate: "15/03/2026", endDate: "15/09/2026", budget: 142000.00, spent: 38500.00, inventoryAllocated: ["INV-010","INV-011"],                      ledgerRefs: ["PO-72441"],            completion: 27 },
  { id: "PRJ-004", name: "Business Bay Tower — Plot BB.A02.016 (B+G+3P+34)",                 client: "LACASA Architects & Engineering Consultants",    location: "Dubai",     productScope: "EXD Cable Glands",          status: "planned", startDate: "25/04/2026", endDate: "30/10/2026", budget: 96000.00,  spent: 2992.50,  inventoryAllocated: ["INV-013"],                                ledgerRefs: ["PO-72458"],            completion: 3  },
];

// ─── Product Approvals (real pairings from suncorpn.com/projects) ──────
const APPROVALS = [
  { id: "APR-001", brand: "CMP Products",        productLine: "Cable Glands & Lugs",       consultant: "Khatib & Alami",                              project: "Bvlgari Promenade & Ocean View Residences — Marina Lofts", year: 2022, status: "approved" },
  { id: "APR-002", brand: "CMP Products",        productLine: "Cable Glands & Lugs",       consultant: "LACASA Architects & Engineering Consultants", project: "B+G+3P+34 Business Bay Tower — Plot BB.A02.016",           year: 2022, status: "approved" },
  { id: "APR-003", brand: "Hawke International", productLine: "EXD Cable Glands",           consultant: "Jacobs",                                       project: "Etihad Rail Stage 2 & 3 — Package 2F2",                    year: 2022, status: "approved" },
  { id: "APR-004", brand: "CMP Products",        productLine: "Cable Glands & Lugs",       consultant: "ATKINS (SNC-Lavalin)",                         project: "Riyadh City South — Phase 4",                              year: 2022, status: "approved" },
  { id: "APR-005", brand: "JSL Industries",      productLine: "Copper & Aluminum Lugs",     consultant: "AL AJMI Engineering Consultants",              project: "126 Villas, Wadi Al Safa 2, Dubai",                         year: 2022, status: "approved" },
  { id: "APR-006", brand: "OBO Bettermann",      productLine: "GI Conduits & Accessories",  consultant: "Pioneer Engineering Consultancy",              project: "Al Maryah Vista SB13 — Island M15",                         year: 2021, status: "approved" },
  { id: "APR-007", brand: "OBO Bettermann",      productLine: "GI Conduits & Accessories",  consultant: "Parsons Overseas Limited",                     project: "Al Shindagha Corridor — Phase 2D Double Deck",              year: 2021, status: "approved" },
  { id: "APR-008", brand: "Legrand",             productLine: "HDG Cable Trays & Trunking", consultant: "Khatib & Alami",                               project: "Souq Al-Jubail, Al Dhaid, Sharjah",                         year: 2021, status: "approved" },
  { id: "APR-009", brand: "Hawke International", productLine: "EXD Cable Glands",           consultant: "GOPA International Energy Consultants",        project: "33/11KV Primary Substation — Al Ain",                       year: 2020, status: "approved" },
  { id: "APR-010", brand: "3M",                  productLine: "Heat Shrink Sleeves",        consultant: "Dewan Architects + Engineers",                 project: "Sur La Mer Townhouses, La Mer, Jumeirah",                   year: 2020, status: "approved" },
  { id: "APR-011", brand: "Panduit",             productLine: "Cable Markers & Ties",        consultant: "WS ATKINS",                                    project: "Palm Jumeirah Gateway Towers",                              year: 2018, status: "approved" },
  { id: "APR-012", brand: "CCG Peppers",         productLine: "EXD Cable Glands",            consultant: "LACASA Architects & Engineering Consultants", project: "B+G+3P+34 Business Bay Tower — Plot BB.A02.016",           year: 2026, status: "approved", isNew: true },
];

// ─── Extracted data (inbound = supplier PO, outbound = customer delivery) ──
const EXTRACTED_INBOUND = {
  flow: "inbound",
  document: { type: "Delivery Note", poNumber: "PO-72458", counterparty: "Peppers Gulf", counterpartyLabel: "Supplier", counterpartyLocation: "Dubai", counterpartyRole: "Vendor", routingLabel: "Received at", routingValue: "SIC — Sharjah Saif Zone", date: "23/04/2026", paymentStatus: "Not Paid", subtotal: 2850.00, tax: 142.50, total: 2992.50 },
  lineItems: [{ description: "CCG Peppers A2F Ni-Plated Brass Cable Gland 25mm", qty: 100, unitPrice: 28.50, tax: 142.50, total: 2992.50 }],
  approvalMatch: { brand: "CCG Peppers", consultant: "LACASA Architects & Engineering Consultants", project: "Business Bay Tower — Plot BB.A02.016" },
};

const EXTRACTED_OUTBOUND = {
  flow: "outbound",
  document: { type: "Customer Delivery Note", poNumber: "DN-44291", counterparty: "ALEC", counterpartyLabel: "Customer", counterpartyLocation: "Dubai", counterpartyRole: "Main Contractor", routingLabel: "Dispatched from", routingValue: "SIC — Jebel Ali FZ", date: "24/04/2026", paymentStatus: "Invoice Raised", subtotal: 6050.00, tax: 302.50, total: 6352.50, projectRef: "Bvlgari Promenade & Ocean View — Marina Lofts" },
  lineItems: [
    { skuId: "INV-010", description: "HDG Cable Tray 300mm Perforated (Legrand)", qty: 30, unitPrice: 110.00, tax: 165.00, total: 3465.00 },
    { skuId: "INV-011", description: "PRG Trunking 100×100 HDG (Legrand)",         qty: 50, unitPrice:  55.00, tax: 137.50, total: 2887.50 },
  ],
};

const STEPS = [
  { id: "upload",     label: "Upload" },
  { id: "processing", label: "Processing" },
  { id: "results",    label: "Results" },
];

const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",      icon: IoGridOutline },
  { id: "inventory",  label: "Inventory",      icon: IoCubeOutline },
  { id: "warehouses", label: "Warehouses",     icon: IoBusinessOutline },
  { id: "approvals",  label: "Approvals",      icon: IoShieldCheckmarkOutline },
  { id: "ledger",     label: "General Ledger", icon: IoReceiptOutline },
  { id: "projects",   label: "Projects",       icon: IoConstructOutline },
  { id: "documents",  label: "Documents",      icon: IoFolderOpenOutline },
];

// ═══════════════════════════════════════════════════════════════════════
export default function Home() {
  const [phase, setPhase] = useState("flow");
  const [step, setStep] = useState("upload");
  const [flow, setFlow] = useState("inbound");
  const [fileName, setFileName] = useState(null);
  const [activeTab, setActiveTab] = useState("ledger");
  const [appPage, setAppPage] = useState("inventory");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#app") setPhase("app");
    else if (hash === "#results") { setStep("results"); setFileName("DN-72458-Peppers-Gulf.pdf"); }
  }, []);

  const handleDrop = useCallback((e, selectedFlow) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (file) {
      setFlow(selectedFlow);
      setFileName(file.name);
      setStep("processing");
      setTimeout(() => setStep("results"), 2800);
    }
  }, []);

  const handleConfirm = () => { setPhase("app"); setAppPage(flow === "outbound" ? "ledger" : "inventory"); };
  const resetDemo = () => { setPhase("flow"); setStep("upload"); setFileName(null); setActiveTab("ledger"); };

  if (phase === "app") return <AppShell appPage={appPage} setAppPage={setAppPage} onNewUpload={resetDemo} uploadedFlow={flow} />;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <FlowHeader />
      <StepIndicator step={step} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          {step === "upload" && <UploadStep key="upload" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} />}
          {step === "processing" && <ProcessingStep key="processing" fileName={fileName} flow={flow} />}
          {step === "results" && <ResultsStep key="results" flow={flow} activeTab={activeTab} setActiveTab={setActiveTab} onConfirm={handleConfirm} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// FLOW COMPONENTS
// ═══════════════════════════════════════════════════════════════════════
function FlowHeader() {
  return (
    <header className="bg-white border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/images/crossval-logo.png" alt="CrossVal" width={180} height={58} className="h-7 w-auto" priority />
          <span className="text-xs text-gray-400 pl-3 border-l border-gray-200">{COMPANY.short}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Document Processing</span>
          <span className="inline-block w-2 h-2 rounded-full bg-primary-green" />
        </div>
      </div>
    </header>
  );
}

function StepIndicator({ step }) {
  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2">
        {STEPS.map((s, i) => {
          const isActive = s.id === step;
          const isPast = STEPS.findIndex((x) => x.id === step) > STEPS.findIndex((x) => x.id === s.id);
          return (
            <div key={s.id} className="flex items-center gap-2">
              {i > 0 && <div className={`w-8 h-px ${isPast ? "bg-primary-green" : "bg-gray-200"}`} />}
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${isPast || isActive ? "bg-primary-green text-white" : "bg-gray-100 text-gray-400"}`}>
                  {isPast ? "✓" : i + 1}
                </div>
                <span className={`text-sm font-medium ${isActive ? "text-black" : isPast ? "text-primary-green" : "text-gray-400"}`}>{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UploadStep({ onDrop, onDragOver }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-xl font-semibold text-black mb-2">Upload a document</h1>
        <p className="text-sm text-gray-500">Pick the direction — we extract line items and post to the right accounts + warehouse automatically.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
        <UploadCard flow="inbound"  icon={IoArrowDownCircleOutline} title="Supplier PO / Delivery Note" subtitle="Stock coming IN from a supplier"      sub2="→ Inventory DR · Accounts Payable CR"       onDrop={onDrop} onDragOver={onDragOver} />
        <UploadCard flow="outbound" icon={IoArrowUpCircleOutline}   title="Customer Delivery Note"      subtitle="Stock going OUT to a project site" sub2="→ Accounts Receivable DR · Sales Revenue CR" onDrop={onDrop} onDragOver={onDragOver} />
      </div>

      <div className="mt-6 w-full max-w-3xl p-3 border border-blue-200 rounded-lg bg-blue-50">
        <p className="text-sm text-gray-600">Drop any PDF/PNG/JPEG — this is a demo, the content of the file is ignored and the shown data is seeded from real Sun International project records on suncorpn.com.</p>
      </div>
    </motion.div>
  );
}

function UploadCard({ flow, icon: Icon, title, subtitle, sub2, onDrop, onDragOver }) {
  return (
    <label onDrop={(e) => onDrop(e, flow)} onDragOver={onDragOver} className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary-green hover:bg-secondary-green/20 transition-all duration-200">
      <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => onDrop(e, flow)} className="hidden" />
      <Icon className="w-10 h-10 text-primary-green" />
      <div className="text-center">
        <p className="text-sm font-semibold text-black">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        <p className="text-[11px] text-gray-400 mt-2 font-mono">{sub2}</p>
      </div>
      <span className="text-[11px] text-gray-400">Drop file here, or click to browse</span>
    </label>
  );
}

function ProcessingStep({ fileName, flow }) {
  const stages = flow === "outbound" ? [
    { label: "Reading document", delay: 0 },
    { label: "Extracting line items & customer", delay: 0.6 },
    { label: "Posting to Accounts Receivable", delay: 1.2 },
    { label: "Deducting stock from dispatching warehouse", delay: 1.8 },
    { label: "Matching to project & approved product line", delay: 2.2 },
  ] : [
    { label: "Reading document", delay: 0 },
    { label: "Extracting line items & supplier", delay: 0.6 },
    { label: "Posting to general ledger", delay: 1.2 },
    { label: "Routing stock to receiving warehouse", delay: 1.8 },
    { label: "Matching to project / product approval", delay: 2.2 },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-lg border border-border shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <IoDocumentTextOutline className="w-5 h-5 text-primary-green" />
          <span className="text-sm font-medium text-black truncate">{fileName}</span>
          <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded ${flow === "outbound" ? "bg-orange-50 text-orange-700" : "bg-blue-50 text-blue-700"}`}>{flow === "outbound" ? "OUT" : "IN"}</span>
        </div>
        <div className="space-y-4">
          {stages.map((stage) => (
            <motion.div key={stage.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: stage.delay, duration: 0.3 }} className="flex items-center gap-3">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: stage.delay + 0.3, type: "spring" }}>
                <IoCheckmarkCircle className="w-5 h-5 text-primary-green" />
              </motion.div>
              <span className="text-sm text-gray-600">{stage.label}</span>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.6, ease: "easeInOut" }} className="mt-6 h-1 bg-primary-green rounded-full" />
      </div>
    </motion.div>
  );
}

function ResultsStep({ flow, activeTab, setActiveTab, onConfirm }) {
  const data = flow === "outbound" ? EXTRACTED_OUTBOUND : EXTRACTED_INBOUND;
  const doc = data.document;
  const isOut = flow === "outbound";
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
      <div className="bg-white rounded-lg border border-border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isOut ? "bg-orange-50" : "bg-secondary-green"}`}>
              {isOut ? <IoArrowUpCircleOutline className="w-5 h-5 text-orange-600" /> : <IoArrowDownCircleOutline className="w-5 h-5 text-primary-green" />}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-black">{doc.type} — {doc.poNumber}</h2>
              <p className="text-sm text-gray-500">
                {isOut
                  ? <>SIC → <span className="font-medium text-black">{doc.counterparty}</span> ({doc.counterpartyLocation}) · {doc.routingValue}</>
                  : <><span className="font-medium text-black">{doc.counterparty}</span> ({doc.counterpartyLocation}) → {doc.routingValue}</>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded border ${isOut ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}>{doc.paymentStatus}</span>
            <span className="text-xs font-medium px-2 py-1 rounded bg-gray-50 text-gray-600 border border-gray-200">{doc.date}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-4 gap-4">
          <div><span className="text-xs text-gray-400 font-medium">Items</span><p className="text-sm font-semibold text-black mt-0.5">{data.lineItems.length}</p></div>
          <div><span className="text-xs text-gray-400 font-medium">Subtotal</span><p className="text-sm font-semibold text-black mt-0.5">AED {doc.subtotal.toFixed(2)}</p></div>
          <div><span className="text-xs text-gray-400 font-medium">Tax (5% VAT)</span><p className="text-sm font-semibold text-black mt-0.5">AED {doc.tax.toFixed(2)}</p></div>
          <div><span className="text-xs text-gray-400 font-medium">Total</span><p className="text-sm font-semibold text-primary-green mt-0.5">AED {doc.total.toFixed(2)}</p></div>
        </div>
      </div>

      {!isOut && data.approvalMatch && (
        <div className="mb-4 p-3 border border-primary-green/30 rounded-lg bg-secondary-green/40 flex items-center gap-2">
          <IoShieldCheckmarkOutline className="w-4 h-4 text-primary-green shrink-0" />
          <p className="text-sm text-black">
            <span className="font-medium">Product approval matched:</span> {data.approvalMatch.brand} is approved by <span className="font-medium">{data.approvalMatch.consultant}</span> for <span className="font-medium">{data.approvalMatch.project}</span>.
          </p>
        </div>
      )}

      {isOut && doc.projectRef && (
        <div className="mb-4 p-3 border border-orange-200 rounded-lg bg-orange-50 flex items-center gap-2">
          <IoConstructOutline className="w-4 h-4 text-orange-600 shrink-0" />
          <p className="text-sm text-black"><span className="font-medium">Project allocation:</span> {doc.projectRef}</p>
        </div>
      )}

      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-border text-sm"><IoDocumentTextOutline className="w-4 h-4 text-primary-green" /><span className="font-medium">{doc.type}</span></div>
        <IoArrowForward className="w-4 h-4 text-gray-300" />
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-green/50 rounded-lg border border-primary-green/20 text-sm"><IoReceiptOutline className="w-4 h-4 text-primary-green" /><span className="font-medium text-primary-green">Ledger</span></div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-green/50 rounded-lg border border-primary-green/20 text-sm"><IoCubeOutline className="w-4 h-4 text-primary-green" /><span className="font-medium text-primary-green">{isOut ? "Stock Decremented" : "Warehouse Stock"}</span></div>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[["ledger", "Ledger", IoReceiptOutline], ["inventory", isOut ? "Stock Decremented" : "Warehouse Stock", IoCubeOutline]].map(([id, label, Icon]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-all ${activeTab === id ? "border-primary-green text-primary-green" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
        <div>{activeTab === "ledger" ? <PreviewLedger flow={flow} /> : <PreviewInventory flow={flow} />}</div>
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <p className="text-xs text-gray-400">
            {activeTab === "ledger"
              ? "3 journal entries extracted"
              : isOut
                ? `${data.lineItems.length} items decremented from ${doc.routingValue.replace("SIC — ", "")}`
                : `1 item routed to ${WH_LABEL[NEW_INVENTORY_ENTRY.warehouse]}`}
          </p>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-primary-green rounded-lg hover:bg-[#005c14] transition-all active:scale-[0.98]">Confirm & Save</button>
        </div>
      </div>
    </motion.div>
  );
}

function PreviewLedger({ flow }) {
  const rows = flow === "outbound" ? OUTBOUND_LEDGER_ENTRIES : INBOUND_LEDGER_ENTRIES;
  return (
    <div className="overflow-x-auto">
      <table className="cv-table">
        <thead><tr><th>Date</th><th>Ref</th><th>Account</th><th>Description</th><th className="text-right">Debit (AED)</th><th className="text-right">Credit (AED)</th></tr></thead>
        <tbody>
          {rows.map((e, i) => (
            <tr key={i}>
              <td className="whitespace-nowrap">{e.date}</td>
              <td><span className="font-mono text-xs px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">{e.ref}</span></td>
              <td className="font-medium">{e.account}</td>
              <td className="text-gray-500">{e.description}</td>
              <td className="text-right font-mono">{e.debit != null ? e.debit.toFixed(2) : ""}</td>
              <td className="text-right font-mono">{e.credit != null ? e.credit.toFixed(2) : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PreviewInventory({ flow }) {
  if (flow === "outbound") {
    const items = EXTRACTED_OUTBOUND.lineItems.map((li) => {
      const sku = EXISTING_INVENTORY.find((i) => i.id === li.skuId);
      return { ...sku, dispatchedQty: li.qty };
    });
    return (
      <div className="overflow-x-auto">
        <table className="cv-table">
          <thead><tr><th>Product</th><th>Brand</th><th>Warehouse</th><th>Stock Before</th><th className="text-right">Dispatched</th><th>Stock After</th></tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td className="font-medium">{i.productName}</td>
                <td className="text-gray-500">{i.brand}</td>
                <td><WarehousePill id={i.warehouse} /></td>
                <td className="font-mono">{i.qty}</td>
                <td className="text-right font-mono text-orange-600">− {i.dispatchedQty}</td>
                <td className="font-mono font-semibold">{i.qty - i.dispatchedQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  const inv = NEW_INVENTORY_ENTRY;
  return (
    <div className="overflow-x-auto">
      <table className="cv-table">
        <thead><tr><th>Section</th><th>Product Name</th><th>Brand</th><th>Warehouse</th><th>Package</th><th className="text-right">Qty</th><th className="text-right">Price (AED)</th><th className="text-right">Value</th></tr></thead>
        <tbody>
          <tr>
            <td><span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary-green text-primary-green">{inv.section}</span></td>
            <td className="font-medium">{inv.productName}</td>
            <td className="text-gray-500">{inv.brand}</td>
            <td><WarehousePill id={inv.warehouse} /></td>
            <td>{inv.package}</td>
            <td className="text-right font-mono">{inv.qty}</td>
            <td className="text-right font-mono">{inv.price.toFixed(2)}</td>
            <td className="text-right font-mono font-semibold">{inv.inventoryValue.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════════════════════════
function AppShell({ appPage, setAppPage, onNewUpload, uploadedFlow }) {
  const initialInventory = useMemo(() => {
    let inv = [...EXISTING_INVENTORY, { ...NEW_INVENTORY_ENTRY }];
    if (uploadedFlow === "outbound") {
      inv = inv.map((item) => {
        const li = EXTRACTED_OUTBOUND.lineItems.find((x) => x.skuId === item.id);
        if (!li) return item;
        const qty = item.qty - li.qty;
        return { ...item, qty, inventoryValue: qty * item.price };
      });
    }
    return inv;
  }, [uploadedFlow]);

  const [inventory, setInventory] = useState(initialInventory);
  const [transfers, setTransfers] = useState([]);
  const [transferOpen, setTransferOpen] = useState(false);
  const [draftPOFor, setDraftPOFor] = useState(null);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [docPreview, setDocPreview] = useState(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const uploadedLedger = uploadedFlow === "outbound" ? OUTBOUND_LEDGER_ENTRIES : INBOUND_LEDGER_ENTRIES;
  const allLedger = [...EXISTING_LEDGER, ...uploadedLedger];
  const totalInvValue = inventory.reduce((s, i) => s + i.inventoryValue, 0);
  const totalDebit = allLedger.reduce((s, e) => s + (e.debit || 0), 0);
  const totalCredit = allLedger.reduce((s, e) => s + (e.credit || 0), 0);
  const lowStock = inventory.filter((i) => i.qty < i.minQty);

  const handleTransfer = ({ skuId, fromWh, toWh, qty }) => {
    setInventory((prev) => {
      const src = prev.find((i) => i.id === skuId && i.warehouse === fromWh);
      if (!src) return prev;
      const moved = Math.min(qty, src.qty);
      let updated = prev.map((i) => {
        if (i.id === skuId && i.warehouse === fromWh) {
          const newQty = i.qty - moved;
          return { ...i, qty: newQty, inventoryValue: newQty * i.price };
        }
        return i;
      }).filter((i) => !(i.id === skuId && i.warehouse === fromWh && i.qty === 0));

      const destIdx = updated.findIndex((i) => i.id === skuId && i.warehouse === toWh);
      if (destIdx >= 0) {
        const d = updated[destIdx];
        updated[destIdx] = { ...d, qty: d.qty + moved, inventoryValue: (d.qty + moved) * d.price };
      } else {
        updated.push({ ...src, warehouse: toWh, qty: moved, inventoryValue: moved * src.price });
      }
      return updated;
    });
    setTransfers((t) => [{ id: `TR-${Date.now()}`, skuId, skuName: inventory.find((i) => i.id === skuId)?.productName, from: fromWh, to: toWh, qty, date: new Date().toLocaleDateString("en-GB") }, ...t]);
    setTransferOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <aside className="w-56 bg-white border-r border-border flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <Image src="/images/crossval-logo.png" alt="CrossVal" width={180} height={58} className="h-6 w-auto" priority />
          <p className="text-xs text-gray-500 mt-1.5 font-medium">{COMPANY.short}</p>
          <p className="text-[10px] text-gray-400 leading-tight">{COMPANY.tagline}</p>
        </div>
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.id === appPage;
            let badge = null;
            if (item.id === "warehouses") badge = <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">{WAREHOUSES.length}</span>;
            else if (item.id === "projects")  badge = <span className="ml-auto text-[10px] bg-primary-green text-white px-1.5 py-0.5 rounded-full font-medium">{PROJECTS.length}</span>;
            else if (item.id === "approvals") badge = <span className="ml-auto text-[10px] bg-secondary-green text-primary-green px-1.5 py-0.5 rounded-full font-medium">{APPROVALS.length}</span>;
            else if (item.id === "inventory" && lowStock.length > 0) badge = <span className="ml-auto text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5"><IoAlertCircleOutline className="w-3 h-3" />{lowStock.length}</span>;
            return (
              <button key={item.id} onClick={() => setAppPage(item.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${active ? "bg-secondary-green text-primary-green font-medium" : "text-gray-600 hover:bg-gray-50 font-normal"}`}>
                <Icon className={`w-[18px] h-[18px] ${active ? "text-primary-green" : "text-gray-400"}`} />
                {item.label}
                {badge}
              </button>
            );
          })}
          <div className="mt-2 pt-2 border-t border-gray-100">
            <button onClick={() => setMoreOpen(!moreOpen)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <IoChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${moreOpen ? "rotate-180" : ""}`} /> More
            </button>
            {moreOpen && (
              <div className="ml-4 mt-1 space-y-0.5">
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50"><IoStatsChartOutline className="w-4 h-4 text-gray-400" />Insights</button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50"><IoLayersOutline className="w-4 h-4 text-gray-400" />Product Lines</button>
              </div>
            )}
          </div>
        </nav>
        <div className="px-2 py-3 border-t border-border">
          <button onClick={onNewUpload} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-primary-green text-white text-sm font-medium rounded-lg hover:bg-[#005c14] transition-all active:scale-[0.98]">
            <IoCloudUploadOutline className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
          <div>
            <p className="text-sm text-gray-500">Hi <span className="font-semibold text-black">Admin</span></p>
            <h1 className="text-lg font-semibold text-black capitalize">{appPage === "ledger" ? "General Ledger" : appPage}</h1>
            <p className="text-xs text-gray-400">Simplify your financial & stock operations</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2.5 py-1 rounded-full border border-yellow-300 bg-yellow-50 text-yellow-700 font-medium">Trial Plan</span>
            <div className="flex items-center gap-1 text-sm text-gray-500"><IoGlobeOutline className="w-4 h-4" /> English</div>
            <IoNotificationsOutline className="w-5 h-5 text-gray-400" />
            <div className="w-8 h-8 rounded-full bg-primary-green flex items-center justify-center text-white text-xs font-semibold">SI</div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-light p-6">
          <AnimatePresence mode="wait">
            {appPage === "dashboard"  && <DashboardPage  key="dash" inventory={inventory} allLedger={allLedger} totalInvValue={totalInvValue} lowStock={lowStock} onDraftPO={setDraftPOFor} setAppPage={setAppPage} />}
            {appPage === "inventory"  && <InventoryPage  key="inv"  inventory={inventory} totalInvValue={totalInvValue} onOpenTransfer={() => setTransferOpen(true)} onDraftPO={setDraftPOFor} />}
            {appPage === "warehouses" && <WarehousesPage key="wh"   inventory={inventory} transfers={transfers} onOpenTransfer={() => setTransferOpen(true)} />}
            {appPage === "approvals"  && <ApprovalsPage  key="apr" />}
            {appPage === "ledger"     && <LedgerPage     key="led"  allLedger={allLedger} totalDebit={totalDebit} totalCredit={totalCredit} uploadedFlow={uploadedFlow} />}
            {appPage === "projects"   && <ProjectsPage   key="prj"  inventory={inventory} allLedger={allLedger} onOpenNewProject={() => setNewProjectOpen(true)} />}
            {appPage === "documents"  && <DocumentsPage  key="docs" uploadedFlow={uploadedFlow} onOpenPreview={setDocPreview} />}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {transferOpen   && <TransferModal inventory={inventory} onClose={() => setTransferOpen(false)} onSubmit={handleTransfer} />}
        {draftPOFor     && <DraftPOModal item={draftPOFor} onClose={() => setDraftPOFor(null)} />}
        {newProjectOpen && <NewProjectModal onClose={() => setNewProjectOpen(false)} />}
        {docPreview     && <DocumentPreviewDrawer doc={docPreview} onClose={() => setDocPreview(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Dashboard ──────────────────────────────────────────────────────────
function DashboardPage({ inventory, allLedger, totalInvValue, lowStock, onDraftPO, setAppPage }) {
  const byWarehouse = WAREHOUSES.map((w) => {
    const items = inventory.filter((i) => i.warehouse === w.id);
    const value = items.reduce((s, i) => s + i.inventoryValue, 0);
    return { ...w, itemCount: items.length, value };
  });
  const recentApprovals = [...APPROVALS].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.year - a.year).slice(0, 4);

  const stats = [
    { label: "Stock Value",         value: `AED ${fmtMoney(totalInvValue)}`,                 sub: `${inventory.length} SKUs across ${WAREHOUSES.length} warehouses` },
    { label: "Product Approvals",   value: APPROVALS.length.toString(),                      sub: `${new Set(APPROVALS.map((a) => a.consultant)).size} consultants · ${new Set(APPROVALS.map((a) => a.project)).size} projects` },
    { label: "Active Projects",     value: PROJECTS.filter((p) => p.status === "active").length.toString(), sub: `${PROJECTS.length} total` },
    { label: "Low-Stock Alerts",    value: lowStock.length.toString(),                       sub: lowStock.length ? "Needs reordering" : "All stocked" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg p-4 border border-border">
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            <p className="text-xl font-semibold text-black mt-1">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {byWarehouse.map((w) => (
          <button key={w.id} onClick={() => setAppPage("warehouses")} className="text-left bg-white rounded-lg p-4 border border-border hover:border-primary-green/40 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><IoBusinessOutline className="w-4 h-4 text-primary-green" /><p className="text-sm font-semibold text-black">{w.short}</p></div>
              <span className="text-[10px] text-gray-400">{w.id}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{w.address}</p>
            <div className="flex items-end justify-between mt-3 pt-3 border-t border-gray-100">
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Stock Value</p><p className="text-sm font-semibold text-black font-mono">AED {fmtMoney(w.value)}</p></div>
              <div className="text-right"><p className="text-[10px] text-gray-400 uppercase tracking-wide">SKUs</p><p className="text-sm font-semibold text-black">{w.itemCount}</p></div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2 bg-white rounded-lg border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IoAlertCircleOutline className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-semibold text-black">Low-Stock Alerts</h3>
              {lowStock.length > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium">{lowStock.length}</span>}
            </div>
            <button onClick={() => setAppPage("inventory")} className="text-xs text-primary-green font-medium hover:underline">View inventory</button>
          </div>
          {lowStock.length === 0 ? (
            <div className="px-5 py-6 text-center text-sm text-gray-400">All SKUs above reorder threshold.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {lowStock.map((i) => (
                <div key={i.id + i.warehouse} className="px-5 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-black truncate">{i.productName}</p>
                    <p className="text-xs text-gray-400">{i.brand} · <WarehousePillInline id={i.warehouse} /></p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Stock / Min</p>
                      <p className="text-sm font-mono"><span className="text-red-600 font-semibold">{i.qty}</span> <span className="text-gray-300">/ {i.minQty}</span></p>
                    </div>
                    <button onClick={() => onDraftPO(i)} className="px-2.5 py-1.5 text-xs font-medium text-primary-green border border-primary-green/30 rounded-lg hover:bg-secondary-green/50">
                      <IoFlashOutline className="w-3 h-3 inline mr-1" />Draft PO
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2"><IoShieldCheckmarkOutline className="w-4 h-4 text-primary-green" /><h3 className="text-sm font-semibold text-black">Recent Approvals</h3></div>
            <button onClick={() => setAppPage("approvals")} className="text-xs text-primary-green font-medium hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentApprovals.map((a) => (
              <div key={a.id} className={`px-5 py-2.5 ${a.isNew ? "bg-secondary-green/30" : ""}`}>
                <div className="flex items-center gap-1.5">
                  {a.isNew && <span className="w-1.5 h-1.5 rounded-full bg-primary-green shrink-0" />}
                  <p className="text-sm font-medium text-black">{a.brand}</p>
                  <span className="text-[10px] text-gray-400 ml-auto">{a.year}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">{a.consultant}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-black">Active Projects</h3><button onClick={() => setAppPage("projects")} className="text-xs text-primary-green font-medium hover:underline">View all</button></div>
          {PROJECTS.filter((p) => p.status === "active").map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div><p className="text-sm font-medium text-black truncate max-w-[260px]">{p.name}</p><p className="text-xs text-gray-400">{p.client} · {p.location}</p></div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-primary-green rounded-full" style={{ width: `${p.completion}%` }} /></div>
                <span className="text-xs font-medium text-gray-500">{p.completion}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-black">Recent Stock Additions</h3><button onClick={() => setAppPage("inventory")} className="text-xs text-primary-green font-medium hover:underline">View all</button></div>
          {inventory.slice(-5).reverse().map((inv, i) => (
            <div key={i} className={`flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 ${inv.isNew ? "bg-secondary-green/30 -mx-2 px-2 rounded" : ""}`}>
              <div className="flex items-center gap-2 min-w-0">
                {inv.isNew && <span className="w-1.5 h-1.5 rounded-full bg-primary-green shrink-0" />}
                <p className="text-sm text-black truncate">{inv.productName}</p>
              </div>
              <span className="text-sm font-mono text-gray-500 shrink-0 ml-2">{inv.inventoryValue.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Inventory Page ─────────────────────────────────────────────────────
function InventoryPage({ inventory, onOpenTransfer, onDraftPO }) {
  const [whFilter, setWhFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [filterOpen, setFilterOpen] = useState(false);

  const sections = useMemo(() => [...new Set(inventory.map((i) => i.section))], [inventory]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inventory.filter((i) => {
      if (whFilter !== "ALL" && i.warehouse !== whFilter) return false;
      if (sectionFilter !== "ALL" && i.section !== sectionFilter) return false;
      if (q && !(i.productName.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q) || i.section.toLowerCase().includes(q) || i.prdCat.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [inventory, whFilter, sectionFilter, search]);

  const filteredValue = filtered.reduce((s, i) => s + i.inventoryValue, 0);
  const categories = [...new Set(filtered.map((i) => i.prdCat))];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard label={whFilter === "ALL" ? "Total Stock Value" : "Warehouse Value"} value={`AED ${fmtMoney(filteredValue)}`} />
        <StatCard label="SKUs" value={filtered.length.toString()} />
        <StatCard label="Categories" value={categories.length.toString()} />
        <StatCard label="Last Updated" value="Just Now" green />
      </div>
      <div className="mb-3 p-3 border border-primary-green/20 rounded-lg bg-secondary-green/40 flex items-center gap-2">
        <IoCheckmarkCircle className="w-4 h-4 text-primary-green shrink-0" />
        <p className="text-sm text-black"><span className="font-medium">1 new SKU added</span> to {WH_LABEL[NEW_INVENTORY_ENTRY.warehouse]} from Delivery Note PO-72458</p>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-2.5 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
          <button onClick={() => setWhFilter("ALL")} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap ${whFilter === "ALL" ? "bg-primary-green text-white border-primary-green" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
            All Warehouses <span className="ml-1.5 opacity-70">({inventory.length})</span>
          </button>
          {WAREHOUSES.map((w) => {
            const count = inventory.filter((i) => i.warehouse === w.id).length;
            const active = whFilter === w.id;
            return (
              <button key={w.id} onClick={() => setWhFilter(w.id)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap ${active ? "bg-primary-green text-white border-primary-green" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
                <IoLocationOutline className="w-3 h-3 inline mr-1 -mt-0.5" />{w.short}
                <span className="ml-1.5 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[320px]">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm w-full max-w-sm focus-within:border-primary-green">
              <IoSearchOutline className="w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product, brand, category..." className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400" />
              {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-black"><IoClose className="w-4 h-4" /></button>}
            </div>
            <div className="relative">
              <button onClick={() => setFilterOpen((v) => !v)} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm hover:border-gray-300 ${sectionFilter !== "ALL" ? "border-primary-green text-primary-green bg-secondary-green/30" : "border-gray-200 text-gray-500"}`}>
                <IoFilterOutline className="w-4 h-4" />
                {sectionFilter === "ALL" ? "Filter" : sectionFilter}
              </button>
              {filterOpen && (
                <div className="absolute left-0 top-full mt-1 bg-white border border-border rounded-lg shadow-lg min-w-[220px] z-10 py-1">
                  <button onClick={() => { setSectionFilter("ALL"); setFilterOpen(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${sectionFilter === "ALL" ? "font-semibold text-primary-green" : "text-gray-600"}`}>All sections</button>
                  {sections.map((s) => (
                    <button key={s} onClick={() => { setSectionFilter(s); setFilterOpen(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${sectionFilter === s ? "font-semibold text-primary-green" : "text-gray-600"}`}>{s}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 mr-1">{filtered.length} of {inventory.length} items</span>
            <button onClick={onOpenTransfer} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-green text-white text-xs font-medium rounded-lg hover:bg-[#005c14]">
              <IoSwapHorizontalOutline className="w-3.5 h-3.5" /> Transfer Stock
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="cv-table">
            <thead><tr><th>Section</th><th>Product Name</th><th>Brand</th><th>Category</th><th>Warehouse</th><th>Package</th><th className="text-right">Qty / Min</th><th className="text-right">Price</th><th className="text-right">Value</th><th>Approvals</th></tr></thead>
            <tbody>
              {filtered.map((inv) => {
                const low = inv.qty < inv.minQty;
                const approvals = APPROVALS.filter((a) => a.brand === inv.brand);
                return (
                  <tr key={inv.id + inv.warehouse} className={inv.isNew ? "bg-secondary-green/30" : ""}>
                    <td><span className={`text-xs font-medium px-2 py-0.5 rounded ${sectionColor(inv.section)}`}>{inv.section}</span></td>
                    <td className="font-medium text-sm">{inv.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-1.5" />}{inv.productName}</td>
                    <td className="text-sm text-gray-600">{inv.brand}</td>
                    <td className="text-sm text-gray-500">{inv.prdCat}</td>
                    <td><WarehousePill id={inv.warehouse} /></td>
                    <td className="text-sm">{inv.package}</td>
                    <td className="text-right font-mono text-sm">
                      <span className={low ? "text-red-600 font-semibold" : ""}>{inv.qty.toLocaleString()}</span>
                      <span className="text-gray-300"> / {inv.minQty}</span>
                      {low && (
                        <button onClick={() => onDraftPO(inv)} title="Generate draft PO" className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium hover:bg-red-100">
                          <IoAlertCircleOutline className="w-3 h-3 inline" /> Low
                        </button>
                      )}
                    </td>
                    <td className="text-right font-mono text-sm">{inv.price.toFixed(2)}</td>
                    <td className="text-right font-mono text-sm font-semibold">{inv.inventoryValue.toFixed(2)}</td>
                    <td>
                      {approvals.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-secondary-green text-primary-green font-medium" title={approvals.map((a) => `${a.consultant} · ${a.project}`).join("\n")}>
                          <IoShieldCheckmarkOutline className="w-3 h-3" /> {approvals.length}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={10} className="text-center py-10 text-sm text-gray-400">No items match your filters.</td></tr>}
            </tbody>
            <tfoot><tr className="bg-gray-50"><td colSpan={8} className="text-right text-xs font-medium text-gray-400">Total</td><td className="text-right font-mono font-semibold text-sm">{filteredValue.toFixed(2)}</td><td></td></tr></tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Warehouses Page ────────────────────────────────────────────────────
function WarehousesPage({ inventory, transfers, onOpenTransfer }) {
  const data = WAREHOUSES.map((w) => {
    const items = inventory.filter((i) => i.warehouse === w.id);
    const sectionsSet = [...new Set(items.map((i) => i.section))];
    const value = items.reduce((s, i) => s + i.inventoryValue, 0);
    const hasNew = items.some((i) => i.isNew);
    return { ...w, items, sections: sectionsSet, value, hasNew };
  });
  const totalValue = data.reduce((s, d) => s + d.value, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard label="Warehouses" value={WAREHOUSES.length.toString()} />
        <StatCard label="Total SKUs" value={inventory.length.toString()} />
        <StatCard label="Stock Value" value={`AED ${fmtMoney(totalValue)}`} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-black">Warehouses</h2>
        <button onClick={onOpenTransfer} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-green text-white text-xs font-medium rounded-lg hover:bg-[#005c14]">
          <IoSwapHorizontalOutline className="w-3.5 h-3.5" /> Transfer Stock
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data.map((w) => (
          <div key={w.id} className="bg-white rounded-lg border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <IoBusinessOutline className="w-4 h-4 text-primary-green" />
                  <h3 className="text-sm font-semibold text-black">{w.name}</h3>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100 text-gray-500">{w.id}</span>
                  {w.hasNew && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-green text-white font-medium">New stock</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{w.address} · {w.role}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Stock Value</p>
                <p className="text-base font-semibold font-mono">AED {fmtMoney(w.value)}</p>
              </div>
            </div>
            <div className="px-5 py-3 grid grid-cols-4 gap-4 border-b border-gray-100">
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">SKUs</p><p className="text-sm font-semibold text-black">{w.items.length}</p></div>
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Sections</p><p className="text-sm font-semibold text-black">{w.sections.length}</p></div>
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Total Units</p><p className="text-sm font-semibold text-black">{w.items.reduce((s, i) => s + i.qty, 0).toLocaleString()}</p></div>
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Sections Held</p><p className="text-xs text-gray-600 mt-0.5">{w.sections.join(" · ") || "—"}</p></div>
            </div>
            <div className="overflow-x-auto">
              <table className="cv-table">
                <thead><tr><th>Product</th><th>Brand</th><th>Section</th><th>Package</th><th className="text-right">Qty</th><th className="text-right">Value</th></tr></thead>
                <tbody>
                  {w.items.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-sm text-gray-400">No stock at this location.</td></tr>
                  ) : w.items.map((i) => (
                    <tr key={i.id + "-" + w.id} className={i.isNew ? "bg-secondary-green/30" : ""}>
                      <td className="font-medium text-sm">{i.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-1.5" />}{i.productName}</td>
                      <td className="text-sm text-gray-500">{i.brand}</td>
                      <td><span className={`text-xs font-medium px-2 py-0.5 rounded ${sectionColor(i.section)}`}>{i.section}</span></td>
                      <td className="text-sm">{i.package}</td>
                      <td className="text-right font-mono text-sm">{i.qty.toLocaleString()}</td>
                      <td className="text-right font-mono text-sm font-semibold">{i.inventoryValue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {transfers.length > 0 && (
        <div className="bg-white rounded-lg border border-border overflow-hidden mt-4">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
            <IoSwapHorizontalOutline className="w-4 h-4 text-primary-green" />
            <h3 className="text-sm font-semibold text-black">Recent Transfers</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary-green text-primary-green font-medium ml-1">{transfers.length}</span>
          </div>
          <table className="cv-table">
            <thead><tr><th>Date</th><th>SKU</th><th>From</th><th></th><th>To</th><th className="text-right">Qty</th></tr></thead>
            <tbody>
              {transfers.map((t) => (
                <tr key={t.id}>
                  <td className="text-sm whitespace-nowrap">{t.date}</td>
                  <td className="text-sm font-medium">{t.skuName}</td>
                  <td><WarehousePill id={t.from} /></td>
                  <td><IoArrowForward className="w-4 h-4 text-gray-300" /></td>
                  <td><WarehousePill id={t.to} /></td>
                  <td className="text-right font-mono text-sm font-semibold">{t.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

// ─── Approvals Page ─────────────────────────────────────────────────────
function ApprovalsPage() {
  const [brandFilter, setBrandFilter] = useState("ALL");
  const [consultantFilter, setConsultantFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const brands = [...new Set(APPROVALS.map((a) => a.brand))];
  const consultants = [...new Set(APPROVALS.map((a) => a.consultant))];

  const filtered = APPROVALS.filter((a) => {
    if (brandFilter !== "ALL" && a.brand !== brandFilter) return false;
    if (consultantFilter !== "ALL" && a.consultant !== consultantFilter) return false;
    const q = search.trim().toLowerCase();
    if (q && !(a.brand.toLowerCase().includes(q) || a.consultant.toLowerCase().includes(q) || a.project.toLowerCase().includes(q) || a.productLine.toLowerCase().includes(q))) return false;
    return true;
  });

  const stats = [
    { label: "Total Approvals", value: APPROVALS.length.toString(), sub: "Across all brands" },
    { label: "Brands Approved", value: brands.length.toString(),    sub: `${new Set(APPROVALS.map((a) => a.productLine)).size} product lines` },
    { label: "Consultants",     value: consultants.length.toString(), sub: "Decision-makers" },
    { label: "Projects Won",    value: new Set(APPROVALS.map((a) => a.project)).size.toString(), sub: "Historical + active" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg p-4 border border-border">
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            <p className="text-xl font-semibold text-black mt-1">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm flex-1 max-w-md focus-within:border-primary-green">
            <IoSearchOutline className="w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search brand, consultant, project..." className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400" />
          </div>
          <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="ALL">All brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={consultantFilter} onChange={(e) => setConsultantFilter(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="ALL">All consultants</option>
            {consultants.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} of {APPROVALS.length} approvals</span>
        </div>
        <table className="cv-table">
          <thead><tr><th>Brand</th><th>Product Line</th><th>Consultant</th><th>Project</th><th>Year</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className={a.isNew ? "bg-secondary-green/30" : ""}>
                <td className="font-medium text-sm">{a.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-1.5" />}{a.brand}</td>
                <td className="text-sm text-gray-600">{a.productLine}</td>
                <td className="text-sm text-gray-600">{a.consultant}</td>
                <td className="text-sm text-gray-500">{a.project}</td>
                <td className="text-sm text-gray-500">{a.year}</td>
                <td><span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-secondary-green text-primary-green"><IoShieldCheckmarkOutline className="w-3 h-3" /> Approved</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ─── Ledger Page ────────────────────────────────────────────────────────
function LedgerPage({ allLedger, totalDebit, totalCredit, uploadedFlow }) {
  const [search, setSearch] = useState("");
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allLedger;
    return allLedger.filter((e) => e.account.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.ref.toLowerCase().includes(q));
  }, [allLedger, search]);
  const filteredDebit = rows.reduce((s, e) => s + (e.debit || 0), 0);
  const filteredCredit = rows.reduce((s, e) => s + (e.credit || 0), 0);
  const uploadedRef = uploadedFlow === "outbound" ? "INV-44291" : "PO-72458";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard label="Total Debits" value={`AED ${fmtMoney(totalDebit)}`} />
        <StatCard label="Total Credits" value={`AED ${fmtMoney(totalCredit)}`} />
        <StatCard label="Balance" value={Math.abs(totalDebit - totalCredit) < 0.01 ? "Balanced" : `AED ${(totalDebit - totalCredit).toFixed(2)}`} green={Math.abs(totalDebit - totalCredit) < 0.01} />
      </div>
      <div className="mb-3 p-3 border border-primary-green/20 rounded-lg bg-secondary-green/40 flex items-center gap-2">
        <IoCheckmarkCircle className="w-4 h-4 text-primary-green shrink-0" />
        <p className="text-sm text-black"><span className="font-medium">3 new entries</span> from {uploadedFlow === "outbound" ? "Customer Delivery" : "Delivery Note"} {uploadedRef}</p>
      </div>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm flex-1 max-w-md focus-within:border-primary-green">
            <IoSearchOutline className="w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search account, description, ref..." className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400" />
            {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-black"><IoClose className="w-4 h-4" /></button>}
          </div>
          <span className="text-xs text-gray-400">{rows.length} of {allLedger.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="cv-table">
            <thead><tr><th>Date</th><th>Ref</th><th>Account</th><th>Description</th><th className="text-right">Debit (AED)</th><th className="text-right">Credit (AED)</th></tr></thead>
            <tbody>
              {rows.map((e, i) => (
                <tr key={i} className={e.isNew ? "bg-secondary-green/30" : ""}>
                  <td className="whitespace-nowrap text-sm">{e.date}</td>
                  <td><span className={`font-mono text-xs px-1.5 py-0.5 rounded border ${e.flow === "outbound" ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-gray-50 border-gray-100 text-gray-700"}`}>{e.ref}</span></td>
                  <td className="font-medium text-sm">{e.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-1.5" />}{e.account}</td>
                  <td className="text-sm text-gray-500">{e.description}</td>
                  <td className="text-right font-mono text-sm">{e.debit != null ? e.debit.toFixed(2) : ""}</td>
                  <td className="text-right font-mono text-sm">{e.credit != null ? e.credit.toFixed(2) : ""}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-sm text-gray-400">No entries match your search.</td></tr>}
            </tbody>
            <tfoot><tr className="bg-gray-50"><td colSpan={4} className="text-right text-xs font-medium text-gray-400">Totals</td><td className="text-right font-mono font-semibold text-sm">{filteredDebit.toFixed(2)}</td><td className="text-right font-mono font-semibold text-sm">{filteredCredit.toFixed(2)}</td></tr></tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Projects Page ──────────────────────────────────────────────────────
function ProjectsPage({ inventory, allLedger, onOpenNewProject }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [tab, setTab] = useState("overview");

  if (selectedProject) {
    const proj = PROJECTS.find((p) => p.id === selectedProject);
    return <ProjectDetail project={proj} inventory={inventory} allLedger={allLedger} onBack={() => { setSelectedProject(null); setTab("overview"); }} tab={tab} setTab={setTab} />;
  }

  const activeProjects = PROJECTS.filter((p) => p.status === "active");
  const totalBudget = PROJECTS.reduce((s, p) => s + p.budget, 0);
  const totalSpent = PROJECTS.reduce((s, p) => s + p.spent, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard label="Active Projects" value={activeProjects.length.toString()} />
        <StatCard label="Total Budget" value={`AED ${fmtMoney(totalBudget)}`} />
        <StatCard label="Total Spent" value={`AED ${fmtMoney(totalSpent)}`} />
        <StatCard label="Budget Utilization" value={`${Math.round((totalSpent / totalBudget) * 100)}%`} />
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black">All Projects</h3>
          <button onClick={onOpenNewProject} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-green text-white text-xs font-medium rounded-lg hover:bg-[#005c14] transition-all">
            <IoAddCircleOutline className="w-3.5 h-3.5" /> New Project
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {PROJECTS.map((proj) => {
            const invCount = proj.inventoryAllocated.length;
            const ledgerEntries = allLedger.filter((e) => proj.ledgerRefs.includes(e.ref));
            return (
              <div key={proj.id} onClick={() => setSelectedProject(proj.id)} className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-black">{proj.name}</h4>
                      <StatusBadge status={proj.status} />
                      {proj.id === "PRJ-004" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-green text-white font-medium">New</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{proj.client} · {proj.location} · {proj.startDate} — {proj.endDate}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-xs text-gray-500"><span className="font-medium text-black">{proj.productScope}</span></span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500"><span className="font-medium text-black">{invCount}</span> SKUs</span>
                      <span className="text-xs text-gray-500"><span className="font-medium text-black">{ledgerEntries.length}</span> ledger entries</span>
                      <span className="text-xs text-gray-500">Budget: <span className="font-medium text-black">AED {proj.budget.toLocaleString()}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right"><p className="text-xs text-gray-400">Spent</p><p className="text-sm font-semibold text-black">AED {proj.spent.toLocaleString()}</p></div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-primary-green rounded-full transition-all" style={{ width: `${proj.completion}%` }} /></div>
                      <span className="text-xs font-medium text-gray-500 w-8">{proj.completion}%</span>
                    </div>
                    <IoChevronForward className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectDetail({ project, inventory, allLedger, onBack, tab, setTab }) {
  const projInventory = inventory.filter((i) => project.inventoryAllocated.includes(i.id));
  const projLedger = allLedger.filter((e) => project.ledgerRefs.includes(e.ref));
  const projInvValue = projInventory.reduce((s, i) => s + i.inventoryValue, 0);
  const projDebit = projLedger.reduce((s, e) => s + (e.debit || 0), 0);
  const projCredit = projLedger.reduce((s, e) => s + (e.credit || 0), 0);
  const remaining = project.budget - project.spent;
  const keyword = project.name.split(" — ")[0].toLowerCase();
  const projApprovals = APPROVALS.filter((a) => a.project.toLowerCase().includes(keyword) || keyword.includes(a.project.split(" — ")[0].toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-sm text-primary-green hover:underline font-medium">Projects</button>
        <IoChevronForward className="w-3 h-3 text-gray-300" />
        <span className="text-sm text-gray-500">{project.name}</span>
      </div>

      <div className="bg-white rounded-lg border border-border p-5 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-black">{project.name}</h2>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-gray-400 mt-0.5">{project.client} · {project.location} · {project.startDate} — {project.endDate}</p>
            <p className="text-xs text-gray-500 mt-1">Product scope: <span className="font-medium text-black">{project.productScope}</span></p>
          </div>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg border border-border hover:bg-gray-100"><IoPencilOutline className="w-3.5 h-3.5 inline mr-1" />Edit</button>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div><p className="text-xs text-gray-400">Budget</p><p className="text-sm font-semibold text-black mt-0.5">AED {project.budget.toLocaleString()}</p></div>
          <div><p className="text-xs text-gray-400">Spent</p><p className="text-sm font-semibold text-black mt-0.5">AED {project.spent.toLocaleString()}</p></div>
          <div><p className="text-xs text-gray-400">Remaining</p><p className={`text-sm font-semibold mt-0.5 ${remaining > 0 ? "text-primary-green" : "text-red-600"}`}>AED {remaining.toLocaleString()}</p></div>
          <div><p className="text-xs text-gray-400">SKUs Allocated</p><p className="text-sm font-semibold text-black mt-0.5">{projInventory.length}</p></div>
          <div>
            <p className="text-xs text-gray-400">Completion</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-primary-green rounded-full" style={{ width: `${project.completion}%` }} /></div>
              <span className="text-xs font-semibold text-black">{project.completion}%</span>
            </div>
          </div>
        </div>

        {projApprovals.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium mb-2">Approved brands on this project:</p>
            <div className="flex items-center gap-2 flex-wrap">
              {projApprovals.map((a) => (
                <span key={a.id} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-secondary-green text-primary-green font-medium">
                  <IoShieldCheckmarkOutline className="w-3 h-3" /> {a.brand}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[["overview", "Overview"], ["inventory", "Stock"], ["financials", "Financials"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-all ${tab === id ? "border-primary-green text-primary-green" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="p-5">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-black mb-3">Allocated Stock ({projInventory.length} SKUs)</h4>
                <div className="space-y-2">
                  {projInventory.map((inv) => (
                    <div key={inv.id + inv.warehouse} className={`flex items-center justify-between py-2 px-3 rounded-lg border ${inv.isNew ? "border-primary-green/20 bg-secondary-green/30" : "border-gray-100"}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        {inv.isNew && <span className="w-1.5 h-1.5 rounded-full bg-primary-green shrink-0" />}
                        <span className="text-sm text-black truncate">{inv.productName}</span>
                        <WarehousePill id={inv.warehouse} />
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <span className="text-sm font-mono text-gray-600">{inv.qty} {inv.package}</span>
                        <span className="text-xs text-gray-400 ml-2">AED {inv.inventoryValue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
                  <span className="text-xs text-gray-400 font-medium">Total Stock Value</span>
                  <span className="text-sm font-semibold font-mono">AED {projInvValue.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-black mb-3">Financial Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg border border-gray-100"><span className="text-sm text-gray-600">Total Debits</span><span className="text-sm font-mono font-semibold">AED {projDebit.toFixed(2)}</span></div>
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg border border-gray-100"><span className="text-sm text-gray-600">Total Credits</span><span className="text-sm font-mono font-semibold">AED {projCredit.toFixed(2)}</span></div>
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg border border-primary-green/20 bg-secondary-green/30"><span className="text-sm font-medium text-primary-green">Budget Remaining</span><span className="text-sm font-mono font-semibold text-primary-green">AED {remaining.toLocaleString()}</span></div>
                </div>
                <h4 className="text-sm font-semibold text-black mt-6 mb-3">Linked Purchase Orders</h4>
                <div className="space-y-1.5">
                  {project.ledgerRefs.map((ref) => (
                    <div key={ref} className="flex items-center gap-2 py-1.5 px-3 rounded border border-gray-100">
                      <span className="font-mono text-xs px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">{ref}</span>
                      <span className="text-xs text-gray-400">{allLedger.find((e) => e.ref === ref)?.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "inventory" && (
          <div className="overflow-x-auto">
            <table className="cv-table">
              <thead><tr><th>Section</th><th>Product Name</th><th>Brand</th><th>Warehouse</th><th>Package</th><th className="text-right">Qty Allocated</th><th className="text-right">Unit Price</th><th className="text-right">Value</th></tr></thead>
              <tbody>
                {projInventory.map((inv) => (
                  <tr key={inv.id + inv.warehouse} className={inv.isNew ? "bg-secondary-green/30" : ""}>
                    <td><span className={`text-xs font-medium px-2 py-0.5 rounded ${sectionColor(inv.section)}`}>{inv.section}</span></td>
                    <td className="font-medium text-sm">{inv.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-1.5" />}{inv.productName}</td>
                    <td className="text-sm text-gray-600">{inv.brand}</td>
                    <td><WarehousePill id={inv.warehouse} /></td>
                    <td className="text-sm">{inv.package}</td>
                    <td className="text-right font-mono text-sm">{inv.qty.toLocaleString()}</td>
                    <td className="text-right font-mono text-sm">{inv.price.toFixed(2)}</td>
                    <td className="text-right font-mono text-sm font-semibold">{inv.inventoryValue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr className="bg-gray-50"><td colSpan={7} className="text-right text-xs font-medium text-gray-400">Total</td><td className="text-right font-mono font-semibold text-sm">{projInvValue.toFixed(2)}</td></tr></tfoot>
            </table>
          </div>
        )}

        {tab === "financials" && (
          <div className="overflow-x-auto">
            <table className="cv-table">
              <thead><tr><th>Date</th><th>Ref</th><th>Account</th><th>Description</th><th className="text-right">Debit (AED)</th><th className="text-right">Credit (AED)</th></tr></thead>
              <tbody>
                {projLedger.map((e, i) => (
                  <tr key={i} className={e.isNew ? "bg-secondary-green/30" : ""}>
                    <td className="whitespace-nowrap text-sm">{e.date}</td>
                    <td><span className="font-mono text-xs px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">{e.ref}</span></td>
                    <td className="font-medium text-sm">{e.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-1.5" />}{e.account}</td>
                    <td className="text-sm text-gray-500">{e.description}</td>
                    <td className="text-right font-mono text-sm">{e.debit != null ? e.debit.toFixed(2) : ""}</td>
                    <td className="text-right font-mono text-sm">{e.credit != null ? e.credit.toFixed(2) : ""}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr className="bg-gray-50"><td colSpan={4} className="text-right text-xs font-medium text-gray-400">Totals</td><td className="text-right font-mono font-semibold text-sm">{projDebit.toFixed(2)}</td><td className="text-right font-mono font-semibold text-sm">{projCredit.toFixed(2)}</td></tr></tfoot>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Documents Page ─────────────────────────────────────────────────────
const DOC_DIRECTORY = [
  { name: "PO-72401 — CMP Products UK.pdf",    ref: "PO-72401", type: "Purchase Order",  vendor: "CMP Products UK", date: "01/04/2026", total: 19372.50, flow: "inbound" },
  { name: "PO-72415 — JSL Industries.pdf",      ref: "PO-72415", type: "Purchase Order",  vendor: "JSL Industries",  date: "08/04/2026", total: 7717.50,  flow: "inbound" },
  { name: "PO-72428 — 3M Emirates.pdf",         ref: "PO-72428", type: "Purchase Order",  vendor: "3M Emirates",     date: "14/04/2026", total: 4494.00,  flow: "inbound" },
  { name: "PO-72441 — Legrand Middle East.pdf", ref: "PO-72441", type: "Purchase Order",  vendor: "Legrand ME",      date: "20/04/2026", total: 33075.00, flow: "inbound" },
];

function DocumentsPage({ uploadedFlow, onOpenPreview }) {
  const [search, setSearch] = useState("");
  const uploaded = uploadedFlow === "outbound"
    ? { name: "DN-44291 — ALEC Delivery.pdf",       ref: "INV-44291", type: "Customer Delivery Note", vendor: "ALEC",          date: "24/04/2026", total: 6352.50, flow: "outbound", isNew: true }
    : { name: "DN-72458 — Peppers Gulf Delivery.pdf", ref: "PO-72458", type: "Delivery Note",          vendor: "Peppers Gulf", date: "23/04/2026", total: 2992.50, flow: "inbound",  isNew: true };
  const docs = [...DOC_DIRECTORY, uploaded];

  const filtered = docs.filter((d) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return d.name.toLowerCase().includes(q) || d.vendor.toLowerCase().includes(q) || d.ref.toLowerCase().includes(q);
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm flex-1 max-w-md focus-within:border-primary-green">
            <IoSearchOutline className="w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents..." className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400" />
            {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-black"><IoClose className="w-4 h-4" /></button>}
          </div>
          <span className="text-xs text-gray-400">{filtered.length} of {docs.length} documents</span>
        </div>
        <table className="cv-table">
          <thead><tr><th>Document</th><th>Type</th><th>Counterparty</th><th>Date</th><th className="text-right">Total (AED)</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.ref} onClick={() => onOpenPreview(d)} className={`cursor-pointer ${d.isNew ? "bg-secondary-green/30" : ""}`}>
                <td className="font-medium text-sm">
                  <div className="flex items-center gap-2">
                    <IoDocumentTextOutline className="w-4 h-4 text-gray-400" />
                    {d.isNew && <span className="w-1.5 h-1.5 rounded-full bg-primary-green" />}
                    {d.name}
                  </div>
                </td>
                <td><span className={`text-xs font-medium px-2 py-0.5 rounded ${d.flow === "outbound" ? "bg-orange-50 text-orange-700" : "bg-blue-50 text-blue-700"}`}>{d.type}</span></td>
                <td className="text-sm text-gray-600">{d.vendor}</td>
                <td className="text-sm text-gray-500">{d.date}</td>
                <td className="text-right font-mono text-sm font-semibold">{d.total.toFixed(2)}</td>
                <td><span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary-green text-primary-green">Processed</span></td>
                <td className="text-right"><IoChevronForward className="w-4 h-4 text-gray-300" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3">Click any row to see the extracted document with field-by-field mapping.</p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MODALS & DRAWERS
// ═══════════════════════════════════════════════════════════════════════
function Modal({ title, onClose, children, width = "max-w-md" }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30 flex items-center justify-center p-6 bg-black/30" onClick={onClose}>
      <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className={`bg-white rounded-xl border border-border shadow-xl w-full ${width}`}>
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black"><IoClose className="w-5 h-5" /></button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function TransferModal({ inventory, onClose, onSubmit }) {
  const [fromWh, setFromWh] = useState(WAREHOUSES[0].id);
  const skusInFromWh = inventory.filter((i) => i.warehouse === fromWh && i.qty > 0);
  const [skuId, setSkuId] = useState(skusInFromWh[0]?.id || "");
  const [toWh, setToWh] = useState(WAREHOUSES.find((w) => w.id !== fromWh)?.id || "");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const list = inventory.filter((i) => i.warehouse === fromWh && i.qty > 0);
    setSkuId(list[0]?.id || "");
    if (toWh === fromWh) setToWh(WAREHOUSES.find((w) => w.id !== fromWh)?.id || "");
  }, [fromWh, inventory, toWh]);

  const selectedSku = inventory.find((i) => i.id === skuId && i.warehouse === fromWh);
  const maxQty = selectedSku?.qty || 0;

  const submit = () => {
    if (!skuId || !toWh || qty <= 0) return;
    onSubmit({ skuId, fromWh, toWh, qty: Math.min(qty, maxQty) });
  };

  return (
    <Modal title="Transfer Stock Between Warehouses" onClose={onClose}>
      <div className="space-y-3">
        <Field label="From warehouse">
          <select value={fromWh} onChange={(e) => setFromWh(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
            {WAREHOUSES.map((w) => <option key={w.id} value={w.id}>{w.short} — {w.role}</option>)}
          </select>
        </Field>
        <Field label="SKU">
          <select value={skuId} onChange={(e) => setSkuId(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
            {skusInFromWh.length === 0 && <option value="">No stock in this warehouse</option>}
            {skusInFromWh.map((i) => <option key={i.id} value={i.id}>{i.productName} ({i.qty} {i.package})</option>)}
          </select>
        </Field>
        <Field label="To warehouse">
          <select value={toWh} onChange={(e) => setToWh(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
            {WAREHOUSES.filter((w) => w.id !== fromWh).map((w) => <option key={w.id} value={w.id}>{w.short} — {w.role}</option>)}
          </select>
        </Field>
        <Field label={`Quantity (max ${maxQty})`}>
          <input type="number" min={1} max={maxQty} value={qty} onChange={(e) => setQty(Number(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        </Field>
      </div>
      <div className="mt-5 flex items-center justify-end gap-2">
        <button onClick={onClose} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
        <button onClick={submit} disabled={!skuId || qty <= 0 || qty > maxQty} className="px-4 py-1.5 text-sm font-medium text-white bg-primary-green rounded-lg hover:bg-[#005c14] disabled:opacity-40 disabled:cursor-not-allowed">
          <IoSwapHorizontalOutline className="w-4 h-4 inline mr-1" /> Transfer
        </button>
      </div>
    </Modal>
  );
}

function DraftPOModal({ item, onClose }) {
  const reorderQty = Math.max(item.minQty * 2 - item.qty, item.minQty);
  const subtotal = reorderQty * item.price;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  return (
    <Modal title="Draft Purchase Order" onClose={onClose} width="max-w-lg">
      <div className="text-xs text-gray-500 mb-3">Auto-drafted from reorder rule. Review and send to supplier.</div>
      <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-100">
        <KV label="SKU" value={item.productName} />
        <KV label="Brand" value={item.brand} />
        <KV label="Supplier" value={`Same as last PO (${item.brand})`} />
        <KV label="Destination" value={WH_LABEL[item.warehouse]} />
        <div className="border-t border-gray-200 pt-3 grid grid-cols-4 gap-3">
          <KVSmall label="Current" value={item.qty} />
          <KVSmall label="Min" value={item.minQty} />
          <KVSmall label="Suggested" value={reorderQty} green />
          <KVSmall label="Unit" value={item.package} />
        </div>
        <div className="border-t border-gray-200 pt-3 grid grid-cols-3 gap-3">
          <KVSmall label="Subtotal" value={`AED ${subtotal.toFixed(2)}`} />
          <KVSmall label="VAT 5%" value={`AED ${tax.toFixed(2)}`} />
          <KVSmall label="Total" value={`AED ${total.toFixed(2)}`} green />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-end gap-2">
        <button onClick={onClose} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
        <button onClick={onClose} className="px-4 py-1.5 text-sm font-medium text-white bg-primary-green rounded-lg hover:bg-[#005c14]">
          <IoCheckmarkCircle className="w-4 h-4 inline mr-1" /> Save as Draft
        </button>
      </div>
    </Modal>
  );
}

function NewProjectModal({ onClose }) {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [scope, setScope] = useState("Cable Glands & Lugs");
  const [budget, setBudget] = useState(50000);
  return (
    <Modal title="New Project" onClose={onClose} width="max-w-md">
      <div className="space-y-3">
        <Field label="Project name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Saadiyat Island Villas — Phase 2" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></Field>
        <Field label="Consultant / Client"><input value={client} onChange={(e) => setClient(e.target.value)} placeholder="e.g. Khatib & Alami" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></Field>
        <Field label="Product scope">
          <select value={scope} onChange={(e) => setScope(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option>Cable Glands & Lugs</option>
            <option>EXD Cable Glands</option>
            <option>HDG Cable Trays & Trunking</option>
            <option>GI Conduits & Accessories</option>
            <option>Heat Shrink & Terminations</option>
          </select>
        </Field>
        <Field label="Budget (AED)"><input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></Field>
      </div>
      <div className="mt-5 flex items-center justify-end gap-2">
        <button onClick={onClose} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
        <button onClick={onClose} disabled={!name || !client} className="px-4 py-1.5 text-sm font-medium text-white bg-primary-green rounded-lg hover:bg-[#005c14] disabled:opacity-40 disabled:cursor-not-allowed">
          <IoAddCircleOutline className="w-4 h-4 inline mr-1" /> Create Project
        </button>
      </div>
    </Modal>
  );
}

function DocumentPreviewDrawer({ doc, onClose }) {
  const isOut = doc.flow === "outbound";
  let lines, supplier, supplierAddr, subtotal, tax, total, notes;
  if (doc.ref === "PO-72401") {
    lines = [{ d: "CMP A2F Brass Cable Gland 20mm", q: 1000, p: 12.50 }, { d: "CMP A2F Brass Cable Gland 25mm", q: 300, p: 19.50 }];
    supplier = "CMP Products Ltd"; supplierAddr = "St Neots, Cambridgeshire, UK";
    subtotal = 18450.00; tax = 922.50; total = 19372.50;
  } else if (doc.ref === "PO-72415") {
    lines = [{ d: "Copper Lug 16mm² Cu", q: 3000, p: 1.80 }, { d: "Aluminum Lug 35mm² Al", q: 780, p: 2.50 }];
    supplier = "JSL Industries Ltd"; supplierAddr = "Vadodara, Gujarat, India";
    subtotal = 7350.00; tax = 367.50; total = 7717.50;
  } else if (doc.ref === "PO-72428") {
    lines = [{ d: "3M Heat Shrink Sleeve 12mm black", q: 600, p: 4.80 }, { d: "Panduit nylon cable tie 200mm black UV, pk/100", q: 80, p: 18.00 }];
    supplier = "3M Gulf Ltd"; supplierAddr = "Dubai Airport Free Zone, UAE";
    subtotal = 4280.00; tax = 214.00; total = 4494.00;
  } else if (doc.ref === "PO-72441") {
    lines = [{ d: "HDG Cable Tray 300mm Perforated", q: 220, p: 95.00 }, { d: "PRG Trunking 100×100 HDG", q: 435, p: 48.00 }];
    supplier = "Legrand Middle East"; supplierAddr = "Dubai Investment Park, UAE";
    subtotal = 31500.00; tax = 1575.00; total = 33075.00;
  } else if (doc.ref === "INV-44291") {
    lines = EXTRACTED_OUTBOUND.lineItems.map((li) => ({ d: li.description, q: li.qty, p: li.unitPrice }));
    supplier = "ALEC (Main Contractor)"; supplierAddr = "Dubai, UAE — Bvlgari Marina Lofts site";
    subtotal = 6050.00; tax = 302.50; total = 6352.50;
    notes = "Project ref: Bvlgari Promenade & Ocean View — Marina Lofts";
  } else {
    lines = EXTRACTED_INBOUND.lineItems.map((li) => ({ d: li.description, q: li.qty, p: li.unitPrice }));
    supplier = "Peppers Gulf"; supplierAddr = "Dubai, UAE";
    subtotal = 2850.00; tax = 142.50; total = 2992.50;
    notes = "CCG Peppers authorized distributor — Gulf region";
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30 bg-black/30 flex justify-end" onClick={onClose}>
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-[720px] max-w-full bg-white h-full overflow-auto shadow-xl border-l border-border"
      >
        <div className="sticky top-0 bg-white z-10 px-5 py-3 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-mono">{doc.ref}</p>
            <h3 className="text-sm font-semibold text-black">{doc.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${isOut ? "bg-orange-50 text-orange-700" : "bg-blue-50 text-blue-700"}`}>{doc.type}</span>
            <button onClick={onClose} className="text-gray-400 hover:text-black"><IoClose className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-xs text-gray-400 mb-3">Extraction preview — highlighted fields were read by CrossVal and mapped to your general ledger and inventory.</p>

          <div className="bg-white border border-gray-300 rounded shadow-sm p-8 font-serif text-[13px] text-black">
            <div className="flex items-start justify-between border-b-2 border-black pb-3 mb-4">
              <div>
                <Highlight label="Supplier">
                  <p className="text-base font-bold tracking-wide">{supplier}</p>
                  <p className="text-[11px] text-gray-600">{supplierAddr}</p>
                </Highlight>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold tracking-wide uppercase">{isOut ? "Delivery Note" : doc.type}</p>
                <p className="text-xs text-gray-600">Reference: <Highlight label="Doc Ref" inline><span className="font-mono">{doc.ref}</span></Highlight></p>
                <p className="text-xs text-gray-600">Date: <Highlight label="Date" inline>{doc.date}</Highlight></p>
              </div>
            </div>

            <div className="mb-4 text-xs">
              <p className="font-semibold">To:</p>
              <Highlight label={isOut ? "Customer / Recipient" : "Receiving Party"}>
                <p>{isOut ? "ALEC — Bvlgari Marina Lofts Site" : "Sun International Corporation FZC L.L.C"}</p>
                <p>{isOut ? "Palm Jumeirah, Dubai, UAE" : "Saif Zone, Sharjah, UAE"}</p>
              </Highlight>
            </div>

            <table className="w-full text-[12px] border-collapse mb-3">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-1.5 font-semibold">#</th>
                  <th className="text-left py-1.5 font-semibold">Description</th>
                  <th className="text-right py-1.5 font-semibold">Qty</th>
                  <th className="text-right py-1.5 font-semibold">Unit Price</th>
                  <th className="text-right py-1.5 font-semibold">Amount (AED)</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="py-1.5">{i + 1}</td>
                    <td className="py-1.5"><Highlight label="Line item" inline>{l.d}</Highlight></td>
                    <td className="py-1.5 text-right"><Highlight label="Qty" inline>{l.q}</Highlight></td>
                    <td className="py-1.5 text-right"><Highlight label="Price" inline>{l.p.toFixed(2)}</Highlight></td>
                    <td className="py-1.5 text-right font-semibold">{(l.q * l.p).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-72 text-xs space-y-1">
                <div className="flex justify-between"><span>Subtotal</span><Highlight label="Subtotal" inline>AED {subtotal.toFixed(2)}</Highlight></div>
                <div className="flex justify-between"><span>VAT 5%</span><Highlight label="VAT" inline>AED {tax.toFixed(2)}</Highlight></div>
                <div className="flex justify-between font-bold border-t border-gray-300 pt-1 mt-1 text-sm"><span>Total</span><Highlight label="Total" inline>AED {total.toFixed(2)}</Highlight></div>
              </div>
            </div>

            {notes && <p className="text-[11px] text-gray-500 mt-4 italic">{notes}</p>}

            <div className="mt-8 grid grid-cols-2 gap-8 text-[11px] text-gray-500">
              <div><div className="border-t border-gray-400 pt-1">Authorised by (supplier)</div></div>
              <div><div className="border-t border-gray-400 pt-1">Received by (SIC)</div></div>
            </div>
          </div>

          <div className="mt-5 p-3 border border-primary-green/20 rounded-lg bg-secondary-green/30">
            <p className="text-xs text-gray-600">
              <span className="font-semibold text-primary-green">Extraction status:</span> all highlighted fields parsed and posted to the general ledger. {lines.length} line items mapped to SKUs {isOut ? "and decremented from dispatching warehouse" : "and routed to receiving warehouse"}.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Highlight({ children, label, inline }) {
  const Cls = inline ? "inline" : "block";
  return (
    <span className={`${Cls} bg-yellow-100/60 border border-yellow-300/60 rounded px-0.5 -mx-0.5 relative group`} title={`Extracted: ${label}`}>
      {children}
    </span>
  );
}

// ─── Shared Components ──────────────────────────────────────────────────
function StatCard({ label, value, green }) {
  return (
    <div className="bg-white rounded-lg p-4 border border-border">
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className={`text-lg font-semibold mt-1 ${green ? "text-primary-green" : "text-black"}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    active:    "bg-green-50 text-green-700 border-green-200",
    planned:   "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${styles[status] || styles.planned}`}>{status}</span>;
}

function WarehousePill({ id }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border border-gray-200 bg-white text-gray-600">
      <IoLocationOutline className="w-3 h-3 text-gray-400" />
      {WH_LABEL[id] || id}
    </span>
  );
}

function WarehousePillInline({ id }) {
  return <span className="inline-flex items-center gap-1 text-[11px] text-gray-500"><IoLocationOutline className="w-3 h-3" />{WH_LABEL[id] || id}</span>;
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-500 mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function KV({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-black text-right">{value}</span>
    </div>
  );
}

function KVSmall({ label, value, green }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-semibold ${green ? "text-primary-green" : "text-black"}`}>{value}</p>
    </div>
  );
}

function sectionColor(section) {
  const map = {
    "CABLE GLANDS":      "bg-secondary-green text-primary-green",
    "LUGS & TERMINALS":  "bg-blue-50 text-blue-700",
    "ACCESSORIES":       "bg-gray-50 text-gray-600",
    "TRAYS & TRUNKING":  "bg-orange-50 text-orange-700",
    "CONDUITS":          "bg-purple-50 text-purple-700",
  };
  return map[section] || "bg-gray-50 text-gray-500";
}

function fmtMoney(n) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
