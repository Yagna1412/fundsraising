import React, { useEffect, useMemo, useState } from "react";
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

/** Professional vertical column chart for donation counts */
const DonationVolumeChart = ({ labels = [], donations = [] }) => {
  const maxValue = Math.max(...donations.map(Number), 1);
  const yTicks = useMemo(() => {
    const top = Math.ceil(maxValue);
    const step = Math.max(1, Math.ceil(top / 4));
    const ticks = [];
    for (let v = top; v >= 0; v -= step) ticks.push(v);
    if (ticks[ticks.length - 1] !== 0) ticks.push(0);
    return ticks;
  }, [maxValue]);

  const total = donations.reduce((sum, n) => sum + Number(n || 0), 0);
  const peakIndex = donations.reduce(
    (best, n, i) => (Number(n) > Number(donations[best] || 0) ? i : best),
    0
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
        <span>
          Total <span className="font-bold text-slate-800">{total}</span> donations
        </span>
        {labels[peakIndex] != null && (
          <span>
            Peak <span className="font-bold text-violet-700">{labels[peakIndex]}</span>
            {" · "}
            <span className="font-bold text-slate-800">{donations[peakIndex]}</span>
          </span>
        )}
      </div>

      <div className="relative h-64 rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white px-3 pb-8 pt-4 sm:px-4">
        {/* Y-axis grid */}
        <div className="pointer-events-none absolute inset-x-3 bottom-8 top-4 flex flex-col justify-between sm:inset-x-4">
          {yTicks.map((tick) => (
            <div key={tick} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-right text-[10px] font-bold text-slate-400">{tick}</span>
              <div className="h-px flex-1 border-t border-dashed border-slate-200" />
            </div>
          ))}
        </div>

        {/* Bars */}
        <div
          className="relative z-10 ml-7 flex h-full items-end gap-2 sm:gap-3"
          style={{ height: "calc(100% - 0.5rem)" }}
        >
          {labels.map((label, index) => {
            const value = Number(donations[index] || 0);
            const heightPct = Math.max(value === 0 ? 0 : 6, (value / maxValue) * 100);
            const isPeak = index === peakIndex && value > 0;

            return (
              <div key={`${label}-${index}`} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end">
                <span
                  className={`mb-1 text-[10px] font-bold transition ${
                    isPeak ? "text-violet-700" : "text-slate-500 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {value}
                </span>
                <div
                  className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 ${
                    isPeak
                      ? "bg-gradient-to-t from-violet-700 to-violet-400 shadow-md shadow-violet-200"
                      : "bg-gradient-to-t from-violet-500 to-violet-300 group-hover:from-violet-600 group-hover:to-violet-400"
                  }`}
                  style={{ height: `${heightPct}%`, minHeight: value > 0 ? "8px" : "0px" }}
                  title={`${label}: ${value} donations`}
                />
                <span className="mt-2 max-w-full truncate text-[10px] font-bold text-slate-500">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
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
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Donation volume</h2>
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700">
              Count by period
            </span>
          </div>
          <p className="mb-5 text-xs font-semibold text-slate-500">
            Number of donations received in each period
          </p>
          {loading ? (
            <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
          ) : (
            <DonationVolumeChart
              labels={report?.labels || []}
              donations={report?.donations || []}
            />
          )}
        </section>
      </div>
    </>
  );
};

export default AdminReportsPanel;
