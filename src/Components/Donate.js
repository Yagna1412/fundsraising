import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getCampaignById, getRecipientById } from "./campaignData";
import { PAYMENT_METHODS } from "../constants/paymentMethods";

const FieldLabel = ({ htmlFor, children, required }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-slate-700">
    {children}
    {required ? <span className="text-red-500"> *</span> : null}
  </label>
);

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100";

const Donate = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const campaign = getCampaignById(id);
  const requestedRecipient = searchParams.get("recipient");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const initialRecipientId =
    getRecipientById(campaign, requestedRecipient)?.id ||
    campaign?.recipients?.[0]?.id ||
    "";

  const [loading, setLoading] = useState(true);
  const [completedDonation, setCompletedDonation] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    recipientId: initialRecipientId,
    paymentMethod: "UPI",
    anonymous: false,
    message: "",
  });

  const selectedRecipient = useMemo(
    () => getRecipientById(campaign, form.recipientId),
    [campaign, form.recipientId]
  );

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
      recipientId: initialRecipientId,
    }));
  }, [initialRecipientId, user.email, user.name]);

  if (!campaign) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold">Campaign Not Found</h1>
        <button
          type="button"
          onClick={() => navigate("/campaigns")}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
        >
          <ArrowLeft size={16} />
          Back to Campaigns
        </button>
      </div>
    );
  }

  const progress = (campaign.raised / campaign.goal) * 100;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDonate = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.amount || !selectedRecipient) {
      alert("Please complete all required fields and select who you want to support.");
      return;
    }

    const donations = JSON.parse(localStorage.getItem("userDonations")) || [];

    donations.push({
      campaignId: id,
      campaignName: campaign.title,
      category: campaign.category,
      recipientId: selectedRecipient.id,
      recipientName: selectedRecipient.name,
      recipientNeed: selectedRecipient.need,
      recipientLocation: selectedRecipient.location,
      ...form,
      date: new Date().toLocaleString(),
    });

    localStorage.setItem("userDonations", JSON.stringify(donations));

    setCompletedDonation({
      amount: form.amount,
      recipientName: selectedRecipient.name,
    });
  };

  const impact =
    Number(form.amount) >= 10000
      ? `Can make major progress toward ${selectedRecipient?.name || "this recipient"}'s need`
      : Number(form.amount) >= 5000
      ? `Can strongly support ${selectedRecipient?.name || "this recipient"}`
      : "Every contribution matters";

  if (completedDonation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8 sm:px-5 sm:py-12">
        <div className="w-full max-w-lg rounded-2xl bg-white p-5 text-center shadow-lg sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-3xl font-bold text-teal-700">
            +
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">Donation Successful</h1>
          <p className="mt-3 text-gray-600">
            Rs. {Number(completedDonation.amount).toLocaleString()} donated successfully to{" "}
            {completedDonation.recipientName}.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate("/campaigns")}
              className="rounded-lg border border-teal-700 px-5 py-3 font-bold text-teal-700 transition hover:bg-teal-50"
            >
              Back to Campaigns
            </button>
            <button
              type="button"
              onClick={() => navigate("/campaigns")}
              className="rounded-lg bg-teal-700 px-5 py-3 font-bold text-white transition hover:bg-teal-800"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-5 sm:py-12">
      <div className="mx-auto mb-6 flex max-w-6xl flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate(`/campaigns/${campaign.id}`)}
          className="rounded-lg border border-teal-700 bg-white px-5 py-3 font-bold text-teal-700 transition hover:bg-teal-50"
        >
          Back to Campaign
        </button>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading && <div className="h-72 bg-gray-200 animate-pulse" />}

          <img
            src={campaign.image}
            alt={campaign.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoading(false)}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = `https://picsum.photos/seed/fundraising-campaign-${campaign.id}/1000/600`;
              setLoading(false);
            }}
            className={`w-full h-72 object-cover ${loading ? "hidden" : "block"}`}
          />

            <div className="p-5 sm:p-8">
              <h1 className="text-xl font-bold text-teal-800 sm:text-3xl">{campaign.title}</h1>

              <span className="mt-3 inline-block rounded-full bg-teal-100 px-4 py-1 text-sm font-semibold text-teal-800">
                {campaign.category}
              </span>

              <div className="mt-8">
                <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold text-slate-700">
                  <span>Raised Rs. {campaign.raised.toLocaleString("en-IN")}</span>
                  <span>Goal Rs. {campaign.goal.toLocaleString("en-IN")}</span>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-teal-700 transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-bold text-slate-500">{Math.round(progress)}% funded</p>
              </div>

              {selectedRecipient && (
                <div className="mt-8 rounded-xl bg-teal-50 p-5 ring-1 ring-teal-100">
                  <h3 className="text-lg font-bold text-teal-900">Selected Recipient</h3>
                  <p className="mt-2 font-semibold text-slate-900">{selectedRecipient.name}</p>
                  <p className="text-sm text-slate-700">{selectedRecipient.need}</p>
                  <p className="text-sm text-slate-600">
                    {selectedRecipient.location} | Target Rs.{" "}
                    {selectedRecipient.target.toLocaleString("en-IN")}
                  </p>
                  <p className="mt-3 text-sm font-medium text-teal-800">{impact}</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-md sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Complete Donation</h2>
            <p className="mb-6 mt-1 text-sm text-slate-600">
              Select the exact {campaign.recipientType} your donation should support.
            </p>

            <form className="space-y-5" onSubmit={handleDonate}>
              <fieldset>
                <legend className="mb-3 text-sm font-bold text-slate-700">Donate To *</legend>
                <div className="grid gap-3">
                  {campaign.recipients.map((recipient) => (
                    <label
                      key={recipient.id}
                      className={`block cursor-pointer rounded-lg border p-4 transition ${
                        form.recipientId === recipient.id
                          ? "border-teal-700 bg-teal-50 ring-1 ring-teal-200"
                          : "border-slate-200 hover:border-teal-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="recipientId"
                        value={recipient.id}
                        checked={form.recipientId === recipient.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="block font-semibold text-slate-900">{recipient.name}</span>
                      <span className="block text-sm text-slate-600">{recipient.need}</span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {recipient.location} | Need Rs. {recipient.target.toLocaleString("en-IN")}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <FieldLabel htmlFor="donor-name" required>Full Name</FieldLabel>
                <input
                  id="donor-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <FieldLabel htmlFor="donor-email" required>Email Address</FieldLabel>
                <input
                  id="donor-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <FieldLabel required>Suggested Amount</FieldLabel>
                <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[500, 1000, 5000, 10000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setForm({ ...form, amount: String(amt) })}
                      className={`rounded-lg py-3 text-sm font-bold transition ${
                        Number(form.amount) === amt
                          ? "bg-teal-700 text-white"
                          : "bg-teal-100 text-teal-800 hover:bg-teal-200"
                      }`}
                    >
                      Rs. {amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="donor-amount" required>Custom Amount (Rs.)</FieldLabel>
                <input
                  id="donor-amount"
                  type="number"
                  name="amount"
                  min="1"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <FieldLabel htmlFor="payment-method" required>Payment Method</FieldLabel>
                <select
                  id="payment-method"
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="donor-message">Message (optional)</FieldLabel>
                <textarea
                  id="donor-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Leave encouragement for the recipient..."
                  className={inputClass}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={form.anonymous}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
                />
                Donate anonymously
              </label>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/campaigns")}
                  className="flex-1 rounded-lg border border-slate-300 bg-white py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] rounded-lg bg-teal-700 py-3.5 text-sm font-bold text-white hover:bg-teal-800"
                >
                  Donate Rs. {Number(form.amount || 0).toLocaleString("en-IN")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default Donate;
