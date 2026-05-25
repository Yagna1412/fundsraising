import React, { useEffect, useState } from "react";
import { ArrowLeft, Mail, MapPin, Phone, ShieldCheck, User } from "lucide-react";
import platformApi from "../../services/platformApi";
import { validateEmail } from "./utils/adminHelpers";

const roleColors = {
  Admin: "bg-teal-100 text-teal-800",
  Donor: "bg-blue-100 text-blue-800",
  Organiser: "bg-violet-100 text-violet-800",
  User: "bg-slate-100 text-slate-800",
};

const AdminUserProfilesPanel = () => {
  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editNote, setEditNote] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    platformApi
      .getUserProfiles()
      .then((data) => setProfiles(data.profiles || []))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = profiles.filter(
    (p) =>
      !search.trim() ||
      [p.name, p.email, p.role, p.city].some((f) => String(f).toLowerCase().includes(search.toLowerCase()))
  );

  const validateNote = () => {
    const next = {};
    if (editNote.length > 200) next.note = "Note must be under 200 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSaveNote = () => {
    if (!validateNote() || !selected) return;
    setProfiles((list) =>
      list.map((p) => (p.id === selected.id ? { ...p, adminNote: editNote } : p))
    );
    setSelected((s) => ({ ...s, adminNote: editNote }));
  };

  const openProfile = (profile) => {
    setSelected(profile);
    setEditNote(profile.adminNote || "");
    setErrors({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">User profiles</h2>
          <p className="text-sm text-slate-500">Browse platform members and verification status</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, role, city..."
          className="w-full max-w-sm rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-slate-700">Members ({filtered.length})</h3>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
              {filtered.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => openProfile(profile)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                    selected?.id === profile.id ? "border-teal-300 bg-teal-50" : "border-slate-200 hover:border-teal-200"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">{profile.name}</p>
                    <p className="truncate text-xs text-slate-500">{profile.role}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {selected ? (
            <>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="mb-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-teal-800 transition hover:bg-teal-50 lg:hidden"
              >
                <ArrowLeft size={16} />
                Back to list
              </button>

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-700 text-xl font-bold text-white">
                    {selected.name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selected.name}</h2>
                    <p className="text-sm text-slate-500">{selected.id}</p>
                    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${roleColors[selected.role] || roleColors.User}`}>
                      {selected.role}
                    </span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    selected.status === "Active" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selected.status}
                </span>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">Email</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Mail size={14} />
                    {selected.email}
                    {validateEmail(selected.email) ? null : <span className="text-xs text-red-600">Invalid</span>}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">Phone</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Phone size={14} />
                    {selected.phone || "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">City</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <MapPin size={14} />
                    {selected.city || "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">Member since</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <User size={14} />
                    {selected.joined}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">Donations</p>
                  <p className="mt-1 text-2xl font-black text-teal-800">{selected.donations}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">Total contributed</p>
                  <p className="mt-1 text-2xl font-black text-emerald-700">Rs {Number(selected.total).toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">KYC / PAN</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-800">
                    <ShieldCheck size={14} className="text-teal-700" />
                    {selected.kyc} {selected.panVerified ? "· PAN verified" : "· PAN pending"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">Last active</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{selected.lastActive}</p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <label className="block text-sm font-bold text-slate-700">Admin notes</label>
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  rows={3}
                  maxLength={200}
                  placeholder="Internal notes about this user (max 200 chars)"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600"
                />
                {errors.note && <p className="mt-1 text-xs text-red-600">{errors.note}</p>}
                <button type="button" onClick={handleSaveNote} className="mt-3 rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800">
                  Save note
                </button>
              </div>
            </>
          ) : (
            <p className="py-20 text-center text-slate-500">Select a member from the list to view their profile.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminUserProfilesPanel;
