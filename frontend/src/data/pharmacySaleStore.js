import { formatEtb } from "./receptionBills";
import { PAYMENT_METHOD_BY_ID } from "./paymentMethods";

export { formatEtb };

export const PHARMACY_RECEPTIONIST_NAME = "Hanna";

const SALES_STORAGE_KEY = "chfs-pharmacy-sales";

export function loadPersistedSales() {
  try {
    const raw = localStorage.getItem(SALES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* use seed data */
  }
  return createInitialSales();
}

export function persistSales(sales) {
  try {
    localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(sales));
    window.dispatchEvent(new CustomEvent("pharmacy-sales-updated"));
  } catch {
    /* ignore quota errors in demo */
  }
}

export function getPharmacyTodayTotal(sales = loadPersistedSales()) {
  return getTodaysSales(sales).reduce((sum, sale) => sum + sale.amount, 0);
}

let saleCounter = 3;

function nowIso() {
  return new Date().toISOString();
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function formatSaleTimestamp(date = new Date()) {
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function generateSaleId(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `PHM-${y}${m}${d}-${h}${min}`;
}

function isToday(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function buildSeedSale({ medicineName, quantity, paymentTypeId, amount, hoursAgo, minutesAgo = 0 }) {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);
  const paymentMethod = PAYMENT_METHOD_BY_ID[paymentTypeId];
  saleCounter += 1;
  const saleId = `PHM-SEED-${String(saleCounter).padStart(4, "0")}`;

  return {
    id: `sale-${saleCounter}`,
    saleId,
    medicineName,
    quantity,
    paymentTypeId,
    methodId: paymentTypeId,
    paymentType: paymentMethod?.label ?? paymentTypeId,
    method: paymentMethod?.label ?? paymentTypeId,
    amount,
    recordedBy: PHARMACY_RECEPTIONIST_NAME,
    recordedAt: date.toISOString(),
    time: formatTime(date),
    timestamp: formatSaleTimestamp(date),
  };
}

export function createInitialSales() {
  return [
    buildSeedSale({
      medicineName: "Paracetamol 500mg",
      quantity: 2,
      paymentTypeId: "cash",
      amount: 80,
      hoursAgo: 2,
    }),
    buildSeedSale({
      medicineName: "Amoxicillin 250mg",
      quantity: 1,
      paymentTypeId: "telebirr",
      amount: 450,
      hoursAgo: 1,
      minutesAgo: 20,
    }),
    buildSeedSale({
      medicineName: "Metformin 500mg",
      quantity: 3,
      paymentTypeId: "cbe-birr",
      amount: 360,
      hoursAgo: 0,
      minutesAgo: 45,
    }),
  ];
}

export function recordSale(sales, saleInput) {
  const date = new Date();
  const methodId = saleInput.methodId ?? saleInput.paymentTypeId;
  const paymentMethod = PAYMENT_METHOD_BY_ID[methodId];
  const methodLabel = paymentMethod?.label ?? saleInput.method ?? saleInput.paymentType ?? methodId;
  const saleId = generateSaleId(date);
  const record = {
    id: `sale-${Date.now()}`,
    saleId,
    medicineName: saleInput.medicineName?.trim() || "Pharmacy Sale",
    quantity: saleInput.quantity ?? 1,
    paymentTypeId: methodId,
    methodId,
    paymentType: methodLabel,
    method: methodLabel,
    amount: saleInput.amount,
    recordedBy: PHARMACY_RECEPTIONIST_NAME,
    recordedAt: date.toISOString(),
    time: formatTime(date),
    timestamp: formatSaleTimestamp(date),
  };

  return {
    sales: [record, ...sales],
    saleRecord: record,
  };
}

export function getTodaysSales(sales) {
  return sales.filter((s) => isToday(s.recordedAt));
}

export function filterSalesByQuery(sales, query) {
  const q = query.trim().toLowerCase();
  if (!q) return sales;
  return sales.filter(
    (s) =>
      s.medicineName.toLowerCase().includes(q) ||
      s.saleId.toLowerCase().includes(q) ||
      s.paymentType.toLowerCase().includes(q),
  );
}
