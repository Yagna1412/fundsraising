export const parseRupeeAmount = (value) => {
  if (typeof value === "number") return value;
  return Number(String(value || "").replace(/[^\d]/g, "")) || 0;
};

export const getCampaignProgress = (item) => {
  const explicit = Number(item?.progress);
  if (!Number.isNaN(explicit) && explicit >= 0 && item?.progress !== undefined && item?.progress !== "") {
    return Math.min(100, Math.max(0, explicit));
  }
  const raised = parseRupeeAmount(item?.raised);
  const goal = parseRupeeAmount(item?.goal);
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
};

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePhone = (phone) => /^[0-9]{10}$/.test(phone.replace(/\D/g, ""));
export const validatePassword = (password) => password.length >= 6;

export const downloadCsv = (filename, rows) => {
  const headers = Object.keys(rows[0] || {});
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => `"${String(row[header]).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const notify = (message) => window.alert(message);
