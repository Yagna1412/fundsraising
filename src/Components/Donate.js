import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PAYMENT_METHODS } from "../constants/paymentMethods";
import backendApi, { getStoredUserId } from "../services/backendApi";

const FieldLabel = ({ htmlFor, children, required }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-slate-700">
    {children}
    {required ? <span className="text-red-500"> *</span> : null}
  </label>
);

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100";

const getRecipientById = (campaign, recipientId) => {
  if (!campaign?.recipients?.length || recipientId == null || recipientId === "") return null;
  return (
    campaign.recipients.find((r) => String(r.id) === String(recipientId)) || null
  );
};

const Donate = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [completedDonation, setCompletedDonation] = useState(null);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const requestedRecipient = searchParams.get("recipient");

  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || localStorage.getItem("email") || "",
    amount: "",
    recipientId: "",
    paymentMethod: "UPI",
    anonymous: false,
    message: "",
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await backendApi.getCampaign(id);
        if (cancelled) return;
        setCampaign(data);
        const initial =
          getRecipientById(data, requestedRecipient)?.id ||
          data.recipients?.[0]?.id ||
          "";
        setForm((prev) => ({
          ...prev,
          recipientId: initial === "" ? "" : String(initial),
        }));
      } catch (err) {
        if (!cancelled) setFetchError(err.message || "Campaign not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, requestedRecipient]);

  const selectedRecipient = useMemo(
    () => getRecipientById(campaign, form.recipientId),
    [campaign, form.recipientId]
  );

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">Loading campaign…</div>
    );
  }

  if (fetchError || !campaign) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold">Campaign Not Found</h1>
        <p className="mt-2 text-slate-600">{fetchError}</p>
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

  const progress = (campaign.raised / Math.max(campaign.goal, 1)) * 100;
  const hasRecipients = campaign.recipients?.length > 0;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    const userId = getStoredUserId();
    if (!userId) {
      alert("Please sign in again before donating.");
      navigate("/loginSignup");
      return;
    }

    if (!form.name || !form.email || !form.amount) {
      alert("Please complete all required fields.");
      return;
    }

    if (hasRecipients && !selectedRecipient) {
      alert("Please select who you want to support.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await backendApi.donate({
        userId,
        campaignId: campaign.id,
        recipientId: selectedRecipient?.id || null,
        amount: form.amount,
        paymentMethod: form.paymentMethod,
        message: form.message,
        anonymous: form.anonymous,
      });

      setCompletedDonation({
        amount: result.amount ?? form.amount,
        recipientName:
          result.recipientName || selectedRecipient?.name || campaign.title,
      });
    } catch (err) {
      alert(err.message || "Donation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const impact =
    Number(form.amount) >= 10000
      ? `Can make major progress toward ${selectedRecipient?.name || "this cause"}`
      : Number(form.amount) >= 5000
      ? `Can strongly support ${selectedRecipient?.name || "this cause"}`
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
              onClick={() => navigate("/dashboard")}
              className="rounded-lg bg-teal-700 px-5 py-3 font-bold text-white transition hover:bg-teal-800"
            >
              View Dashboard
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
        <div className="overflow-hidden rounded-xl bg-white shadow">
          {imageLoading && <div className="h-72 animate-pulse bg-gray-200" />}

          <img
            src={campaign.image}
            alt={campaign.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoading(false)}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = `https://picsum.photos/seed/fundraising-campaign-${campaign.id}/1000/600`;
              setImageLoading(false);
            }}
            className={`h-72 w-full object-cover ${imageLoading ? "hidden" : "block"}`}
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
            {hasRecipients
              ? `Select the exact ${campaign.recipientType} your donation should support.`
              : "Your donation will support this campaign directly."}
          </p>

          <form className="space-y-5" onSubmit={handleDonate}>
            {hasRecipients && (
              <fieldset>
                <legend className="mb-3 text-sm font-bold text-slate-700">Donate To *</legend>
                <div className="grid gap-3">
                  {campaign.recipients.map((recipient) => (
                    <label
                      key={recipient.id}
                      className={`block cursor-pointer rounded-lg border p-4 transition ${
                        String(form.recipientId) === String(recipient.id)
                          ? "border-teal-700 bg-teal-50 ring-1 ring-teal-200"
                          : "border-slate-200 hover:border-teal-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="recipientId"
                        value={recipient.id}
                        checked={String(form.recipientId) === String(recipient.id)}
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
            )}

            <div>
              <FieldLabel htmlFor="donor-name" required>
                Full Name
              </FieldLabel>
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
              <FieldLabel htmlFor="donor-email" required>
                Email Address
              </FieldLabel>
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
              <FieldLabel htmlFor="donor-amount" required>
                Custom Amount (Rs.)
              </FieldLabel>
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
              <FieldLabel htmlFor="payment-method" required>
                Payment Method
              </FieldLabel>
              <select
                id="payment-method"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className={inputClass}
                required
              >
                {PAYMENT_METHODS.filter((m) => m.id !== "Wallet").map((method) => (
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
                disabled={submitting}
                className="flex-[2] rounded-lg bg-teal-700 py-3.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-60"
              >
                {submitting
                  ? "Processing…"
                  : `Donate Rs. ${Number(form.amount || 0).toLocaleString("en-IN")}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Donate;
