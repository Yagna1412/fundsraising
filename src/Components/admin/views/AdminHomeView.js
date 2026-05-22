import React from "react";
import { BarChart3, CircleDollarSign, Home, Users } from "lucide-react";
import LiveDonorAdmin from "../components/LiveDonorAdmin";
import LiveSyncBadge from "../LiveSyncBadge";
import { categoryStats } from "../data/adminSeedData";
import { StatCard } from "../components/ui/AdminUi";

const panelClass =
  "dashboard-panel rounded-2xl border border-white/70 bg-white/55 p-5 shadow-sm backdrop-blur-md";

const AdminHomeView = ({
  donationsState,
  userStats,
  liveSyncActive,
  renderPendingApprovals,
}) => (
  <div className="dashboard-home-wrap w-full min-w-0 space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Overview</h2>
        <p className="text-xs text-slate-500">Platform snapshot</p>
      </div>
      <LiveSyncBadge active={liveSyncActive} />
    </div>

    <LiveDonorAdmin donations={donationsState} />

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={CircleDollarSign} label="Total Raised" value="Rs 24.8L" note="+12% from last month" tone="teal" />
      <StatCard icon={Home} label="Active Campaigns" value="38" note="+5 new this week" tone="blue" />
      <StatCard icon={Users} label="Total Users" value="1,247" note={`${userStats.active} active in this list`} tone="violet" />
      <StatCard icon={BarChart3} label="Success Rate" value="64%" note="-2% from last month" danger tone="amber" />
    </div>

    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <section className={`${panelClass} xl:col-span-8`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold text-slate-900">Monthly Fundraising (Rs Lakhs)</h2>
          <select className="rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 backdrop-blur-sm">
            <option>This Month</option>
            <option>Last Month</option>
          </select>
        </div>
        <div className="grid h-56 grid-cols-6 items-end gap-3 rounded-xl bg-slate-50/80 px-4 pb-8 pt-4">
          {[3.2, 2.9, 4.2, 3.7, 4.8, 6.0].map((amount, index) => (
            <div key={amount} className="relative flex h-full items-end justify-center">
              <div
                className={`w-full max-w-12 rounded-t-md ${index === 5 ? "bg-teal-700" : "bg-teal-300/90"}`}
                style={{ height: `${amount * 30}px` }}
              />
              <span className="absolute -bottom-6 text-[10px] font-semibold text-slate-500 sm:text-xs">
                {["Dec", "Jan", "Feb", "Mar", "Apr", "May"][index]}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={`${panelClass} xl:col-span-4`}>
        <h2 className="mb-4 font-bold text-slate-900">Campaign Categories</h2>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div
            className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
            style={{
              background:
                "conic-gradient(#0f766e 0 40%, #2563eb 40% 62%, #7c3aed 62% 76%, #ea580c 76% 100%)",
            }}
          >
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white/90 text-base font-bold text-teal-800 shadow-inner backdrop-blur-sm">
              38<span className="ml-0.5 text-[10px] font-semibold text-slate-500">Total</span>
            </div>
          </div>
          <div className="w-full space-y-2 text-sm">
            {categoryStats.map((item) => (
              <div key={item.name} className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 ${item.bg}`}>
                <span className="flex items-center gap-2 font-semibold text-slate-800">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <b className={item.text}>{item.value}%</b>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>

    {renderPendingApprovals()}
  </div>
);

export default AdminHomeView;
