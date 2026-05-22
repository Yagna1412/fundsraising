const paymentsSeed = [
  { id: "PAY-7001", donor: "Ravi Kumar", campaign: "Heart Surgery for Arjun", amount: 5000, method: "UPI", status: "Settled", date: "2026-05-22", gateway: "Razorpay", settlementId: "STL-88001" },
  { id: "PAY-7002", donor: "Ananya Patel", campaign: "Flood Relief - Warangal", amount: 10000, method: "Card", status: "Settled", date: "2026-05-22", gateway: "Stripe", settlementId: "STL-88002" },
  { id: "PAY-7003", donor: "Sanjay Singh", campaign: "School Supplies - Nalgonda", amount: 2500, method: "UPI", status: "Processing", date: "2026-05-22", gateway: "Razorpay", settlementId: "STL-88003" },
  { id: "PAY-7004", donor: "Lakshmi M.", campaign: "Heart Surgery for Arjun", amount: 15000, method: "Net Banking", status: "Settled", date: "2026-05-21", gateway: "HDFC", settlementId: "STL-88004" },
  { id: "PAY-7005", donor: "Deepa Sharma", campaign: "Cancer Treatment Fund", amount: 1000, method: "Card", status: "Failed", date: "2026-05-21", gateway: "Stripe", settlementId: "STL-88005" },
  { id: "PAY-7006", donor: "Priya N.", campaign: "Community Well Project", amount: 3500, method: "UPI", status: "Settled", date: "2026-05-21", gateway: "Razorpay", settlementId: "STL-88006" },
  { id: "PAY-7007", donor: "Karthik S.", campaign: "Flood Relief - Warangal", amount: 7500, method: "Card", status: "Settled", date: "2026-05-20", gateway: "Stripe", settlementId: "STL-88007" },
  { id: "PAY-7008", donor: "Neha G.", campaign: "School Supplies - Nalgonda", amount: 1200, method: "UPI", status: "Settled", date: "2026-05-20", gateway: "Razorpay", settlementId: "STL-88008" },
  { id: "PAY-7009", donor: "Arun T.", campaign: "Cancer Treatment Fund", amount: 3000, method: "Net Banking", status: "Processing", date: "2026-05-20", gateway: "HDFC", settlementId: "STL-88009" },
  { id: "PAY-7010", donor: "Meena R.", campaign: "Dialysis Fund for Deepa", amount: 8000, method: "Card", status: "Settled", date: "2026-05-19", gateway: "Stripe", settlementId: "STL-88010" },
  { id: "PAY-7011", donor: "Suresh K.", campaign: "Free Tuition Centre", amount: 2200, method: "UPI", status: "Settled", date: "2026-05-19", gateway: "Razorpay", settlementId: "STL-88011" },
  { id: "PAY-7012", donor: "Bhanu N.", campaign: "Village Road Repair", amount: 12000, method: "Net Banking", status: "Settled", date: "2026-05-18", gateway: "HDFC", settlementId: "STL-88012" },
  { id: "PAY-7013", donor: "Teja R.", campaign: "Free Tuition Centre", amount: 4500, method: "UPI", status: "Failed", date: "2026-05-18", gateway: "Razorpay", settlementId: "STL-88013" },
  { id: "PAY-7014", donor: "Venkat Naidu", campaign: "Heart Surgery for Arjun", amount: 20000, method: "Card", status: "Settled", date: "2026-05-17", gateway: "Stripe", settlementId: "STL-88014" },
  { id: "PAY-7015", donor: "Demo User", campaign: "School Supplies - Nalgonda", amount: 5000, method: "UPI", status: "Settled", date: "2026-05-17", gateway: "Razorpay", settlementId: "STL-88015" },
  { id: "PAY-7016", donor: "Isha M.", campaign: "Community Well Project", amount: 1800, method: "Wallet", status: "Settled", date: "2026-05-16", gateway: "Paytm", settlementId: "STL-88016" },
];

const userProfilesSeed = [
  { id: "USR-001", name: "Ravi Kumar", email: "ravi.kumar@email.com", phone: "+91 98765 43210", city: "Hyderabad", role: "Donor", status: "Active", joined: "Jan 2025", donations: 5, total: 50000, kyc: "Verified", panVerified: true, lastActive: "2 min ago" },
  { id: "USR-002", name: "Ananya Patel", email: "ananya.patel@email.com", phone: "+91 91234 56780", city: "Warangal", role: "Donor", status: "Active", joined: "Mar 2025", donations: 3, total: 35000, kyc: "Verified", panVerified: true, lastActive: "8 min ago" },
  { id: "USR-003", name: "Meena R.", email: "meena.r@email.com", phone: "+91 99880 11220", city: "Hyderabad", role: "Organiser", status: "Active", joined: "Feb 2025", donations: 0, total: 0, kyc: "Verified", panVerified: true, lastActive: "1 hr ago" },
  { id: "USR-004", name: "Suresh K.", email: "suresh.k@email.com", phone: "+91 90123 44556", city: "Nalgonda", role: "Organiser", status: "Active", joined: "Apr 2025", donations: 1, total: 5000, kyc: "Pending", panVerified: false, lastActive: "3 hr ago" },
  { id: "USR-005", name: "Demo User", email: "user@myfundraiser.com", phone: "+91 90000 11122", city: "Hyderabad", role: "User", status: "Active", joined: "May 2026", donations: 4, total: 70000, kyc: "Verified", panVerified: true, lastActive: "Just now" },
  { id: "USR-006", name: "Admin", email: "admin@myfundraiser.com", phone: "+91 90000 00001", city: "Hyderabad", role: "Admin", status: "Active", joined: "Dec 2024", donations: 0, total: 0, kyc: "Verified", panVerified: true, lastActive: "Just now" },
];

const securityEventsSeed = [
  { id: "SEC-01", type: "Login", user: "admin@myfundraiser.com", ip: "127.0.0.1", device: "Chrome / macOS", status: "Success", time: "2026-05-22 18:53" },
  { id: "SEC-02", type: "2FA", user: "admin@myfundraiser.com", ip: "127.0.0.1", device: "Chrome / macOS", status: "Pending", time: "2026-05-22 18:50" },
  { id: "SEC-03", type: "Password Change", user: "user@myfundraiser.com", ip: "192.168.1.4", device: "Safari / iOS", status: "Blocked", time: "2026-05-22 16:12" },
  { id: "SEC-04", type: "API Key", user: "system", ip: "10.0.0.2", device: "Server", status: "Rotated", time: "2026-05-22 09:00" },
];

const reportSeries = {
  daily: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    raised: [42000, 38500, 51200, 47800, 55600, 61200, 58900],
    donations: [18, 14, 22, 19, 25, 28, 24],
  },
  weekly: {
    labels: ["W1 Apr", "W2 Apr", "W3 Apr", "W1 May", "W2 May", "W3 May", "W4 May", "W1 Jun"],
    raised: [210000, 245000, 198000, 265000, 312000, 289000, 334000, 298000],
    donations: [82, 94, 76, 102, 118, 109, 124, 111],
  },
  monthly: {
    labels: ["Dec", "Jan", "Feb", "Mar", "Apr", "May"],
    raised: [820000, 910000, 1040000, 1180000, 1245000, 1380000],
    donations: [320, 355, 402, 448, 472, 520],
  },
};

const liveDonationTemplates = [
  { donor: "Priya N.", campaign: "Heart Surgery for Arjun", amount: 2500, method: "UPI" },
  { donor: "Karthik S.", campaign: "Flood Relief - Warangal", amount: 7500, method: "Card" },
  { donor: "Neha G.", campaign: "School Supplies - Nalgonda", amount: 1200, method: "UPI" },
  { donor: "Arun T.", campaign: "Cancer Treatment Fund", amount: 3000, method: "Net Banking" },
  { donor: "Isha M.", campaign: "Community Well Project", amount: 1800, method: "Wallet" },
];

module.exports = {
  paymentsSeed,
  userProfilesSeed,
  securityEventsSeed,
  reportSeries,
  liveDonationTemplates,
};
