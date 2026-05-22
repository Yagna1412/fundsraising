const PAYMENT_METHODS = [
  { id: "UPI", gateway: "Razorpay" },
  { id: "Card", gateway: "Stripe" },
  { id: "Net Banking", gateway: "HDFC" },
  { id: "Wallet", gateway: "Paytm" },
];

const ALIASES = {
  upi: "UPI",
  card: "Card",
  "debit card": "Card",
  "credit card": "Card",
  "net banking": "Net Banking",
  wallet: "Wallet",
};

function normalizePaymentMethod(raw) {
  if (!raw) return "UPI";
  const key = String(raw).trim().toLowerCase();
  if (ALIASES[key]) return ALIASES[key];
  const exact = PAYMENT_METHODS.find((m) => m.id.toLowerCase() === key);
  return exact ? exact.id : "UPI";
}

function getGatewayForMethod(methodId) {
  const id = normalizePaymentMethod(methodId);
  return PAYMENT_METHODS.find((m) => m.id === id)?.gateway || "Razorpay";
}

module.exports = { normalizePaymentMethod, getGatewayForMethod };
