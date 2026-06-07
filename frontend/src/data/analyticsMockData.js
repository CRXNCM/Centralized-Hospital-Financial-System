function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - (29 - n));
  return d;
}

function formatShortDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const dailyBase = [
  18200, 21500, 19800, 24100, 22800, 19500, 17200, 25600, 23800, 22100,
  26400, 24900, 23100, 20800, 18900, 27200, 25800, 24500, 21900, 23400,
  26100, 24850, 25300, 23900, 22700, 24400, 25900, 25100, 24850, 26200,
];

export const TREND_30_DAYS = dailyBase.map((revenue, i) => {
  const date = daysAgo(i);
  return {
    date: formatShortDate(date),
    fullDate: date.toISOString().slice(0, 10),
    revenue,
  };
});

export const PAYMENT_METHOD_SPLIT = [
  { id: "cash", name: "Cash", amount: 284500, color: "#22D3EE" },
  { id: "telebirr", name: "Telebirr", amount: 198200, color: "#10B981" },
  { id: "ebirr", name: "eBirr", amount: 112400, color: "#67E8F9" },
  { id: "cbe-birr", name: "CBE Birr", amount: 168400, color: "#3B82F6" },
  { id: "amole", name: "Amole", amount: 98600, color: "#8B5CF6" },
  { id: "apollo", name: "Apollo", amount: 74200, color: "#F59E0B" },
  { id: "coopay", name: "Coopay-Ebirr", amount: 61800, color: "#14B8A6" },
  { id: "awash", name: "Awash Wallet", amount: 52400, color: "#EC4899" },
  { id: "other-banks", name: "Other Banks", amount: 124600, color: "#94A3B8" },
];

export const MONTH_COMPARISON = {
  thisMonth: 595100,
  lastMonth: 518400,
  thisMonthLabel: "May 2026",
  lastMonthLabel: "April 2026",
};

export const TOP_SERVICES = [
  { rank: 1, name: "Laboratory", revenue: 185200 },
  { rank: 2, name: "Consultation", revenue: 142800 },
  { rank: 3, name: "X-Ray", revenue: 98400 },
  { rank: 4, name: "Pharmacy", revenue: 76300 },
  { rank: 5, name: "Surgery Prep", revenue: 52400 },
];

export const TOP_SERVICES_BY_PERIOD = {
  daily: [
    { rank: 1, name: "Consultation", revenue: 6200 },
    { rank: 2, name: "Laboratory", revenue: 5800 },
    { rank: 3, name: "Pharmacy", revenue: 4100 },
    { rank: 4, name: "X-Ray", revenue: 3200 },
    { rank: 5, name: "New Card", revenue: 900 },
  ],
  weekly: [
    { rank: 1, name: "Laboratory", revenue: 42800 },
    { rank: 2, name: "Consultation", revenue: 38400 },
    { rank: 3, name: "Pharmacy", revenue: 22100 },
    { rank: 4, name: "X-Ray", revenue: 19600 },
    { rank: 5, name: "Surgery Prep", revenue: 15200 },
  ],
  monthly: TOP_SERVICES,
};

export const TOP_SERVICES_PERIOD_LABELS = {
  daily: "today",
  weekly: "this week",
  monthly: "this month",
};

export function formatEtb(amount) {
  return `ETB ${amount.toLocaleString()}`;
}

export function paymentSplitTotal() {
  return PAYMENT_METHOD_SPLIT.reduce((s, p) => s + p.amount, 0);
}
