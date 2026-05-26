import React from "react";
import { validateEmail, validatePassword, validatePhone } from "../utils/adminHelpers";

const SETTINGS_TABS = ["Profile", "Website", "Notifications", "Payment Settings"];

const AdminSettingsPanel = ({
  successMessage,
  settingsTab,
  setSettingsTab,
  profileForm,
  setProfileForm,
  passwordForm,
  setPasswordForm,
  websiteForm,
  setWebsiteForm,
  formErrors,
  touchedFields,
  handleFieldBlur,
  handleSaveProfile,
  handleUpdatePassword,
  handleSaveWebsite,
  onResetWebsite,
  notify,
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    {successMessage && (
      <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
        ✓ {successMessage}
      </div>
    )}
    <div className="mb-6 flex flex-wrap gap-4 border-b border-slate-200 text-sm font-bold text-slate-600">
      {SETTINGS_TABS.map((tab) => (
        <button
          type="button"
          key={tab}
          onClick={() => setSettingsTab(tab)}
          className={`pb-3 transition ${settingsTab === tab ? "border-b-2 border-teal-700 text-teal-700" : "hover:text-slate-900"}`}
        >
          {tab}
        </button>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {settingsTab === "Profile" && (
        <>
          <div>
            <h2 className="mb-5 text-lg font-bold text-slate-900">Admin profile</h2>
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-700 text-2xl font-bold text-white">
                AD
              </div>
              <button type="button" onClick={() => notify("Photo picker will open here.")} className="text-sm font-bold text-teal-700">
                Change photo
              </button>
            </div>
            {[
              { key: "fullName", label: "Full Name", type: "text", required: true },
              { key: "email", label: "Email", type: "email", required: true },
              { key: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "10-digit number" },
              { key: "organization", label: "Organization", type: "text" },
              { key: "jobTitle", label: "Job Title", type: "text" },
              { key: "department", label: "Department", type: "text" },
            ].map((field) => {
              const error = formErrors[field.key] && touchedFields[field.key];
              return (
                <label key={field.key} className="mb-4 block text-sm font-bold text-slate-600">
                  {field.label}
                  {field.required ? <span className="text-red-500"> *</span> : null}
                  <input
                    value={profileForm[field.key] || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, [field.key]: e.target.value })}
                    onBlur={() => handleFieldBlur(field.key)}
                    type={field.type}
                    placeholder={field.placeholder || ""}
                    className={`mt-2 w-full rounded-lg border px-3 py-2.5 font-normal outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 ${
                      error ? "border-red-500 bg-red-50" : "border-slate-200"
                    }`}
                  />
                  {error && <span className="mt-1 block text-xs text-red-600">{formErrors[field.key]}</span>}
                </label>
              );
            })}
            <button type="button" onClick={handleSaveProfile} className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800">
              Save profile
            </button>
          </div>
          <div>
            <h2 className="mb-5 text-lg font-bold text-slate-900">Change password</h2>
            <p className="mb-4 text-sm text-slate-500">Use a strong password with at least 8 characters.</p>
            {[
              { key: "current", label: "Current Password" },
              { key: "new", label: "New Password" },
              { key: "confirm", label: "Confirm New Password" },
            ].map((field) => {
              const error = formErrors[field.key] && touchedFields[field.key];
              return (
                <label key={field.key} className="mb-4 block text-sm font-bold text-slate-600">
                  {field.label}
                  <input
                    value={passwordForm[field.key]}
                    onChange={(e) => setPasswordForm({ ...passwordForm, [field.key]: e.target.value })}
                    onBlur={() => handleFieldBlur(field.key)}
                    type="password"
                    className={`mt-2 w-full rounded-lg border px-3 py-2.5 font-normal outline-none focus:border-teal-600 ${
                      error ? "border-red-500 bg-red-50" : "border-slate-200"
                    }`}
                  />
                  {error && <span className="mt-1 block text-xs text-red-600">{formErrors[field.key]}</span>}
                </label>
              );
            })}
            <button type="button" onClick={handleUpdatePassword} className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800">
              Update password
            </button>
          </div>
        </>
      )}

      {settingsTab === "Website" && (
        <div className="grid grid-cols-1 gap-6 lg:col-span-2 lg:grid-cols-2">
          <div>
            <h2 className="mb-5 text-lg font-bold text-slate-900">Website settings</h2>
            {[
              { key: "heroTitle", label: "Hero Title", type: "text" },
              { key: "heroSubtitle", label: "Hero Subtitle", type: "text" },
              { key: "footerText", label: "Footer Text", type: "text" },
            ].map((field) => (
              <label key={field.key} className="mb-4 block text-sm font-bold text-slate-600">
                {field.label}
                <input
                  value={websiteForm[field.key]}
                  onChange={(e) => setWebsiteForm({ ...websiteForm, [field.key]: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-teal-600"
                />
              </label>
            ))}
            <label className="mb-4 block text-sm font-bold text-slate-600">
              Featured campaigns
              <input
                type="number"
                min={1}
                max={12}
                value={websiteForm.featuredCount}
                onChange={(e) => setWebsiteForm({ ...websiteForm, featuredCount: Number(e.target.value) })}
                className="mt-2 w-32 rounded-lg border border-slate-200 px-3 py-2.5"
              />
            </label>
            <label className="mb-4 flex items-center gap-3 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                checked={websiteForm.enableCarousel}
                onChange={(e) => setWebsiteForm({ ...websiteForm, enableCarousel: e.target.checked })}
              />
              Enable homepage carousel
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleSaveWebsite} className="rounded-lg bg-teal-700 px-4 py-2 font-bold text-white">
                Save website
              </button>
              <button type="button" onClick={onResetWebsite} className="rounded-lg border border-slate-300 px-4 py-2 font-bold text-slate-700">
                Reset
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 text-sm font-bold text-slate-700">Preview</h3>
            <div className="rounded-lg bg-white p-6 shadow-inner">
              <h2 className="text-lg font-bold text-teal-800">{websiteForm.heroTitle || "Hero Title"}</h2>
              <p className="text-sm text-slate-600">{websiteForm.heroSubtitle || "Hero subtitle"}</p>
            </div>
          </div>
        </div>
      )}

      {settingsTab === "Notifications" && (
        <div className="col-span-2 space-y-3">
          {["Email Notifications", "SMS Alerts", "Push Notifications", "Weekly Reports"].map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
              <span className="font-bold text-slate-700">{item}</span>
            </label>
          ))}
        </div>
      )}

      {settingsTab === "Payment Settings" && (
        <div className="grid gap-4 md:grid-cols-2 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="font-bold text-slate-900">Bank account</p>
            <p className="mt-1 text-sm text-slate-600">HDFC Bank · XXXX XXXX 5678</p>
            <button type="button" className="mt-3 text-sm font-bold text-teal-700">
              Edit
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="font-bold text-slate-900">Commission rate</p>
            <p className="mt-1 text-sm text-slate-600">5% per transaction</p>
            <button type="button" className="mt-3 text-sm font-bold text-teal-700">
              Change
            </button>
          </div>
        </div>
      )}
    </div>
  </section>
);

export { validateEmail, validatePhone, validatePassword };
export default AdminSettingsPanel;
