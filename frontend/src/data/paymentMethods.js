/** Ethiopian hospital payment channels — cash, mobile money, and bank wallets. */

export const PAYMENT_CATEGORIES = {
  cash: { id: "cash", label: "Cash" },
  mobile: { id: "mobile", label: "Mobile Money" },
  bank: { id: "bank", label: "Bank Mobile & Wallets" },
};

export const PAYMENT_METHODS = [
  { id: "cash", label: "Cash", category: "cash" },
  { id: "telebirr", label: "Telebirr", category: "mobile" },
  { id: "ebirr", label: "eBirr", category: "mobile" },
  {
    id: "cbe-birr",
    label: "CBE Birr",
    category: "bank",
    bank: "Commercial Bank of Ethiopia",
    product: "CBE Mobile + CBE Birr",
  },
  {
    id: "amole",
    label: "Amole",
    category: "bank",
    bank: "Dashen Bank",
    product: "Amole",
  },
  {
    id: "apollo",
    label: "Apollo",
    category: "bank",
    bank: "Bank of Abyssinia",
    product: "Apollo app",
  },
  {
    id: "coopay-ebirr",
    label: "Coopay-Ebirr",
    category: "bank",
    bank: "Cooperative Bank of Oromia",
    product: "Coopay-Ebirr",
  },
  {
    id: "awash-wallet",
    label: "Awash Wallet",
    category: "bank",
    bank: "Awash Bank",
    product: "Awash Wallet / mobile banking",
  },
  {
    id: "wegagen-ebirr",
    label: "Wegagen Ebirr",
    category: "bank",
    bank: "Wegagen Bank",
    product: "Mobile banking + Ebirr integration",
  },
  {
    id: "nib-mobile",
    label: "NIB Mobile",
    category: "bank",
    bank: "Nib International Bank",
    product: "NIB mobile + Ebirr integration",
  },
  {
    id: "zemen-mobile",
    label: "Zemen Mobile",
    category: "bank",
    bank: "Zemen Bank",
    product: "Zemen mobile banking",
  },
  {
    id: "lion-mobile",
    label: "Lion Mobile",
    category: "bank",
    bank: "Lion International Bank",
    product: "Mobile banking",
  },
  {
    id: "enat-pay",
    label: "Enat Pay",
    category: "bank",
    bank: "Enat Bank",
    product: "Enat mobile banking",
  },
  {
    id: "bunna-mobile",
    label: "Bunna Mobile",
    category: "bank",
    bank: "Bunna Bank",
    product: "Bunna mobile banking",
  },
];

export const PAYMENT_METHOD_LABELS = PAYMENT_METHODS.map((m) => m.label);

export const PAYMENT_METHOD_BY_ID = Object.fromEntries(
  PAYMENT_METHODS.map((m) => [m.id, m]),
);

export const PAYMENT_METHOD_BY_LABEL = Object.fromEntries(
  PAYMENT_METHODS.map((m) => [m.label, m]),
);

/** Weighted pick for demo transaction generation */
const WEIGHTED_POOL = [
  { label: "Cash", weight: 18 },
  { label: "Telebirr", weight: 16 },
  { label: "eBirr", weight: 10 },
  { label: "CBE Birr", weight: 14 },
  { label: "Amole", weight: 9 },
  { label: "Apollo", weight: 8 },
  { label: "Coopay-Ebirr", weight: 7 },
  { label: "Awash Wallet", weight: 6 },
  { label: "Wegagen Ebirr", weight: 4 },
  { label: "NIB Mobile", weight: 4 },
  { label: "Zemen Mobile", weight: 3 },
  { label: "Lion Mobile", weight: 2 },
  { label: "Enat Pay", weight: 2 },
  { label: "Bunna Mobile", weight: 2 },
];

export function pickRandomPaymentMethod() {
  const total = WEIGHTED_POOL.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const item of WEIGHTED_POOL) {
    r -= item.weight;
    if (r <= 0) return item.label;
  }
  return WEIGHTED_POOL[0].label;
}

export function getMethodsByCategory(categoryId) {
  return PAYMENT_METHODS.filter((m) => m.category === categoryId);
}

export function getMethodLabel(methodIdOrLabel) {
  const byId = PAYMENT_METHOD_BY_ID[methodIdOrLabel];
  if (byId) return byId.label;
  return methodIdOrLabel;
}

/** Chart / analytics palette rotation */
export const METHOD_CHART_COLORS = [
  "#22D3EE",
  "#10B981",
  "#67E8F9",
  "#3B82F6",
  "#8B5CF6",
  "#F59E0B",
  "#EC4899",
  "#14B8A6",
  "#A78BFA",
  "#94A3B8",
];

export function colorForMethodIndex(index) {
  return METHOD_CHART_COLORS[index % METHOD_CHART_COLORS.length];
}
