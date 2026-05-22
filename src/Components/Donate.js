import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getCampaignById, getRecipientById } from "./campaignData";

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
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Campaign Not Found</h1>
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
      alert("Please complete all fields and select who you want to support");
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

    alert(
      `Rs. ${form.amount} donated successfully to ${selectedRecipient.name}`
    );

    navigate("/dashboard");
  };

  const impact =
    Number(form.amount) >= 10000
      ? `Can make major progress toward ${selectedRecipient?.name || "this recipient"}'s need`
      : Number(form.amount) >= 5000
      ? `Can strongly support ${selectedRecipient?.name || "this recipient"}`
      : "Every contribution matters";

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-5">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading && <div className="h-72 bg-gray-200 animate-pulse" />}

          <img
            src={campaign.image}
            alt={campaign.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoading(false)}
            onError={(event) => {
              event.currentTarget.src =
                "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80";
              setLoading(false);
            }}
            className={`w-full h-72 object-cover ${loading ? "hidden" : "block"}`}
          />

          <div className="p-8">
            <h1 className="text-3xl font-bold text-teal-700">
              {campaign.title}
            </h1>

            <span className="inline-block mt-3 px-4 py-1 bg-teal-100 rounded-full">
              {campaign.category}
            </span>

            <div className="mt-8">
              <div className="flex justify-between">
                <span>Raised Rs. {campaign.raised.toLocaleString()}</span>
                <span>Goal Rs. {campaign.goal.toLocaleString()}</span>
              </div>

              <div className="mt-2 h-3 rounded bg-gray-200">
                <div
                  className="h-full rounded bg-teal-700"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            {selectedRecipient && (
              <div className="mt-8 bg-teal-50 p-5 rounded">
                <h3 className="font-bold text-lg">Selected Recipient</h3>
                <p className="mt-2 font-semibold">{selectedRecipient.name}</p>
                <p className="text-sm text-gray-700">{selectedRecipient.need}</p>
                <p className="text-sm text-gray-600">
                  {selectedRecipient.location} | Target Rs.{" "}
                  {selectedRecipient.target.toLocaleString()}
                </p>
                <p className="mt-3 text-sm">{impact}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-2">Complete Donation</h2>
          <p className="text-sm text-gray-600 mb-6">
            Select the exact {campaign.recipientType} your donation should support.
          </p>

          <form className="space-y-5" onSubmit={handleDonate}>
            <div>
              <label className="font-semibold">Donate To</label>
              <div className="mt-3 grid gap-3">
                {campaign.recipients.map((recipient) => (
                  <label
                    key={recipient.id}
                    className={`block cursor-pointer rounded-lg border p-4 transition ${
                      form.recipientId === recipient.id
                        ? "border-teal-700 bg-teal-50"
                        : "border-gray-200 hover:border-teal-400"
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
                    <span className="block font-semibold text-gray-900">
                      {recipient.name}
                    </span>
                    <span className="block text-sm text-gray-600">
                      {recipient.need}
                    </span>
                    <span className="block text-xs text-gray-500 mt-1">
                      {recipient.location} | Need Rs.{" "}
                      {recipient.target.toLocaleString()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border p-3 rounded"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border p-3 rounded"
            />

            <div>
              <label className="font-semibold">Suggested Amount</label>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[500, 1000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setForm({ ...form, amount: amt })}
                    className="bg-teal-100 py-3 rounded"
                  >
                    Rs. {amt}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Custom Amount"
              className="w-full border p-3 rounded"
            />

            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            >
              <option>UPI</option>
              <option>Debit Card</option>
              <option>Credit Card</option>
              <option>Net Banking</option>
            </select>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="3"
              placeholder="Leave encouragement..."
              className="w-full border p-3 rounded"
            />

            <label className="flex gap-2">
              <input
                type="checkbox"
                name="anonymous"
                checked={form.anonymous}
                onChange={handleChange}
              />
              Donate anonymously
            </label>

            <button className="w-full bg-teal-700 hover:bg-teal-800 text-white py-4 rounded-lg font-bold">
              Donate Rs. {form.amount || 0}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Donate;
