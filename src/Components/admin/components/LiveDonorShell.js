import React from "react";
import { Heart } from "lucide-react";

/** Shared width — home & admin live donor cards (280px). */
export const LIVE_DONOR_CARD_WIDTH = "w-full max-w-[280px]";

const VARIANT_STYLES = {
  hero: {
    shell: "border-white/60 bg-white/60 shadow-lg backdrop-blur-md",
    shellExpanded: "bg-white/85 shadow-2xl ring-2 ring-teal-200/90",
    float: "animate-live-float",
    header: "border-white/40 bg-teal-800/90",
  },
  admin: {
    shell: "border-slate-200 bg-white shadow-md",
    shellExpanded: "shadow-lg ring-2 ring-teal-100",
    float: "",
    header: "border-slate-100 bg-teal-800",
  },
};

const LiveDonorShell = ({ expanded, headerExtra, children, footerHint, variant = "hero" }) => {
  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.hero;

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${LIVE_DONOR_CARD_WIDTH} ${v.shell} ${
        expanded ? v.shellExpanded : v.float
      }`}
    >
      <div className={`flex items-center gap-2 border-b px-3 py-2 ${v.header}`}>
        <Heart size={13} className="text-teal-100" fill="currentColor" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-white">Live donor</span>
        {headerExtra}
        <span className="relative ml-auto flex h-2 w-2">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
      </div>
      <div className="p-3">
        {children}
        {footerHint && !expanded && (
          <p className="mt-2 text-center text-[10px] font-medium text-slate-500">{footerHint}</p>
        )}
      </div>
    </div>
  );
};

export const LiveDonorMainRow = ({ donor, campaign, methodBadge, amountDisplay, initials }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-800 text-xs font-bold text-white shadow-inner">
      {initials}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-bold text-slate-900">{donor}</p>
      <p className="truncate text-[11px] text-slate-600">{campaign}</p>
      <div className="mt-1 flex flex-wrap items-center gap-1.5">{methodBadge}</div>
    </div>
    <p className="shrink-0 text-sm font-black text-emerald-700">{amountDisplay}</p>
  </div>
);

export default LiveDonorShell;
