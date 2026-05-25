import React from "react";
import { Search } from "lucide-react";
import { actionStyles, statusMeters, statusStyles } from "../../data/adminSeedData";

export const StatCard = ({ icon: Icon, label, value, note, danger, tone = "teal" }) => {
  const tones = {
    teal: "bg-teal-500/15 text-teal-800 ring-teal-200/60",
    blue: "bg-blue-500/15 text-blue-800 ring-blue-200/60",
    violet: "bg-violet-500/15 text-violet-800 ring-violet-200/60",
    amber: "bg-amber-500/15 text-amber-800 ring-amber-200/60",
  };
  return (
    <div className="kpi-card group rounded-2xl border border-white/80 bg-white/50 p-5 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-teal-300/80 hover:bg-white/75 hover:shadow-lg">
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ring-1 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105 ${tones[tone]}`}
      >
        <Icon size={18} />
      </div>
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
      {note && (
        <p className={`mt-2 text-xs font-semibold ${danger ? "text-red-600" : "text-emerald-600"}`}>{note}</p>
      )}
    </div>
  );
};

export const StatusPill = ({ status }) => {
  const style = statusStyles[status] || "bg-slate-100 text-slate-700 ring-slate-200";
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${style}`}>{status}</span>;
};

export const StatusCell = ({ status, meterValue }) => {
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

export const ActionButton = ({ children, icon: Icon, tone = "neutral", className = "", ...props }) => (
  <button
    type="button"
    {...props}
    className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-bold ${actionStyles[tone]} ${className}`}
  >
    {Icon && <Icon size={13} />}
    {children}
  </button>
);

export const Progress = ({ value = 0 }) => {
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

export const Toolbar = ({ placeholder, searchValue = "", onSearchChange, children }) => (
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
    <div className="flex flex-wrap items-center gap-2">{children}</div>
  </div>
);

export const FilterSelect = ({ label, value, onChange, options = [] }) => (
  <select
    aria-label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

export const TableShell = ({ children, minWidth = 960 }) => (
  <div className="admin-table-wrap overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
    <table className="admin-table w-full text-sm" style={{ minWidth }}>
      {children}
    </table>
  </div>
);

export const TableHead = ({ children }) => <thead className="bg-slate-50 text-left text-xs uppercase">{children}</thead>;
export const Th = ({ children, className = "" }) => (
  <th className={`px-4 py-3 font-bold ${className}`}>{children}</th>
);
export const Td = ({ children, className = "", wrap }) => (
  <td className={`px-4 py-3 align-top ${wrap ? "max-w-[220px]" : ""} ${className}`}>{children}</td>
);

export const TextCell = ({ primary, secondary, title }) => (
  <div className="min-w-0" title={title || primary}>
    <p className="truncate font-semibold text-slate-900">{primary}</p>
    {secondary && <p className="truncate text-xs text-slate-500">{secondary}</p>}
  </div>
);

export const IdBadge = ({ value }) => (
  <span className="inline-block rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] font-bold text-slate-700">{value}</span>
);

export const Modal = ({ open, title, onClose, children, wide }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl ${
          wide ? "max-w-4xl" : "max-w-lg"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100">
            Close
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
