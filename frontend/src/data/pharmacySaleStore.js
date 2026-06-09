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

function saleRecordedDate(sale) {
  if (sale.recordedAt) {
    const date = new Date(sale.recordedAt);
    if (!Number.isNaN(date.getTime())) return date;
  }

  const match = sale.saleId?.match(/^PHM-(\d{4})(\d{2})(\d{2})-/);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  return null;
}

function isTodaySale(sale) {
  const date = saleRecordedDate(sale);
  if (!date) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

const PHARMACY_STAFF_COLORS = ["#8B5CF6", "#A78BFA", "#C084FC", "#7C3AED"];

function staffShortName(fullName) {
  const parts = String(fullName).trim().split(/\s+/);
  if (parts.length < 2) return fullName;
  return `${parts[0]} ${parts[1][0]}.`;
}

function filterSalesByPeriod(sales, period) {
  const now = new Date();
  return sales.filter((sale) => {
    const date = new Date(sale.recordedAt);
    if (period === "daily") return isTodaySale(sale);
    if (period === "weekly") {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
}

export function buildPharmacyCollections(period, fallback = []) {
  const sales = filterSalesByPeriod(loadPersistedSales(), period);
  const totals = {};

  for (const sale of sales) {
    const name = sale.recordedBy || PHARMACY_RECEPTIONIST_NAME;
    if (!totals[name]) {
      totals[name] = { name, amount: 0, transactions: 0 };
    }
    totals[name].amount += sale.amount;
    totals[name].transactions += 1;
  }

  const fromSales = Object.values(totals)
    .map((row, index) => ({
      ...row,
      shortName: staffShortName(row.name),
      color: PHARMACY_STAFF_COLORS[index % PHARMACY_STAFF_COLORS.length],
    }))
    .sort((a, b) => b.amount - a.amount);

  return fromSales.length > 0 ? fromSales : fallback;
}

export function getPharmacyTransactionsForManager(limit = 10) {
  return loadPersistedSales()
    .slice()
    .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))
    .slice(0, limit)
    .map((sale) => ({
      id: sale.id,
      saleId: sale.saleId,
      amount: sale.amount,
      amountLabel: formatEtb(sale.amount),
      method: sale.method ?? sale.paymentType,
      time: sale.timestamp ?? sale.time,
      recordedBy: sale.recordedBy ?? PHARMACY_RECEPTIONIST_NAME,
      status: "Paid",
    }));
}

function buildSeedSale({ paymentTypeId, amount, hoursAgo, minutesAgo = 0, recordedBy }) {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);
  const paymentMethod = PAYMENT_METHOD_BY_ID[paymentTypeId];
  saleCounter += 1;
  const saleId = `PHM-SEED-${String(saleCounter).padStart(4, "0")}`;

  return {
    id: `sale-${saleCounter}`,
    saleId,
    paymentTypeId,
    methodId: paymentTypeId,
    paymentType: paymentMethod?.label ?? paymentTypeId,
    method: paymentMethod?.label ?? paymentTypeId,
    amount,
    recordedBy: recordedBy ?? PHARMACY_RECEPTIONIST_NAME,
    recordedAt: date.toISOString(),
    time: formatTime(date),
    timestamp: formatSaleTimestamp(date),
  };
}

export function createInitialSales() {
  return [
    buildSeedSale({
      paymentTypeId: "cash",
      amount: 80,
      hoursAgo: 2,
    }),
    buildSeedSale({
      paymentTypeId: "telebirr",
      amount: 450,
      hoursAgo: 1,
      minutesAgo: 20,
    }),
    buildSeedSale({
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
  return sales.filter(isTodaySale);
}

export function filterSalesByQuery(sales, query) {
  const q = query.trim().toLowerCase();
  if (!q) return sales;
  return sales.filter(
    (s) =>
      s.saleId.toLowerCase().includes(q) ||
      (s.paymentType ?? s.method ?? "").toLowerCase().includes(q),
  );
}
