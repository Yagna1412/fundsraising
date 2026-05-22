import { normalizePaymentMethod } from "../../../constants/paymentMethods";

export const parseRupeeAmount = (value) => {
  if (typeof value === "number") return value;
  return Number(String(value || "").replace(/[^\d]/g, "")) || 0;
};

export const formatRupee = (amount) => {
  const n = typeof amount === "number" ? amount : parseRupeeAmount(amount);
  return `Rs ${n.toLocaleString("en-IN")}`;
};

export const getInitials = (name) =>
  String(name || "?")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const normalizeDonationRow = (row) => ({
  ...row,
  method: normalizePaymentMethod(row.method),
  amountNum: parseRupeeAmount(row.amount),
  amountDisplay: typeof row.amount === "string" && row.amount.includes("Rs") ? row.amount : formatRupee(row.amount),
});

/** Rank donors by total payment/donation volume (highest first). */
export function buildDonorRankings(donations = [], payments = []) {
  const map = new Map();

  const ingest = (donor, entry) => {
    if (!donor) return;
    const normalized = normalizeDonationRow({ donor, ...entry });
    const existing = map.get(donor) || {
      donor,
      total: 0,
      transactions: [],
    };
    existing.total += normalized.amountNum;
    existing.transactions.push({
      id: normalized.id || `${donor}-${existing.transactions.length}`,
      amount: normalized.amountDisplay,
      amountNum: normalized.amountNum,
      campaign: normalized.campaign || "General",
      method: normalized.method,
      date: normalized.date || "",
      time: normalized.time || "",
    });
    map.set(donor, existing);
  };

  const seenTx = new Set();
  const ingestUnique = (donor, entry) => {
    const normalized = normalizeDonationRow({ donor, ...entry });
    const key = `${donor}|${normalized.amountNum}|${normalized.campaign}|${normalized.date}`;
    if (seenTx.has(key)) return;
    seenTx.add(key);
    ingest(donor, entry);
  };

  const paymentSource = payments.length > 0 ? payments : donations;
  paymentSource.forEach((row) => ingestUnique(row.donor, row));

  return [...map.values()]
    .map((profile) => ({
      ...profile,
      transactions: profile.transactions.sort((a, b) => b.amountNum - a.amountNum),
      lastDonation: profile.transactions[0],
    }))
    .sort((a, b) => b.total - a.total)
    .map((profile, index) => ({
      ...profile,
      rank: index + 1,
      priorityLabel:
        index === 0 ? "Priority #1 · Top donor" : index === 1 ? "Priority #2 · High value" : index === 2 ? "Priority #3 · Active" : `Donor #${index + 1}`,
      priorityTone:
        index === 0 ? "bg-amber-100 text-amber-900 ring-amber-200" : index === 1 ? "bg-teal-100 text-teal-900 ring-teal-200" : "bg-slate-100 text-slate-700 ring-slate-200",
    }));
}
