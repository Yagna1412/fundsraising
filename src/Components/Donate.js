import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const campaignData = {
  1: {
    title: "Help Children for Education",
    category: "Education",
    goal: 50000,
    raised: 23000,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55e"
  },

  2: {
    title: "Emergency Medical Support",
    category: "Medical",
    goal: 100000,
    raised: 65000,
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309"
  },

  3: {
    title: "Disaster Relief Support",
    category: "Emergency",
    goal: 75000,
    raised: 30000,
    image:
      "https://images.unsplash.com/photo-1576765608866-5b51046452be"
  },

  4: {
    title: "Clean Water & Sanitation",
    category: "Health",
    goal: 60000,
    raised: 42000,
    image:
      "https://images.unsplash.com/photo-1541544181051-e46607d31a4b"
  },

  5: {
    title: "Skills Training for Youth",
    category: "Employment",
    goal: 80000,
    raised: 52000,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
  },

  6: {
    title: "Women Empowerment Program",
    category: "Social",
    goal: 70000,
    raised: 38000,
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216"
  },

  7: {
    title: "Environmental Conservation",
    category: "Environment",
    goal: 45000,
    raised: 18000,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
  },

  8: {
    title: "Elderly Care & Support",
    category: "Welfare",
    goal: 55000,
    raised: 28000,
    image:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b"
  }
};

const Donate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const campaign = campaignData[id];

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    paymentMethod: "UPI",
    anonymous: false,
    message: ""
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || ""
    }));
  }, []);

  if (!campaign) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">
          Campaign Not Found
        </h1>
      </div>
    );
  }

  const progress = (
    campaign.raised /
    campaign.goal
  ) * 100;

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value
    });
  };

  const handleDonate = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.amount
    ) {
      alert("Please complete all fields");
      return;
    }

    const donations =
      JSON.parse(
        localStorage.getItem(
          "userDonations"
        )
      ) || [];

    donations.push({
      campaignId: id,
      campaignName: campaign.title,
      category: campaign.category,
      ...form,
      date:
        new Date().toLocaleString()
    });

    localStorage.setItem(
      "userDonations",
      JSON.stringify(donations)
    );

    alert(
      `₹${form.amount} donated successfully ❤️`
    );

    navigate("/dashboard");
  };

  const impact =
    form.amount >= 10000
      ? "Can support an entire family"
      : form.amount >= 5000
      ? "Can support one person"
      : "Every contribution matters ❤️";

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-5">

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">

        {/* LEFT */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading && (
            <div className="h-72 bg-gray-200 animate-pulse" />
          )}

          <img
            src={campaign.image}
            alt={campaign.title}
            loading="lazy"
            decoding="async"
            onLoad={() =>
              setLoading(false)
            }
            className={`w-full h-72 object-cover ${
              loading
                ? "hidden"
                : "block"
            }`}
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

                <span>
                  Raised ₹
                  {campaign.raised.toLocaleString()}
                </span>

                <span>
                  Goal ₹
                  {campaign.goal.toLocaleString()}
                </span>

              </div>

              <div className="mt-2 h-3 rounded bg-gray-200">

                <div
                  className="h-full rounded bg-teal-700"
                  style={{
                    width: `${progress}%`
                  }}
                />

              </div>

            </div>

            <div className="mt-8 bg-teal-50 p-5 rounded">

              <h3 className="font-bold text-lg">
                Your Donation Impact
              </h3>

              <p className="mt-2">
                {impact}
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="bg-white rounded-xl shadow p-8">

          <h2 className="text-2xl font-bold mb-6">
            Complete Donation
          </h2>

          <form
            className="space-y-5"
            onSubmit={handleDonate}
          >

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

              <label className="font-semibold">
                Suggested Amount
              </label>

              <div className="grid grid-cols-4 gap-2 mt-3">

                {[500,1000,5000,10000].map(
                  (amt)=>(
                    <button
                      key={amt}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          amount: amt
                        })
                      }
                      className="bg-teal-100 py-3 rounded"
                    >
                      ₹{amt}
                    </button>
                  )
                )}

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

            <button
              className="w-full bg-teal-700 hover:bg-teal-800 text-white py-4 rounded-lg font-bold"
            >
              Donate ₹
              {form.amount || 0}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Donate;