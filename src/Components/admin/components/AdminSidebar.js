import React from "react";
import { LogOut, ShieldCheck } from "lucide-react";

const AdminSidebar = ({ navItems, activeView, onNavigate, onLogout, onUpgrade }) => (
  <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 text-white md:flex">
    <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
      <ShieldCheck size={18} className="text-teal-300" />
      <span className="text-sm font-bold tracking-wide">MyFundraiser</span>
    </div>

    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activeView === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-bold transition ${
              active ? "bg-teal-700 text-white shadow-md" : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon size={16} />
              {item.label}
            </span>
            {item.badge ? (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>
            ) : null}
          </button>
        );
      })}
    </nav>

    <div className="space-y-2 border-t border-white/10 p-3">
      <div className="rounded-xl bg-teal-900/60 p-4 ring-1 ring-white/10">
        <p className="text-sm font-bold text-white">Upgrade to Pro</p>
        <p className="mt-1 text-xs leading-relaxed text-teal-100">Advanced reports and team tools.</p>
        <button
          type="button"
          onClick={onUpgrade}
          className="mt-3 w-full rounded-lg bg-white px-3 py-2 text-xs font-bold text-teal-900 transition hover:bg-teal-50"
        >
          Upgrade Now
        </button>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-400/40 bg-red-950/50 px-3 py-2.5 text-sm font-bold text-red-100 transition hover:bg-red-900/60 hover:text-white"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  </aside>
);

export default AdminSidebar;
