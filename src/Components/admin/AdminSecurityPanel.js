import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  KeyRound,
  Lock,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import platformApi from "../../services/platformApi";

const SecurityKpiCard = ({ icon: Icon, label, value, note, tone = "teal" }) => {
  const tones = {
    teal: "from-teal-50 to-white ring-teal-100 text-teal-700",
    blue: "from-blue-50 to-white ring-blue-100 text-blue-700",
    amber: "from-amber-50 to-white ring-amber-100 text-amber-700",
    red: "from-red-50 to-white ring-red-100 text-red-700",
  };

  return (
    <div
      className={`security-kpi-card group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br p-5 shadow-sm ring-1 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${tones[tone]}`}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition group-hover:scale-105">
        <Icon size={20} />
      </div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
      {note && <p className="mt-2 text-xs font-semibold text-slate-600">{note}</p>}
    </div>
  );
};

const AdminSecurityPanel = ({ liveEvents = [] }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    platformApi
      .getSecurityEvents()
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (liveEvents.length > 0) {
      setEvents((prev) => {
        const ids = new Set(liveEvents.map((e) => e.id));
        return [...liveEvents, ...prev.filter((e) => !ids.has(e.id))].slice(0, 30);
      });
    }
  }, [liveEvents]);

  const statusStyle = {
    Success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    Blocked: "bg-red-50 text-red-700 ring-red-200",
    Rotated: "bg-blue-50 text-blue-700 ring-blue-200",
  };

  const failedCount = events.filter((e) => e.status === "Blocked").length;
  const successCount = events.filter((e) => e.status === "Success").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SecurityKpiCard icon={ShieldCheck} label="Secure sessions" value={successCount} note="Successful logins today" tone="teal" />
        <SecurityKpiCard icon={ShieldAlert} label="Blocked attempts" value={failedCount} note="Requires review" tone="red" />
        <SecurityKpiCard icon={UserCheck} label="2FA coverage" value="86%" note="Admin & organiser roles" tone="blue" />
        <SecurityKpiCard icon={KeyRound} label="API keys" value="Rotated" note="Last rotation: May 22" tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { icon: ShieldCheck, title: "Two-factor authentication", desc: "Require 2FA for all admin accounts", action: "Enable", tone: "hover:border-teal-300 hover:bg-teal-50/50" },
          { icon: KeyRound, title: "API access keys", desc: "Manage payment and reporting integrations", action: "Manage keys", tone: "hover:border-blue-300 hover:bg-blue-50/50" },
          { icon: Lock, title: "Session timeout", desc: "Auto logout after 30 minutes of inactivity", action: "Configure", tone: "hover:border-violet-300 hover:bg-violet-50/50" },
        ].map((item) => (
          <div
            key={item.title}
            className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${item.tone}`}
          >
            <item.icon className="text-teal-700 transition group-hover:scale-110" size={22} />
            <p className="mt-3 font-bold text-slate-900">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.desc}</p>
            <button
              type="button"
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-800"
            >
              {item.action}
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="shrink-0 text-amber-600" size={20} />
          <p className="text-sm text-slate-600">
            <span className="font-bold text-slate-800">Browser password alerts</span> come from Google Password Manager when
            using old demo passwords. Use the credentials on the login page — not an application error.
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-900">Activity audit log</h2>
          <p className="text-sm text-slate-500">Login, API, and permission events across the platform</p>
        </div>
        {loading ? (
          <div className="h-48 animate-pulse bg-slate-50" />
        ) : (
          <div className="admin-table overflow-x-auto">
            <table className="w-full min-w-[720px] table-fixed text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                  <th className="w-[18%] px-4 py-3 text-left">Event</th>
                  <th className="w-[24%] px-4 py-3 text-left">User</th>
                  <th className="w-[14%] px-4 py-3 text-left">IP</th>
                  <th className="w-[22%] px-4 py-3 text-left">Device</th>
                  <th className="w-[14%] px-4 py-3 text-left">Time</th>
                  <th className="w-[8%] px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((event) => (
                  <tr key={event.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{event.type}</td>
                    <td className="truncate px-4 py-3.5 text-slate-700" title={event.user}>
                      {event.user}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{event.ip}</td>
                    <td className="truncate px-4 py-3.5 text-slate-600" title={event.device}>
                      {event.device}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">{event.time}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ${statusStyle[event.status] || "bg-slate-100 text-slate-700"}`}>
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminSecurityPanel;
