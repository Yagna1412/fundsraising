import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("username") || "Admin";

  const stats = [
    { label: "Total Raised", value: "Rs 24.8L", note: "+12% from last month", tone: "text-green-600" },
    { label: "Active Campaigns", value: "38", note: "+5 new this week", tone: "text-green-600" },
    { label: "Total Donors", value: "1,247", note: "+89 this week", tone: "text-green-600" },
    { label: "Success Rate", value: "64%", note: "-2% from last month", tone: "text-red-600" },
  ];

  const activeCampaigns = [
    { title: "Heart Surgery for Arjun", organiser: "Meena R.", category: "Medical", goal: "Rs 5,00,000", progress: 82, status: "Active", deadline: "Jun 15" },
    { title: "School Supplies - Nalgonda", organiser: "Suresh K.", category: "Education", goal: "Rs 1,20,000", progress: 43, status: "Active", deadline: "May 30" },
    { title: "Flood Relief - Warangal", organiser: "NGO Sahay", category: "Community", goal: "Rs 10,00,000", progress: 97, status: "Urgent", deadline: "May 22" },
  ];

  const recentDonations = [
    { name: "Ravi Kumar", campaign: "Heart Surgery for Arjun", amount: "+Rs 5,000", time: "2 min ago" },
    { name: "Ananya Patel", campaign: "Flood Relief - Warangal", amount: "+Rs 10,000", time: "14 min ago" },
    { name: "Sanjay Singh", campaign: "School Supplies", amount: "+Rs 2,500", time: "38 min ago" },
  ];

  const navItems = [
    { label: "Dashboard", icon: "▦", path: "/admin", badge: null },
    { label: "Campaigns", icon: "□", path: "/admin/campaigns", badge: null },
    { label: "Donations", icon: "₹", path: "/admin/donations", badge: null },
    { label: "Donors", icon: "◎", path: "/admin/donors", badge: null },
    { label: "Approvals", icon: "✓", path: "/admin/approvals", badge: "3" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-80 shrink-0 border-r border-teal-900/20 bg-teal-950 text-white lg:block">
          <div className="sticky top-0 flex min-h-screen flex-col p-6">
            <div className="mb-8 border-b border-white/10 pb-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-200">Admin Console</p>
              <h2 className="mt-2 text-2xl font-bold">MyFundraiser</h2>
            </div>

            <div className="mb-8 rounded-lg bg-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-teal-400 font-bold text-teal-950">
                  AD
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{adminName}</p>
                  <p className="text-xs text-teal-100">Admin workspace</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-md bg-white/10 px-2 py-3">
                  <p className="text-lg font-bold">38</p>
                  <p className="text-[11px] text-teal-100">Campaigns</p>
                </div>
                <div className="rounded-md bg-white/10 px-2 py-3">
                  <p className="text-lg font-bold">3</p>
                  <p className="text-[11px] text-teal-100">Pending</p>
                </div>
              </div>
            </div>

            <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-teal-200">Manage</p>
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`group flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-bold transition ${
                    item.label === "Dashboard"
                      ? "bg-white text-teal-900 shadow-md"
                      : "text-teal-50 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-md text-base ${
                      item.label === "Dashboard" ? "bg-teal-100 text-teal-800" : "bg-white/10 text-teal-100 group-hover:bg-white/15"
                    }`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs text-white">{item.badge}</span>
                  )}
                </button>
              ))}

            </nav>

            <div className="mb-4 rounded-lg bg-white/10 p-4">
              <p className="text-sm font-bold">System status</p>
              <div className="mt-3 flex items-center justify-between text-xs text-teal-100">
                <span>Backend API</span>
                <span className="rounded-full bg-green-400/20 px-2 py-1 font-bold text-green-200">Online</span>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.clear();
                navigate("/loginSignup");
              }}
              className="w-full rounded-lg border border-red-300/30 bg-red-500/10 px-4 py-3 text-left text-sm font-bold text-red-100 hover:bg-red-500/20"
            >
              Logout
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-6 py-6">
          <header className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Good morning, {adminName}!</h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-500">
                  Welcome back to your fundraiser dashboard. You have 3 pending approvals and 2 campaigns ending this week.
                </p>
              </div>
              <div className="rounded-md bg-teal-50 px-5 py-3 text-left xl:text-right">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Raised today</p>
                <p className="mt-1 text-xl font-bold text-teal-700">Rs 24.8L</p>
              </div>
            </div>
          </header>

          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="min-h-[132px] rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className={`mt-3 text-xs font-semibold ${stat.tone}`}>{stat.note}</p>
              </article>
            ))}
          </section>

          <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-bold text-slate-800">Monthly Fundraising (Rs Lakhs)</h2>
                <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:w-auto">
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>
              <div className="grid h-56 grid-cols-7 items-end gap-3 rounded-lg bg-slate-50 px-5 pb-9 pt-5">
                {[
                  ["Mon", 72],
                  ["Tue", 96],
                  ["Wed", 118],
                  ["Thu", 140],
                  ["Fri", 162],
                  ["Sat", 126],
                  ["Sun", 186],
                ].map(([label, height], index) => (
                  <div key={label} className="relative flex h-full items-end justify-center">
                    <div
                      className={`w-full max-w-14 rounded-t-md ${index === 6 ? "bg-teal-700" : "bg-teal-300"}`}
                      style={{ height: `${height}px` }}
                    />
                    <span className="absolute -bottom-6 text-xs font-semibold text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-base font-bold text-slate-800">Campaign Categories</h2>
              <div className="flex flex-col items-center gap-5 sm:flex-row xl:flex-col 2xl:flex-row">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-teal-700 text-3xl font-bold text-white">
                  38
                </div>
                <div className="w-full space-y-3 text-sm text-slate-700">
                  {[
                    ["Medical", "40%"],
                    ["Education", "22%"],
                    ["Community", "14%"],
                    ["Others", "24%"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                      <span>{label}</span>
                      <span className="font-bold text-slate-500">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <section className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-base font-bold text-slate-800">Active Campaigns</h2>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select className="rounded-md border border-slate-300 px-3 py-2 text-sm">
                  <option>All status</option>
                </select>
                <button className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800">
                  + New
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-500">
                    <th className="px-4 py-3 font-bold">Campaign</th>
                    <th className="px-4 py-3 font-bold">Organiser</th>
                    <th className="px-4 py-3 font-bold">Category</th>
                    <th className="px-4 py-3 font-bold">Goal</th>
                    <th className="px-4 py-3 font-bold">Progress</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold">Deadline</th>
                    <th className="px-4 py-3 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeCampaigns.map((campaign) => (
                    <tr key={campaign.title} className="text-slate-700">
                      <td className="px-4 py-4 font-semibold">{campaign.title}</td>
                      <td className="px-4 py-4">{campaign.organiser}</td>
                      <td className="px-4 py-4">{campaign.category}</td>
                      <td className="px-4 py-4">{campaign.goal}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-36 rounded-full bg-slate-100">
                            <div
                              className="h-3 rounded-full bg-teal-700"
                              style={{ width: `${campaign.progress}%` }}
                            />
                          </div>
                          <span className="w-10 text-xs font-bold text-slate-500">{campaign.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                          campaign.status === "Urgent"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">{campaign.deadline}</td>
                      <td className="px-4 py-4">
                        <button className="rounded-md px-2 py-1 font-bold text-slate-500 hover:bg-slate-100">...</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
              <h2 className="mb-4 text-base font-bold text-slate-800">Live Donations</h2>
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div key={`${donation.name}-${donation.time}`} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-700">
                        {donation.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">{donation.name}</p>
                        <p className="truncate text-xs text-slate-500">{donation.campaign} - {donation.time}</p>
                      </div>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-green-600">{donation.amount}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-slate-800">Pending Approvals</h2>
              <div className="rounded-md bg-slate-50 p-4">
                <p className="font-bold text-slate-800">Dialysis Fund for Deepa</p>
                <p className="mt-1 text-sm text-slate-500">Medical - Goal: Rs 3,00,000</p>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-md bg-teal-700 px-3 py-2 text-sm font-bold text-white">Approve</button>
                  <button className="rounded-md border border-red-200 px-3 py-2 text-sm font-bold text-red-600">Reject</button>
                </div>
              </div>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-slate-800">Top Donors This Month</h2>
              <div className="space-y-3">
                {[
                  ["Ravi Kumar", "Rs 50,000"],
                  ["Venkat Naidu", "Rs 40,000"],
                  ["Ananya Patel", "Rs 35,000"],
                ].map(([name, amount], index) => (
                  <div key={name} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
                    <span className="font-semibold text-slate-700">{index + 1}. {name}</span>
                    <span className="font-bold text-slate-500">{amount}</span>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;
