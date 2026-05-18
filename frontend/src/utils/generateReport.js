import { TRANSACTION_HISTORY } from "../data/managerMockData";

function formatEtb(amount) {
  return `ETB ${amount.toLocaleString()}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function monthStartISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function aggregateBreakdown(items, key) {
  const map = {};
  for (const item of items) {
    const k = item[key];
    const revenue =
      item.status === "Paid" || item.status === "Verified" ? item.amountPaid : 0;
    map[k] = (map[k] ?? 0) + revenue;
  }
  return Object.entries(map)
    .map(([name, amount]) => ({ name, amount, label: formatEtb(amount) }))
    .sort((a, b) => b.amount - a.amount);
}

export function buildReport(filters = {}) {
  const {
    dateFrom,
    dateTo,
    methods = [],
    statuses = [],
    periodLabel = "Custom period",
  } = filters;

  let rows = [...TRANSACTION_HISTORY];

  if (dateFrom) rows = rows.filter((t) => t.dateISO >= dateFrom);
  if (dateTo) rows = rows.filter((t) => t.dateISO <= dateTo);
  if (methods.length) rows = rows.filter((t) => methods.includes(t.method));
  if (statuses.length) rows = rows.filter((t) => statuses.includes(t.status));

  const totalRevenue = rows.reduce(
    (sum, t) =>
      sum + (t.status === "Paid" || t.status === "Verified" ? t.amountPaid : 0),
    0,
  );

  const flagged = rows.filter(
    (t) => t.status === "Pending" || t.status === "Failed",
  );

  return {
    periodLabel,
    dateFrom: dateFrom ?? "—",
    dateTo: dateTo ?? "—",
    totalRevenue,
    totalRevenueLabel: formatEtb(totalRevenue),
    transactionCount: rows.length,
    byMethod: aggregateBreakdown(rows, "method"),
    byService: aggregateBreakdown(rows, "service"),
    flagged: flagged.map((t) => ({
      id: t.id,
      patient: t.patient,
      service: t.service,
      amount: t.amount,
      status: t.status,
      date: t.date,
    })),
    generatedAt: new Date().toLocaleString(),
  };
}

export function buildTodayReport() {
  const today = todayISO();
  return buildReport({
    dateFrom: today,
    dateTo: today,
    periodLabel: "Today",
  });
}

export function buildMonthReport() {
  return buildReport({
    dateFrom: monthStartISO(),
    dateTo: todayISO(),
    periodLabel: "This month",
  });
}

export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function randomLoadingMs() {
  return 1000 + Math.floor(Math.random() * 1000);
}
