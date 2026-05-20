import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("username") || "Admin";

  const stats = {
    totalRaised: "₹24.8L",
    activeCampaigns: 38,
    totalDonors: 1247,
    successRate: "64%",
  };

  const activeCampaigns = [
    { title: "Heart Surgery for Arjun", organiser: "Meena R.", category: "Medical", goal: "₹5,00,000", progress: 82, status: "Active", deadline: "Jun 15" },
    { title: "School Supplies — Nalgonda", organiser: "Suresh K.", category: "Education", goal: "₹1,20,000", progress: 43, status: "Active", deadline: "May 30" },
    { title: "Flood Relief — Warangal", organiser: "NGO Sahay", category: "Community", goal: "₹10,00,000", progress: 97, status: "Urgent", deadline: "May 22" },
  ];

  const recentDonations = [
    { name: "Ravi Kumar", campaign: "Heart Surgery for Arjun", amount: "+₹5,000", time: "2 min ago" },
    { name: "Ananya Patel", campaign: "Flood Relief — Warangal", amount: "+₹10,000", time: "14 min ago" },
    { name: "Sanjay Singh", campaign: "School Supplies", amount: "+₹2,500", time: "38 min ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left sidebar */}
        <aside className="w-64 bg-white h-screen border-r">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">AD</div>
              <div>
                <div className="text-sm font-semibold">Good morning, {adminName}!</div>
                <div className="text-xs text-gray-500">Welcome back to your fundraiser dashboard.</div>
              </div>
            </div>

            <nav className="space-y-2">
              <button onClick={() => navigate('/admin')} className="w-full text-left px-3 py-2 rounded-lg bg-teal-50 text-teal-700 font-semibold">Dashboard</button>
              <button onClick={() => navigate('/admin/campaigns')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">Campaigns</button>
              <button onClick={() => navigate('/admin/donations')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">Donations</button>
              <button onClick={() => navigate('/admin/donors')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">Donors</button>
              <button onClick={() => navigate('/admin/approvals')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex justify-between items-center">Approvals <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded-full">3</span></button>
              <button onClick={() => { localStorage.clear(); navigate('/loginSignup'); }} className="w-full text-left px-3 py-2 mt-6 rounded-lg text-red-600 hover:bg-red-50">Logout</button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <header className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Good morning, {adminName}! 👋</h1>
              <p className="text-sm text-gray-500">Welcome back to your fundraiser dashboard. You have 3 pending approvals and 2 campaigns ending this week.</p>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">Raised today</div>
              <div className="text-lg font-bold text-teal-700">{stats.totalRaised}</div>
            </div>
          </header>

          {/* Top summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 shadow">
              <div className="text-sm text-gray-500">Total Raised</div>
              <div className="text-xl font-bold mt-2">{stats.totalRaised}</div>
              <div className="text-xs text-green-500 mt-1">↑ 12% from last month</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow">
              <div className="text-sm text-gray-500">Active Campaigns</div>
              <div className="text-xl font-bold mt-2">{stats.activeCampaigns}</div>
              <div className="text-xs text-green-500 mt-1">+5 new this week</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow">
              <div className="text-sm text-gray-500">Total Donors</div>
              <div className="text-xl font-bold mt-2">{stats.totalDonors}</div>
              <div className="text-xs text-green-500 mt-1">+89 this week</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow">
              <div className="text-sm text-gray-500">Success Rate</div>
              <div className="text-xl font-bold mt-2">{stats.successRate}</div>
              <div className="text-xs text-red-500 mt-1">-2% from last month</div>
            </div>
          </div>

          {/* Charts + campaign list */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Monthly Fundraising (₹ Lakhs)</h3>
                <select className="text-sm border px-2 py-1 rounded">
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>
              <div className="h-40 bg-gradient-to-r from-teal-50 to-white rounded flex items-end gap-2 p-4">
                <div className="flex-1 h-6 bg-teal-300 rounded" style={{height: '32%'}}></div>
                <div className="flex-1 h-8 bg-teal-300 rounded" style={{height: '45%'}}></div>
                <div className="flex-1 h-10 bg-teal-300 rounded" style={{height: '55%'}}></div>
                <div className="flex-1 h-12 bg-teal-300 rounded" style={{height: '65%'}}></div>
                <div className="flex-1 h-14 bg-teal-600 rounded" style={{height: '75%'}}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <h3 className="font-semibold text-gray-700 mb-4">Campaign Categories</h3>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-400 to-blue-400 flex items-center justify-center text-white font-bold">38</div>
                <div>
                  <div className="text-sm">Medical <span className="text-gray-500">40%</span></div>
                  <div className="text-sm">Education <span className="text-gray-500">22%</span></div>
                  <div className="text-sm">Community <span className="text-gray-500">14%</span></div>
                  <div className="text-sm">Others <span className="text-gray-500">24%</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Active campaigns table */}
          <div className="bg-white rounded-xl p-6 shadow mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Active Campaigns</h3>
              <div className="flex items-center gap-2">
                <select className="text-sm border px-2 py-1 rounded">
                  <option>All status</option>
                </select>
                <button className="bg-teal-600 text-white px-3 py-1 rounded">+ New</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-500 border-b">
                    <th className="py-3">Campaign</th>
                    <th className="py-3">Organiser</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Goal</th>
                    <th className="py-3">Progress</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Deadline</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCampaigns.map((c, i) => (
                    <tr key={i} className="border-b text-sm text-gray-700">
                      <td className="py-3">{c.title}</td>
                      <td className="py-3">{c.organiser}</td>
                      <td className="py-3">{c.category}</td>
                      <td className="py-3">{c.goal}</td>
                      <td className="py-3">
                        <div className="w-36 bg-gray-100 rounded-full h-3">
                          <div className={`h-3 rounded-full`} style={{ width: `${c.progress}%`, background: c.progress > 70 ? '#059669' : (c.progress > 40 ? '#f59e0b' : '#ef4444') }}></div>
                        </div>
                      </td>
                      <td className="py-3">{c.status}</td>
                      <td className="py-3">{c.deadline}</td>
                      <td className="py-3">•••</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Right sidebar */}
        <aside className="w-80 p-6">
          <div className="bg-white rounded-xl p-4 shadow mb-4">
            <h4 className="font-semibold text-gray-700 mb-3">Live Donations</h4>
            <div className="space-y-3">
              {recentDonations.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold">{d.name.split(' ').map(n => n[0]).slice(0,2).join('')}</div>
                    <div>
                      <div className="text-sm font-semibold">{d.name}</div>
                      <div className="text-xs text-gray-500">{d.campaign} • {d.time}</div>
                    </div>
                  </div>
                  <div className="text-sm text-green-600 font-semibold">{d.amount}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow mb-4">
            <h4 className="font-semibold text-gray-700 mb-3">Pending Approvals</h4>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Dialysis Fund for Deepa</div>
                  <div className="text-xs text-gray-500">Medical • Goal: ₹3,00,000</div>
                </div>
                <div className="flex gap-2">
                  <button className="text-white bg-teal-600 px-3 py-1 rounded">Approve</button>
                  <button className="text-red-600 px-3 py-1 rounded border">Reject</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow">
            <h4 className="font-semibold text-gray-700 mb-3">Top Donors This Month</h4>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
              <li className="flex justify-between"><span>Ravi Kumar</span><span className="text-gray-500">₹50,000</span></li>
              <li className="flex justify-between"><span>Venkat Naidu</span><span className="text-gray-500">₹40,000</span></li>
              <li className="flex justify-between"><span>Ananya Patel</span><span className="text-gray-500">₹35,000</span></li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
