import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  CheckCircle,
  CircleDollarSign,
  Edit3,
  Eye,
  FileText,
  Home,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const campaigns = [
  { name: "Heart Surgery for Arjun", organiser: "Meena R.", category: "Medical", raised: "Rs 4,10,000", goal: "Rs 5,00,000", progress: 82, status: "Active", deadline: "Jun 15" },
  { name: "School Supplies - Nalgonda", organiser: "Suresh K.", category: "Education", raised: "Rs 51,600", goal: "Rs 1,20,000", progress: 43, status: "Active", deadline: "May 30" },
  { name: "Flood Relief - Warangal", organiser: "NGO Sahay", category: "Community", raised: "Rs 9,70,000", goal: "Rs 10,00,000", progress: 97, status: "Urgent", deadline: "May 22" },
  { name: "Community Well Project", organiser: "Priso M.", category: "Community", raised: "Rs 65,200", goal: "Rs 2,50,000", progress: 26, status: "Paused", deadline: "Jul 1" },
  { name: "Cancer Treatment Fund", organiser: "Ramesh P.", category: "Medical", raised: "Rs 82,000", goal: "Rs 4,00,000", progress: 61, status: "Active", deadline: "Jun 30" },
];

const getSubmittedFundraisers = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("userFunds")) || [];
    return stored.map((fundraiser) => ({
      name: fundraiser.title || "Untitled Fundraiser",
      organiser: fundraiser.creator || "Submitted User",
      category: fundraiser.category || "General",
      raised: `Rs ${Number(fundraiser.raised || 0).toLocaleString("en-IN")}`,
      goal: `Rs ${Number(fundraiser.goalAmount || 0).toLocaleString("en-IN")}`,
      progress: 0,
      status: fundraiser.status || "Pending Review",
      deadline: fundraiser.endDate || "Not set",
      description: fundraiser.description || "No description provided.",
      beneficiary: fundraiser.beneficiary || "Not specified",
      image: fundraiser.image,
      submittedAt: fundraiser.createdAt || "Recently",
      source: "Submitted Fundraiser",
    }));
  } catch {
    return [];
  }
};

const donations = [
  { donor: "Ravi Kumar", campaign: "Heart Surgery for Arjun", amount: "Rs 5,000", method: "UPI", date: "May 21, 2026 - 10:30 AM", status: "Success" },
  { donor: "Ananya Patel", campaign: "Flood Relief - Warangal", amount: "Rs 10,000", method: "Card", date: "May 21, 2026 - 10:20 AM", status: "Success" },
  { donor: "Sanjay Singh", campaign: "School Supplies - Nalgonda", amount: "Rs 2,500", method: "UPI", date: "May 21, 2026 - 10:10 AM", status: "Success" },
  { donor: "Lakshmi M.", campaign: "Heart Surgery for Arjun", amount: "Rs 15,000", method: "Net Banking", date: "May 21, 2026 - 10:05 AM", status: "Success" },
  { donor: "Deepa Sharma", campaign: "Cancer Treatment Fund", amount: "Rs 1,000", method: "Card", date: "May 21, 2026 - 09:48 AM", status: "Pending" },
];

const donors = [
  { name: "Ravi Kumar", email: "ravi.kumar@email.com", donated: "Rs 50,000", campaigns: 5, last: "May 21, 2026", status: "Active" },
  { name: "Ananya Patel", email: "ananya.patel@email.com", donated: "Rs 35,000", campaigns: 3, last: "May 21, 2026", status: "Active" },
  { name: "Venkat Naidu", email: "venkat.naidu@email.com", donated: "Rs 40,000", campaigns: 4, last: "May 21, 2026", status: "Inactive" },
  { name: "Sanjay Singh", email: "sanjay.singh@email.com", donated: "Rs 22,500", campaigns: 2, last: "May 21, 2026", status: "Active" },
  { name: "Lakshmi M.", email: "lakshmi@email.com", donated: "Rs 15,000", campaigns: 2, last: "May 21, 2026", status: "Inactive" },
];

const LIFE_SAVING_IMAGE = "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1600&q=80";

const approvals = [
  { campaign: "Dialysis Fund for Deepa", by: "Deepa V.", category: "Medical", goal: "Rs 3,00,000", date: "May 21, 2026", docs: 3 },
  { campaign: "Free Tuition Centre", by: "Teja R.", category: "Education", goal: "Rs 60,000", date: "May 21, 2026", docs: 2 },
  { campaign: "Village Road Repair", by: "Bhanu N.", category: "Community", goal: "Rs 1,50,000", date: "May 21, 2026", docs: 4 },
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
  { key: "approvals", label: "Approvals", icon: CheckCircle, badge: 3 },
  { key: "reports", label: "Reports", icon: FileText },
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "settings", label: "Settings", icon: Settings },
];

const categoryStats = [
  { name: "Medical", value: 40, color: "#0f766e", bg: "bg-teal-50", text: "text-teal-700" },
  { name: "Education", value: 22, color: "#2563eb", bg: "bg-blue-50", text: "text-blue-700" },
  { name: "Community", value: 14, color: "#7c3aed", bg: "bg-violet-50", text: "text-violet-700" },
  { name: "Others", value: 24, color: "#ea580c", bg: "bg-orange-50", text: "text-orange-700" },
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

const actionStyles = {
  primary: "bg-teal-700 text-white hover:bg-teal-800",
  neutral: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  info: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  warning: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  danger: "bg-red-50 text-red-700 hover:bg-red-100",
  success: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
};

const StatCard = ({ icon: Icon, label, value, note, danger, tone = "teal" }) => {
  const tones = {
    teal: "bg-teal-50 text-teal-700 ring-teal-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
  };

  return (
  <div className="kpi-card rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ring-1 ${tones[tone]}`}>
      <Icon size={18} />
    </div>
    <p className="text-sm font-semibold text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    {note && <p className={`mt-2 text-xs font-semibold ${danger ? "text-red-600" : "text-green-600"}`}>{note}</p>}
  </div>
  );
};

const StatusPill = ({ status }) => {
  const style = statusStyles[status] || "bg-slate-100 text-slate-700 ring-slate-200";
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${style}`}>{status}</span>;
};

const StatusCell = ({ status }) => {
  const meter = statusMeters[status] || { value: 50, color: "bg-slate-500" };
  return (
    <div className="status-cell min-w-[132px] max-w-[190px]">
      <StatusPill status={status} />
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${meter.color}`} style={{ width: `${meter.value}%` }} />
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

const Progress = ({ value }) => (
  <div className="flex items-center gap-3">
    <div className="h-2 w-28 rounded-full bg-slate-100">
      <div className="h-2 rounded-full bg-teal-600" style={{ width: `${value}%` }} />
    </div>
    <span className="w-9 text-xs font-bold text-slate-500">{value}%</span>
  </div>
);

const Toolbar = ({ placeholder, children }) => (
  <div className="admin-toolbar mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <label className="relative w-full md:max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-600" placeholder={placeholder} />
    </label>
    <div className="admin-toolbar-actions flex flex-wrap gap-2">{children}</div>
  </div>
);

const TableShell = ({ children }) => (
  <div className="admin-table overflow-x-auto rounded-2xl border border-slate-200 bg-white">
    <table className="w-full min-w-[1120px] border-collapse text-left text-sm">{children}</table>
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
  const [profileForm, setProfileForm] = useState({ fullName: "", email: "", phone: "" });
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
  const navigate = useNavigate();

  // Local editable state so actions reflect immediately in UI
  const [campaignsState, setCampaignsState] = useState(() => [...getSubmittedFundraisers(), ...campaigns]);
  const [donationsState, setDonationsState] = useState(donations);
  const [donorsState, setDonorsState] = useState(donors);

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
    setRefundForm({ donationId: `${donation.donor}-${donation.date}`, reason: "", processRefund: false });
    setShowRefundForm(true);
  };

  const handleProcessRefund = () => {
    if (validateRefundForm()) {
      const donation = selectedItem;
      // update donation state to reflect refund
      setDonationsState((list) => list.map((d) => (d.donor === donation.donor && d.date === donation.date ? { ...d, status: "Refunded" } : d)));
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
            <p className="text-sm text-slate-600">Donor: <span className="font-bold text-slate-900">{selectedItem.donor}</span></p>
            <p className="text-sm text-slate-600">Amount: <span className="font-bold text-green-600">{selectedItem.amount}</span></p>
            <p className="text-sm text-slate-600">Campaign: <span className="font-bold text-slate-900">{selectedItem.campaign}</span></p>
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
              <Progress value={selectedItem.progress} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Deadline</p>
              <p className="text-sm font-bold text-slate-900">{selectedItem.deadline}</p>
            </div>
            {selectedItem.beneficiary && (
              <div>
                <p className="text-xs font-bold text-slate-500">Beneficiary</p>
                <p className="text-sm font-bold text-slate-900">{selectedItem.beneficiary}</p>
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
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CircleDollarSign} label="Total Raised" value="Rs 24.8L" note="+12% from last month" tone="teal" />
        <StatCard icon={Home} label="Active Campaigns" value="38" note="+5 new this week" tone="blue" />
        <StatCard icon={Users} label="Total Users" value="1,247" note={`${userStats.active} active in this list`} tone="violet" />
        <StatCard icon={BarChart3} label="Success Rate" value="64%" note="-2% from last month" danger tone="amber" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,0.75fr)_minmax(320px,0.65fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Monthly Fundraising (Rs Lakhs)</h2>
            <select className="rounded-md border border-slate-200 px-3 py-2 text-sm"><option>This Month</option></select>
          </div>
          <div className="grid h-64 grid-cols-6 items-end gap-4 rounded-lg bg-slate-50 px-6 pb-8 pt-5">
            {[3.2, 2.9, 4.2, 3.7, 4.8, 6.0].map((amount, index) => (
              <div key={amount} className="relative flex h-full items-end justify-center">
                <div className={`w-full max-w-12 rounded-t-md ${index === 5 ? "bg-teal-700" : "bg-teal-300"}`} style={{ height: `${amount * 30}px` }} />
                <span className="absolute -bottom-6 text-xs font-semibold text-slate-500">{["Dec", "Jan", "Feb", "Mar", "Apr", "May"][index]}</span>
                <span className="absolute text-xs font-bold text-slate-500" style={{ bottom: `${amount * 30 + 8}px` }}>{amount}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 font-bold text-slate-900">Campaign Categories</h2>
          <div className="flex items-center gap-5">
            <div
              className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full text-center"
              style={{
                background:
                  "conic-gradient(#0f766e 0 40%, #2563eb 40% 62%, #7c3aed 62% 76%, #ea580c 76% 100%)",
              }}
            >
              <div className="flex h-[94px] w-[94px] items-center justify-center rounded-full bg-white text-xl font-bold text-teal-800 shadow-inner">
                38<span className="ml-1 text-xs font-semibold text-slate-500">Total</span>
              </div>
            </div>
            <div className="w-full space-y-3 text-sm">
              {categoryStats.map((item) => (
                <div key={item.name} className={`flex items-center justify-between rounded-md px-3 py-2 ${item.bg}`}>
                  <span className="flex items-center gap-2 font-semibold text-slate-800">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <b className={item.text}>{item.value}%</b>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-transparent p-5 shadow-sm">
          <h2 className="mb-4 font-bold text-slate-900">Live Donations</h2>
          <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
            {donationsState.slice(0, 12).map((item, idx) => (
              <div key={`${item.donor}-${item.date}-${idx}`} className="floating-donor rounded-lg bg-white/70 backdrop-blur-sm p-3 shadow-sm border border-white/30 transition-transform hover:translate-y-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-700 text-white font-bold">{item.donor.split(' ').map(p=>p[0]).slice(0,2).join('')}</div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{item.donor}</p>
                    <p className="truncate text-xs text-slate-500">{item.campaign}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-bold text-green-600">{item.amount}</p>
                    <p className="text-xs text-slate-400">{item.date.split(' - ')[1]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-[0.95fr_1.35fr]">
        {renderRecentDonations()}
        {renderApprovals(true)}
      </div>
    </>
  );

  const renderCampaigns = () => (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard icon={Home} label="All Campaigns" value={campaignsState.length} note="Admin managed campaigns" tone="blue" />
        <StatCard icon={CheckCircle} label="Active" value={campaignsState.filter((item) => item.status === "Active").length} note="Currently accepting funds" tone="teal" />
        <StatCard icon={FileText} label="Pending Review" value={campaignsState.filter((item) => item.status === "Pending Review").length} note="Submitted fundraisers" tone="amber" />
        <StatCard icon={BarChart3} label="Urgent" value={campaignsState.filter((item) => item.status === "Urgent").length} note="Needs priority attention" danger tone="amber" />
      </div>
      <Toolbar placeholder="Search campaigns...">
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm"><option>All Categories</option></select>
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm"><option>All Status</option></select>
        <button onClick={() => navigate('/create-fundraiser', { state: { image: LIFE_SAVING_IMAGE } })} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800 transition-colors hover:shadow-lg">+ New Campaign</button>
      </Toolbar>
      <TableShell>
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr><th className="px-5 py-4">Campaign</th><th>Organiser</th><th>Category</th><th>Raised</th><th>Goal</th><th>Progress</th><th>Status</th><th>Deadline</th><th className="min-w-[310px]">Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {campaignsState.map((item) => (
            <tr key={item.name} className="transition-colors hover:bg-slate-50 cursor-pointer">
              <td className="px-5 py-5 font-bold">{item.name}</td>
              <td>{item.organiser}</td>
              <td>{item.category}</td>
              <td>{item.raised}</td>
              <td>{item.goal}</td>
              <td><Progress value={item.progress} /></td>
              <td><StatusCell status={item.status} /></td>
              <td>{item.deadline}</td>
              <td className="px-5 py-5">
                <div className="table-actions flex flex-wrap gap-2">
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
              </td>
            </tr>
          ))}
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
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Toolbar placeholder="Search donations...">
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm"><option>All Campaigns</option></select>
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm"><option>All Methods</option></select>
        <button onClick={() => downloadCsv("donations.csv", donationsState)} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800 transition-colors">Export</button>
      </Toolbar>
      <TableShell>
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr><th className="px-5 py-4">Donor</th><th>Campaign</th><th>Amount</th><th>Method</th><th>Date & Time</th><th>Status</th><th className="min-w-[230px]">Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {donationsState.map((item) => (
            <tr key={`${item.donor}-${item.date}`}>
              <td className="px-5 py-5 font-bold">{item.donor}</td>
              <td>{item.campaign}</td>
              <td>{item.amount}</td>
              <td>{item.method}</td>
              <td>{item.date}</td>
              <td><StatusCell status={item.status} /></td>
              <td className="px-5 py-5">
                <div className="table-actions flex flex-wrap gap-2">
                  <ActionButton onClick={() => notify(`Viewing donation from ${item.donor}`)} icon={Eye} tone="info">View</ActionButton>
                  {item.status === "Success" && <ActionButton onClick={() => handleInitiateRefund(item)} icon={RotateCcw} tone="danger">Refund</ActionButton>}
                  {item.status === "Pending" && <ActionButton onClick={() => notify(`Following up on pending payment from ${item.donor}`)} tone="warning">Follow Up</ActionButton>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableShell>
      {renderRefundForm()}
    </section>
  );

  const renderDonors = () => (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
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
      <Toolbar placeholder="Search donors...">
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm"><option>All Donor Types</option></select>
        <button onClick={() => downloadCsv("donors.csv", donorsState)} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800 transition-colors">Export</button>
      </Toolbar>
      <TableShell>
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr><th className="px-5 py-4">User</th><th>Email</th><th>Total Donated</th><th>Campaigns Supported</th><th>Last Donation</th><th>Status</th><th className="min-w-[420px]">Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {donorsState.map((item) => (
            <tr key={item.email}>
              <td className="px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {item.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.status === "Active" ? "Currently active" : "Inactive user"}</p>
                  </div>
                </div>
              </td>
              <td>{item.email}</td>
              <td>{item.donated}</td>
              <td>{item.campaigns}</td>
              <td>{item.last}</td>
              <td><StatusCell status={item.status} /></td>
              <td className="px-5 py-5">
                <div className="table-actions flex flex-wrap gap-2">
                  <ActionButton onClick={() => handleViewDonorProfile(item)} icon={Eye} tone="info">Profile</ActionButton>
                  <ActionButton onClick={() => notify(`Composing message to ${item.name}...`)} icon={MessageSquare} tone="neutral">Message</ActionButton>
                  <ActionButton onClick={() => handleDonorStatusChange(item.email)} icon={item.status === "Active" ? PauseCircle : PlayCircle} tone={item.status === "Active" ? "warning" : "success"}>
                    {item.status === "Active" ? "Deactivate" : "Activate"}
                  </ActionButton>
                  <ActionButton onClick={() => downloadCsv(`${item.name}_report.csv`, [item])} icon={FileText} tone="success">Report</ActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableShell>
      {renderDonorDetailsModal()}
    </section>
  );

  function renderApprovals(compact = false) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Pending Approvals</h2>
          {compact && <button onClick={() => setActiveView("approvals")} className="text-sm font-bold text-teal-700 hover:text-teal-800">View all</button>}
        </div>
        <TableShell>
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-5 py-4">Campaign</th><th>Submitted By</th><th>Category</th><th>Goal</th><th>Status</th><th>Documents</th><th className="min-w-[430px]">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {approvalItems.map((item) => (
              <tr key={item.campaign}>
                <td className="px-5 py-5 font-bold">{item.campaign}</td>
                <td>{item.by}</td>
                <td>{item.category}</td>
                <td>{item.goal}</td>
                <td><StatusCell status="Pending Review" /></td>
                <td><span className="inline-block rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">{item.docs} files</span></td>
                <td className="px-5 py-5">
                  <div className="table-actions flex flex-wrap gap-2">
                    <ActionButton onClick={() => notify(`Viewing documents for ${item.campaign}`)} icon={FileText} tone="info">Docs</ActionButton>
                    <ActionButton onClick={() => notify(`Requesting additional info from ${item.by}`)} tone="warning">Request Info</ActionButton>
                    <ActionButton onClick={() => handleApproval(item.campaign, "approve")} icon={CheckCircle} tone="primary">Approve</ActionButton>
                    <ActionButton onClick={() => handleApproval(item.campaign, "reject")} tone="danger">Reject</ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {approvalItems.length === 0 && (
              <tr><td className="px-5 py-6 text-center text-slate-500" colSpan="7">No pending approvals.</td></tr>
            )}
          </tbody>
        </TableShell>
      </section>
    );
  }

  function renderRecentDonations() {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-5 font-bold text-slate-900">Recent Donations</h2>
        <div className="space-y-4">
          {donationsState.slice(0, 3).map((item) => (
            <div key={`${item.donor}-${item.amount}`} className="flex items-center justify-between rounded-md bg-slate-50 p-3">
              <div><p className="font-bold text-slate-800">{item.donor}</p><p className="text-xs text-slate-500">{item.campaign} - {item.date}</p></div>
              <p className="font-bold text-green-600">{item.amount}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const renderReports = () => (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CircleDollarSign} label="Total Raised" value="Rs 12,45,000" note="+10%" tone="teal" />
        <StatCard icon={Inbox} label="Total Donations" value="820" note="+18%" tone="blue" />
        <StatCard icon={Users} label="New Donors" value="124" note="+18%" tone="violet" />
        <StatCard icon={BarChart3} label="Success Rate" value="64%" note="-2%" danger tone="amber" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-bold">Revenue Overview</h2>
            <span className="text-xs font-bold text-green-600">+18% growth</span>
          </div>
          <div className="relative h-64 rounded-lg bg-slate-50 px-5 pb-10 pt-6">
            <div className="absolute inset-x-5 top-1/4 border-t border-dashed border-slate-200" />
            <div className="absolute inset-x-5 top-1/2 border-t border-dashed border-slate-200" />
            <div className="absolute inset-x-5 top-3/4 border-t border-dashed border-slate-200" />
            <div className="relative z-10 grid h-full grid-cols-6 items-end gap-4">
              {[42, 58, 74, 92, 84, 118].map((height, index) => (
                <div key={height} className="relative flex h-full items-end justify-center">
                  <div
                    className={`w-full max-w-14 rounded-t-md ${index === 5 ? "bg-teal-700" : "bg-teal-300"}`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="absolute -bottom-7 text-xs font-semibold text-slate-500">
                    {["May 1", "May 5", "May 10", "May 15", "May 20", "May 25"][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <button onClick={() => downloadCsv("revenue_report.csv", [{ month: "May", revenue: "Rs 12,45,000" }])} className="flex-1 rounded-md bg-teal-700 px-3 py-2 text-xs font-bold text-white hover:bg-teal-800 transition-colors">Export Report</button>
            <button onClick={() => notify("Scheduling report email...")} className="flex-1 rounded-md bg-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-300 transition-colors">Schedule Email</button>
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 font-bold">Donations by Category</h2>
          <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full border-[28px] border-teal-600 text-center font-bold">820<br /><span className="text-xs">Total</span></div>
          <div className="mt-5 flex gap-2">
            <button onClick={() => notify("Generating detailed category report...")} className="flex-1 rounded-md bg-teal-700 px-3 py-2 text-xs font-bold text-white hover:bg-teal-800 transition-colors">View Details</button>
            <button onClick={() => notify("Filtering categories...")} className="flex-1 rounded-md bg-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-300 transition-colors">Filter</button>
          </div>
        </section>
      </div>
    </>
  );

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
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm font-bold text-green-700 border border-green-200">
          ✓ {successMessage}
        </div>
      )}
      <div className="mb-6 flex gap-6 border-b border-slate-200 text-sm font-bold text-slate-600">
        {["Profile", "Website", "Security", "Notifications", "Payment Settings"].map((tab) => (
          <button onClick={() => { setSettingsTab(tab); setFormErrors({}); setTouchedFields({}); }} key={tab} className={`pb-3 transition-all ${settingsTab === tab ? "border-b-2 border-teal-700 text-teal-700" : "hover:text-slate-800"}`}>
            {tab}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {settingsTab === "Profile" && (
          <div>
            <h2 className="mb-5 font-bold">Admin Profile</h2>
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-700 text-2xl font-bold text-white">AD</div>
              <button onClick={() => notify("Photo picker will open here.")} className="text-sm font-bold text-teal-700 hover:text-teal-800">Change Photo</button>
            </div>
            {["fullName", "email", "phone"].map((field) => {
              const labels = { fullName: "Full Name", email: "Email", phone: "Phone Number" };
              const error = formErrors[field] && touchedFields[field];
              return (
                <label key={field} className="mb-4 block text-sm font-bold text-slate-600">
                  {labels[field]}
                  <input 
                    value={profileForm[field]}
                    onChange={(e) => setProfileForm({ ...profileForm, [field]: e.target.value })}
                    onBlur={() => handleFieldBlur(field)}
                    className={`mt-2 w-full rounded-md border px-3 py-2 font-normal outline-none transition-colors focus:border-teal-600 ${error ? "border-red-500 bg-red-50" : "border-slate-200"}`}
                    placeholder={field === "phone" ? "10-digit number" : ""}
                    type={field === "email" ? "email" : "text"}
                  />
                  {error && <span className="mt-1 block text-xs text-red-600">{formErrors[field]}</span>}
                </label>
              );
            })}
            <button onClick={handleSaveProfile} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800 transition-colors">Save Changes</button>
          </div>
        )}
        {settingsTab === "Website" && (
          <div className="col-span-2">
            <h2 className="mb-5 font-bold">Website Settings</h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-600">Hero Title</label>
                <input value={websiteForm.heroTitle} onChange={(e) => setWebsiteForm({ ...websiteForm, heroTitle: e.target.value })} className="mb-4 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" placeholder="Bring hope to those in need" />

                <label className="mb-2 block text-sm font-bold text-slate-600">Hero Subtitle</label>
                <input value={websiteForm.heroSubtitle} onChange={(e) => setWebsiteForm({ ...websiteForm, heroSubtitle: e.target.value })} className="mb-4 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" placeholder="Create a campaign and help today" />

                <label className="mb-2 block text-sm font-bold text-slate-600">Featured Campaigns</label>
                <input type="number" value={websiteForm.featuredCount} onChange={(e) => setWebsiteForm({ ...websiteForm, featuredCount: Number(e.target.value) })} className="mb-4 w-32 rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" />

                <label className="mb-2 block text-sm font-bold text-slate-600">Primary Color</label>
                <input type="color" value={websiteForm.primaryColor} onChange={(e) => setWebsiteForm({ ...websiteForm, primaryColor: e.target.value })} className="mb-4 h-10 w-20 rounded-md border border-slate-200 p-1" />

                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={websiteForm.enableCarousel} onChange={(e) => setWebsiteForm({ ...websiteForm, enableCarousel: e.target.checked })} className="rounded" />
                  <span className="font-bold text-slate-700">Enable featured carousel on homepage</span>
                </label>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-bold text-slate-600">Footer Text</label>
                  <input value={websiteForm.footerText} onChange={(e) => setWebsiteForm({ ...websiteForm, footerText: e.target.value })} className="mb-4 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-teal-600" placeholder="© 2026 MyFundraiser. All rights reserved." />
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={handleSaveWebsite} className="rounded-md bg-teal-700 px-4 py-2 font-bold text-white hover:bg-teal-800">Save Website</button>
                  <button onClick={() => { setWebsiteForm({ heroTitle: '', heroSubtitle: '', featuredCount: 4, enableCarousel: true, footerText: '', primaryColor: '#0d9488' }); setFormErrors({}); }} className="rounded-md border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50">Reset</button>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-bold text-slate-700">Live Preview</h3>
                <div className="rounded-md border border-slate-200 p-4">
                  <div className="mb-4 rounded-md p-6" style={{ background: `linear-gradient(90deg, ${websiteForm.primaryColor}22, ${websiteForm.primaryColor}11)` }}>
                    <h2 className="text-lg font-bold" style={{ color: websiteForm.primaryColor }}>{websiteForm.heroTitle || 'Hero Title'}</h2>
                    <p className="text-sm text-slate-600">{websiteForm.heroSubtitle || 'Hero subtitle goes here'}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-slate-500">Featured campaigns shown: <b className="text-slate-900">{websiteForm.featuredCount}</b></p>
                    <p className="text-xs text-slate-500">Carousel: <b className="text-slate-900">{websiteForm.enableCarousel ? 'Enabled' : 'Disabled'}</b></p>
                  </div>
                  <div className="mt-3 rounded-t-md border-t pt-3 text-xs text-slate-500">Footer preview: {websiteForm.footerText || '© 2026 MyFundraiser. All rights reserved.'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {settingsTab === "Profile" && (
          <div>
            <h2 className="mb-5 font-bold">Change Password</h2>
            {["current", "new", "confirm"].map((field) => {
              const labels = { current: "Current Password", new: "New Password", confirm: "Confirm New Password" };
              const error = formErrors[field] && touchedFields[field];
              return (
                <label key={field} className="mb-4 block text-sm font-bold text-slate-600">
                  {labels[field]}
                  <input 
                    value={passwordForm[field]}
                    onChange={(e) => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
                    onBlur={() => handleFieldBlur(field)}
                    type="password"
                    className={`mt-2 w-full rounded-md border px-3 py-2 font-normal outline-none transition-colors focus:border-teal-600 ${error ? "border-red-500 bg-red-50" : "border-slate-200"}`}
                  />
                  {error && <span className="mt-1 block text-xs text-red-600">{formErrors[field]}</span>}
                </label>
              );
            })}
            <button onClick={handleUpdatePassword} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800 transition-colors">Update Password</button>
          </div>
        )}
        {settingsTab === "Security" && (
          <div className="col-span-2">
            <h2 className="mb-5 font-bold">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-bold">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500">Add an extra layer of security</p>
                </div>
                <button className="rounded-md bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-300 transition-colors">Enable</button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-bold">Login History</p>
                  <p className="text-xs text-slate-500">View your recent login activity</p>
                </div>
                <button className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800 transition-colors">View</button>
              </div>
            </div>
          </div>
        )}
        {settingsTab === "Notifications" && (
          <div className="col-span-2">
            <h2 className="mb-5 font-bold">Notification Preferences</h2>
            <div className="space-y-3">
              {["Email Notifications", "SMS Alerts", "Push Notifications", "Weekly Reports"].map((item) => (
                <label key={item} className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="font-bold text-slate-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        {settingsTab === "Payment Settings" && (
          <div className="col-span-2">
            <h2 className="mb-5 font-bold">Payment Configuration</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-bold">Bank Account</p>
                <p className="text-sm text-slate-600">HDFC Bank - XXXX XXXX XXXX 5678</p>
                <button className="mt-3 text-sm font-bold text-teal-700 hover:text-teal-800">Edit</button>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-bold">Commission Rate</p>
                <p className="text-sm text-slate-600">5% per transaction</p>
                <button className="mt-3 text-sm font-bold text-teal-700 hover:text-teal-800">Change</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );

  const content = {
    dashboard: renderDashboard,
    campaigns: renderCampaigns,
    donations: renderDonations,
    donors: renderDonors,
    approvals: () => renderApprovals(false),
    reports: renderReports,
    messages: renderMessages,
    settings: renderSettings,
  };

  return (
    <main className="min-h-screen bg-slate-50 admin-page">
      <style>{`
        .admin-page {
          width: 100%;
          overflow-x: hidden;
        }
        .admin-page * {
          box-sizing: border-box;
        }
        .admin-page section,
        .admin-page .dashboard-card,
        .admin-page .admin-table,
        .admin-page .kpi-card {
          border-radius: 18px;
        }
        .admin-page section,
        .admin-page .dashboard-card {
          border-color: #dbe3ee;
          box-shadow: 0 8px 24px rgba(15,23,42,0.05);
          transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;
        }
        .admin-page section:hover,
        .admin-page .dashboard-card:hover {
          border-color: #bdd7d2;
          box-shadow: 0 18px 38px rgba(15,23,42,0.09);
        }
        .admin-page input, .admin-page select, .admin-page textarea, .admin-page .toolbar-input {
          box-shadow: 0 8px 20px rgba(2,6,23,0.08);
          transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease, background-color .18s ease;
          border-radius: .9rem;
          min-height: 44px;
        }
        .admin-page select {
          appearance: none;
          min-width: 150px;
          padding-right: 2.5rem;
          background-color: #fff;
          background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%230f172a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right .8rem center;
          background-size: 18px;
        }
        .admin-page .admin-toolbar-actions {
          align-items: center;
        }
        .admin-page .admin-toolbar-actions > select,
        .admin-page .admin-toolbar-actions > button {
          min-height: 44px;
        }
        .admin-page input:hover, .admin-page select:hover, .admin-page textarea:hover {
          border-color: #0f766e;
          box-shadow: 0 14px 30px rgba(15,118,110,0.16);
          transform: translateY(-2px);
        }
        .admin-page input:focus, .admin-page select:focus, .admin-page textarea:focus{
          box-shadow: 0 14px 30px rgba(2,6,23,0.12);
          transform: translateY(-4px);
        }
        .admin-page button,
        .admin-page select,
        .admin-page input[type="checkbox"],
        .admin-page input[type="color"],
        .admin-page input[type="file"],
        .admin-page tbody tr {
          cursor: pointer;
        }
        .admin-page input:not([type="checkbox"]):not([type="color"]):not([type="file"]),
        .admin-page textarea {
          cursor: text;
        }
        .admin-page button:disabled {
          cursor: not-allowed;
        }
        .admin-page button {
          transition: background-color .18s ease, border-color .18s ease, box-shadow .18s ease, color .18s ease, transform .18s ease;
        }
        .admin-page button:not(:disabled):hover {
          box-shadow: 0 10px 22px rgba(2,6,23,0.12);
          transform: translateY(-1px);
        }
        .admin-page .kpi-card {
          cursor: pointer;
          min-height: 158px;
          transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease, background-color .18s ease;
        }
        .admin-page .kpi-card:hover {
          border-color: #99f6e4;
          box-shadow: 0 18px 36px rgba(15,23,42,0.12);
          transform: translateY(-4px);
          background: linear-gradient(180deg, #ffffff 0%, #f8fffd 100%);
        }
        .admin-page tbody tr {
          transition: background-color .18s ease, box-shadow .18s ease, transform .18s ease;
        }
        .admin-page tbody tr:hover {
          background: #f8fafc;
          box-shadow: inset 3px 0 0 #0f766e;
        }
        .admin-page .admin-table thead th {
          white-space: nowrap;
          letter-spacing: .02em;
          color: #64748b;
          font-weight: 800;
        }
        .admin-page .admin-table tbody td {
          vertical-align: middle;
          white-space: nowrap;
        }
        .admin-page .admin-table tbody td:first-child,
        .admin-page .admin-table tbody td:nth-child(2) {
          white-space: normal;
        }
        .admin-page .table-actions {
          align-items: center;
          min-width: max-content;
        }
        .admin-page .status-cell {
          width: clamp(130px, 10vw, 190px);
        }
        .admin-page .floating-donor,
        .admin-page .admin-table tbody tr,
        .admin-page .rounded-xl.bg-slate-50 {
          transition: background-color .18s ease, box-shadow .18s ease, transform .18s ease;
        }
        .admin-page .floating-donor:hover,
        .admin-page .rounded-xl.bg-slate-50:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 28px rgba(15,23,42,0.1);
        }
        .floating-donor { animation: floatY 6s ease-in-out infinite; }
        @keyframes floatY { 0%{transform:translateY(0)} 50%{transform:translateY(-8px)} 100%{transform:translateY(0)} }
      `}</style>
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 bg-slate-950 text-white lg:flex lg:flex-col">
          <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
            <ShieldCheck size={18} />
            <span className="text-sm font-bold">MyFundraiser</span>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeView === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveView(item.key)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-bold ${active ? "bg-teal-700 text-white" : "text-slate-300 hover:bg-white/10"}`}
                >
                  <span className="flex items-center gap-3"><Icon size={16} />{item.label}</span>
                  {item.badge && <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">{item.badge}</span>}
                </button>
              );
            })}
          </nav>

          <div className="m-3 rounded-lg bg-teal-900/70 p-4">
            <p className="text-sm font-bold">Upgrade to Pro</p>
            <p className="mt-2 text-xs text-teal-100">Unlock advanced reports and analytics.</p>
            <button onClick={() => notify("Upgrade request submitted.")} className="mt-4 w-full rounded-md bg-white px-3 py-2 text-xs font-bold text-teal-800">Upgrade Now</button>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex h-16 items-center justify-between bg-teal-800 px-6 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400 text-sm font-bold text-teal-950">AD</div>
              <div>
                <p className="text-sm font-bold">Good morning, Admin!</p>
                <p className="text-xs text-teal-100">Welcome back to your fundraiser dashboard.</p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-right">
              <div><p className="text-xs text-teal-100">Rs 24.8L</p><p className="text-[11px] text-teal-100">Raised today</p></div>
              <div><p className="text-xs text-teal-100">38</p><p className="text-[11px] text-teal-100">Active campaigns</p></div>
              <div><p className="text-xs text-teal-100">1,247</p><p className="text-[11px] text-teal-100">Total donors</p></div>
              <Bell size={18} />
            </div>
          </header>

          <div className="w-full max-w-[1920px] px-6 py-6 2xl:px-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
              <p className="mt-1 text-sm text-slate-500">Manage fundraiser operations from one clean workspace.</p>
            </div>
            {content[activeView]()}
          </div>
        </section>
      </div>
      {renderCampaignDetailsModal()}
    </main>
  );
}
