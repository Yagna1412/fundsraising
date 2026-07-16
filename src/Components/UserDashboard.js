import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Edit3,
  Gift,
  Heart,
  Landmark,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Settings,
  Star,
  User,
  Zap,
} from "lucide-react";
import backendApi, {
  clearAuthSession,
  getStoredUserId,
} from "../services/backendApi";

const formatCurrency = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const formatMemberSince = (value) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
};

const formatDonationDate = (value) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
};

const Card = ({ children, className = "" }) => (
  <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
    {children}
  </section>
);

const IconBubble = ({ children }) => (
  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-700">
    {children}
  </div>
);

const SectionTitle = ({ icon, title }) => (
  <div className="mb-6 flex items-center gap-4">
    <IconBubble>{icon}</IconBubble>
    <h2 className="text-base font-bold text-teal-700">{title}</h2>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="min-w-0">
    <p className="text-xs font-bold text-slate-600">{label}</p>
    <p className="mt-1 break-words text-sm text-slate-700">{value || "—"}</p>
  </div>
);

const emptyProfile = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  jobRole: "",
  company: "",
  experience: "",
  location: "",
  bankName: "",
  maskedAccountNumber: "",
  ifscCode: "",
  accountType: "",
  favoriteCause: "",
  preferredMonthlyBudget: "",
  anonymousDonation: false,
  receiveUpdates: true,
  memberSince: null,
  profileImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  totalDonations: 0,
  campaignsSupported: 0,
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const userId = getStoredUserId();
  const [isEditing, setIsEditing] = useState(false);
  const [showAllDonations, setShowAllDonations] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(emptyProfile);
  const [donations, setDonations] = useState([]);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);

  const loadDashboard = async () => {
    if (!userId) {
      setError("Please sign in to view your dashboard.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [profileData, donationData] = await Promise.all([
        backendApi.getProfile(userId),
        backendApi.getUserDonations(userId),
      ]);
      setProfile({ ...emptyProfile, ...profileData });
      setDonations(donationData || []);
      setEditForm({
        fullName: profileData.fullName || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const visibleDonations = showAllDonations ? donations : donations.slice(0, 4);

  const totalDonations = useMemo(() => {
    if (profile.totalDonations != null) return Number(profile.totalDonations);
    return donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  }, [profile.totalDonations, donations]);

  const supportedCampaigns = useMemo(() => {
    if (profile.campaignsSupported != null) return Number(profile.campaignsSupported);
    return new Set(donations.map((d) => d.campaignId)).size;
  }, [profile.campaignsSupported, donations]);

  const quickActions = [
    {
      title: "Explore Campaigns",
      text: "Find and support new causes",
      icon: <Star size={16} />,
      action: () => navigate("/campaigns"),
    },
    {
      title: "Donation History",
      text: "View all your contributions",
      icon: <ClipboardList size={16} />,
      action: () => {
        setShowAllDonations(true);
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      },
    },
    {
      title: "Account Settings",
      text: "Manage your profile and security",
      icon: <Settings size={16} />,
      action: () => setIsEditing(true),
    },
    {
      title: "Logout",
      text: "Sign out of your account",
      icon: <LogOut size={16} />,
      action: () => {
        clearAuthSession();
        navigate("/loginSignup");
      },
    },
  ];

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await backendApi.updateProfile(userId, {
        fullName: editForm.fullName,
        phone: editForm.phone,
        address: editForm.address,
      });
      setProfile((prev) => ({ ...prev, ...updated }));
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...stored,
          name: updated.fullName,
          email: updated.email || stored.email,
        })
      );
      setIsEditing(false);
    } catch (err) {
      window.alert(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-20 text-center text-slate-500">
        Loading your dashboard…
      </main>
    );
  }

  if (error && !profile.email) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-20 text-center">
        <p className="text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/loginSignup")}
          className="mt-6 rounded-md bg-teal-700 px-5 py-2 text-sm font-bold text-white"
        >
          Sign in
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-[1720px]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-teal-700 sm:text-3xl">
              Welcome back, {profile.fullName || "Donor"}!
            </h1>
            <p className="mt-2 text-base text-slate-600">
              Here&apos;s what&apos;s happening with your donations and profile.
            </p>
            {error ? <p className="mt-2 text-sm text-amber-700">{error}</p> : null}
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-teal-800"
          >
            <Edit3 size={16} />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2.1fr_0.9fr_0.85fr_1fr_0.85fr]">
          <Card className="p-5 sm:p-7">
            <div className="flex flex-col items-center gap-8 sm:flex-row">
              <div className="rounded-full border-4 border-teal-700 p-1">
                <img
                  src={
                    profile.profileImageUrl ||
                    "https://randomuser.me/api/portraits/men/32.jpg"
                  }
                  alt={profile.fullName}
                  className="h-36 w-36 rounded-full object-cover"
                />
              </div>
              <div className="min-w-0 space-y-4">
                <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                  {profile.fullName}
                </h2>
                <p className="flex min-w-0 items-start gap-3 break-all text-sm text-slate-600 sm:text-base">
                  <Mail size={17} className="text-slate-600" /> {profile.email}
                </p>
                <p className="flex items-start gap-3 text-sm text-slate-600 sm:text-base">
                  <Phone size={17} className="text-slate-600" /> {profile.phone || "—"}
                </p>
                <p className="flex items-start gap-3 text-sm text-slate-600 sm:text-base">
                  <MapPin size={17} className="text-slate-600" /> {profile.address || "—"}
                </p>
                <span className="inline-flex items-center gap-2 rounded-md bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">
                  <CalendarDays size={15} /> Member since{" "}
                  {formatMemberSince(profile.memberSince)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <IconBubble>
              <Heart size={24} fill="currentColor" />
            </IconBubble>
            <p className="mt-7 text-sm font-bold text-slate-600">Total Donations</p>
            <p className="mt-2 text-3xl font-bold text-teal-700">
              {formatCurrency(totalDonations)}
            </p>
            <p className="mt-7 text-sm text-slate-600">Across all campaigns</p>
          </Card>

          <Card className="p-8">
            <IconBubble>
              <Gift size={24} fill="currentColor" />
            </IconBubble>
            <p className="mt-7 text-sm font-bold text-slate-600">Campaigns Supported</p>
            <p className="mt-2 text-3xl font-bold text-teal-700">{supportedCampaigns}</p>
            <p className="mt-7 text-sm text-slate-600">You&apos;re making impact</p>
          </Card>

          <Card className="p-8">
            <IconBubble>
              <Star size={24} fill="currentColor" />
            </IconBubble>
            <p className="mt-7 text-sm font-bold text-slate-600">Favorite Cause</p>
            <p className="mt-2 text-2xl font-bold text-teal-700">
              {profile.favoriteCause || "—"}
            </p>
            <p className="mt-7 text-sm text-slate-600">Your top priority</p>
          </Card>

          <Card className="p-8">
            <IconBubble>
              <CalendarDays size={24} />
            </IconBubble>
            <p className="mt-7 text-sm font-bold text-slate-600">Member Since</p>
            <p className="mt-2 text-2xl font-bold text-teal-700">
              {formatMemberSince(profile.memberSince)}
            </p>
            <p className="mt-7 text-sm text-slate-600">Glad you&apos;re here</p>
          </Card>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[0.95fr_0.9fr_0.9fr_1fr]">
          <Card className="p-7">
            <SectionTitle icon={<User size={24} fill="currentColor" />} title="Personal Information" />
            <div className="space-y-4">
              <DetailRow label="Full Name" value={profile.fullName} />
              <DetailRow label="Email" value={profile.email} />
              <DetailRow label="Phone" value={profile.phone} />
              <DetailRow label="Address" value={profile.address} />
            </div>
          </Card>

          <Card className="p-7">
            <SectionTitle icon={<BriefcaseBusiness size={24} />} title="Job Details" />
            <div className="space-y-4">
              <DetailRow label="Role" value={profile.jobRole} />
              <DetailRow label="Company" value={profile.company} />
              <DetailRow label="Experience" value={profile.experience} />
              <DetailRow label="Location" value={profile.location} />
            </div>
          </Card>

          <Card className="p-7">
            <SectionTitle icon={<Landmark size={24} />} title="Bank Details" />
            <div className="space-y-4">
              <DetailRow label="Bank Name" value={profile.bankName} />
              <DetailRow label="Account Number" value={profile.maskedAccountNumber} />
              <DetailRow label="IFSC Code" value={profile.ifscCode} />
              <DetailRow label="Account Type" value={profile.accountType} />
            </div>
          </Card>

          <Card className="p-7">
            <SectionTitle icon={<Heart size={24} fill="currentColor" />} title="Donation Preferences" />
            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-sm font-bold text-slate-600">Causes Interested In</p>
                <span className="rounded-md bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">
                  {profile.favoriteCause || "—"}
                </span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-sm font-bold text-slate-600">Preferred Monthly Budget</p>
                <p className="text-sm text-slate-700">
                  {profile.preferredMonthlyBudget || "—"}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-sm font-bold text-slate-600">Anonymous Donation</p>
                <p className="flex items-center gap-2 text-sm text-slate-700">
                  {profile.anonymousDonation ? (
                    <>
                      <CheckCircle size={16} className="text-green-600" /> Yes
                    </>
                  ) : (
                    "No"
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-sm font-bold text-slate-600">Receive Updates</p>
                <p className="flex items-center gap-2 text-sm text-slate-700">
                  {profile.receiveUpdates ? (
                    <>
                      <CheckCircle size={16} className="text-green-600" /> Yes
                    </>
                  ) : (
                    "No"
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.78fr]">
          <Card className="p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SectionTitle icon={<ClipboardList size={24} />} title="Recent Donations" />
              <button
                onClick={() => setShowAllDonations((current) => !current)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                {showAllDonations ? "Show Recent" : "View All Donations"}
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-[700px] w-full border-collapse text-left text-sm">
                <thead className="bg-teal-700 text-white">
                  <tr>
                    <th className="px-4 py-3 font-bold">Campaign</th>
                    <th className="px-4 py-3 font-bold">Cause</th>
                    <th className="px-4 py-3 font-bold">Amount</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {visibleDonations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No donations yet. Explore campaigns to get started.
                      </td>
                    </tr>
                  ) : (
                    visibleDonations.map((donation) => (
                      <tr key={donation.donationId || `${donation.campaignId}-${donation.donatedAt}`}>
                        <td className="px-4 py-3 font-medium text-slate-700">
                          {donation.campaignTitle || "Campaign"}
                          {donation.recipientName ? (
                            <span className="mt-1 block text-xs text-slate-500">
                              for {donation.recipientName}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{donation.cause || "—"}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">
                          {formatCurrency(donation.amount)}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {formatDonationDate(donation.donatedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            {donation.status || "SUCCESS"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitle icon={<Zap size={24} fill="currentColor" />} title="Quick Actions" />
            <div className="overflow-hidden rounded-lg border border-slate-200">
              {quickActions.map((item) => (
                <button
                  key={item.title}
                  onClick={item.action}
                  className="flex w-full items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 text-left last:border-b-0 hover:bg-slate-50 sm:px-5"
                >
                  <span className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-700 text-white">
                      {item.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-teal-700">{item.title}</span>
                      <span className="block text-sm text-slate-500">{item.text}</span>
                    </span>
                  </span>
                  <ChevronRight size={18} className="text-slate-500" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-teal-700">Edit Profile</h2>
            <div className="mt-5 space-y-4">
              <label className="block text-sm font-bold text-slate-600">
                Full Name
                <input
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-normal"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                />
              </label>
              <label className="block text-sm font-bold text-slate-600">
                Email
                <input
                  className="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 font-normal"
                  value={profile.email}
                  disabled
                />
              </label>
              <label className="block text-sm font-bold text-slate-600">
                Phone
                <input
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-normal"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </label>
              <label className="block text-sm font-bold text-slate-600">
                Address
                <input
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-normal"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-md border border-slate-300 px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="rounded-md bg-teal-700 px-5 py-2 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
