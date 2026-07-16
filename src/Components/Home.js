import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import BannerImage from "./BannerImage";
import LiveDonorHome from "./admin/components/LiveDonorHome";
import liveDonationsSeed from "../data/liveDonationsSeed";
import { normalizePaymentMethod } from "../constants/paymentMethods";
import { useAdminRealtime } from "../hooks/useAdminRealtime";

const Home = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState(liveDonationsSeed);

  const handleLiveDonation = useCallback((donation) => {
    const normalized = {
      id: donation.id || `LIVE-${Date.now()}`,
      donor: donation.donor || "Anonymous",
      campaign: donation.campaign || "General Fund",
      amount: donation.amount || "Rs 1,000",
      method: normalizePaymentMethod(donation.method),
      date: donation.date || "Today",
      time: donation.time || "Just now",
    };
    setDonations((list) => [normalized, ...list].slice(0, 12));
  }, []);

  useAdminRealtime({
    enabled: localStorage.getItem("role") === "ADMIN",
    onDonation: handleLiveDonation,
  });

  const handleNavigation = (destination) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/loginSignup");
      return;
    }
    if (destination === "start") navigate("/create-fundraiser");
    else if (destination === "explore") navigate("/campaigns");
  };

  return (
    <div className="flex w-full min-w-0 flex-col">
      <section className="relative h-[360px] w-full shrink-0 sm:h-[min(55vh,600px)]">
        <LiveDonorHome donations={donations} />
        <div className="h-full w-full">
          <BannerImage
            title="Join the Cause: Make a Difference Today"
            subtitle="Support our fundraising efforts to change lives and empower communities"
          />
        </div>
      </section>

      <section className="w-full bg-white px-4 py-12 text-center sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-teal-800 sm:text-[26px]">Welcome to MyFundraiser</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-[17px]">
            Start or support a fundraiser today and make a real impact in your community.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleNavigation("start")}
              className="rounded-lg bg-teal-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-teal-800"
            >
              Start a Fundraiser
            </button>
            <button
              type="button"
              onClick={() => handleNavigation("explore")}
              className="rounded-lg border-2 border-teal-700 bg-white px-6 py-3 text-base font-semibold text-teal-800 transition hover:bg-teal-50"
            >
              Explore Campaigns
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
