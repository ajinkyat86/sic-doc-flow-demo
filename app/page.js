"use client";

import { useState, useCallback, useEffect } from "react";
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
  IoDownloadOutline,
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
} from "react-icons/io5";

// ─── Company ────────────────────────────────────────────────────────────
const COMPANY = {
  legalName: "Sun International Corporation FZC L.L.C",
  short: "SIC",
  tagline: "Cable Management Systems Distributor · Est. 1966",
};

// ─── Warehouses ─────────────────────────────────────────────────────────
const WAREHOUSES = [
  { id: "WH-SHJ", name: "Sharjah Saif Zone", short: "Sharjah HQ", address: "Saif Zone, Sharjah", role: "Head Office · Main Warehouse" },
  { id: "WH-DXB", name: "Al Khabisi, Deira", short: "Dubai Branch", address: "Al Khabisi, Deira, Dubai", role: "Branch · Technical Office" },
  { id: "WH-JAFZ", name: "Jebel Ali FZ", short: "Jebel Ali", address: "Jebel Ali Free Zone, Dubai", role: "Bulk Storage" },
];
const WH_LABEL = Object.fromEntries(WAREHOUSES.map((w) => [w.id, w.short]));

// ─── Pre-existing inventory (SIC cable management stock) ────────────────
const EXISTING_INVENTORY = [
  { id: "INV-001", section: "CABLE GLANDS", productName: "CMP A2F BRASS CABLE GLAND 20MM", prdCat: "INDUSTRIAL", brand: "CMP Products", warehouse: "WH-SHJ", package: "PC", qty: 250, price: 12.50, inventoryValue: 3125.00 },
  { id: "INV-002", section: "CABLE GLANDS", productName: "HAWKE ICG-623 EXD GLAND M20", prdCat: "EXPLOSION PROOF", brand: "Hawke International", warehouse: "WH-SHJ", package: "PC", qty: 80, price: 145.00, inventoryValue: 11600.00 },
  { id: "INV-003", section: "LUGS & TERMINALS", productName: "COPPER LUG 16MM² CU", prdCat: "TERMINATION", brand: "JSL Industries", warehouse: "WH-DXB", package: "PC", qty: 2000, price: 1.80, inventoryValue: 3600.00 },
  { id: "INV-004", section: "LUGS & TERMINALS", productName: "ALUMINUM LUG 35MM² AL", prdCat: "TERMINATION", brand: "JSL Industries", warehouse: "WH-DXB", package: "PC", qty: 1500, price: 2.50, inventoryValue: 3750.00 },
  { id: "INV-005", section: "LUGS & TERMINALS", productName: "INSULATED RING TERMINAL 6MM² RED", prdCat: "TERMINATION", brand: "Panduit", warehouse: "WH-DXB", package: "PACK/100", qty: 45, price: 28.00, inventoryValue: 1260.00 },
  { id: "INV-006", section: "ACCESSORIES", productName: "3M HEAT SHRINK SLEEVE 12MM BLACK", prdCat: "SLEEVES", brand: "3M", warehouse: "WH-SHJ", package: "METER", qty: 500, price: 4.80, inventoryValue: 2400.00 },
  { id: "INV-007", section: "ACCESSORIES", productName: "NYLON CABLE TIE 200MM BLACK UV", prdCat: "TIES", brand: "Panduit", warehouse: "WH-DXB", package: "PACK/100", qty: 60, price: 18.00, inventoryValue: 1080.00 },
  { id: "INV-008", section: "ACCESSORIES", productName: "SS316 CABLE TIE 360MM", prdCat: "TIES", brand: "Band-It", warehouse: "WH-JAFZ", package: "PACK/100", qty: 25, price: 92.00, inventoryValue: 2300.00 },
  { id: "INV-009", section: "ACCESSORIES", productName: "CABLE MARKER SET EC1 0-9", prdCat: "MARKERS", brand: "Panduit", warehouse: "WH-DXB", package: "SET", qty: 40, price: 65.00, inventoryValue: 2600.00 },
  { id: "INV-010", section: "TRAYS & TRUNKING", productName: "HDG CABLE TRAY 300MM PERFORATED", prdCat: "TRAYS", brand: "Legrand", warehouse: "WH-JAFZ", package: "METER", qty: 180, price: 95.00, inventoryValue: 17100.00 },
  { id: "INV-011", section: "TRAYS & TRUNKING", productName: "PRG TRUNKING 100X100 HDG", prdCat: "TRUNKING", brand: "Legrand", warehouse: "WH-JAFZ", package: "METER", qty: 300, price: 48.00, inventoryValue: 14400.00 },
  { id: "INV-012", section: "CONDUITS", productName: "GI CONDUIT 25MM HEAVY GAUGE", prdCat: "RIGID", brand: "OBO Bettermann", warehouse: "WH-SHJ", package: "METER", qty: 600, price: 8.40, inventoryValue: 5040.00 },
];

const NEW_INVENTORY_ENTRY = {
  id: "INV-013", section: "CABLE GLANDS", productName: "CCG PEPPERS A2F NI-PLATED BRASS GLAND 25MM", prdCat: "INDUSTRIAL", brand: "CCG Peppers", warehouse: "WH-SHJ", package: "PC", qty: 100, price: 28.50, inventoryValue: 2850.00, isNew: true,
};

// ─── Pre-existing ledger ────────────────────────────────────────────────
const EXISTING_LEDGER = [
  { date: "01/04/2026", ref: "PO-72401", account: "Inventory — Electrical Components", description: "Cable glands restock — CMP Products UK", debit: 18450.00, credit: null },
  { date: "01/04/2026", ref: "PO-72401", account: "VAT Input Tax (5%)", description: "Tax on PO-72401", debit: 922.50, credit: null },
  { date: "01/04/2026", ref: "PO-72401", account: "Accounts Payable — CMP Products", description: "Cable glands restock — CMP Products UK", debit: null, credit: 19372.50 },
  { date: "08/04/2026", ref: "PO-72415", account: "Inventory — Electrical Components", description: "Copper & aluminum lugs — JSL Industries", debit: 7350.00, credit: null },
  { date: "08/04/2026", ref: "PO-72415", account: "VAT Input Tax (5%)", description: "Tax on PO-72415", debit: 367.50, credit: null },
  { date: "08/04/2026", ref: "PO-72415", account: "Accounts Payable — JSL Industries", description: "Copper & aluminum lugs — JSL Industries", debit: null, credit: 7717.50 },
  { date: "14/04/2026", ref: "PO-72428", account: "Inventory — Electrical Components", description: "Heat shrink sleeves & markers — 3M / Panduit", debit: 4280.00, credit: null },
  { date: "14/04/2026", ref: "PO-72428", account: "VAT Input Tax (5%)", description: "Tax on PO-72428", debit: 214.00, credit: null },
  { date: "14/04/2026", ref: "PO-72428", account: "Accounts Payable — 3M Emirates", description: "Heat shrink sleeves & markers — 3M / Panduit", debit: null, credit: 4494.00 },
  { date: "20/04/2026", ref: "PO-72441", account: "Inventory — Electrical Components", description: "HDG cable trays & PRG trunking — Legrand ME", debit: 31500.00, credit: null },
  { date: "20/04/2026", ref: "PO-72441", account: "VAT Input Tax (5%)", description: "Tax on PO-72441", debit: 1575.00, credit: null },
  { date: "20/04/2026", ref: "PO-72441", account: "Accounts Payable — Legrand ME", description: "HDG cable trays & PRG trunking — Legrand ME", debit: null, credit: 33075.00 },
];

const NEW_LEDGER_ENTRIES = [
  { date: "23/04/2026", ref: "PO-72458", account: "Inventory — Electrical Components", description: "CCG Peppers A2F Ni-Plated Brass Cable Gland 25mm — 100pc", debit: 2850.00, credit: null, isNew: true },
  { date: "23/04/2026", ref: "PO-72458", account: "VAT Input Tax (5%)", description: "Tax on PO-72458", debit: 142.50, credit: null, isNew: true },
  { date: "23/04/2026", ref: "PO-72458", account: "Accounts Payable — Peppers Gulf", description: "CCG Peppers A2F Ni-Plated Brass Cable Gland 25mm — 100pc", debit: null, credit: 2992.50, isNew: true },
];

// ─── Projects (real SIC project sites from suncorpn.com/projects) ───────
const PROJECTS = [
  {
    id: "PRJ-001",
    name: "Etihad Rail Stage 2 & 3 — Package 2F2 Freight Facilities",
    client: "Jacobs",
    location: "Abu Dhabi",
    productScope: "Cable Glands & Lugs",
    status: "active",
    startDate: "01/03/2026",
    endDate: "31/12/2026",
    budget: 185000.00,
    spent: 78500.00,
    inventoryAllocated: ["INV-001", "INV-002", "INV-003", "INV-004"],
    ledgerRefs: ["PO-72401", "PO-72415"],
    completion: 42,
  },
  {
    id: "PRJ-002",
    name: "Al Maryah Vista SB13 — Island M15",
    client: "Pioneer Engineering Consultancy",
    location: "Abu Dhabi",
    productScope: "GI Conduits & Accessories",
    status: "active",
    startDate: "01/02/2026",
    endDate: "30/06/2026",
    budget: 78000.00,
    spent: 52300.00,
    inventoryAllocated: ["INV-006", "INV-007", "INV-009", "INV-012"],
    ledgerRefs: ["PO-72428"],
    completion: 67,
  },
  {
    id: "PRJ-003",
    name: "Bvlgari Promenade & Ocean View Residences — Marina Lofts",
    client: "Khatib & Alami",
    location: "Dubai",
    productScope: "HDG Cable Trays & Trunking",
    status: "active",
    startDate: "15/03/2026",
    endDate: "15/09/2026",
    budget: 142000.00,
    spent: 38500.00,
    inventoryAllocated: ["INV-010", "INV-011"],
    ledgerRefs: ["PO-72441"],
    completion: 27,
  },
  {
    id: "PRJ-004",
    name: "Business Bay Tower — Plot BB.A02.016 (B+G+3P+34)",
    client: "LACASA Architects & Engineering Consultants",
    location: "Dubai",
    productScope: "EXD Cable Glands",
    status: "planned",
    startDate: "25/04/2026",
    endDate: "30/10/2026",
    budget: 96000.00,
    spent: 2992.50,
    inventoryAllocated: ["INV-013"],
    ledgerRefs: ["PO-72458"],
    completion: 3,
  },
];

const EXTRACTED_DATA = {
  document: {
    type: "Delivery Note",
    poNumber: "PO-72458",
    supplier: "Peppers Gulf",
    supplierLocation: "Dubai",
    recipient: "SIC — Sharjah Saif Zone Warehouse",
    date: "23/04/2026",
    paymentStatus: "Not Paid",
  },
  lineItems: [
    { description: "CCG Peppers A2F Ni-Plated Brass Cable Gland 25mm", qty: 100, unitPrice: 28.50, tax: 142.50, total: 2992.50 },
  ],
};

const STEPS = [
  { id: "upload", label: "Upload" },
  { id: "processing", label: "Processing" },
  { id: "results", label: "Results" },
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: IoGridOutline },
  { id: "inventory", label: "Inventory", icon: IoCubeOutline },
  { id: "warehouses", label: "Warehouses", icon: IoBusinessOutline },
  { id: "ledger", label: "General Ledger", icon: IoReceiptOutline },
  { id: "projects", label: "Projects", icon: IoConstructOutline },
  { id: "documents", label: "Documents", icon: IoFolderOpenOutline },
];

// ═══════════════════════════════════════════════════════════════════════
export default function SuncorpnHome() {
  const [phase, setPhase] = useState("flow");
  const [step, setStep] = useState("upload");
  const [fileName, setFileName] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#app") setPhase("app");
    else if (hash === "#results") { setStep("results"); setFileName("DN-72458-Peppers-Gulf.pdf"); }
  }, []);
  const [activeTab, setActiveTab] = useState("ledger");
  const [appPage, setAppPage] = useState("inventory");

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (file) {
      setFileName(file.name);
      setStep("processing");
      setTimeout(() => setStep("results"), 2800);
    }
  }, []);

  const handleConfirm = () => { setPhase("app"); setAppPage("inventory"); };
  const resetDemo = () => { setPhase("flow"); setStep("upload"); setFileName(null); setActiveTab("ledger"); };

  if (phase === "app") return <AppShell appPage={appPage} setAppPage={setAppPage} onNewUpload={resetDemo} />;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <FlowHeader />
      <StepIndicator step={step} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          {step === "upload" && <UploadStep key="upload" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} />}
          {step === "processing" && <ProcessingStep key="processing" fileName={fileName} />}
          {step === "results" && <ResultsStep key="results" activeTab={activeTab} setActiveTab={setActiveTab} onConfirm={handleConfirm} />}
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
        <h1 className="text-xl font-semibold text-black mb-2">Upload Delivery Note or Purchase Order</h1>
        <p className="text-sm text-gray-500">We extract line items and route them into your warehouse inventory and general ledger automatically.</p>
      </div>
      <label onDrop={onDrop} onDragOver={onDragOver} className="w-full max-w-lg border-2 border-dashed border-gray-200 rounded-lg p-16 flex flex-col items-center gap-4 cursor-pointer hover:border-primary-green hover:bg-secondary-green/20 transition-all duration-200">
        <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={onDrop} className="hidden" />
        <IoCloudUploadOutline className="w-12 h-12 text-gray-300" />
        <div className="text-center">
          <p className="text-sm font-medium text-black">Drop your file here, or click to browse</p>
          <p className="text-xs text-gray-400 mt-1">PDF, PNG, or JPEG up to 10 MB</p>
        </div>
      </label>
      <div className="mt-6 w-full max-w-lg p-3 border border-blue-200 rounded-lg bg-blue-50">
        <p className="text-sm text-gray-600">Upload a supplier PO or delivery note. CrossVal posts it to the general ledger, adds the stock into the receiving warehouse, and links it to the right project or product approval.</p>
      </div>
    </motion.div>
  );
}

function ProcessingStep({ fileName }) {
  const stages = [
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

function ResultsStep({ activeTab, setActiveTab, onConfirm }) {
  const data = EXTRACTED_DATA;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
      <div className="bg-white rounded-lg border border-border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary-green flex items-center justify-center"><IoDocumentTextOutline className="w-5 h-5 text-primary-green" /></div>
            <div>
              <h2 className="text-sm font-semibold text-black">{data.document.type} — {data.document.poNumber}</h2>
              <p className="text-sm text-gray-500">{data.document.supplier} ({data.document.supplierLocation}) → {data.document.recipient}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-1 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">{data.document.paymentStatus}</span>
            <span className="text-xs font-medium px-2 py-1 rounded bg-gray-50 text-gray-600 border border-gray-200">{data.document.date}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-4 gap-4">
          <div><span className="text-xs text-gray-400 font-medium">Items</span><p className="text-sm font-semibold text-black mt-0.5">{data.lineItems.length}</p></div>
          <div><span className="text-xs text-gray-400 font-medium">Subtotal</span><p className="text-sm font-semibold text-black mt-0.5">AED 2,850.00</p></div>
          <div><span className="text-xs text-gray-400 font-medium">Tax (5% VAT)</span><p className="text-sm font-semibold text-black mt-0.5">AED 142.50</p></div>
          <div><span className="text-xs text-gray-400 font-medium">Total</span><p className="text-sm font-semibold text-primary-green mt-0.5">AED 2,992.50</p></div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-border text-sm"><IoDocumentTextOutline className="w-4 h-4 text-primary-green" /><span className="font-medium">Delivery Note</span></div>
        <IoArrowForward className="w-4 h-4 text-gray-300" />
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-green/50 rounded-lg border border-primary-green/20 text-sm"><IoReceiptOutline className="w-4 h-4 text-primary-green" /><span className="font-medium text-primary-green">Ledger</span></div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-green/50 rounded-lg border border-primary-green/20 text-sm"><IoCubeOutline className="w-4 h-4 text-primary-green" /><span className="font-medium text-primary-green">Warehouse Stock</span></div>
      </div>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[["ledger", "Ledger", IoReceiptOutline], ["inventory", "Warehouse Stock", IoCubeOutline]].map(([id, label, Icon]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-all ${activeTab === id ? "border-primary-green text-primary-green" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
        <div>{activeTab === "ledger" ? <PreviewLedger /> : <PreviewInventory />}</div>
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <p className="text-xs text-gray-400">{activeTab === "ledger" ? "3 journal entries extracted" : `1 item routed to ${WH_LABEL[NEW_INVENTORY_ENTRY.warehouse]}`}</p>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-primary-green rounded-lg hover:bg-[#005c14] transition-all active:scale-[0.98]">Confirm & Save</button>
        </div>
      </div>
    </motion.div>
  );
}

function PreviewLedger() {
  return (
    <div className="overflow-x-auto"><table className="cv-table"><thead><tr><th>Date</th><th>Ref</th><th>Account</th><th>Description</th><th className="text-right">Debit (AED)</th><th className="text-right">Credit (AED)</th></tr></thead><tbody>
      {NEW_LEDGER_ENTRIES.map((e, i) => (<tr key={i}><td className="whitespace-nowrap">{e.date}</td><td><span className="font-mono text-xs px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">{e.ref}</span></td><td className="font-medium">{e.account}</td><td className="text-gray-500">{e.description}</td><td className="text-right font-mono">{e.debit != null ? e.debit.toFixed(2) : ""}</td><td className="text-right font-mono">{e.credit != null ? e.credit.toFixed(2) : ""}</td></tr>))}
    </tbody></table></div>
  );
}

function PreviewInventory() {
  const inv = NEW_INVENTORY_ENTRY;
  return (
    <div className="overflow-x-auto"><table className="cv-table"><thead><tr><th>Section</th><th>Product Name</th><th>Brand</th><th>Warehouse</th><th>Package</th><th className="text-right">Qty</th><th className="text-right">Price (AED)</th><th className="text-right">Value</th></tr></thead><tbody>
      <tr><td><span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary-green text-primary-green">{inv.section}</span></td><td className="font-medium">{inv.productName}</td><td className="text-gray-500">{inv.brand}</td><td><WarehousePill id={inv.warehouse} /></td><td>{inv.package}</td><td className="text-right font-mono">{inv.qty}</td><td className="text-right font-mono">{inv.price.toFixed(2)}</td><td className="text-right font-mono font-semibold">{inv.inventoryValue.toFixed(2)}</td></tr>
    </tbody></table></div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════════════════════════
function AppShell({ appPage, setAppPage, onNewUpload }) {
  const allInventory = [...EXISTING_INVENTORY, NEW_INVENTORY_ENTRY];
  const allLedger = [...EXISTING_LEDGER, ...NEW_LEDGER_ENTRIES];
  const totalInvValue = allInventory.reduce((s, i) => s + i.inventoryValue, 0);
  const totalDebit = allLedger.reduce((s, e) => s + (e.debit || 0), 0);
  const totalCredit = allLedger.reduce((s, e) => s + (e.credit || 0), 0);
  const [moreOpen, setMoreOpen] = useState(false);

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
            return (
              <button key={item.id} onClick={() => setAppPage(item.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${active ? "bg-secondary-green text-primary-green font-medium" : "text-gray-600 hover:bg-gray-50 font-normal"}`}>
                <Icon className={`w-[18px] h-[18px] ${active ? "text-primary-green" : "text-gray-400"}`} />
                {item.label}
                {item.id === "warehouses" && <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">{WAREHOUSES.length}</span>}
                {item.id === "projects" && <span className="ml-auto text-[10px] bg-primary-green text-white px-1.5 py-0.5 rounded-full font-medium">{PROJECTS.length}</span>}
              </button>
            );
          })}
          <div className="mt-2 pt-2 border-t border-gray-100">
            <button onClick={() => setMoreOpen(!moreOpen)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <IoChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              More
            </button>
            {moreOpen && (
              <div className="ml-4 mt-1 space-y-0.5">
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50"><IoStatsChartOutline className="w-4 h-4 text-gray-400" />Insights</button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50"><IoLayersOutline className="w-4 h-4 text-gray-400" />Product Approvals</button>
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
            {appPage === "dashboard" && <DashboardPage key="dash" allInventory={allInventory} allLedger={allLedger} totalInvValue={totalInvValue} totalDebit={totalDebit} setAppPage={setAppPage} />}
            {appPage === "inventory" && <InventoryPage key="inv" allInventory={allInventory} totalInvValue={totalInvValue} />}
            {appPage === "warehouses" && <WarehousesPage key="wh" allInventory={allInventory} setAppPage={setAppPage} />}
            {appPage === "ledger" && <LedgerPage key="led" allLedger={allLedger} totalDebit={totalDebit} totalCredit={totalCredit} />}
            {appPage === "projects" && <ProjectsPage key="prj" allInventory={allInventory} allLedger={allLedger} />}
            {appPage === "documents" && <DocumentsPage key="docs" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard ──────────────────────────────────────────────────────────
function DashboardPage({ allInventory, allLedger, totalInvValue, totalDebit, setAppPage }) {
  const byWarehouse = WAREHOUSES.map((w) => {
    const items = allInventory.filter((i) => i.warehouse === w.id);
    const value = items.reduce((s, i) => s + i.inventoryValue, 0);
    return { ...w, itemCount: items.length, value };
  });
  const stats = [
    { label: "Stock Value", value: `AED ${totalInvValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: `${allInventory.length} SKUs across ${WAREHOUSES.length} warehouses` },
    { label: "Ledger Entries", value: allLedger.length.toString(), sub: "April 2026" },
    { label: "Active Projects", value: PROJECTS.filter(p => p.status === "active").length.toString(), sub: `${PROJECTS.length} total` },
    { label: "Documents", value: "5", sub: "All processed" },
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
              <div className="flex items-center gap-2">
                <IoBusinessOutline className="w-4 h-4 text-primary-green" />
                <p className="text-sm font-semibold text-black">{w.short}</p>
              </div>
              <span className="text-[10px] text-gray-400">{w.id}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{w.address}</p>
            <div className="flex items-end justify-between mt-3 pt-3 border-t border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Stock Value</p>
                <p className="text-sm font-semibold text-black font-mono">AED {w.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">SKUs</p>
                <p className="text-sm font-semibold text-black">{w.itemCount}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-black">Active Projects</h3><button onClick={() => setAppPage("projects")} className="text-xs text-primary-green font-medium hover:underline">View all</button></div>
          {PROJECTS.filter(p => p.status === "active").map((p) => (
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
          {allInventory.slice(-5).reverse().map((inv, i) => (
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
function InventoryPage({ allInventory, totalInvValue }) {
  const [whFilter, setWhFilter] = useState("ALL");
  const filtered = whFilter === "ALL" ? allInventory : allInventory.filter((i) => i.warehouse === whFilter);
  const filteredValue = filtered.reduce((s, i) => s + i.inventoryValue, 0);
  const categories = [...new Set(filtered.map((i) => i.prdCat))];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard label={whFilter === "ALL" ? "Total Stock Value" : "Warehouse Value"} value={`AED ${filteredValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
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
            All Warehouses
            <span className="ml-1.5 opacity-70">({allInventory.length})</span>
          </button>
          {WAREHOUSES.map((w) => {
            const count = allInventory.filter((i) => i.warehouse === w.id).length;
            const active = whFilter === w.id;
            return (
              <button key={w.id} onClick={() => setWhFilter(w.id)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all whitespace-nowrap ${active ? "bg-primary-green text-white border-primary-green" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
                <IoLocationOutline className="w-3 h-3 inline mr-1 -mt-0.5" />
                {w.short}
                <span className="ml-1.5 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
        <TableToolbar placeholder="Search stock..." count={`${filtered.length} items`} />
        <div className="overflow-x-auto">
          <table className="cv-table"><thead><tr><th>Section</th><th>Product Name</th><th>Brand</th><th>Category</th><th>Warehouse</th><th>Package</th><th className="text-right">Qty</th><th className="text-right">Price (AED)</th><th className="text-right">Value</th></tr></thead>
            <tbody>
              {filtered.map((inv, i) => (
                <tr key={i} className={inv.isNew ? "bg-secondary-green/30" : ""}>
                  <td><span className={`text-xs font-medium px-2 py-0.5 rounded ${sectionColor(inv.section)}`}>{inv.section}</span></td>
                  <td className="font-medium text-sm">{inv.isNew && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-green mr-1.5" />}{inv.productName}</td>
                  <td className="text-sm text-gray-600">{inv.brand}</td>
                  <td className="text-sm text-gray-500">{inv.prdCat}</td>
                  <td><WarehousePill id={inv.warehouse} /></td>
                  <td className="text-sm">{inv.package}</td>
                  <td className="text-right font-mono text-sm">{inv.qty.toLocaleString()}</td>
                  <td className="text-right font-mono text-sm">{inv.price.toFixed(2)}</td>
                  <td className="text-right font-mono text-sm font-semibold">{inv.inventoryValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr className="bg-gray-50"><td colSpan={8} className="text-right text-xs font-medium text-gray-400">Total</td><td className="text-right font-mono font-semibold text-sm">{filteredValue.toFixed(2)}</td></tr></tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Warehouses Page ────────────────────────────────────────────────────
function WarehousesPage({ allInventory, setAppPage }) {
  const data = WAREHOUSES.map((w) => {
    const items = allInventory.filter((i) => i.warehouse === w.id);
    const sections = [...new Set(items.map((i) => i.section))];
    const value = items.reduce((s, i) => s + i.inventoryValue, 0);
    const hasNew = items.some((i) => i.isNew);
    return { ...w, items, sections, value, hasNew };
  });
  const totalValue = data.reduce((s, d) => s + d.value, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard label="Warehouses" value={WAREHOUSES.length.toString()} />
        <StatCard label="Total SKUs" value={allInventory.length.toString()} />
        <StatCard label="Stock Value" value={`AED ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
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
                <p className="text-base font-semibold font-mono">AED {w.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
            <div className="px-5 py-3 grid grid-cols-4 gap-4 border-b border-gray-100">
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">SKUs</p><p className="text-sm font-semibold text-black">{w.items.length}</p></div>
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Sections</p><p className="text-sm font-semibold text-black">{w.sections.length}</p></div>
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Total Units</p><p className="text-sm font-semibold text-black">{w.items.reduce((s, i) => s + i.qty, 0).toLocaleString()}</p></div>
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Sections Held</p><p className="text-xs text-gray-600 mt-0.5">{w.sections.join(" · ")}</p></div>
            </div>
            <div className="overflow-x-auto">
              <table className="cv-table">
                <thead><tr><th>Product</th><th>Brand</th><th>Section</th><th>Package</th><th className="text-right">Qty</th><th className="text-right">Value</th></tr></thead>
                <tbody>
                  {w.items.map((i) => (
                    <tr key={i.id} className={i.isNew ? "bg-secondary-green/30" : ""}>
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
    </motion.div>
  );
}

// ─── Ledger Page ────────────────────────────────────────────────────────
function LedgerPage({ allLedger, totalDebit, totalCredit }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard label="Total Debits" value={`AED ${totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        <StatCard label="Total Credits" value={`AED ${totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        <StatCard label="Balance" value={Math.abs(totalDebit - totalCredit) < 0.01 ? "Balanced" : `AED ${(totalDebit - totalCredit).toFixed(2)}`} green={Math.abs(totalDebit - totalCredit) < 0.01} />
      </div>
      <div className="mb-3 p-3 border border-primary-green/20 rounded-lg bg-secondary-green/40 flex items-center gap-2">
        <IoCheckmarkCircle className="w-4 h-4 text-primary-green shrink-0" />
        <p className="text-sm text-black"><span className="font-medium">3 new entries</span> from Delivery Note PO-72458</p>
      </div>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <TableToolbar placeholder="Search ledger..." count={`${allLedger.length} entries`} />
        <div className="overflow-x-auto">
          <table className="cv-table"><thead><tr><th>Date</th><th>Ref</th><th>Account</th><th>Description</th><th className="text-right">Debit (AED)</th><th className="text-right">Credit (AED)</th></tr></thead>
            <tbody>
              {allLedger.map((e, i) => (
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
            <tfoot><tr className="bg-gray-50"><td colSpan={4} className="text-right text-xs font-medium text-gray-400">Totals</td><td className="text-right font-mono font-semibold text-sm">{totalDebit.toFixed(2)}</td><td className="text-right font-mono font-semibold text-sm">{totalCredit.toFixed(2)}</td></tr></tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Projects Page ──────────────────────────────────────────────────────
function ProjectsPage({ allInventory, allLedger }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [tab, setTab] = useState("overview");

  if (selectedProject) {
    const proj = PROJECTS.find(p => p.id === selectedProject);
    return <ProjectDetail project={proj} allInventory={allInventory} allLedger={allLedger} onBack={() => { setSelectedProject(null); setTab("overview"); }} tab={tab} setTab={setTab} />;
  }

  const activeProjects = PROJECTS.filter(p => p.status === "active");
  const totalBudget = PROJECTS.reduce((s, p) => s + p.budget, 0);
  const totalSpent = PROJECTS.reduce((s, p) => s + p.spent, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard label="Active Projects" value={activeProjects.length.toString()} />
        <StatCard label="Total Budget" value={`AED ${totalBudget.toLocaleString()}`} />
        <StatCard label="Total Spent" value={`AED ${totalSpent.toLocaleString()}`} />
        <StatCard label="Budget Utilization" value={`${Math.round(totalSpent / totalBudget * 100)}%`} />
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black">All Projects</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-green text-white text-xs font-medium rounded-lg hover:bg-[#005c14] transition-all">
            <IoAddCircleOutline className="w-3.5 h-3.5" /> New Project
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {PROJECTS.map((proj) => {
            const invCount = proj.inventoryAllocated.length;
            const ledgerEntries = allLedger.filter(e => proj.ledgerRefs.includes(e.ref));
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
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Spent</p>
                      <p className="text-sm font-semibold text-black">AED {proj.spent.toLocaleString()}</p>
                    </div>
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

// ─── Project Detail ─────────────────────────────────────────────────────
function ProjectDetail({ project, allInventory, allLedger, onBack, tab, setTab }) {
  const projInventory = allInventory.filter(i => project.inventoryAllocated.includes(i.id));
  const projLedger = allLedger.filter(e => project.ledgerRefs.includes(e.ref));
  const projInvValue = projInventory.reduce((s, i) => s + i.inventoryValue, 0);
  const projDebit = projLedger.reduce((s, e) => s + (e.debit || 0), 0);
  const projCredit = projLedger.reduce((s, e) => s + (e.credit || 0), 0);
  const remaining = project.budget - project.spent;

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
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg border border-border hover:bg-gray-100"><IoPencilOutline className="w-3.5 h-3.5 inline mr-1" />Edit</button>
          </div>
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
                    <div key={inv.id} className={`flex items-center justify-between py-2 px-3 rounded-lg border ${inv.isNew ? "border-primary-green/20 bg-secondary-green/30" : "border-gray-100"}`}>
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
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-600">Total Debits</span>
                    <span className="text-sm font-mono font-semibold">AED {projDebit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg border border-gray-100">
                    <span className="text-sm text-gray-600">Total Credits</span>
                    <span className="text-sm font-mono font-semibold">AED {projCredit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg border border-primary-green/20 bg-secondary-green/30">
                    <span className="text-sm font-medium text-primary-green">Budget Remaining</span>
                    <span className="text-sm font-mono font-semibold text-primary-green">AED {remaining.toLocaleString()}</span>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-black mt-6 mb-3">Linked Purchase Orders</h4>
                <div className="space-y-1.5">
                  {project.ledgerRefs.map(ref => (
                    <div key={ref} className="flex items-center gap-2 py-1.5 px-3 rounded border border-gray-100">
                      <span className="font-mono text-xs px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">{ref}</span>
                      <span className="text-xs text-gray-400">{allLedger.find(e => e.ref === ref)?.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "inventory" && (
          <div className="overflow-x-auto">
            <table className="cv-table"><thead><tr><th>Section</th><th>Product Name</th><th>Brand</th><th>Warehouse</th><th>Package</th><th className="text-right">Qty Allocated</th><th className="text-right">Unit Price</th><th className="text-right">Value</th></tr></thead>
              <tbody>
                {projInventory.map((inv, i) => (
                  <tr key={i} className={inv.isNew ? "bg-secondary-green/30" : ""}>
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
            <table className="cv-table"><thead><tr><th>Date</th><th>Ref</th><th>Account</th><th>Description</th><th className="text-right">Debit (AED)</th><th className="text-right">Credit (AED)</th></tr></thead>
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
function DocumentsPage() {
  const docs = [
    { name: "PO-72401 — CMP Products UK.pdf", type: "Purchase Order", vendor: "CMP Products", date: "01/04/2026", status: "Processed" },
    { name: "PO-72415 — JSL Industries.pdf", type: "Purchase Order", vendor: "JSL Industries", date: "08/04/2026", status: "Processed" },
    { name: "PO-72428 — 3M Emirates.pdf", type: "Purchase Order", vendor: "3M Emirates", date: "14/04/2026", status: "Processed" },
    { name: "PO-72441 — Legrand Middle East.pdf", type: "Purchase Order", vendor: "Legrand ME", date: "20/04/2026", status: "Processed" },
    { name: "DN-72458 — Peppers Gulf Delivery.pdf", type: "Delivery Note", vendor: "Peppers Gulf", date: "23/04/2026", status: "Processed", isNew: true },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <TableToolbar placeholder="Search documents..." count={`${docs.length} documents`} />
        <table className="cv-table"><thead><tr><th>Document</th><th>Type</th><th>Vendor</th><th>Date</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {docs.map((d, i) => (
              <tr key={i} className={d.isNew ? "bg-secondary-green/30" : ""}>
                <td className="font-medium text-sm"><div className="flex items-center gap-2"><IoDocumentTextOutline className="w-4 h-4 text-gray-400" />{d.isNew && <span className="w-1.5 h-1.5 rounded-full bg-primary-green" />}{d.name}</div></td>
                <td className="text-sm text-gray-500">{d.type}</td>
                <td className="text-sm text-gray-600">{d.vendor}</td>
                <td className="text-sm text-gray-500">{d.date}</td>
                <td><span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary-green text-primary-green">{d.status}</span></td>
                <td className="text-right"><IoDownloadOutline className="w-4 h-4 text-gray-400 hover:text-black cursor-pointer" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
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
    active: "bg-green-50 text-green-700 border-green-200",
    planned: "bg-blue-50 text-blue-700 border-blue-200",
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

function sectionColor(section) {
  const map = {
    "CABLE GLANDS": "bg-secondary-green text-primary-green",
    "LUGS & TERMINALS": "bg-blue-50 text-blue-700",
    "ACCESSORIES": "bg-gray-50 text-gray-600",
    "TRAYS & TRUNKING": "bg-orange-50 text-orange-700",
    "CONDUITS": "bg-purple-50 text-purple-700",
  };
  return map[section] || "bg-gray-50 text-gray-500";
}

function TableToolbar({ placeholder, count }) {
  return (
    <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-400"><IoSearchOutline className="w-4 h-4" />{placeholder}</div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-400 hover:border-gray-300"><IoFilterOutline className="w-4 h-4" />Filter</button>
      </div>
      <span className="text-xs text-gray-400">{count}</span>
    </div>
  );
}
