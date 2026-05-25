/** Canonical payment methods used across donate, admin, API, and live feeds */
export const PAYMENT_METHODS = [
  {
    id: "UPI",
    label: "UPI",
    gateway: "Razorpay",
    badgeClass: "bg-violet-50 text-violet-800 ring-violet-200",
  },
  {
    id: "Card",
    label: "Debit / Credit Card",
    shortLabel: "Card",
    gateway: "Stripe",
    badgeClass: "bg-blue-50 text-blue-800 ring-blue-200",
  },
  {
    id: "Net Banking",
    label: "Net Banking",
    gateway: "HDFC",
    badgeClass: "bg-slate-100 text-slate-800 ring-slate-200",
  },
  {
    id: "Wallet",
    label: "Digital Wallet",
    shortLabel: "Wallet",
    gateway: "Paytm",
    badgeClass: "bg-amber-50 text-amber-800 ring-amber-200",
  },
];

const ALIASES = {
  upi: "UPI",
  card: "Card",
  "debit card": "Card",
  "credit card": "Card",
  "debit / credit card": "Card",
  "net banking": "Net Banking",
  netbanking: "Net Banking",
  wallet: "Wallet",
  "digital wallet": "Wallet",
  paytm: "Wallet",
};

export const PAYMENT_METHOD_IDS = PAYMENT_METHODS.map((m) => m.id);

export function normalizePaymentMethod(raw) {
  if (!raw) return "UPI";
  const key = String(raw).trim().toLowerCase();
  if (ALIASES[key]) return ALIASES[key];
  const exact = PAYMENT_METHODS.find((m) => m.id.toLowerCase() === key);
  if (exact) return exact.id;
  return PAYMENT_METHODS[0].id;
}

export function getPaymentMethodMeta(methodId) {
  const id = normalizePaymentMethod(methodId);
  return PAYMENT_METHODS.find((m) => m.id === id) || PAYMENT_METHODS[0];
}

export function getPaymentMethodLabel(methodId, { short = false } = {}) {
  const meta = getPaymentMethodMeta(methodId);
  if (short && meta.shortLabel) return meta.shortLabel;
  return meta.label;
}

export function getGatewayForMethod(methodId) {
  return getPaymentMethodMeta(methodId).gateway;
}
