import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  CheckCircle,
  CircleDollarSign,
  CreditCard,
  Edit3,
  Eye,
  FileText,
  Home,
  LayoutDashboard,
  MessageSquare,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Search,
  LogOut,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserCircle,
  Users,
} from "lucide-react";
import { useAdminRealtime } from "../hooks/useAdminRealtime";
import platformApi from "../services/platformApi";
import AdminReportsPanel from "./admin/AdminReportsPanel";
import AdminPaymentsPanel from "./admin/AdminPaymentsPanel";
import AdminUserProfilesPanel from "./admin/AdminUserProfilesPanel";
import AdminSecurityPanel from "./admin/AdminSecurityPanel";
import LiveSyncBadge from "./admin/LiveSyncBadge";
import AdminSidebar from "./admin/components/AdminSidebar";
import AdminSettingsPanel from "./admin/components/AdminSettingsPanel";
import AdminHomeView from "./admin/views/AdminHomeView";
import adminPageStyles from "./admin/styles/adminPageStyles";
import { StatCard } from "./admin/components/ui/AdminUi";
import PaymentMethodBadge from "./admin/components/PaymentMethodBadge";
import Pagination from "./admin/components/Pagination";
import AdminPendingApprovalsPanel, { PendingApprovalsFull } from "./admin/components/AdminPendingApprovalsPanel";
import { normalizePaymentMethod } from "../constants/paymentMethods";

const DONOR_PAGE_SIZE = 5;
const DONATION_PAGE_SIZE = 5;

const campaigns = [
  { id: "CMP-1001", name: "Heart Surgery for Arjun", organiser: "Meena R.", category: "Medical", beneficiary: "Arjun Kumar", raised: "Rs 4,10,000", goal: "Rs 5,00,000", progress: 82, status: "Active", deadline: "Jun 15, 2026", createdAt: "Apr 2, 2026", donorCount: 142, verified: true },
  { id: "CMP-1002", name: "School Supplies - Nalgonda", organiser: "Suresh K.", category: "Education", beneficiary: "ZPHS Nalgonda", raised: "Rs 51,600", goal: "Rs 1,20,000", progress: 43, status: "Active", deadline: "May 30, 2026", createdAt: "Mar 18, 2026", donorCount: 38, verified: true },
  { id: "CMP-1003", name: "Flood Relief - Warangal", organiser: "NGO Sahay", category: "Community", beneficiary: "Warangal District", raised: "Rs 9,70,000", goal: "Rs 10,00,000", progress: 97, status: "Urgent", deadline: "May 22, 2026", createdAt: "May 1, 2026", donorCount: 310, verified: true },
  { id: "CMP-1004", name: "Community Well Project", organiser: "Priso M.", category: "Community", beneficiary: "Village Panchayat", raised: "Rs 65,200", goal: "Rs 2,50,000", progress: 26, status: "Paused", deadline: "Jul 1, 2026", createdAt: "Feb 10, 2026", donorCount: 21, verified: false },
  { id: "CMP-1005", name: "Cancer Treatment Fund", organiser: "Ramesh P.", category: "Medical", beneficiary: "Lakshmi Devi", raised: "Rs 82,000", goal: "Rs 4,00,000", progress: 61, status: "Active", deadline: "Jun 30, 2026", createdAt: "Apr 28, 2026", donorCount: 56, verified: true },
];

const getSubmittedFundraisers = () => {
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

const donations = [
  { id: "TXN-90021", donor: "Ravi Kumar", email: "ravi.kumar@email.com", campaign: "Heart Surgery for Arjun", campaignId: "CMP-1001", amount: "Rs 5,000", method: "UPI", date: "May 21, 2026", time: "10:30 AM", status: "Success", reference: "UPI/REF/8821" },
  { id: "TXN-90020", donor: "Ananya Patel", email: "ananya.patel@email.com", campaign: "Flood Relief - Warangal", campaignId: "CMP-1003", amount: "Rs 10,000", method: "Card", date: "May 21, 2026", time: "10:20 AM", status: "Success", reference: "CARD/REF/4410" },
  { id: "TXN-90019", donor: "Sanjay Singh", email: "sanjay.singh@email.com", campaign: "School Supplies - Nalgonda", campaignId: "CMP-1002", amount: "Rs 2,500", method: "UPI", date: "May 21, 2026", time: "10:10 AM", status: "Success", reference: "UPI/REF/7712" },
  { id: "TXN-90018", donor: "Lakshmi M.", email: "lakshmi@email.com", campaign: "Heart Surgery for Arjun", campaignId: "CMP-1001", amount: "Rs 15,000", method: "Net Banking", date: "May 21, 2026", time: "10:05 AM", status: "Success", reference: "NEFT/REF/3309" },
  { id: "TXN-90017", donor: "Deepa Sharma", email: "deepa.sharma@email.com", campaign: "Cancer Treatment Fund", campaignId: "CMP-1005", amount: "Rs 1,000", method: "Card", date: "May 21, 2026", time: "09:48 AM", status: "Pending", reference: "CARD/REF/PENDING" },
];

const donors = [
  { name: "Ravi Kumar", email: "ravi.kumar@email.com", phone: "+91 98765 43210", donated: "Rs 50,000", campaigns: 5, last: "May 21, 2026", memberSince: "Jan 2025", donorType: "Recurring", status: "Active", kyc: "Verified" },
  { name: "Ananya Patel", email: "ananya.patel@email.com", phone: "+91 91234 56780", donated: "Rs 35,000", campaigns: 3, last: "May 21, 2026", memberSince: "Mar 2025", donorType: "One-time", status: "Active", kyc: "Verified" },
  { name: "Venkat Naidu", email: "venkat.naidu@email.com", phone: "+91 99887 76655", donated: "Rs 40,000", campaigns: 4, last: "May 20, 2026", memberSince: "Dec 2024", donorType: "Corporate", status: "Inactive", kyc: "Verified" },
  { name: "Sanjay Singh", email: "sanjay.singh@email.com", phone: "+91 90123 45678", donated: "Rs 22,500", campaigns: 2, last: "May 21, 2026", memberSince: "Feb 2026", donorType: "One-time", status: "Active", kyc: "Pending" },
  { name: "Lakshmi M.", email: "lakshmi@email.com", phone: "+91 93456 78901", donated: "Rs 15,000", campaigns: 2, last: "May 18, 2026", memberSince: "Apr 2025", donorType: "Recurring", status: "Inactive", kyc: "Verified" },
];

const LIFE_SAVING_IMAGE = "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1600&q=80";

const approvals = [
  { id: "APR-301", campaign: "Dialysis Fund for Deepa", by: "Deepa V.", phone: "+91 98760 11223", category: "Medical", goal: "Rs 3,00,000", location: "Hyderabad", submittedDate: "May 21, 2026", docs: 3, kycStatus: "Verified" },
  { id: "APR-302", campaign: "Free Tuition Centre", by: "Teja R.", phone: "+91 90111 22334", category: "Education", goal: "Rs 60,000", location: "Warangal", submittedDate: "May 20, 2026", docs: 2, kycStatus: "Pending" },
  { id: "APR-303", campaign: "Village Road Repair", by: "Bhanu N.", phone: "+91 93444 55667", category: "Community", goal: "Rs 1,50,000", location: "Nalgonda", submittedDate: "May 19, 2026", docs: 4, kycStatus: "Verified" },
  { id: "APR-304", campaign: "Cancer Care for Lakshmi", by: "Ramesh P.", phone: "+91 98765 11122", category: "Medical", goal: "Rs 4,00,000", location: "Hyderabad", submittedDate: "May 18, 2026", docs: 3, kycStatus: "Verified" },
  { id: "APR-305", campaign: "School Bus for ZPHS", by: "Suresh K.", phone: "+91 91234 55667", category: "Education", goal: "Rs 2,20,000", location: "Nalgonda", submittedDate: "May 17, 2026", docs: 2, kycStatus: "Pending" },
  { id: "APR-306", campaign: "Clean Water Initiative", by: "Priya N.", phone: "+91 99880 33445", category: "Community", goal: "Rs 80,000", location: "Warangal", submittedDate: "May 16, 2026", docs: 3, kycStatus: "Verified" },
  { id: "APR-307", campaign: "Emergency Relief Fund", by: "Karthik S.", phone: "+91 90123 77889", category: "Community", goal: "Rs 1,00,000", location: "Hyderabad", submittedDate: "May 15, 2026", docs: 4, kycStatus: "Pending" },
];

const conversations = [
  { name: "Meena R.", subject: "Heart Surgery for Arjun", time: "10:30 AM", active: true },
  { name: "Suresh K.", subject: "School Supplies - Nalgonda", time: "10:10 AM", active: false },
  { name: "Deepa V.", subject: "Dialysis Fund for Deepa", time: "Yesterday", active: false },
  { name: "Teja R.", subject: "Free Tuition Centre", time: "Yesterday", active: false },
  { name: "Bhanu N.", subject: "Village Road Repair", time: "Yesterday", active: false },
];

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "campaigns", label: "Campaigns", icon: Home },
  { key: "donors", label: "Donors", icon: Users },
  { key: "donations", label: "Donations", icon: CircleDollarSign },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "userProfiles", label: "User Profiles", icon: UserCircle },
  { key: "approvals", label: "Approvals", icon: CheckCircle },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "security", label: "Security", icon: ShieldCheck },
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "settings", label: "Settings", icon: Settings },
];

const statusStyles = {
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

const statusMeters = {
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

const parseRupeeAmount = (value) => {
  if (typeof value === "number") return value;
  return Number(String(value || "").replace(/[^\d]/g, "")) || 0;
};

const getCampaignProgress = (item) => {
  const explicit = Number(item?.progress);
  if (!Number.isNaN(explicit) && explicit >= 0 && item?.progress !== undefined && item?.progress !== "") {
    return Math.min(100, Math.max(0, explicit));
  }
  const raised = parseRupeeAmount(item?.raised);
  const goal = parseRupeeAmount(item?.goal);
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
};

const actionStyles = {
  primary: "bg-teal-700 text-white hover:bg-teal-800",
  neutral: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  info: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  warning: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  danger: "bg-red-50 text-red-700 hover:bg-red-100",
  success: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
};

const StatusPill = ({ status }) => {
  const style = statusStyles[status] || "bg-slate-100 text-slate-700 ring-slate-200";
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${style}`}>{status}</span>;
};

const StatusCell = ({ status, meterValue }) => {
  const meter = statusMeters[status] || { value: 50, color: "bg-slate-500" };
  const pct = Math.min(100, Math.max(0, Number(meterValue ?? meter.value) || 0));
  const barWidth = pct > 0 ? Math.max(pct, 10) : 0;
  return (
    <div className="status-cell min-w-[148px]">
      <StatusPill status={status || "Unknown"} />
      <div className="mt-2 flex items-center gap-2">
        <div className="h-2 min-w-[72px] flex-1 overflow-hidden rounded-full bg-slate-200">
          <div className={`h-2 rounded-full ${meter.color}`} style={{ width: `${barWidth}%` }} />
        </div>
        <span className="shrink-0 text-[10px] font-bold text-slate-500">{pct}%</span>
      </div>
    </div>
  );
};

const ActionButton = ({ children, icon: Icon, tone = "neutral", ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-bold ${actionStyles[tone]} ${props.className || ""}`}
  >
    {Icon && <Icon size={13} />}
    {children}
  </button>
);

const Progress = ({ value = 0 }) => {
  const safe = Math.min(100, Math.max(0, Number(value) || 0));
  const barWidth = safe > 0 ? Math.max(safe, 6) : 0;
  return (
    <div className="progress-cell flex min-w-[128px] items-center gap-2">
      <div className="h-2.5 min-w-[88px] flex-1 overflow-hidden rounded-full bg-slate-200">
        <div className="h-2.5 rounded-full bg-teal-600" style={{ width: `${barWidth}%` }} />
      </div>
      <span className="shrink-0 text-xs font-bold text-slate-600">{safe}%</span>
    </div>
  );
};

const Toolbar = ({ placeholder, searchValue = "", onSearchChange, children }) => (
  <div className="admin-toolbar mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <label className="relative w-full md:max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input
        value={searchValue}
        onChange={(e) => onSearchChange?.(e.target.value)}
        className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-600"
        placeholder={placeholder}
      />
    </label>
    <div className="admin-toolbar-actions flex flex-wrap gap-2">{children}</div>
  </div>
);

const FilterSelect = ({ value, onChange, options, label }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    aria-label={label}
    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-teal-600"
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const TableHead = ({ children }) => (
  <thead className="bg-slate-50/90">
    <tr className="border-b border-slate-200">{children}</tr>
  </thead>
);

const Th = ({ children, className = "" }) => (
  <th className={`whitespace-nowrap px-4 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wide text-slate-500 ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "", wrap = false }) => (
  <td className={`px-4 py-4 align-top text-left text-sm text-slate-700 ${wrap ? "whitespace-normal" : "whitespace-nowrap"} ${className}`}>
    {children}
  </td>
);

const TextCell = ({ primary, secondary, title }) => (
  <div className="min-w-[160px] max-w-[260px]" title={title || primary}>
    <p className="text-sm font-semibold leading-snug text-slate-900 line-clamp-2 break-words">{primary}</p>
    {secondary ? <p className="mt-1 text-xs font-medium text-slate-500 line-clamp-1">{secondary}</p> : null}
  </div>
);

const IdBadge = ({ value }) => (
  <span className="inline-block max-w-full truncate rounded-md bg-slate-100 px-2 py-1 text-left font-mono text-[11px] font-bold text-slate-600">
    {value}
  </span>
);

const VerifiedBadge = ({ verified }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${verified ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-amber-200"}`}>
    {verified ? "Verified" : "Review"}
  </span>
);

const TableShell = ({ children, minWidth = 1280, fixed = false }) => (
  <div className="admin-table overflow-x-auto rounded-2xl border border-slate-200 bg-white">
    <table
      className={`w-full border-collapse text-left text-sm ${fixed ? "table-fixed" : ""}`}
      style={{ minWidth: fixed ? undefined : minWidth }}
    >
      {children}
    </table>
  </div>
);

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [approvalItems, setApprovalItems] = useState(approvals);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageDraft, setMessageDraft] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [settingsTab, setSettingsTab] = useState("Profile");
  
  // Form state for settings
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "MyFundraiser",
    jobTitle: "Platform Administrator",
    department: "Operations",
  });
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Modal states
  const [showEditCampaignForm, setShowEditCampaignForm] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [showDonorDetailsModal, setShowDonorDetailsModal] = useState(false);
  const [showCampaignDetailsModal, setShowCampaignDetailsModal] = useState(false);

  // Form data states

  const [editCampaignForm, setEditCampaignForm] = useState({
    name: "",
    status: "Active",
  });

  const [refundForm, setRefundForm] = useState({
    donationId: "",
    reason: "",
    processRefund: false,
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [adminSession, setAdminSession] = useState({ name: "Admin", email: "admin@myfundraiser.com", role: "ADMIN" });
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const email = localStorage.getItem("email") || stored.email || "admin@myfundraiser.com";
      const name = stored.name || localStorage.getItem("username") || "Admin";
      const role = stored.role || localStorage.getItem("role") || "ADMIN";
      setAdminSession({ name, email, role });
      setProfileForm((prev) => ({
        fullName: prev.fullName || name,
        email: prev.email || email,
        phone: prev.phone || "",
      }));
    } catch {
      /* keep defaults */
    }
  }, []);

  // Local editable state so actions reflect immediately in UI
  const [campaignsState, setCampaignsState] = useState(() => [...getSubmittedFundraisers(), ...campaigns]);
  const [donationsState, setDonationsState] = useState(donations);
  const [donorsState, setDonorsState] = useState(donors);

  const [campaignSearch, setCampaignSearch] = useState("");
  const [campaignCategoryFilter, setCampaignCategoryFilter] = useState("all");
  const [campaignStatusFilter, setCampaignStatusFilter] = useState("all");
  const [donationSearch, setDonationSearch] = useState("");
  const [donationStatusFilter, setDonationStatusFilter] = useState("all");
  const [donorSearch, setDonorSearch] = useState("");
  const [donorStatusFilter, setDonorStatusFilter] = useState("all");
  const [donorPage, setDonorPage] = useState(1);
  const [donationPage, setDonationPage] = useState(1);
  const [livePaymentFeed, setLivePaymentFeed] = useState([]);
  const [securityLiveEvents, setSecurityLiveEvents] = useState([]);

  const handleLiveDonation = useCallback((donation) => {
    const normalized = { ...donation, method: normalizePaymentMethod(donation.method) };
    setDonationsState((list) => [normalized, ...list].slice(0, 20));
    setLivePaymentFeed((list) => [normalized, ...list].slice(0, 10));
  }, []);

  const handleLiveSecurity = useCallback((event) => {
    setSecurityLiveEvents((list) => [event, ...list].slice(0, 10));
  }, []);

  const { connected, infra } = useAdminRealtime({
    enabled: true,
    onDonation: handleLiveDonation,
    onSecurity: handleLiveSecurity,
  });

  // Website settings for fundraiser site
  const [websiteForm, setWebsiteForm] = useState({
    heroTitle: "",
    heroSubtitle: "",
    featuredCount: 4,
    enableCarousel: true,
    footerText: "",
    primaryColor: "#0d9488",
  });

  const validateWebsiteForm = () => {
    const errors = {};
    if (!websiteForm.heroTitle.trim()) errors.heroTitle = "Hero title is required";
    if (!websiteForm.footerText.trim()) errors.footerText = "Footer text is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveWebsite = () => {
    if (validateWebsiteForm()) {
      setSuccessMessage("Website settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      notify("Website settings updated.", "success");
    }
  };

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone.replace(/\D/g, ""));
  const validatePassword = (password) => password.length >= 6;

  const validateRefundForm = () => {
    const errors = {};
    if (!refundForm.reason.trim()) errors.reason = "Refund reason is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateProfileForm = () => {
    const errors = {};
    if (!profileForm.fullName.trim()) errors.fullName = "Full name is required";
    if (!profileForm.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(profileForm.email)) errors.email = "Invalid email format";
    if (!profileForm.phone.trim()) errors.phone = "Phone number is required";
    else if (!validatePhone(profileForm.phone)) errors.phone = "Invalid phone number (10 digits required)";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.current.trim()) errors.current = "Current password is required";
    if (!passwordForm.new.trim()) errors.new = "New password is required";
    else if (!validatePassword(passwordForm.new)) errors.new = "Password must be at least 6 characters";
    if (!passwordForm.confirm.trim()) errors.confirm = "Confirm password is required";
    else if (passwordForm.new !== passwordForm.confirm) errors.confirm = "Passwords do not match";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const title = useMemo(() => navItems.find((item) => item.key === activeView)?.label || "Dashboard", [activeView]);

  const navItemsWithBadges = useMemo(
    () =>
      navItems.map((item) =>
        item.key === "approvals" && approvalItems.length > 0
          ? { ...item, badge: approvalItems.length }
          : item
      ),
    [approvalItems.length]
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/loginSignup");
  };

  const campaignCategories = useMemo(
    () => [...new Set(campaignsState.map((item) => item.category).filter(Boolean))].sort(),
    [campaignsState]
  );
  const campaignStatuses = useMemo(
    () => [...new Set(campaignsState.map((item) => item.status).filter(Boolean))].sort(),
    [campaignsState]
  );
  const donationStatuses = useMemo(
    () => [...new Set(donationsState.map((item) => item.status).filter(Boolean))].sort(),
    [donationsState]
  );
  const donorStatuses = useMemo(
    () => [...new Set(donorsState.map((item) => item.status).filter(Boolean))].sort(),
    [donorsState]
  );

  const filteredCampaigns = useMemo(() => {
    const query = campaignSearch.trim().toLowerCase();
    return campaignsState.filter((item) => {
      const matchesSearch =
        !query ||
        [item.id, item.name, item.organiser, item.category, item.beneficiary]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(query));
      const matchesCategory = campaignCategoryFilter === "all" || item.category === campaignCategoryFilter;
      const matchesStatus = campaignStatusFilter === "all" || item.status === campaignStatusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [campaignsState, campaignSearch, campaignCategoryFilter, campaignStatusFilter]);

  const filteredDonations = useMemo(() => {
    const query = donationSearch.trim().toLowerCase();
    return donationsState.filter((item) => {
      const matchesSearch =
        !query ||
        [item.id, item.donor, item.email, item.campaign, item.reference, item.method]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(query));
      const matchesStatus = donationStatusFilter === "all" || item.status === donationStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [donationsState, donationSearch, donationStatusFilter]);

  useEffect(() => {
    setDonorPage(1);
  }, [donorSearch, donorStatusFilter]);

  useEffect(() => {
    setDonationPage(1);
  }, [donationSearch, donationStatusFilter]);

  const filteredDonors = useMemo(() => {
    const query = donorSearch.trim().toLowerCase();
    return donorsState.filter((item) => {
      const matchesSearch =
        !query ||
        [item.name, item.email, item.phone, item.donorType, item.kyc]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(query));
      const matchesStatus = donorStatusFilter === "all" || item.status === donorStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [donorsState, donorSearch, donorStatusFilter]);

  const donorTotalPages = Math.max(1, Math.ceil(filteredDonors.length / DONOR_PAGE_SIZE));
  const paginatedDonors = useMemo(
    () => filteredDonors.slice((donorPage - 1) * DONOR_PAGE_SIZE, donorPage * DONOR_PAGE_SIZE),
    [filteredDonors, donorPage]
  );

  useEffect(() => {
    if (donorPage > donorTotalPages) setDonorPage(donorTotalPages);
  }, [donorPage, donorTotalPages]);

  const donationTotalPages = Math.max(1, Math.ceil(filteredDonations.length / DONATION_PAGE_SIZE));
  const paginatedDonations = useMemo(
    () => filteredDonations.slice((donationPage - 1) * DONATION_PAGE_SIZE, donationPage * DONATION_PAGE_SIZE),
    [filteredDonations, donationPage]
  );

  useEffect(() => {
    if (donationPage > donationTotalPages) setDonationPage(donationTotalPages);
  }, [donationPage, donationTotalPages]);

  const userStats = useMemo(() => {
    const active = donorsState.filter((donor) => donor.status === "Active").length;
    const inactive = donorsState.length - active;
    return {
      total: donorsState.length,
      active,
      inactive,
      returning: donorsState.filter((donor) => donor.campaigns > 2).length,
    };
  }, [donorsState]);

  const notify = (message) => {
    window.alert(message);
  };

  const downloadCsv = (filename, rows) => {
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

  const handleApproval = (campaign, action) => {
    setApprovalItems((items) => items.filter((item) => item.campaign !== campaign));
    notify(`Campaign ${action === "approve" ? "approved" : "rejected"}: ${campaign}`, "success");
  };

  const handleSendMessage = () => {
    if (!messageDraft.trim()) {
      notify("Message cannot be empty");
      return;
    }
    setSentMessages((messages) => [...messages, { to: selectedConversation.name, text: messageDraft.trim() }]);
    setMessageDraft("");
    notify("Message sent successfully", "success");
  };

  const handleSaveProfile = () => {
    if (validateProfileForm()) {
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      notify("Profile changes saved.", "success");
    }
  };

  const handleUpdatePassword = () => {
    if (validatePasswordForm()) {
      setPasswordForm({ current: "", new: "", confirm: "" });
      setFormErrors({});
      setSuccessMessage("Password updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      notify("Password updated.", "success");
    }
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields({ ...touchedFields, [fieldName]: true });
  };

  const handleEditCampaign = (campaign) => {
    setSelectedItem(campaign);
    setEditCampaignForm({ name: campaign.name, status: campaign.status });
    setShowEditCampaignForm(true);
  };

  const handleSaveCampaignEdit = () => {
    setCampaignsState((list) => list.map((c) => (c.name === selectedItem.name ? { ...c, name: editCampaignForm.name, status: editCampaignForm.status } : c)));
    notify(`Campaign "${editCampaignForm.name}" updated to status: ${editCampaignForm.status}`, "success");
    setShowEditCampaignForm(false);
  };

  const handleCampaignStatusChange = (campaignName, status) => {
    setCampaignsState((list) => list.map((campaign) => (campaign.name === campaignName ? { ...campaign, status } : campaign)));
    notify(`Campaign "${campaignName}" marked as ${status}.`);
  };

  const handleInitiateRefund = (donation) => {
    setSelectedItem(donation);
    setRefundForm({ donationId: donation.id || `${donation.donor}-${donation.date}`, reason: "", processRefund: false });
    setShowRefundForm(true);
  };

  const handleProcessRefund = () => {
    if (validateRefundForm()) {
      const donation = selectedItem;
      // update donation state to reflect refund
      setDonationsState((list) =>
        list.map((d) => (d.id === donation.id || (d.donor === donation.donor && d.date === donation.date) ? { ...d, status: "Refunded" } : d))
      );
      notify(`Refund initiated for ${donation.donor} - Amount: ${donation.amount}. Reason: ${refundForm.reason}`, "success");
      setShowRefundForm(false);
      setRefundForm({ donationId: "", reason: "", processRefund: false });
      setFormErrors({});
    }
  };

  const handleViewCampaignDetails = (campaign) => {
    setSelectedItem(campaign);
    setShowCampaignDetailsModal(true);
  };

  const handleViewDonorProfile = (donor) => {
    setSelectedItem(donor);
    setShowDonorDetailsModal(true);
  };

  const handleDonorStatusChange = (email) => {
    setDonorsState((list) =>
      list.map((donor) => (donor.email === email ? { ...donor, status: donor.status === "Active" ? "Inactive" : "Active" } : donor))
    );
  };

  // Modal Components
  const Modal = ({ show, title, onClose, children }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-600">×</button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };

  const renderRefundForm = () => (
    <Modal show={showRefundForm} title="Process Refund" onClose={() => {
      setShowRefundForm(false);
      setFormErrors({});
      setRefundForm({ donationId: "", reason: "", processRefund: false });
    }}>
      {selectedItem && (
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Transaction: <span className="font-mono font-bold text-slate-900">{selectedItem.id || "—"}</span></p>
            <p className="text-sm text-slate-600">Donor: <span className="font-bold text-slate-900">{selectedItem.donor}</span></p>
            <p className="text-sm text-slate-600">Amount: <span className="font-bold text-green-600">{selectedItem.amount}</span></p>
            <p className="text-sm text-slate-600">Campaign: <span className="font-bold text-slate-900">{selectedItem.campaign}</span></p>
            <p className="text-sm text-slate-600">Reference: <span className="font-mono text-slate-800">{selectedItem.reference || "—"}</span></p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600">Refund Reason</label>
            <textarea
              value={refundForm.reason}
              onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
              onBlur={() => handleFieldBlur("reason")}
              className={`mt-2 w-full rounded-md border px-3 py-2 outline-none transition-colors focus:border-teal-600 ${formErrors.reason && touchedFields.reason ? "border-red-500 bg-red-50" : "border-slate-200"}`}
              placeholder="Explain why this refund is being processed"
              rows="3"
            />
            {formErrors.reason && touchedFields.reason && <span className="mt-1 block text-xs text-red-600">{formErrors.reason}</span>}
          </div>

          <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3">
            <input
              type="checkbox"
              checked={refundForm.processRefund}
              onChange={(e) => setRefundForm({ ...refundForm, processRefund: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-bold text-slate-700">I confirm this refund should be processed</span>
          </label>

          <div className="flex gap-3 border-t border-slate-200 pt-4">
            <button onClick={() => {
              setShowRefundForm(false);
              setFormErrors({});
              setRefundForm({ donationId: "", reason: "", processRefund: false });
            }} className="flex-1 rounded-md border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleProcessRefund} disabled={!refundForm.processRefund} className="flex-1 rounded-md bg-rose-600 px-4 py-2 font-bold text-white hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors">
              Process Refund
            </button>
          </div>
        </div>
      )}
    </Modal>
  );

  const renderCampaignDetailsModal = () => (
    <Modal show={showCampaignDetailsModal} title="Campaign Details" onClose={() => setShowCampaignDetailsModal(false)}>
      {selectedItem && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500">Campaign Name</p>
              <p className="text-sm font-bold text-slate-900">{selectedItem.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Organiser</p>
              <p className="text-sm font-bold text-slate-900">{selectedItem.organiser}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Category</p>
              <p className="text-sm font-bold text-slate-900">{selectedItem.category}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Status</p>
              <StatusPill status={selectedItem.status} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Amount Raised</p>
              <p className="text-sm font-bold text-green-600">{selectedItem.raised}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Goal</p>
              <p className="text-sm font-bold text-slate-900">{selectedItem.goal}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Progress</p>
              <Progress value={getCampaignProgress(selectedItem)} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Deadline</p>
              <p className="text-sm font-bold text-slate-900">{selectedItem.deadline}</p>
            </div>
            {selectedItem.id && (
              <div>
                <p className="text-xs font-bold text-slate-500">Campaign ID</p>
                <p className="text-sm font-bold text-slate-900">{selectedItem.id}</p>
              </div>
            )}
            {selectedItem.beneficiary && (
              <div>
                <p className="text-xs font-bold text-slate-500">Beneficiary</p>
                <p className="text-sm font-bold text-slate-900">{selectedItem.beneficiary}</p>
              </div>
            )}
            {typeof selectedItem.donorCount === "number" && (
              <div>
                <p className="text-xs font-bold text-slate-500">Donors</p>
                <p className="text-sm font-bold text-slate-900">{selectedItem.donorCount}</p>
              </div>
            )}
            {selectedItem.createdAt && (
              <div>
                <p className="text-xs font-bold text-slate-500">Created</p>
                <p className="text-sm font-bold text-slate-900">{selectedItem.createdAt}</p>
              </div>
            )}
            {selectedItem.submittedAt && (
              <div>
                <p className="text-xs font-bold text-slate-500">Submitted</p>
                <p className="text-sm font-bold text-slate-900">{selectedItem.submittedAt}</p>
              </div>
            )}
            {selectedItem.description && (
              <div className="col-span-2 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500">Campaign Story</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{selectedItem.description}</p>
              </div>
            )}
          </div>
          <button onClick={() => setShowCampaignDetailsModal(false)} className="w-full rounded-md bg-teal-700 px-4 py-2 font-bold text-white hover:bg-teal-800 transition-colors">
            Close
          </button>
        </div>
      )}
    </Modal>
  );

  const renderDonorDetailsModal = () => (
    <Modal show={showDonorDetailsModal} title="Donor Profile" onClose={() => setShowDonorDetailsModal(false)}>
      {selectedItem && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500">Donor Name</p>
              <p className="text-sm font-bold text-slate-900">{selectedItem.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Email</p>
              <p className="text-sm text-slate-700">{selectedItem.email}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Total Donated</p>
              <p className="text-sm font-bold text-green-600">{selectedItem.donated}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Campaigns Supported</p>
              <p className="text-sm font-bold text-slate-900">{selectedItem.campaigns}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Phone</p>
              <p className="text-sm text-slate-700">{selectedItem.phone || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Donor Type</p>
              <p className="text-sm font-bold text-slate-900">{selectedItem.donorType || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Member Since</p>
              <p className="text-sm text-slate-700">{selectedItem.memberSince || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">KYC Status</p>
              <VerifiedBadge verified={selectedItem.kyc === "Verified"} />
            </div>
            <div className="col-span-2">
              <p className="text-xs font-bold text-slate-500">Last Donation</p>
              <p className="text-sm text-slate-700">{selectedItem.last}</p>
            </div>
          </div>
          <div className="flex gap-3 border-t border-slate-200 pt-4">
            <button onClick={() => notify(`Sending message to ${selectedItem.name}...`)} className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 transition-colors">
              Send Message
            </button>
            <button onClick={() => setShowDonorDetailsModal(false)} className="flex-1 rounded-md border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );

  const renderDashboard = () => (
    <AdminHomeView
      donationsState={donationsState}
      userStats={userStats}
      liveSyncActive={connected && infra.api}
      renderPendingApprovals={() => (
        <AdminPendingApprovalsPanel
          items={approvalItems}
          onViewAll={() => setActiveView("approvals")}
          onApprove={(campaign) => handleApproval(campaign, "approve")}
          onReject={(campaign) => handleApproval(campaign, "reject")}
        />
      )}
    />
  );

  const renderCampaigns = () => (
    <section className="bg-transparent p-0">
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard icon={Home} label="All Campaigns" value={campaignsState.length} note="Admin managed campaigns" tone="blue" />
        <StatCard icon={CheckCircle} label="Active" value={campaignsState.filter((item) => item.status === "Active").length} note="Currently accepting funds" tone="teal" />
        <StatCard icon={FileText} label="Pending Review" value={campaignsState.filter((item) => item.status === "Pending Review").length} note="Submitted fundraisers" tone="amber" />
        <StatCard icon={BarChart3} label="Urgent" value={campaignsState.filter((item) => item.status === "Urgent").length} note="Needs priority attention" danger tone="amber" />
      </div>
      <Toolbar placeholder="Search campaigns..." searchValue={campaignSearch} onSearchChange={setCampaignSearch}>
        <FilterSelect
          label="Filter by category"
          value={campaignCategoryFilter}
          onChange={setCampaignCategoryFilter}
          options={[
            { value: "all", label: "All Categories" },
            ...campaignCategories.map((category) => ({ value: category, label: category })),
          ]}
        />
        <FilterSelect
          label="Filter by status"
          value={campaignStatusFilter}
          onChange={setCampaignStatusFilter}
          options={[
            { value: "all", label: "All Status" },
            ...campaignStatuses.map((status) => ({ value: status, label: status })),
          ]}
        />
        <button onClick={() => navigate('/create-fundraiser', { state: { image: LIFE_SAVING_IMAGE } })} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800 transition-colors hover:shadow-lg">+ New Campaign</button>
      </Toolbar>
      <TableShell minWidth={1480}>
        <TableHead>
          <Th className="w-[100px]">ID</Th>
          <Th className="min-w-[220px]">Campaign</Th>
          <Th className="min-w-[120px]">Organiser</Th>
          <Th>Category</Th>
          <Th>Raised</Th>
          <Th>Goal</Th>
          <Th>Donors</Th>
          <Th>Progress</Th>
          <Th>Status</Th>
          <Th className="min-w-[110px]">Created</Th>
          <Th>Deadline</Th>
          <Th>KYC</Th>
          <Th className="min-w-[280px]">Actions</Th>
        </TableHead>
        <tbody className="divide-y divide-slate-100">
          {filteredCampaigns.map((item) => {
            const progressVal = getCampaignProgress(item);
            return (
            <tr key={`${item.id || item.name}-${item.name}`} className="transition-colors hover:bg-slate-50">
              <Td><IdBadge value={item.id || "N/A"} /></Td>
              <Td wrap>
                <TextCell primary={item.name} secondary={item.beneficiary ? `Beneficiary: ${item.beneficiary}` : item.source} title={item.name} />
              </Td>
              <Td wrap><span className="font-semibold text-slate-800">{item.organiser}</span></Td>
              <Td><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{item.category}</span></Td>
              <Td><span className="font-bold text-emerald-700">{item.raised}</span></Td>
              <Td>{item.goal}</Td>
              <Td><span className="font-semibold text-slate-800">{item.donorCount ?? "—"}</span></Td>
              <Td><Progress value={progressVal} /></Td>
              <Td><StatusCell status={item.status} meterValue={progressVal} /></Td>
              <Td wrap><span className="text-xs font-semibold text-slate-600">{item.createdAt || item.submittedAt || "—"}</span></Td>
              <Td wrap><span className="text-xs font-semibold text-slate-600">{item.deadline}</span></Td>
              <Td><VerifiedBadge verified={item.verified} /></Td>
              <Td>
                <div className="table-actions flex flex-wrap gap-1.5">
                  <ActionButton onClick={() => handleViewCampaignDetails(item)} icon={Eye} tone="info">View</ActionButton>
                  <ActionButton onClick={() => handleEditCampaign(item)} icon={Edit3} tone="neutral">Edit</ActionButton>
                  {item.status === "Pending Review" && (
                    <ActionButton onClick={() => handleCampaignStatusChange(item.name, "Active")} icon={CheckCircle} tone="primary">Approve</ActionButton>
                  )}
                  {item.status === "Paused" ? (
                    <ActionButton onClick={() => handleCampaignStatusChange(item.name, "Active")} icon={PlayCircle} tone="success">Activate</ActionButton>
                  ) : (
                    <ActionButton onClick={() => handleCampaignStatusChange(item.name, "Paused")} icon={PauseCircle} tone="warning">Pause</ActionButton>
                  )}
                  {item.status !== "Urgent" && (
                    <ActionButton onClick={() => handleCampaignStatusChange(item.name, "Urgent")} tone="danger">Urgent</ActionButton>
                  )}
                </div>
              </Td>
            </tr>
          );
          })}
          {filteredCampaigns.length === 0 && (
            <tr>
              <td colSpan="13" className="px-5 py-10 text-center text-sm font-medium text-slate-500">
                No campaigns match your search or filters.
              </td>
            </tr>
          )}
        </tbody>
      </TableShell>
      <Modal show={showEditCampaignForm} title="Edit Campaign" onClose={() => setShowEditCampaignForm(false)}>
        {selectedItem && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-600">Campaign Name</label>
              <input value={editCampaignForm.name} onChange={(e) => setEditCampaignForm({ ...editCampaignForm, name: e.target.value })} className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600">Status</label>
              <select value={editCampaignForm.status} onChange={(e) => setEditCampaignForm({ ...editCampaignForm, status: e.target.value })} className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-teal-600">
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Urgent">Urgent</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex gap-3 border-t border-slate-200 pt-4">
              <button onClick={() => setShowEditCampaignForm(false)} className="flex-1 rounded-md border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleSaveCampaignEdit} className="flex-1 rounded-md bg-teal-700 px-4 py-2 font-bold text-white hover:bg-teal-800 transition-colors">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );

  const renderDonations = () => (
    <section className="bg-transparent p-0">
      <Toolbar placeholder="Search donations..." searchValue={donationSearch} onSearchChange={setDonationSearch}>
        <FilterSelect
          label="Filter by donation status"
          value={donationStatusFilter}
          onChange={setDonationStatusFilter}
          options={[
            { value: "all", label: "All Status" },
            ...donationStatuses.map((status) => ({ value: status, label: status })),
          ]}
        />
        <button onClick={() => downloadCsv("donations.csv", filteredDonations)} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800 transition-colors">Export</button>
      </Toolbar>
      <TableShell minWidth={1380}>
        <TableHead>
          <Th>Txn ID</Th>
          <Th className="min-w-[150px]">Donor</Th>
          <Th className="min-w-[220px]">Campaign</Th>
          <Th>Amount</Th>
          <Th>Method</Th>
          <Th>Reference</Th>
          <Th>Date</Th>
          <Th>Time</Th>
          <Th>Status</Th>
          <Th className="min-w-[200px]">Actions</Th>
        </TableHead>
        <tbody className="divide-y divide-slate-100">
          {paginatedDonations.map((item) => {
            const statusMeter = statusMeters[item.status]?.value ?? 50;
            return (
            <tr key={item.id || `${item.donor}-${item.date}`}>
              <Td><IdBadge value={item.id || "—"} /></Td>
              <Td wrap>
                <TextCell primary={item.donor} secondary={item.email} title={item.donor} />
              </Td>
              <Td wrap>
                <TextCell primary={item.campaign} secondary={item.campaignId} title={item.campaign} />
              </Td>
              <Td><span className="font-bold text-emerald-700">{item.amount}</span></Td>
              <Td><PaymentMethodBadge method={item.method} short /></Td>
              <Td wrap><span className="font-mono text-[11px] text-slate-500">{item.reference || "—"}</span></Td>
              <Td>{item.date}</Td>
              <Td>{item.time || "—"}</Td>
              <Td><StatusCell status={item.status} meterValue={statusMeter} /></Td>
              <Td>
                <div className="table-actions flex flex-wrap gap-1.5">
                  <ActionButton onClick={() => notify(`Viewing donation ${item.id || ""} from ${item.donor}`)} icon={Eye} tone="info">View</ActionButton>
                  {item.status === "Success" && <ActionButton onClick={() => handleInitiateRefund(item)} icon={RotateCcw} tone="danger">Refund</ActionButton>}
                  {item.status === "Pending" && <ActionButton onClick={() => notify(`Following up on pending payment from ${item.donor}`)} tone="warning">Follow Up</ActionButton>}
                </div>
              </Td>
            </tr>
          );
          })}
          {filteredDonations.length === 0 && (
            <tr>
              <td colSpan="10" className="px-5 py-10 text-center text-sm font-medium text-slate-500">
                No donations match your search or filters.
              </td>
            </tr>
          )}
        </tbody>
      </TableShell>
      <Pagination
        page={donationPage}
        totalPages={donationTotalPages}
        totalItems={filteredDonations.length}
        pageSize={DONATION_PAGE_SIZE}
        onPageChange={setDonationPage}
        label="donations"
      />
      {renderRefundForm()}
    </section>
  );

  const renderDonors = () => (
    <section className="bg-transparent p-0">
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={userStats.total} note="All registered donors" tone="violet" />
        <StatCard icon={CheckCircle} label="Active Users" value={userStats.active} note="Recently engaged" tone="teal" />
        <StatCard icon={PauseCircle} label="Inactive Users" value={userStats.inactive} note="Needs follow-up" danger tone="amber" />
        <StatCard icon={RotateCcw} label="Returning Users" value={userStats.returning} note="3+ campaigns supported" tone="blue" />
      </div>
      <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="dashboard-card rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-950">User Activity Dashboard</h2>
              <p className="text-xs font-semibold text-slate-500">Active and inactive user distribution</p>
            </div>
            <TrendingUp className="text-teal-700" size={18} />
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
              style={{ width: `${Math.round((userStats.active / Math.max(userStats.total, 1)) * 100)}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs font-bold uppercase text-emerald-700">Active ratio</p>
              <p className="mt-1 text-2xl font-black text-emerald-800">{Math.round((userStats.active / Math.max(userStats.total, 1)) * 100)}%</p>
            </div>
            <div className="rounded-xl bg-slate-100 p-4">
              <p className="text-xs font-bold uppercase text-slate-600">Inactive ratio</p>
              <p className="mt-1 text-2xl font-black text-slate-800">{Math.round((userStats.inactive / Math.max(userStats.total, 1)) * 100)}%</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-bold text-slate-950">Top Supporters</h2>
          <div className="space-y-3">
            {donorsState.slice(0, 3).map((donor) => (
              <div key={donor.email} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div>
                  <p className="font-bold text-slate-900">{donor.name}</p>
                  <p className="text-xs text-slate-500">{donor.campaigns} campaigns supported</p>
                </div>
                <p className="font-black text-teal-700">{donor.donated}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Toolbar placeholder="Search donors..." searchValue={donorSearch} onSearchChange={setDonorSearch}>
        <FilterSelect
          label="Filter by donor status"
          value={donorStatusFilter}
          onChange={setDonorStatusFilter}
          options={[
            { value: "all", label: "All Donor Status" },
            ...donorStatuses.map((status) => ({ value: status, label: status })),
          ]}
        />
        <button onClick={() => downloadCsv("donors.csv", filteredDonors)} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800 transition-colors">Export</button>
      </Toolbar>
      <TableShell minWidth={1520}>
        <TableHead>
          <Th className="min-w-[180px]">Donor</Th>
          <Th className="min-w-[200px]">Email</Th>
          <Th>Phone</Th>
          <Th>Type</Th>
          <Th>Total Donated</Th>
          <Th>Campaigns</Th>
          <Th>Member Since</Th>
          <Th>Last Donation</Th>
          <Th>KYC</Th>
          <Th>Status</Th>
          <Th className="min-w-[300px]">Actions</Th>
        </TableHead>
        <tbody className="divide-y divide-slate-100">
          {paginatedDonors.map((item) => {
            const statusMeter = statusMeters[item.status]?.value ?? 40;
            return (
            <tr key={item.email}>
              <Td wrap>
                <div className="flex min-w-[160px] items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {item.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                  </div>
                  <TextCell primary={item.name} secondary={item.status === "Active" ? "Active donor" : "Inactive donor"} title={item.name} />
                </div>
              </Td>
              <Td wrap><span className="block max-w-[220px] truncate text-xs font-medium text-slate-600" title={item.email}>{item.email}</span></Td>
              <Td>{item.phone || "—"}</Td>
              <Td><span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800">{item.donorType || "—"}</span></Td>
              <Td><span className="font-bold text-emerald-700">{item.donated}</span></Td>
              <Td className="text-center font-semibold">{item.campaigns}</Td>
              <Td>{item.memberSince || "—"}</Td>
              <Td>{item.last}</Td>
              <Td><VerifiedBadge verified={item.kyc === "Verified"} /></Td>
              <Td><StatusCell status={item.status} meterValue={statusMeter} /></Td>
              <Td>
                <div className="table-actions flex flex-wrap gap-1.5">
                  <ActionButton onClick={() => handleViewDonorProfile(item)} icon={Eye} tone="info">Profile</ActionButton>
                  <ActionButton onClick={() => notify(`Composing message to ${item.name}...`)} icon={MessageSquare} tone="neutral">Message</ActionButton>
                  <ActionButton onClick={() => handleDonorStatusChange(item.email)} icon={item.status === "Active" ? PauseCircle : PlayCircle} tone={item.status === "Active" ? "warning" : "success"}>
                    {item.status === "Active" ? "Deactivate" : "Activate"}
                  </ActionButton>
                  <ActionButton onClick={() => downloadCsv(`${item.name}_report.csv`, [item])} icon={FileText} tone="success">Report</ActionButton>
                </div>
              </Td>
            </tr>
          );
          })}
          {filteredDonors.length === 0 && (
            <tr>
              <td colSpan="11" className="px-5 py-10 text-center text-sm font-medium text-slate-500">
                No donors match your search or filters.
              </td>
            </tr>
          )}
        </tbody>
      </TableShell>
      <Pagination
        page={donorPage}
        totalPages={donorTotalPages}
        totalItems={filteredDonors.length}
        pageSize={DONOR_PAGE_SIZE}
        onPageChange={setDonorPage}
        label="donors"
      />
      {renderDonorDetailsModal()}
    </section>
  );

  const renderApprovals = () => (
    <PendingApprovalsFull
      items={approvalItems}
      onApprove={(campaign) => handleApproval(campaign, "approve")}
      onReject={(campaign) => handleApproval(campaign, "reject")}
      onViewDocs={(campaign) => notify(`Viewing documents for ${campaign}`)}
    />
  );

  const renderReports = () => <AdminReportsPanel onExport={downloadCsv} />;

  const renderPayments = () => (
    <AdminPaymentsPanel
      livePayments={livePaymentFeed}
      onSimulate={() => platformApi.simulateDonation().catch(() => notify("Start platform server: npm run server"))}
    />
  );

  const renderUserProfiles = () => <AdminUserProfilesPanel />;

  const renderSecurity = () => <AdminSecurityPanel liveEvents={securityLiveEvents} />;

  const renderMessages = () => (
    <section className="grid min-h-[620px] grid-cols-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[340px_1fr]">
      <aside className="border-r border-slate-200">
        <h2 className="border-b border-slate-200 p-5 font-bold">Conversations</h2>
        {conversations.map((item) => (
          <button onClick={() => setSelectedConversation(item)} key={item.name} className={`flex w-full gap-3 border-b border-slate-100 p-4 text-left transition-colors ${selectedConversation.name === item.name ? "bg-teal-50" : "hover:bg-slate-50"}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-700">{item.name[0]}</div>
            <span><b className="block text-sm">{item.name}</b><span className="text-xs text-slate-500">{item.subject}</span></span>
          </button>
        ))}
      </aside>
      <div className="flex flex-col">
        <header className="border-b border-slate-200 p-5 font-bold">{selectedConversation.name} - {selectedConversation.subject}</header>
        <div className="flex-1 space-y-4 bg-slate-50 p-6 overflow-y-auto">
          <p className="max-w-md rounded-lg bg-white p-3 text-sm shadow-sm">Hello Admin, I have uploaded all required documents. Please review my campaign.</p>
          <p className="ml-auto max-w-md rounded-lg bg-teal-50 p-3 text-sm text-teal-900 shadow-sm">Hello, we are reviewing your documents. You will get an update soon.</p>
          {sentMessages.filter((message) => message.to === selectedConversation.name).map((message, index) => (
            <p key={`${message.to}-${index}`} className="ml-auto max-w-md rounded-lg bg-teal-700 p-3 text-sm text-white shadow-sm">{message.text}</p>
          ))}
        </div>
        <footer className="flex flex-col gap-2 border-t border-slate-200 p-4">
          <div className="flex gap-3">
            <input value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600" placeholder="Type a message..." />
            <button onClick={handleSendMessage} className="rounded-md bg-teal-700 px-4 py-2 text-white font-bold hover:bg-teal-800 transition-colors">Send</button>
          </div>
          {messageDraft && <p className="text-xs text-slate-500">{messageDraft.length} characters</p>}
        </footer>
      </div>
    </section>
  );

  const renderSettings = () => (
    <AdminSettingsPanel
      successMessage={successMessage}
      settingsTab={settingsTab}
      setSettingsTab={(tab) => {
        setSettingsTab(tab);
        setFormErrors({});
        setTouchedFields({});
      }}
      profileForm={profileForm}
      setProfileForm={setProfileForm}
      passwordForm={passwordForm}
      setPasswordForm={setPasswordForm}
      websiteForm={websiteForm}
      setWebsiteForm={setWebsiteForm}
      formErrors={formErrors}
      touchedFields={touchedFields}
      handleFieldBlur={handleFieldBlur}
      handleSaveProfile={handleSaveProfile}
      handleUpdatePassword={handleUpdatePassword}
      handleSaveWebsite={handleSaveWebsite}
      onResetWebsite={() => {
        setWebsiteForm({
          heroTitle: "",
          heroSubtitle: "",
          featuredCount: 4,
          enableCarousel: true,
          footerText: "",
          primaryColor: "#0d9488",
        });
        setFormErrors({});
      }}
      notify={notify}
    />
  );

  const content = {
    dashboard: renderDashboard,
    campaigns: renderCampaigns,
    donations: renderDonations,
    donors: renderDonors,
    payments: renderPayments,
    userProfiles: renderUserProfiles,
    approvals: renderApprovals,
    reports: renderReports,
    security: renderSecurity,
    messages: renderMessages,
    settings: renderSettings,
  };

  return (
    <main className="min-h-screen bg-slate-50 admin-page">
      <style>{adminPageStyles}</style>
      <div className="flex min-h-screen">
        <AdminSidebar
          navItems={navItemsWithBadges}
          activeView={activeView}
          onNavigate={setActiveView}
          onLogout={handleLogout}
          onUpgrade={() => notify("Upgrade request submitted.")}
        />

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-teal-900/20 bg-teal-800 px-5 py-3 text-white sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-400 text-sm font-bold text-teal-950">
                {adminSession.name.split(" ").map((p) => p[0]).slice(0, 2).join("") || "AD"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">Good morning, {adminSession.name}</p>
                <p className="truncate text-xs text-teal-100">{adminSession.email}</p>
              </div>
            </div>
            <button type="button" className="shrink-0 rounded-full p-2 hover:bg-white/10" aria-label="Notifications">
              <Bell size={18} />
            </button>
          </header>

          <nav className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 md:hidden">
            {navItemsWithBadges.map((item) => {
              const Icon = item.icon;
              const active = activeView === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveView(item.key)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${
                    active ? "bg-teal-800 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon size={14} />
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="ml-auto flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700"
            >
              <LogOut size={14} />
              Logout
            </button>
          </nav>

          <div className="admin-content-area w-full max-w-none px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
            {activeView !== "dashboard" && activeView !== "approvals" && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
                <p className="mt-1 text-sm text-slate-500">Manage fundraiser operations from one workspace.</p>
                <div className="mt-3">
                  <LiveSyncBadge active={connected && infra.api} />
                </div>
              </div>
            )}
            {activeView === "approvals" && (
              <div className="mb-4">
                <LiveSyncBadge active={connected && infra.api} />
              </div>
            )}
            {content[activeView]()}
          </div>
        </section>
      </div>
      {renderCampaignDetailsModal()}
    </main>
  );
}
