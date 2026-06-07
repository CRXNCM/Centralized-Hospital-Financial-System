import { pickRandomPaymentMethod } from "./paymentMethods";

export const STAT_VALUES = {
  revenue: 24850,
  patients: 47,
  verifiedAmount: 22100,
  pendingAmount: 2750,
};

export const CHART_DATA = {
  daily: [
    { name: "Cash", amount: 12400, color: "#22D3EE" },
    { name: "Telebirr", amount: 8200, color: "#10B981" },
    { name: "eBirr", amount: 4250, color: "#67E8F9" },
    { name: "CBE Birr", amount: 6800, color: "#3B82F6" },
    { name: "Amole", amount: 4200, color: "#8B5CF6" },
    { name: "Apollo", amount: 3100, color: "#F59E0B" },
    { name: "Coopay-Ebirr", amount: 2800, color: "#14B8A6" },
    { name: "Awash Wallet", amount: 2400, color: "#EC4899" },
    { name: "Other Banks", amount: 5500, color: "#94A3B8" },
  ],
  weekly: [
    { name: "Cash", amount: 68400, color: "#22D3EE" },
    { name: "Telebirr", amount: 45200, color: "#10B981" },
    { name: "eBirr", amount: 23100, color: "#67E8F9" },
    { name: "CBE Birr", amount: 38600, color: "#3B82F6" },
    { name: "Amole", amount: 22400, color: "#8B5CF6" },
    { name: "Apollo", amount: 16800, color: "#F59E0B" },
    { name: "Coopay-Ebirr", amount: 14200, color: "#14B8A6" },
    { name: "Awash Wallet", amount: 12100, color: "#EC4899" },
    { name: "Other Banks", amount: 29800, color: "#94A3B8" },
  ],
  monthly: [
    { name: "Cash", amount: 284500, color: "#22D3EE" },
    { name: "Telebirr", amount: 198200, color: "#10B981" },
    { name: "eBirr", amount: 112400, color: "#67E8F9" },
    { name: "CBE Birr", amount: 168400, color: "#3B82F6" },
    { name: "Amole", amount: 98600, color: "#8B5CF6" },
    { name: "Apollo", amount: 74200, color: "#F59E0B" },
    { name: "Coopay-Ebirr", amount: 61800, color: "#14B8A6" },
    { name: "Awash Wallet", amount: 52400, color: "#EC4899" },
    { name: "Other Banks", amount: 124600, color: "#94A3B8" },
  ],
};

export const CHART_PERIOD_LABELS = {
  daily: "today",
  weekly: "this week",
  monthly: "this month",
};

/** Collections recorded per receptionist — manager dashboard */
export const RECEPTION_COLLECTIONS = {
  daily: [
    { name: "Tigist Alemu", shortName: "Tigist A.", amount: 9850, transactions: 18, color: "#22D3EE" },
    { name: "Meron Haile", shortName: "Meron H.", amount: 7200, transactions: 14, color: "#10B981" },
    { name: "Hiwot Tadesse", shortName: "Hiwot T.", amount: 5400, transactions: 11, color: "#8B5CF6" },
    { name: "Selam Worku", shortName: "Selam W.", amount: 2400, transactions: 4, color: "#F59E0B" },
  ],
  weekly: [
    { name: "Tigist Alemu", shortName: "Tigist A.", amount: 52400, transactions: 96, color: "#22D3EE" },
    { name: "Meron Haile", shortName: "Meron H.", amount: 41800, transactions: 78, color: "#10B981" },
    { name: "Hiwot Tadesse", shortName: "Hiwot T.", amount: 35200, transactions: 64, color: "#8B5CF6" },
    { name: "Selam Worku", shortName: "Selam W.", amount: 12800, transactions: 22, color: "#F59E0B" },
  ],
  monthly: [
    { name: "Tigist Alemu", shortName: "Tigist A.", amount: 218400, transactions: 412, color: "#22D3EE" },
    { name: "Meron Haile", shortName: "Meron H.", amount: 186200, transactions: 348, color: "#10B981" },
    { name: "Hiwot Tadesse", shortName: "Hiwot T.", amount: 154800, transactions: 290, color: "#8B5CF6" },
    { name: "Selam Worku", shortName: "Selam W.", amount: 62400, transactions: 118, color: "#F59E0B" },
  ],
};

const PATIENTS = [
  "Abebe Girma", "Fatuma Ali", "Daniel Tesfaye", "Meron Haile",
  "Yonas Bekele", "Hiwot Tadesse", "Selam Desta", "Bereket Alemu",
  "Tigist Worku", "Dawit Mekonnen", "Hanna Solomon", "Kidus Alemayehu",
];

const SERVICES = ["Consultation", "Laboratory", "X-Ray", "Pharmacy", "Surgery Prep"];
const STATUSES = ["Paid", "Verified", "Pending", "Failed"];

let txCounter = 1000;

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAmount() {
  const amounts = [350, 500, 800, 1200, 1500, 2000, 3500];
  return randomItem(amounts);
}

function formatTime(date) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

const VERIFIERS = ["Manager Sara Bekele", "Admin User", "Tigist Haile", "Dawit Mekonnen"];

export function createTransaction(overrides = {}) {
  txCounter += 1;
  const amountNum = overrides.amountNum ?? randomAmount();
  const now = overrides.dateObj ?? new Date();
  const status = overrides.status ?? randomItem(STATUSES);
  const id = overrides.id ?? `TX-${txCounter}`;
  const billId = overrides.billId ?? `BILL-${String(txCounter).padStart(4, "0")}`;
  const patientId = overrides.patientId ?? `PAT-${2000 + txCounter}`;
  const isPaid = status === "Paid" || status === "Verified";
  const amountPaid = overrides.amountPaid ?? (status === "Failed" ? 0 : amountNum);

  return {
    id,
    billId,
    patientId,
    patient: overrides.patient ?? randomItem(PATIENTS),
    service: overrides.service ?? randomItem(SERVICES),
    amountNum,
    billAmount: overrides.billAmount ?? amountNum,
    amountPaid,
    amount: `ETB ${amountNum.toLocaleString()}`,
    billAmountLabel: `ETB ${(overrides.billAmount ?? amountNum).toLocaleString()}`,
    amountPaidLabel: `ETB ${amountPaid.toLocaleString()}`,
    method: overrides.method ?? pickRandomPaymentMethod(),
    status,
    time: overrides.time ?? formatTime(now),
    date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    dateISO: overrides.dateISO ?? now.toISOString().slice(0, 10),
    timestamp: now.getTime(),
    reference: overrides.reference ?? `REF-${txCounter}${Math.floor(Math.random() * 900 + 100)}`,
    recordedBy: overrides.recordedBy ?? randomItem(["Reception Staff", "Tigist H.", "Dawit M."]),
    verifiedBy: overrides.verifiedBy ?? (isPaid ? randomItem(VERIFIERS) : "—"),
    notes: overrides.notes ?? "Standard hospital service payment.",
    ...overrides,
  };
}

function buildTransactionHistory() {
  const seeds = [
    { patient: "Abebe Girma", service: "Consultation", amountNum: 500, method: "Cash", status: "Paid", time: "09:14 AM", daysAgo: 0 },
    { patient: "Fatuma Ali", service: "Laboratory", amountNum: 1200, method: "CBE Birr", status: "Verified", time: "09:45 AM", daysAgo: 0 },
    { patient: "Daniel Tesfaye", service: "X-Ray", amountNum: 800, method: "Amole", status: "Verified", time: "10:02 AM", daysAgo: 0 },
    { patient: "Meron Haile", service: "Pharmacy", amountNum: 350, method: "Cash", status: "Paid", time: "10:30 AM", daysAgo: 0 },
    { patient: "Yonas Bekele", service: "Consultation", amountNum: 500, method: "Telebirr", status: "Pending", time: "10:55 AM", daysAgo: 0, notes: "Awaiting Telebirr confirmation." },
    { patient: "Hiwot Tadesse", service: "Laboratory", amountNum: 1500, method: "Apollo", status: "Verified", time: "11:20 AM", daysAgo: 0 },
    { patient: "Selam Desta", service: "Consultation", amountNum: 500, method: "Cash", status: "Paid", time: "11:38 AM", daysAgo: 1 },
    { patient: "Bereket Alemu", service: "Pharmacy", amountNum: 350, method: "Telebirr", status: "Failed", time: "11:52 AM", daysAgo: 1, notes: "Payment timeout — retry required." },
    { patient: "Tigist Worku", service: "X-Ray", amountNum: 800, method: "eBirr", status: "Verified", time: "12:05 PM", daysAgo: 1 },
    { patient: "Dawit Mekonnen", service: "Laboratory", amountNum: 1200, method: "Cash", status: "Paid", time: "12:18 PM", daysAgo: 1 },
    { patient: "Hanna Solomon", service: "Surgery Prep", amountNum: 3500, method: "Awash Wallet", status: "Verified", time: "02:10 PM", daysAgo: 2 },
    { patient: "Kidus Alemayehu", service: "Consultation", amountNum: 500, method: "Cash", status: "Paid", time: "08:22 AM", daysAgo: 3 },
    { patient: "Meron Haile", service: "Laboratory", amountNum: 1200, method: "eBirr", status: "Pending", time: "03:45 PM", daysAgo: 4 },
    { patient: "Abebe Girma", service: "Pharmacy", amountNum: 350, method: "Cash", status: "Paid", time: "10:00 AM", daysAgo: 5 },
    { patient: "Fatuma Ali", service: "X-Ray", amountNum: 800, method: "Telebirr", status: "Verified", time: "01:15 PM", daysAgo: 6 },
    { patient: "Daniel Tesfaye", service: "Consultation", amountNum: 500, method: "eBirr", status: "Failed", time: "04:30 PM", daysAgo: 7 },
    { patient: "Yonas Bekele", service: "Laboratory", amountNum: 1500, method: "Cash", status: "Paid", time: "09:00 AM", daysAgo: 8 },
    { patient: "Hiwot Tadesse", service: "Consultation", amountNum: 500, method: "Telebirr", status: "Verified", time: "11:40 AM", daysAgo: 10 },
    { patient: "Selam Desta", service: "Pharmacy", amountNum: 350, method: "eBirr", status: "Paid", time: "02:55 PM", daysAgo: 12 },
    { patient: "Bereket Alemu", service: "X-Ray", amountNum: 800, method: "Cash", status: "Verified", time: "08:50 AM", daysAgo: 14 },
    { patient: "Tigist Worku", service: "Laboratory", amountNum: 1200, method: "Telebirr", status: "Pending", time: "05:20 PM", daysAgo: 16 },
    { patient: "Dawit Mekonnen", service: "Consultation", amountNum: 500, method: "Cash", status: "Paid", time: "07:30 AM", daysAgo: 18 },
    { patient: "Hanna Solomon", service: "Pharmacy", amountNum: 350, method: "eBirr", status: "Verified", time: "12:45 PM", daysAgo: 20 },
    { patient: "Kidus Alemayehu", service: "Surgery Prep", amountNum: 2000, method: "Coopay-Ebirr", status: "Paid", time: "03:10 PM", daysAgo: 22 },
    { patient: "Abebe Girma", service: "Laboratory", amountNum: 1200, method: "Cash", status: "Verified", time: "10:25 AM", daysAgo: 25 },
    { patient: "Fatuma Ali", service: "Consultation", amountNum: 500, method: "eBirr", status: "Paid", time: "01:50 PM", daysAgo: 28 },
  ];

  return seeds.map((seed) => {
    const d = new Date();
    d.setDate(d.getDate() - seed.daysAgo);
    const { daysAgo, ...rest } = seed;
    return createTransaction({ ...rest, dateObj: d });
  });
}

export const TRANSACTION_HISTORY = buildTransactionHistory();
export const INITIAL_TRANSACTIONS = TRANSACTION_HISTORY.slice(0, 10);

export const QUICK_ALERTS = [
  {
    id: "alert-1",
    title: "Pending verification — Yonas Bekele",
    message: "Telebirr payment ETB 500 awaiting manager approval.",
    severity: "warning",
    transactionId: null,
  },
  {
    id: "alert-2",
    title: "Failed payment — Bereket Alemu",
    message: "Telebirr transaction timed out. Patient may need to retry.",
    severity: "error",
    transactionId: null,
  },
  {
    id: "alert-3",
    title: "Unusual amount flagged",
    message: "Laboratory charge ETB 3,500 exceeds typical range for today.",
    severity: "warning",
    transactionId: null,
  },
];

export function refreshTransactions(current) {
  const maybeNew = Math.random() > 0.35 ? [createTransaction()] : [];
  const merged = [...maybeNew, ...current];
  return merged.slice(0, 10);
}
