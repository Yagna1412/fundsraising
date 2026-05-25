import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, ChevronRight, FileText, X } from "lucide-react";
import Pagination from "./Pagination";

const DASHBOARD_PAGE_SIZE = 3;
const FULL_PAGE_SIZE = 5;

const ApprovalCard = ({ item, onApprove, onReject, onViewDocs, showDocs, compact }) => (
  <article
    className={`rounded-xl border border-white/80 bg-white/60 shadow-sm backdrop-blur-sm transition hover:border-teal-200/80 hover:bg-white/80 hover:shadow-md ${
      compact ? "p-3" : "p-4"
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] font-bold text-slate-400">{item.id}</p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-slate-900">{item.campaign}</h3>
        <p className="mt-1 text-xs text-slate-500">
          {item.by} · {item.category}
        </p>
      </div>
      <p className="shrink-0 text-sm font-black text-teal-800">{item.goal}</p>
    </div>
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onApprove?.(item.campaign)}
        className="inline-flex items-center gap-1 rounded-md bg-teal-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-teal-800"
      >
        <CheckCircle size={11} />
        Approve
      </button>
      <button
        type="button"
        onClick={() => onReject?.(item.campaign)}
        className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50/90 px-2.5 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"
      >
        <X size={11} />
        Reject
      </button>
      {showDocs && (
        <button
          type="button"
          onClick={() => onViewDocs?.(item.campaign)}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-white/70 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-white"
        >
          <FileText size={11} />
          Docs
        </button>
      )}
    </div>
  </article>
);

const panelShell = "dashboard-panel w-full rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur-md sm:p-5";

const AdminPendingApprovalsPanel = ({ items = [], onViewAll, onApprove, onReject, onViewDocs }) => (
  <section className={panelShell}>
    <PendingApprovalsContent
      items={items}
      onViewAll={onViewAll}
      onApprove={onApprove}
      onReject={onReject}
      pageSize={DASHBOARD_PAGE_SIZE}
      compact
    />
  </section>
);

export const PendingApprovalsFull = ({ items = [], onApprove, onReject, onViewDocs }) => (
  <section className={panelShell}>
    <PendingApprovalsContent
      items={items}
      onApprove={onApprove}
      onReject={onReject}
      onViewDocs={onViewDocs}
      pageSize={FULL_PAGE_SIZE}
      showDocs
    />
  </section>
);

function PendingApprovalsContent({
  items,
  onViewAll,
  onApprove,
  onReject,
  onViewDocs,
  compact = false,
  showDocs = false,
  pageSize = DASHBOARD_PAGE_SIZE,
}) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [items.length]);

  const gridClass = compact
    ? "grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
    : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3";

  return (
    <>
      <div className={`flex items-center justify-between gap-3 ${compact ? "mb-3" : "mb-4"}`}>
        <div>
          <h2 className={`font-bold text-slate-900 ${compact ? "text-base" : "text-lg"}`}>Pending approvals</h2>
          <p className="text-xs text-slate-500">{items.length} awaiting review</p>
        </div>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            View all
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      <div className={gridClass}>
        {pageItems.map((item) => (
          <ApprovalCard
            key={item.id || item.campaign}
            item={item}
            compact={compact}
            onApprove={onApprove}
            onReject={onReject}
            onViewDocs={onViewDocs}
            showDocs={showDocs}
          />
        ))}
        {items.length === 0 && (
          <p className="col-span-full rounded-xl bg-white/50 py-10 text-center text-sm text-slate-500">
            All caught up — no pending items.
          </p>
        )}
      </div>

      {items.length > pageSize && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={items.length}
          pageSize={pageSize}
          onPageChange={setPage}
          label="approvals"
        />
      )}
    </>
  );
}

export default AdminPendingApprovalsPanel;
