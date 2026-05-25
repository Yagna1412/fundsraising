import React from "react";

/** Subtle live indicator — no infrastructure names shown in the UI */
const LiveSyncBadge = ({ active }) => {
  if (!active) return null;

  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200/80">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
      </span>
      Live data sync enabled
    </div>
  );
};

export default LiveSyncBadge;
