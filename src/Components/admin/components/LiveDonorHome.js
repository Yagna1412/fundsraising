import React, { useEffect, useMemo, useState } from "react";
import { getInitials, normalizeDonationRow } from "../utils/liveDonorUtils";
import PaymentMethodBadge from "./PaymentMethodBadge";
import LiveDonorShell, { LiveDonorMainRow } from "./LiveDonorShell";

const LiveDonorHome = ({ donations = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const recent = useMemo(
    () => donations.filter((d) => d.donor && d.amount).map(normalizeDonationRow).slice(0, 12),
    [donations]
  );

  const hoverList = recent.slice(0, 5);

  useEffect(() => {
    if (recent.length <= 1) return undefined;
    const timer = setInterval(() => setActiveIndex((i) => (i + 1) % recent.length), 5500);
    return () => clearInterval(timer);
  }, [recent.length]);

  if (recent.length === 0) return null;

  const current = recent[activeIndex % recent.length];

  return (
    <div
      className="pointer-events-auto absolute left-4 top-4 z-50 hidden sm:block"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <LiveDonorShell expanded={expanded} variant="hero" footerHint="Hover to see last 5 donors">
        <LiveDonorMainRow
          initials={getInitials(current.donor)}
          donor={current.donor}
          campaign={current.campaign}
          amountDisplay={current.amountDisplay}
          methodBadge={
            <>
              <PaymentMethodBadge method={current.method} short />
              <span className="text-[10px] text-slate-400">{current.time || current.date}</span>
            </>
          }
        />

        {expanded && hoverList.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-slate-200/70 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Last 5 donors</p>
            {hoverList.map((item, i) => (
              <div
                key={`${item.id || item.donor}-${i}`}
                className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs ${
                  i === activeIndex % hoverList.length ? "bg-teal-50 ring-1 ring-teal-200" : "bg-slate-50/80"
                }`}
              >
                <span className="truncate font-semibold text-slate-800">{item.donor}</span>
                <span className="shrink-0 font-bold text-emerald-700">{item.amountDisplay}</span>
              </div>
            ))}
          </div>
        )}
      </LiveDonorShell>
    </div>
  );
};

export default LiveDonorHome;
