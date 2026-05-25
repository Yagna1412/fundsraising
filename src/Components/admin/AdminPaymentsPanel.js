import React, { useEffect, useMemo, useState } from "react";
import { CircleDollarSign, RefreshCw } from "lucide-react";
import platformApi from "../../services/platformApi";
import {
  PAYMENT_METHOD_IDS,
  getGatewayForMethod,
  normalizePaymentMethod,
} from "../../constants/paymentMethods";
import Pagination from "./components/Pagination";
import PaymentMethodBadge from "./components/PaymentMethodBadge";
import { StatCard } from "./components/ui/AdminUi";

const PAGE_SIZE = 5;

const statusStyle = {
  Settled: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Processing: "bg-amber-50 text-amber-700 ring-amber-200",
  Failed: "bg-red-50 text-red-700 ring-red-200",
};

const normalizePaymentRow = (row) => {
  const method = normalizePaymentMethod(row.method);
  return {
    ...row,
    method,
    gateway: row.gateway || getGatewayForMethod(method),
  };
};

const AdminPaymentsPanel = ({ livePayments = [], onSimulate }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const loadPayments = () => {
    setLoading(true);
    platformApi
      .getPayments()
      .then((data) => setPayments((data.payments || []).map(normalizePaymentRow)))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    if (!livePayments?.length) return;
    setPayments((list) => {
      const merged = [...livePayments.map(normalizePaymentRow), ...list];
      const seen = new Set();
      return merged.filter((p) => {
        const key = p.id || `${p.donor}-${p.amount}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    });
  }, [livePayments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchMethod = methodFilter === "all" || p.method === methodFilter;
      const matchSearch =
        !q ||
        [p.id, p.donor, p.campaign, p.method, p.gateway].some((f) => String(f || "").toLowerCase().includes(q));
      return matchStatus && matchMethod && matchSearch;
    });
  }, [payments, search, statusFilter, methodFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const settledTotal = payments.filter((p) => p.status === "Settled").reduce((s, p) => s + Number(p.amount || 0), 0);
  const processingCount = payments.filter((p) => p.status === "Processing").length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Payments & settlements</h2>
          <p className="text-sm text-slate-500">5 records per page · UPI, Card, Net Banking, Wallet</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadPayments}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          {onSimulate ? (
            <button
              type="button"
              onClick={onSimulate}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800"
            >
              Simulate live payment
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard icon={CircleDollarSign} label="Settled volume" value={`Rs ${settledTotal.toLocaleString("en-IN")}`} note="Successful settlements" tone="teal" />
        <StatCard icon={CircleDollarSign} label="All transactions" value={payments.length} note={`${processingCount} processing`} tone="blue" />
        <StatCard icon={CircleDollarSign} label="Failed" value={payments.filter((p) => p.status === "Failed").length} note="Requires follow-up" danger tone="amber" />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search donor, campaign, ID..."
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />
          <select
            value={methodFilter}
            onChange={(e) => {
              setMethodFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            <option value="all">All payment methods</option>
            {PAYMENT_METHOD_IDS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            <option value="all">All statuses</option>
            <option value="Settled">Settled</option>
            <option value="Processing">Processing</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="admin-table overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Payment ID</th>
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Gateway</th>
                <th className="px-4 py-3">Settlement</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={9} className="px-4 py-4">
                      <div className="h-8 animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-500">
                    No payment records match your filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-slate-700">{row.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{row.donor}</td>
                    <td className="max-w-[200px] px-4 py-3 text-slate-600">{row.campaign}</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">Rs {Number(row.amount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <PaymentMethodBadge method={row.method} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.gateway}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{row.settlementId || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusStyle[row.status] || "bg-slate-100 text-slate-600 ring-slate-200"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          label="payments"
        />
      </section>
    </div>
  );
};

export default AdminPaymentsPanel;
