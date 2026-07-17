import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  KeyRound,
  Lock,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";
import platformApi from "../../services/platformApi";
import Pagination from "./components/Pagination";

const PAGE_SIZE = 5;
const KEYS_STORAGE = "myfundraiser_api_keys";

const DEFAULT_KEYS = [
  {
    id: "key_live_pay",
    name: "Payments gateway",
    prefix: "mf_live_",
    secret: "mf_live_8f3a2c91d4e7b6a0",
    createdAt: "2026-05-22",
    lastUsed: "2026-07-17",
    status: "Active",
  },
  {
    id: "key_live_rpt",
    name: "Reports export",
    prefix: "mf_rpt_",
    secret: "mf_rpt_c1e9d82b7a450f33",
    createdAt: "2026-05-22",
    lastUsed: "2026-07-16",
    status: "Active",
  },
];

function loadKeys() {
  try {
    const raw = localStorage.getItem(KEYS_STORAGE);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return DEFAULT_KEYS;
}

function saveKeys(keys) {
  localStorage.setItem(KEYS_STORAGE, JSON.stringify(keys));
}

function createSecret(prefix = "mf_live_") {
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${prefix}${rand}`;
}

function maskSecret(secret) {
  if (!secret || secret.length < 12) return "••••••••";
  return `${secret.slice(0, 10)}••••${secret.slice(-4)}`;
}

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

const ApiKeysModal = ({ open, onClose, keys, onChange, onNotify }) => {
  const [newName, setNewName] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  if (!open) return null;

  const copyKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key.secret);
      setCopiedId(key.id);
      setTimeout(() => setCopiedId(null), 1500);
      onNotify?.("API key copied to clipboard");
    } catch {
      onNotify?.("Could not copy key");
    }
  };

  const rotateKey = (id) => {
    const next = keys.map((k) =>
      k.id === id
        ? {
            ...k,
            secret: createSecret(k.prefix || "mf_live_"),
            createdAt: new Date().toISOString().slice(0, 10),
            status: "Active",
          }
        : k
    );
    onChange(next);
    platformApi
      .logSecurityEvent({
        type: "API Key Rotated",
        user: localStorage.getItem("email") || "admin",
        status: "Rotated",
        device: "Admin Console",
      })
      .catch(() => {});
    onNotify?.("API key rotated");
  };

  const revokeKey = (id) => {
    const next = keys.map((k) => (k.id === id ? { ...k, status: "Revoked" } : k));
    onChange(next);
    platformApi
      .logSecurityEvent({
        type: "API Key Revoked",
        user: localStorage.getItem("email") || "admin",
        status: "Blocked",
        device: "Admin Console",
      })
      .catch(() => {});
    onNotify?.("API key revoked");
  };

  const createKey = () => {
    const name = newName.trim() || "New integration key";
    const prefix = "mf_live_";
    const key = {
      id: `key_${Date.now()}`,
      name,
      prefix,
      secret: createSecret(prefix),
      createdAt: new Date().toISOString().slice(0, 10),
      lastUsed: "—",
      status: "Active",
    };
    onChange([key, ...keys]);
    setNewName("");
    platformApi
      .logSecurityEvent({
        type: "API Key Created",
        user: localStorage.getItem("email") || "admin",
        status: "Success",
        device: "Admin Console",
      })
      .catch(() => {});
    onNotify?.("New API key created");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">API access keys</h3>
            <p className="text-sm text-slate-500">Create, copy, rotate, or revoke integration keys</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Key name (e.g. Razorpay webhook)"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-teal-600"
            />
            <button
              type="button"
              onClick={createKey}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-800 px-4 py-2 text-sm font-bold text-white hover:bg-teal-900"
            >
              <Plus size={16} /> Create key
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Key</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {keys.map((key) => (
                  <tr key={key.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{key.name}</td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                        {maskSecret(key.secret)}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{key.createdAt}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ${
                          key.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-red-50 text-red-700 ring-red-200"
                        }`}
                      >
                        {key.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          disabled={key.status !== "Active"}
                          onClick={() => copyKey(key)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-white disabled:opacity-40"
                        >
                          {copiedId === key.id ? <Check size={12} /> : <Copy size={12} />}
                          Copy
                        </button>
                        <button
                          type="button"
                          disabled={key.status !== "Active"}
                          onClick={() => rotateKey(key.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-white disabled:opacity-40"
                        >
                          <RefreshCw size={12} /> Rotate
                        </button>
                        <button
                          type="button"
                          disabled={key.status !== "Active"}
                          onClick={() => revokeKey(key.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100 disabled:opacity-40"
                        >
                          <Trash2 size={12} /> Revoke
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminSecurityPanel = ({ liveEvents = [] }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showKeys, setShowKeys] = useState(false);
  const [apiKeys, setApiKeys] = useState(() => loadKeys());
  const [twoFaEnabled, setTwoFaEnabled] = useState(
    () => localStorage.getItem("admin_2fa_enabled") === "true"
  );
  const [sessionMinutes, setSessionMinutes] = useState(
    () => Number(localStorage.getItem("admin_session_timeout") || 30)
  );
  const [showSession, setShowSession] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2500);
  };

  const refreshEvents = () => {
    platformApi
      .getSecurityEvents()
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  useEffect(() => {
    if (liveEvents.length > 0) {
      setEvents((prev) => {
        const ids = new Set(liveEvents.map((e) => e.id));
        return [...liveEvents, ...prev.filter((e) => !ids.has(e.id))].slice(0, 50);
      });
      setPage(1);
    }
  }, [liveEvents]);

  useEffect(() => {
    saveKeys(apiKeys);
  }, [apiKeys]);

  const statusStyle = {
    Success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    Blocked: "bg-red-50 text-red-700 ring-red-200",
    Rotated: "bg-blue-50 text-blue-700 ring-blue-200",
  };

  const failedCount = events.filter((e) => e.status === "Blocked").length;
  const successCount = events.filter((e) => e.status === "Success").length;
  const activeKeys = apiKeys.filter((k) => k.status === "Active").length;
  const lastRotated = apiKeys[0]?.createdAt || "—";

  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const pageEvents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return events.slice(start, start + PAGE_SIZE);
  }, [events, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const enable2fa = () => {
    const next = !twoFaEnabled;
    setTwoFaEnabled(next);
    localStorage.setItem("admin_2fa_enabled", String(next));
    platformApi
      .logSecurityEvent({
        type: next ? "2FA Enabled" : "2FA Disabled",
        user: localStorage.getItem("email") || "admin",
        status: "Success",
        device: "Admin Console",
      })
      .then(refreshEvents)
      .catch(() => {});
    notify(next ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
  };

  const saveSession = () => {
    localStorage.setItem("admin_session_timeout", String(sessionMinutes));
    setShowSession(false);
    platformApi
      .logSecurityEvent({
        type: "Session Timeout Updated",
        user: localStorage.getItem("email") || "admin",
        status: "Success",
        device: "Admin Console",
      })
      .then(refreshEvents)
      .catch(() => {});
    notify(`Session timeout set to ${sessionMinutes} minutes`);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-lg">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SecurityKpiCard icon={ShieldCheck} label="Secure sessions" value={successCount} note="Successful logins today" tone="teal" />
        <SecurityKpiCard icon={ShieldAlert} label="Blocked attempts" value={failedCount} note="Requires review" tone="red" />
        <SecurityKpiCard
          icon={UserCheck}
          label="2FA coverage"
          value={twoFaEnabled ? "On" : "86%"}
          note={twoFaEnabled ? "Enforced for admin accounts" : "Admin & organiser roles"}
          tone="blue"
        />
        <SecurityKpiCard
          icon={KeyRound}
          label="API keys"
          value={`${activeKeys} active`}
          note={`Last rotation: ${lastRotated}`}
          tone="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:bg-teal-50/50 hover:shadow-md">
          <ShieldCheck className="text-teal-700" size={22} />
          <p className="mt-3 font-bold text-slate-900">Two-factor authentication</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">Require 2FA for all admin accounts</p>
          <button
            type="button"
            onClick={enable2fa}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-800"
          >
            {twoFaEnabled ? "Disable" : "Enable"}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md">
          <KeyRound className="text-teal-700" size={22} />
          <p className="mt-3 font-bold text-slate-900">API access keys</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">Manage payment and reporting integrations</p>
          <button
            type="button"
            onClick={() => setShowKeys(true)}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-800"
          >
            Manage keys
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-300 hover:bg-violet-50/50 hover:shadow-md">
          <Lock className="text-teal-700" size={22} />
          <p className="mt-3 font-bold text-slate-900">Session timeout</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            Auto logout after {sessionMinutes} minutes of inactivity
          </p>
          <button
            type="button"
            onClick={() => setShowSession(true)}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-800"
          >
            Configure
          </button>
        </div>
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Activity audit log</h2>
            <p className="text-sm text-slate-500">Login, API, and permission events across the platform</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
            {events.length} events · 5 / page
          </span>
        </div>
        {loading ? (
          <div className="h-48 animate-pulse bg-slate-50" />
        ) : events.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm font-semibold text-slate-500">No security events yet</div>
        ) : (
          <>
            <div className="admin-table overflow-x-auto">
              <table className="w-full min-w-[900px] table-fixed text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                    <th className="w-[12%] px-4 py-3 text-left">Event ID</th>
                    <th className="w-[16%] px-4 py-3 text-left">Event</th>
                    <th className="w-[20%] px-4 py-3 text-left">User</th>
                    <th className="w-[12%] px-4 py-3 text-left">IP</th>
                    <th className="w-[16%] px-4 py-3 text-left">Device</th>
                    <th className="w-[14%] px-4 py-3 text-left">Time</th>
                    <th className="w-[10%] px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageEvents.map((event) => (
                    <tr key={event.id} className="transition hover:bg-slate-50">
                      <td className="px-4 py-3.5">
                        <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700">
                          EVT-{String(event.id).padStart(4, "0")}
                        </code>
                      </td>
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
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ${
                            statusStyle[event.status] || "bg-slate-100 text-slate-700 ring-slate-200"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 pb-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={events.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
                label="events"
              />
            </div>
          </>
        )}
      </section>

      <ApiKeysModal
        open={showKeys}
        onClose={() => {
          setShowKeys(false);
          refreshEvents();
        }}
        keys={apiKeys}
        onChange={setApiKeys}
        onNotify={notify}
      />

      {showSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Session timeout</h3>
            <p className="mt-1 text-sm text-slate-500">Auto logout after inactivity (minutes)</p>
            <input
              type="number"
              min={5}
              max={180}
              value={sessionMinutes}
              onChange={(e) => setSessionMinutes(Number(e.target.value) || 30)}
              className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-teal-600"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setShowSession(false)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveSession}
                className="flex-1 rounded-lg bg-teal-800 px-4 py-2 text-sm font-bold text-white hover:bg-teal-900"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSecurityPanel;
