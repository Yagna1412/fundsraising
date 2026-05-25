import React, { useEffect, useMemo, useState } from "react";
import { Crown, Heart } from "lucide-react";
import platformApi from "../../../services/platformApi";
import { buildDonorRankings, formatRupee, getInitials, normalizeDonationRow } from "../utils/liveDonorUtils";
import PaymentMethodBadge from "./PaymentMethodBadge";

/** In-flow live donor strip — does not overlap KPIs or charts. */
const LiveDonorAdmin = ({ donations = [] }) => {
  const [payments, setPayments] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [rankIndex, setRankIndex] = useState(0);

  useEffect(() => {
    platformApi
      .getPayments()
      .then((data) => setPayments(data.payments || []))
      .catch(() => setPayments([]));
  }, [donations.length]);

  const rankings = useMemo(() => buildDonorRankings(donations, payments), [donations, payments]);

  useEffect(() => {
    if (rankings.length <= 1) return undefined;
    const timer = setInterval(() => setRankIndex((i) => (i + 1) % Math.min(rankings.length, 5)), 7000);
    return () => clearInterval(timer);
  }, [rankings.length]);

  if (rankings.length === 0) return null;

  const profile = rankings[rankIndex % rankings.length];
  const last = profile.lastDonation
    ? normalizeDonationRow({
        donor: profile.donor,
        campaign: profile.lastDonation.campaign,
        amount: profile.lastDonation.amount,
        method: profile.lastDonation.method,
        time: profile.lastDonation.time,
        date: profile.lastDonation.date,
      })
    : null;

  const history = profile.transactions.slice(0, 5);
  const priorityBadge =
    profile.rank === 1 ? (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-400/90 px-2 py-0.5 text-[10px] font-bold text-amber-950">
        <Crown size={10} /> Top donor
      </span>
    ) : (
      <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800">#{profile.rank}</span>
    );

  return (
    <div
      className="live-donor-bar w-full overflow-hidden rounded-xl border border-teal-200/50 bg-white/55 shadow-sm backdrop-blur-md transition-shadow duration-200 hover:border-teal-300/70 hover:shadow-md"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:gap-4">
        <div className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-800 px-2.5 py-1.5">
          <Heart size={12} className="text-teal-100" fill="currentColor" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-white">Live donor</span>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-800 text-xs font-bold text-white shadow-inner">
          {getInitials(profile.donor)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900">{profile.donor}</p>
          <p className="truncate text-xs text-slate-600">
            {last?.campaign || "Priority supporter"} · {formatRupee(profile.total)} lifetime
          </p>
        </div>

        {last && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            <PaymentMethodBadge method={last.method} short />
            <p className="text-base font-black text-emerald-700">{last.amountDisplay}</p>
          </div>
        )}

        <div className="flex w-full shrink-0 items-center justify-between gap-2 sm:w-auto sm:justify-end">
          {priorityBadge}
          <span className="text-[10px] font-medium text-slate-500">{expanded ? "History open" : "Hover for history"}</span>
        </div>
      </div>

      {expanded && history.length > 0 && (
        <div className="border-t border-slate-200/70 bg-white/40 px-4 py-3 backdrop-blur-sm">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">Recent payments</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((tx, i) => (
              <div
                key={`${tx.id}-${i}`}
                className={`rounded-lg px-2.5 py-2 text-xs ${i === 0 ? "bg-teal-50/90 ring-1 ring-teal-200" : "bg-white/80"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold text-slate-800">{tx.campaign}</span>
                  <span className="shrink-0 font-bold text-emerald-700">{tx.amount}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <PaymentMethodBadge method={tx.method} short />
                  <span className="text-[10px] text-slate-400">{tx.date || tx.time || "—"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveDonorAdmin;
