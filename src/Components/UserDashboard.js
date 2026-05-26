import React, { useMemo, useState } from "react";
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

const campaignDetails = {
  1: {
    campaign: "Help Children for Education",
    cause: "Education",
    image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=140&q=60",
  },
  2: {
    campaign: "Emergency Medical Support",
    cause: "Medical",
    image: "https://images.unsplash.com/photo-1599700403969-f77b3aa74837?auto=format&fit=crop&w=140&q=60",
  },
  3: {
    campaign: "Disaster Relief Support",
    cause: "Emergency",
    image: "https://images.unsplash.com/photo-1764684994219-8347a5ab0e5e?auto=format&fit=crop&w=140&q=60",
  },
  4: {
    campaign: "Food & Shelter Support",
    cause: "Humanity",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=140&q=60",
  },
};

const defaultDonations = [
  { campaignId: "1", amount: "20000", date: "20 May 2026" },
  { campaignId: "2", amount: "15000", date: "18 May 2026" },
  { campaignId: "3", amount: "25000", date: "15 May 2026" },
  { campaignId: "4", amount: "10000", date: "10 May 2026" },
];

const userProfile = {
  name: "Tirumala Yagna Prasanna",
  email: "tirumalayagnaprasanna@gmail.com",
  phone: "+91 98765 43210",
  address: "Hyderabad, Telangana, India",
  role: "Software Developer",
  company: "MyFundraiser",
  experience: "3+ Years",
  bankName: "HDFC Bank",
  accountNumber: "XXXX XXXX 1234",
  ifsc: "HDFC0001234",
  accountType: "Savings Account",
  favoriteCause: "Education",
  monthlyBudget: "Rs 10,000 - Rs 20,000",
  memberSince: "May 2026",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const formatCurrency = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

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
    <p className="mt-1 break-words text-sm text-slate-700">{value}</p>
  </div>
);

export default function UserDashboard() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showAllDonations, setShowAllDonations] = useState(false);
  const storedDonations = JSON.parse(localStorage.getItem("userDonations")) || [];
  const donations = storedDonations.length > 0 ? storedDonations : defaultDonations;
  const visibleDonations = showAllDonations ? donations : donations.slice(0, 4);

  const totalDonations = useMemo(
    () => donations.reduce((sum, donation) => sum + Number(donation.amount || 0), 0),
    [donations]
  );

  const supportedCampaigns = useMemo(
    () => new Set(donations.map((donation) => donation.campaignId)).size,
    [donations]
  );

  const quickActions = [
    { title: "Explore Campaigns", text: "Find and support new causes", icon: <Star size={16} />, action: () => navigate("/campaigns") },
    { title: "Donation History", text: "View all your contributions", icon: <ClipboardList size={16} />, action: () => { setShowAllDonations(true); window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); } },
    { title: "Account Settings", text: "Manage your profile and security", icon: <Settings size={16} />, action: () => setIsEditing(true) },
    { title: "Logout", text: "Sign out of your account", icon: <LogOut size={16} />, action: () => { localStorage.clear(); navigate("/loginSignup"); } },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-[1720px]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-teal-700 sm:text-3xl">
              Welcome back, {userProfile.name}! <span aria-hidden="true">👋</span>
            </h1>
            <p className="mt-2 text-base text-slate-600">
              Here's what's happening with your donations and profile.
            </p>
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
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="h-36 w-36 rounded-full object-cover"
                />
              </div>
              <div className="min-w-0 space-y-4">
                <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">{userProfile.name}</h2>
                <p className="flex min-w-0 items-start gap-3 break-all text-sm text-slate-600 sm:text-base">
                  <Mail size={17} className="text-slate-600" /> {userProfile.email}
                </p>
                <p className="flex items-start gap-3 text-sm text-slate-600 sm:text-base">
                  <Phone size={17} className="text-slate-600" /> {userProfile.phone}
                </p>
                <p className="flex items-start gap-3 text-sm text-slate-600 sm:text-base">
                  <MapPin size={17} className="text-slate-600" /> {userProfile.address}
                </p>
                <span className="inline-flex items-center gap-2 rounded-md bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">
                  <CalendarDays size={15} /> Member since {userProfile.memberSince}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <IconBubble><Heart size={24} fill="currentColor" /></IconBubble>
            <p className="mt-7 text-sm font-bold text-slate-600">Total Donations</p>
            <p className="mt-2 text-3xl font-bold text-teal-700">{formatCurrency(totalDonations || 500000)}</p>
            <p className="mt-7 text-sm text-slate-600">Across all campaigns <span className="text-green-600">↗</span></p>
          </Card>

          <Card className="p-8">
            <IconBubble><Gift size={24} fill="currentColor" /></IconBubble>
            <p className="mt-7 text-sm font-bold text-slate-600">Campaigns Supported</p>
            <p className="mt-2 text-3xl font-bold text-teal-700">{supportedCampaigns || 4}</p>
            <p className="mt-7 text-sm text-slate-600">You're making impact <span className="text-green-600">↗</span></p>
          </Card>

          <Card className="p-8">
            <IconBubble><Star size={24} fill="currentColor" /></IconBubble>
            <p className="mt-7 text-sm font-bold text-slate-600">Favorite Cause</p>
            <p className="mt-2 text-2xl font-bold text-teal-700">{userProfile.favoriteCause}</p>
            <p className="mt-7 text-sm text-slate-600">Your top priority <span className="text-rose-500">♥</span></p>
          </Card>

          <Card className="p-8">
            <IconBubble><CalendarDays size={24} /></IconBubble>
            <p className="mt-7 text-sm font-bold text-slate-600">Member Since</p>
            <p className="mt-2 text-2xl font-bold text-teal-700">{userProfile.memberSince}</p>
            <p className="mt-7 text-sm text-slate-600">1 month with us <span className="text-amber-500">☺</span></p>
          </Card>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[0.95fr_0.9fr_0.9fr_1fr]">
          <Card className="p-7">
            <SectionTitle icon={<User size={24} fill="currentColor" />} title="Personal Information" />
            <div className="space-y-4">
              <DetailRow label="Full Name" value={userProfile.name} />
              <DetailRow label="Email" value={userProfile.email} />
              <DetailRow label="Phone" value={userProfile.phone} />
              <DetailRow label="Address" value={userProfile.address} />
            </div>
          </Card>

          <Card className="p-7">
            <SectionTitle icon={<BriefcaseBusiness size={24} />} title="Job Details" />
            <div className="space-y-4">
              <DetailRow label="Role" value={userProfile.role} />
              <DetailRow label="Company" value={userProfile.company} />
              <DetailRow label="Experience" value={userProfile.experience} />
              <DetailRow label="Location" value="Hyderabad, India" />
            </div>
          </Card>

          <Card className="p-7">
            <SectionTitle icon={<Landmark size={24} />} title="Bank Details" />
            <div className="space-y-4">
              <DetailRow label="Bank Name" value={userProfile.bankName} />
              <DetailRow label="Account Number" value={userProfile.accountNumber} />
              <DetailRow label="IFSC Code" value={userProfile.ifsc} />
              <DetailRow label="Account Type" value={userProfile.accountType} />
            </div>
          </Card>

          <Card className="p-7">
            <SectionTitle icon={<Heart size={24} fill="currentColor" />} title="Donation Preferences" />
            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-sm font-bold text-slate-600">Causes Interested In</p>
                <span className="rounded-md bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">
                  {userProfile.favoriteCause}
                </span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-sm font-bold text-slate-600">Preferred Monthly Budget</p>
                <p className="text-sm text-slate-700">{userProfile.monthlyBudget}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-sm font-bold text-slate-600">Anonymous Donation</p>
                <p className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-green-600" /> Yes</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-sm font-bold text-slate-600">Receive Updates</p>
                <p className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle size={16} className="text-green-600" /> Yes</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.78fr]">
          <Card className="p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SectionTitle icon={<ClipboardList size={24} />} title="Recent Donations" />
              <button onClick={() => setShowAllDonations((current) => !current)} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
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
                  {visibleDonations.map((donation, index) => {
                    const detail = campaignDetails[donation.campaignId] || campaignDetails[1];
                    return (
                      <tr key={`${donation.campaignId}-${index}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-4">
                            <img src={detail.image} alt={detail.campaign} className="h-12 w-16 rounded object-cover" />
                            <span className="font-medium text-slate-700">{detail.campaign}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{detail.cause}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{formatCurrency(donation.amount)}</td>
                        <td className="px-4 py-3 text-slate-700">{donation.date}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Success</span>
                        </td>
                      </tr>
                    );
                  })}
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
              {["Full Name", "Email", "Phone", "Address"].map((label) => (
                <label key={label} className="block text-sm font-bold text-slate-600">
                  {label}
                  <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-normal" defaultValue={label === "Full Name" ? userProfile.name : label === "Email" ? userProfile.email : label === "Phone" ? userProfile.phone : userProfile.address} />
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-md border border-slate-300 px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  window.alert("Profile changes saved.");
                }}
                className="rounded-md bg-teal-700 px-5 py-2 text-sm font-bold text-white hover:bg-teal-800"
              >
                Save Changes
              </button>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
