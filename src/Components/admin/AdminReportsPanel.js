import React, { useEffect, useState } from "react";
import { BarChart3, CircleDollarSign, Download, Inbox } from "lucide-react";
import platformApi from "../../services/platformApi";

const StatCard = ({ icon: Icon, label, value, note, tone = "teal" }) => {
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
      {note && <p className="mt-2 text-xs font-semibold text-green-600">{note}</p>}
    </div>
  );
};

const AdminReportsPanel = ({ onExport }) => {
  const [period, setPeriod] = useState("monthly");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    platformApi
      .getReports(period)
      .then((data) => {
        if (active) setReport(data);
      })
      .catch(() => {
        if (active) setError("Could not load reports. Run npm run server for live data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [period]);

  const maxRaised = report ? Math.max(...report.raised, 1) : 1;

  const formatRs = (n) => `Rs ${Number(n).toLocaleString("en-IN")}`;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl bg-slate-100 p-1">
          {[
            { key: "daily", label: "Daily" },
            { key: "weekly", label: "Weekly" },
            { key: "monthly", label: "Monthly" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setPeriod(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                period === tab.key ? "bg-teal-800 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {period === "daily" ? "Last 7 days" : period === "weekly" ? "Last 8 weeks" : "Last 6 months"}
        </span>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CircleDollarSign}
          label={`${period.charAt(0).toUpperCase() + period.slice(1)} Raised`}
          value={report ? formatRs(report.summary.totalRaised) : "—"}
          note={report ? `+${report.summary.growth}% growth` : ""}
          tone="teal"
        />
        <StatCard
          icon={Inbox}
          label="Donations"
          value={report ? String(report.summary.totalDonations) : "—"}
          note={report ? `Avg ${formatRs(report.summary.avgDonation)}` : ""}
          tone="blue"
        />
        <StatCard icon={BarChart3} label="Data Points" value={report ? String(report.labels.length) : "—"} tone="violet" />
        <StatCard icon={BarChart3} label="Period" value={period.toUpperCase()} tone="amber" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Fundraising — {period} view</h2>
            <button
              type="button"
              onClick={() =>
                onExport?.(
                  `${period}_report.csv`,
                  (report?.labels || []).map((label, i) => ({
                    period: label,
                    raised: report.raised[i],
                    donations: report.donations[i],
                  }))
                )
              }
              className="inline-flex items-center gap-1 rounded-md bg-teal-700 px-3 py-2 text-xs font-bold text-white hover:bg-teal-800"
            >
              <Download size={14} /> Export
            </button>
          </div>
          {loading ? (
            <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
          ) : (
            <div className="relative h-64 rounded-lg bg-slate-50 px-4 pb-10 pt-6">
              <div className="relative z-10 grid h-full gap-3" style={{ gridTemplateColumns: `repeat(${report?.labels.length || 1}, minmax(0, 1fr))` }}>
                {(report?.raised || []).map((amount, index) => (
                  <div key={`${report.labels[index]}-${amount}`} className="relative flex h-full items-end justify-center">
                    <div
                      className={`w-full max-w-12 rounded-t-md ${index === report.raised.length - 1 ? "bg-teal-700" : "bg-teal-300"}`}
                      style={{ height: `${Math.max(12, (amount / maxRaised) * 100)}%` }}
                    />
                    <span className="absolute -bottom-7 text-[10px] font-semibold text-slate-500">{report.labels[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 font-bold text-slate-900">Donation volume</h2>
          {loading ? (
            <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
          ) : (
            <div className="space-y-3">
              {(report?.labels || []).map((label, index) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-xs font-bold text-slate-500">{label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-violet-500"
                      style={{
                        width: `${Math.max(8, (report.donations[index] / Math.max(...report.donations, 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-bold text-slate-700">{report.donations[index]}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default AdminReportsPanel;
