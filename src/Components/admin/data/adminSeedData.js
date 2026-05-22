export const campaigns = [
  { id: "CMP-1001", name: "Heart Surgery for Arjun", organiser: "Meena R.", category: "Medical", beneficiary: "Arjun Kumar", raised: "Rs 4,10,000", goal: "Rs 5,00,000", progress: 82, status: "Active", deadline: "Jun 15, 2026", createdAt: "Apr 2, 2026", donorCount: 142, verified: true },
  { id: "CMP-1002", name: "School Supplies - Nalgonda", organiser: "Suresh K.", category: "Education", beneficiary: "ZPHS Nalgonda", raised: "Rs 51,600", goal: "Rs 1,20,000", progress: 43, status: "Active", deadline: "May 30, 2026", createdAt: "Mar 18, 2026", donorCount: 38, verified: true },
  { id: "CMP-1003", name: "Flood Relief - Warangal", organiser: "NGO Sahay", category: "Community", beneficiary: "Warangal District", raised: "Rs 9,70,000", goal: "Rs 10,00,000", progress: 97, status: "Urgent", deadline: "May 22, 2026", createdAt: "May 1, 2026", donorCount: 310, verified: true },
  { id: "CMP-1004", name: "Community Well Project", organiser: "Priso M.", category: "Community", beneficiary: "Village Panchayat", raised: "Rs 65,200", goal: "Rs 2,50,000", progress: 26, status: "Paused", deadline: "Jul 1, 2026", createdAt: "Feb 10, 2026", donorCount: 21, verified: false },
  { id: "CMP-1005", name: "Cancer Treatment Fund", organiser: "Ramesh P.", category: "Medical", beneficiary: "Lakshmi Devi", raised: "Rs 82,000", goal: "Rs 4,00,000", progress: 61, status: "Active", deadline: "Jun 30, 2026", createdAt: "Apr 28, 2026", donorCount: 56, verified: true },
];

export const getSubmittedFundraisers = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("userFunds")) || [];
    return stored.map((fundraiser, index) => {
      const goalAmount = Number(fundraiser.goalAmount || 0);
      const raisedAmount = Number(fundraiser.raised || 0);
      const progress = goalAmount > 0 ? Math.min(100, Math.round((raisedAmount / goalAmount) * 100)) : 0;
      return {
        id: fundraiser.id || `SUB-${String(index + 1).padStart(4, "0")}`,
        name: fundraiser.title || "Untitled Fundraiser",
        organiser: fundraiser.creator || "Submitted User",
        category: fundraiser.category || "General",
        raised: `Rs ${raisedAmount.toLocaleString("en-IN")}`,
        goal: `Rs ${goalAmount.toLocaleString("en-IN")}`,
        progress,
        status: fundraiser.status || "Pending Review",
        deadline: fundraiser.endDate || "Not set",
        createdAt: fundraiser.createdAt || "Recently",
        donorCount: Number(fundraiser.donorCount || 0),
        verified: false,
        description: fundraiser.description || "No description provided.",
        beneficiary: fundraiser.beneficiary || "Not specified",
        image: fundraiser.image,
        submittedAt: fundraiser.createdAt || "Recently",
        source: "Submitted Fundraiser",
      };
    });
  } catch {
    return [];
  }
};

export const donations = [
  { id: "TXN-90021", donor: "Ravi Kumar", email: "ravi.kumar@email.com", campaign: "Heart Surgery for Arjun", campaignId: "CMP-1001", amount: "Rs 5,000", method: "UPI", date: "May 21, 2026", time: "10:30 AM", status: "Success", reference: "UPI/REF/8821" },
  { id: "TXN-90020", donor: "Ananya Patel", email: "ananya.patel@email.com", campaign: "Flood Relief - Warangal", campaignId: "CMP-1003", amount: "Rs 10,000", method: "Card", date: "May 21, 2026", time: "10:20 AM", status: "Success", reference: "CARD/REF/4410" },
  { id: "TXN-90019", donor: "Sanjay Singh", email: "sanjay.singh@email.com", campaign: "School Supplies - Nalgonda", campaignId: "CMP-1002", amount: "Rs 2,500", method: "UPI", date: "May 21, 2026", time: "10:10 AM", status: "Success", reference: "UPI/REF/7712" },
  { id: "TXN-90018", donor: "Lakshmi M.", email: "lakshmi@email.com", campaign: "Heart Surgery for Arjun", campaignId: "CMP-1001", amount: "Rs 15,000", method: "Net Banking", date: "May 21, 2026", time: "10:05 AM", status: "Success", reference: "NEFT/REF/3309" },
  { id: "TXN-90017", donor: "Deepa Sharma", email: "deepa.sharma@email.com", campaign: "Cancer Treatment Fund", campaignId: "CMP-1005", amount: "Rs 1,000", method: "Card", date: "May 21, 2026", time: "09:48 AM", status: "Pending", reference: "CARD/REF/PENDING" },
];

export const donors = [
  { name: "Ravi Kumar", email: "ravi.kumar@email.com", phone: "+91 98765 43210", donated: "Rs 50,000", campaigns: 5, last: "May 21, 2026", memberSince: "Jan 2025", donorType: "Recurring", status: "Active", kyc: "Verified" },
  { name: "Ananya Patel", email: "ananya.patel@email.com", phone: "+91 91234 56780", donated: "Rs 35,000", campaigns: 3, last: "May 21, 2026", memberSince: "Mar 2025", donorType: "One-time", status: "Active", kyc: "Verified" },
  { name: "Venkat Naidu", email: "venkat.naidu@email.com", phone: "+91 99887 76655", donated: "Rs 40,000", campaigns: 4, last: "May 20, 2026", memberSince: "Dec 2024", donorType: "Corporate", status: "Inactive", kyc: "Verified" },
  { name: "Sanjay Singh", email: "sanjay.singh@email.com", phone: "+91 90123 45678", donated: "Rs 22,500", campaigns: 2, last: "May 21, 2026", memberSince: "Feb 2026", donorType: "One-time", status: "Active", kyc: "Pending" },
  { name: "Lakshmi M.", email: "lakshmi@email.com", phone: "+91 93456 78901", donated: "Rs 15,000", campaigns: 2, last: "May 18, 2026", memberSince: "Apr 2025", donorType: "Recurring", status: "Inactive", kyc: "Verified" },
];

export const LIFE_SAVING_IMAGE =
  "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1600&q=80";

export const approvals = [
  { id: "APR-301", campaign: "Dialysis Fund for Deepa", by: "Deepa V.", phone: "+91 98760 11223", category: "Medical", goal: "Rs 3,00,000", location: "Hyderabad", submittedDate: "May 21, 2026", docs: 3, kycStatus: "Verified" },
  { id: "APR-302", campaign: "Free Tuition Centre", by: "Teja R.", phone: "+91 90111 22334", category: "Education", goal: "Rs 60,000", location: "Warangal", submittedDate: "May 20, 2026", docs: 2, kycStatus: "Pending" },
  { id: "APR-303", campaign: "Village Road Repair", by: "Bhanu N.", phone: "+91 93444 55667", category: "Community", goal: "Rs 1,50,000", location: "Nalgonda", submittedDate: "May 19, 2026", docs: 4, kycStatus: "Verified" },
];

export const conversations = [
  { name: "Meena R.", subject: "Heart Surgery for Arjun", time: "10:30 AM", active: true },
  { name: "Suresh K.", subject: "School Supplies - Nalgonda", time: "10:10 AM", active: false },
  { name: "Deepa V.", subject: "Dialysis Fund for Deepa", time: "Yesterday", active: false },
  { name: "Teja R.", subject: "Free Tuition Centre", time: "Yesterday", active: false },
  { name: "Bhanu N.", subject: "Village Road Repair", time: "Yesterday", active: false },
];

export const categoryStats = [
  { name: "Medical", value: 40, color: "#0f766e", bg: "bg-teal-50", text: "text-teal-700" },
  { name: "Education", value: 22, color: "#2563eb", bg: "bg-blue-50", text: "text-blue-700" },
  { name: "Community", value: 14, color: "#7c3aed", bg: "bg-violet-50", text: "text-violet-700" },
  { name: "Others", value: 24, color: "#ea580c", bg: "bg-orange-50", text: "text-orange-700" },
];

export const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Completed: "bg-sky-50 text-sky-700 ring-sky-200",
  Urgent: "bg-red-50 text-red-700 ring-red-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  "Pending Review": "bg-amber-50 text-amber-700 ring-amber-200",
  Paused: "bg-slate-100 text-slate-700 ring-slate-200",
  Inactive: "bg-slate-100 text-slate-600 ring-slate-200",
  Refunded: "bg-purple-50 text-purple-700 ring-purple-200",
};

export const statusMeters = {
  Active: { value: 100, color: "bg-emerald-500" },
  Success: { value: 100, color: "bg-emerald-500" },
  Completed: { value: 100, color: "bg-sky-500" },
  Urgent: { value: 82, color: "bg-red-500" },
  Pending: { value: 58, color: "bg-amber-500" },
  Paused: { value: 34, color: "bg-slate-500" },
  Inactive: { value: 22, color: "bg-slate-400" },
  Refunded: { value: 100, color: "bg-purple-500" },
  "Pending Review": { value: 62, color: "bg-amber-500" },
};

export const actionStyles = {
  primary: "bg-teal-700 text-white hover:bg-teal-800",
  neutral: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  info: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  warning: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  danger: "bg-red-50 text-red-700 hover:bg-red-100",
  success: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
};
