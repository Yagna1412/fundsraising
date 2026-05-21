import React, { useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  CheckCircle,
  CircleDollarSign,
  FileText,
  Home,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

const campaigns = [
  { name: "Heart Surgery for Arjun", organiser: "Meena R.", category: "Medical", raised: "Rs 4,10,000", goal: "Rs 5,00,000", progress: 82, status: "Active", deadline: "Jun 15" },
  { name: "School Supplies - Nalgonda", organiser: "Suresh K.", category: "Education", raised: "Rs 51,600", goal: "Rs 1,20,000", progress: 43, status: "Active", deadline: "May 30" },
  { name: "Flood Relief - Warangal", organiser: "NGO Sahay", category: "Community", raised: "Rs 9,70,000", goal: "Rs 10,00,000", progress: 97, status: "Urgent", deadline: "May 22" },
  { name: "Community Well Project", organiser: "Priso M.", category: "Community", raised: "Rs 65,200", goal: "Rs 2,50,000", progress: 26, status: "Paused", deadline: "Jul 1" },
  { name: "Cancer Treatment Fund", organiser: "Ramesh P.", category: "Medical", raised: "Rs 82,000", goal: "Rs 4,00,000", progress: 61, status: "Active", deadline: "Jun 30" },
];

const donations = [
  { donor: "Ravi Kumar", campaign: "Heart Surgery for Arjun", amount: "Rs 5,000", method: "UPI", date: "May 21, 2026 - 10:30 AM", status: "Success" },
  { donor: "Ananya Patel", campaign: "Flood Relief - Warangal", amount: "Rs 10,000", method: "Card", date: "May 21, 2026 - 10:20 AM", status: "Success" },
  { donor: "Sanjay Singh", campaign: "School Supplies - Nalgonda", amount: "Rs 2,500", method: "UPI", date: "May 21, 2026 - 10:10 AM", status: "Success" },
  { donor: "Lakshmi M.", campaign: "Heart Surgery for Arjun", amount: "Rs 15,000", method: "Net Banking", date: "May 21, 2026 - 10:05 AM", status: "Success" },
  { donor: "Deepa Sharma", campaign: "Cancer Treatment Fund", amount: "Rs 1,000", method: "Card", date: "May 21, 2026 - 09:48 AM", status: "Pending" },
];

const donors = [
  { name: "Ravi Kumar", email: "ravi.kumar@email.com", donated: "Rs 50,000", campaigns: 5, last: "May 21, 2026" },
  { name: "Ananya Patel", email: "ananya.patel@email.com", donated: "Rs 35,000", campaigns: 3, last: "May 21, 2026" },
  { name: "Venkat Naidu", email: "venkat.naidu@email.com", donated: "Rs 40,000", campaigns: 4, last: "May 21, 2026" },
  { name: "Sanjay Singh", email: "sanjay.singh@email.com", donated: "Rs 22,500", campaigns: 2, last: "May 21, 2026" },
  { name: "Lakshmi M.", email: "lakshmi@email.com", donated: "Rs 15,000", campaigns: 2, last: "May 21, 2026" },
];

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

const StatCard = ({ icon: Icon, label, value, note, danger }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700">
      <Icon size={18} />
    </div>
    <p className="text-sm font-semibold text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    {note && <p className={`mt-2 text-xs font-semibold ${danger ? "text-red-600" : "text-green-600"}`}>{note}</p>}
  </div>
);

const StatusPill = ({ status }) => {
  const style = status === "Urgent"
    ? "bg-red-50 text-red-700"
    : status === "Pending" || status === "Paused"
      ? "bg-amber-50 text-amber-700"
      : "bg-green-50 text-green-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${style}`}>{status}</span>;
};

const Progress = ({ value }) => (
  <div className="flex items-center gap-3">
    <div className="h-2 w-28 rounded-full bg-slate-100">
      <div className="h-2 rounded-full bg-teal-600" style={{ width: `${value}%` }} />
    </div>
    <span className="w-9 text-xs font-bold text-slate-500">{value}%</span>
  </div>
);

const Toolbar = ({ placeholder, children }) => (
  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <label className="relative w-full md:max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-600" placeholder={placeholder} />
    </label>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

const TableShell = ({ children }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
    <table className="w-full min-w-[900px] border-collapse text-left text-sm">{children}</table>
  </div>
);

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [approvalItems, setApprovalItems] = useState(approvals);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageDraft, setMessageDraft] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [settingsTab, setSettingsTab] = useState("Profile");

  const title = useMemo(() => navItems.find((item) => item.key === activeView)?.label || "Dashboard", [activeView]);

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
    notify(`${campaign} ${action}.`);
  };

  const handleSendMessage = () => {
    if (!messageDraft.trim()) {
      notify("Please type a message before sending.");
      return;
    }
    setSentMessages((messages) => [...messages, { to: selectedConversation.name, text: messageDraft.trim() }]);
    setMessageDraft("");
    notify("Message sent.");
  };

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CircleDollarSign} label="Total Raised" value="Rs 24.8L" note="+12% from last month" />
        <StatCard icon={Home} label="Active Campaigns" value="38" note="+5 new this week" />
        <StatCard icon={Users} label="Total Donors" value="1,247" note="+89 this week" />
        <StatCard icon={BarChart3} label="Success Rate" value="64%" note="-2% from last month" danger />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(340px,0.8fr)_minmax(280px,0.75fr)]">
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
            <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full border-[18px] border-teal-600 bg-white text-center text-xl font-bold text-teal-800">
              38<br /><span className="text-xs font-semibold text-slate-500">Total</span>
            </div>
            <div className="w-full space-y-3 text-sm">
              {["Medical 40%", "Education 22%", "Community 14%", "Others 24%"].map((item) => (
                <div key={item} className="flex justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>{item.split(" ")[0]}</span>
                  <b>{item.split(" ")[1]}</b>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-bold text-slate-900">Live Donations</h2>
          <div className="space-y-4">
            {donations.slice(0, 5).map((item) => (
              <div key={`${item.donor}-${item.date}`} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700">
                    {item.donor.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">{item.donor}</p>
                    <p className="truncate text-xs text-slate-500">{item.date.split(" - ")[1]}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-green-600">{item.amount}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        {renderRecentDonations()}
        {renderApprovals(true)}
      </div>
    </>
  );

  const renderCampaigns = () => (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Toolbar placeholder="Search campaigns...">
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm"><option>All Categories</option></select>
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm"><option>All Status</option></select>
        <button onClick={() => notify("New campaign form will open here.")} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white">+ New Campaign</button>
      </Toolbar>
      <TableShell>
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr><th className="px-4 py-3">Campaign</th><th>Organiser</th><th>Category</th><th>Raised</th><th>Goal</th><th>Progress</th><th>Status</th><th>Deadline</th><th>Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {campaigns.map((item) => (
            <tr key={item.name}><td className="px-4 py-4 font-bold">{item.name}</td><td>{item.organiser}</td><td>{item.category}</td><td>{item.raised}</td><td>{item.goal}</td><td><Progress value={item.progress} /></td><td><StatusPill status={item.status} /></td><td>{item.deadline}</td><td><button onClick={() => notify(`Viewing ${item.name}`)} className="font-bold">...</button></td></tr>
          ))}
        </tbody>
      </TableShell>
    </section>
  );

  const renderDonations = () => (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Toolbar placeholder="Search donations...">
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm"><option>All Campaigns</option></select>
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm"><option>All Methods</option></select>
        <button onClick={() => downloadCsv("donations.csv", donations)} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white">Export</button>
      </Toolbar>
      <TableShell>
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr><th className="px-4 py-3">Donor</th><th>Campaign</th><th>Amount</th><th>Method</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {donations.map((item) => (
            <tr key={`${item.donor}-${item.date}`}><td className="px-4 py-4 font-bold">{item.donor}</td><td>{item.campaign}</td><td>{item.amount}</td><td>{item.method}</td><td>{item.date}</td><td><StatusPill status={item.status} /></td><td><button onClick={() => notify(`Viewing donation from ${item.donor}`)} className="font-bold">...</button></td></tr>
          ))}
        </tbody>
      </TableShell>
    </section>
  );

  const renderDonors = () => (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Toolbar placeholder="Search donors...">
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm"><option>All Donor Types</option></select>
        <button onClick={() => downloadCsv("donors.csv", donors)} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white">Export</button>
      </Toolbar>
      <TableShell>
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr><th className="px-4 py-3">Donor</th><th>Email</th><th>Total Donated</th><th>Campaigns Supported</th><th>Last Donation</th><th>Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {donors.map((item) => (
            <tr key={item.email}><td className="px-4 py-4 font-bold">{item.name}</td><td>{item.email}</td><td>{item.donated}</td><td>{item.campaigns}</td><td>{item.last}</td><td><button onClick={() => notify(`Viewing donor ${item.name}`)} className="font-bold">...</button></td></tr>
          ))}
        </tbody>
      </TableShell>
    </section>
  );

  function renderApprovals(compact = false) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Pending Approvals</h2>
          {compact && <button onClick={() => setActiveView("approvals")} className="text-sm font-bold text-teal-700">View all</button>}
        </div>
        <TableShell>
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Campaign</th><th>Submitted By</th><th>Category</th><th>Goal</th><th>Documents</th><th>Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {approvalItems.map((item) => (
              <tr key={item.campaign}><td className="px-4 py-4 font-bold">{item.campaign}</td><td>{item.by}</td><td>{item.category}</td><td>{item.goal}</td><td>{item.docs}</td><td><button onClick={() => handleApproval(item.campaign, "approved")} className="mr-2 rounded bg-teal-700 px-3 py-1 text-xs font-bold text-white">Approve</button><button onClick={() => handleApproval(item.campaign, "rejected")} className="rounded bg-red-50 px-3 py-1 text-xs font-bold text-red-600">Reject</button></td></tr>
            ))}
            {approvalItems.length === 0 && (
              <tr><td className="px-4 py-6 text-center text-slate-500" colSpan="6">No pending approvals.</td></tr>
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
          {donations.slice(0, 3).map((item) => (
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
        <StatCard icon={CircleDollarSign} label="Total Raised" value="Rs 12,45,000" note="+10%" />
        <StatCard icon={Inbox} label="Total Donations" value="820" note="+18%" />
        <StatCard icon={Users} label="New Donors" value="124" note="+18%" />
        <StatCard icon={BarChart3} label="Success Rate" value="64%" note="-2%" danger />
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
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-5 font-bold">Donations by Category</h2><div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full border-[28px] border-teal-600 text-center font-bold">820<br />Total</div></section>
      </div>
    </>
  );

  const renderMessages = () => (
    <section className="grid min-h-[620px] grid-cols-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[340px_1fr]">
      <aside className="border-r border-slate-200">
        <h2 className="border-b border-slate-200 p-5 font-bold">Conversations</h2>
        {conversations.map((item) => (
          <button onClick={() => setSelectedConversation(item)} key={item.name} className={`flex w-full gap-3 border-b border-slate-100 p-4 text-left ${selectedConversation.name === item.name ? "bg-teal-50" : "hover:bg-slate-50"}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-700">{item.name[0]}</div>
            <span><b className="block text-sm">{item.name}</b><span className="text-xs text-slate-500">{item.subject}</span></span>
          </button>
        ))}
      </aside>
      <div className="flex flex-col">
        <header className="border-b border-slate-200 p-5 font-bold">{selectedConversation.name} - {selectedConversation.subject}</header>
        <div className="flex-1 space-y-4 bg-slate-50 p-6">
          <p className="max-w-md rounded-lg bg-white p-3 text-sm shadow-sm">Hello Admin, I have uploaded all required documents. Please review my campaign.</p>
          <p className="ml-auto max-w-md rounded-lg bg-teal-50 p-3 text-sm text-teal-900 shadow-sm">Hello Meena, we are reviewing your documents. You will get an update soon.</p>
          {sentMessages.filter((message) => message.to === selectedConversation.name).map((message, index) => (
            <p key={`${message.to}-${index}`} className="ml-auto max-w-md rounded-lg bg-teal-700 p-3 text-sm text-white shadow-sm">{message.text}</p>
          ))}
        </div>
        <footer className="flex gap-3 border-t border-slate-200 p-4"><input value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Type a message..." /><button onClick={handleSendMessage} className="rounded-md bg-teal-700 px-4 py-2 text-white">Send</button></footer>
      </div>
    </section>
  );

  const renderSettings = () => (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex gap-6 border-b border-slate-200 text-sm font-bold text-slate-600">
        {["Profile", "Platform Settings", "Security", "Notifications", "Payment Settings"].map((tab) => <button onClick={() => setSettingsTab(tab)} key={tab} className={`pb-3 ${settingsTab === tab ? "border-b-2 border-teal-700 text-teal-700" : ""}`}>{tab}</button>)}
      </div>
      <p className="mb-5 text-sm font-semibold text-slate-500">Current tab: {settingsTab}</p>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-5 font-bold">Admin Profile</h2>
          <div className="mb-5 flex items-center gap-4"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-700 text-2xl font-bold text-white">AD</div><button onClick={() => notify("Photo picker will open here.")} className="text-sm font-bold text-teal-700">Change Photo</button></div>
          {["Full Name", "Email", "Phone Number"].map((label) => <label key={label} className="mb-4 block text-sm font-bold text-slate-600">{label}<input className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 font-normal" /></label>)}
          <button onClick={() => notify("Profile changes saved.")} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white">Save Changes</button>
        </div>
        <div>
          <h2 className="mb-5 font-bold">Change Password</h2>
          {["Current Password", "New Password", "Confirm New Password"].map((label) => <label key={label} className="mb-4 block text-sm font-bold text-slate-600">{label}<input type="password" className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 font-normal" /></label>)}
          <button onClick={() => notify("Password updated.")} className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white">Update Password</button>
        </div>
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
    <main className="min-h-screen bg-slate-50">
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

          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
              <p className="mt-1 text-sm text-slate-500">Manage fundraiser operations from one clean workspace.</p>
            </div>
            {content[activeView]()}
          </div>
        </section>
      </div>
    </main>
  );
}
