import React from "react";
import { useNavigate } from "react-router-dom";
import campaigns from "./campaignData";

const getFallbackImage = (id) =>
  `https://picsum.photos/seed/fundraising-campaign-${id}/1000/600`;

const Campaigns = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:p-10">
      <h1 className="mb-3 text-center text-3xl font-bold text-[#007A8E] sm:text-4xl">
        Active Fundraising Campaigns
      </h1>
      <p className="mb-8 text-center text-base text-gray-600 sm:mb-10 sm:text-lg">
        Support causes that make a difference. Select a campaign to learn more.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((camp) => {
          const progress = Math.round((camp.raised / camp.goal) * 100);

          return (
            <article
              key={camp.id}
              className="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg transition duration-300 hover:shadow-2xl"
            >
              <img
                src={camp.image}
                alt={camp.title}
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = getFallbackImage(camp.id);
                }}
                className="h-48 w-full object-cover"
              />

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="min-w-0 flex-1 text-lg font-bold text-gray-800 sm:text-xl">{camp.title}</h2>
                  <span className="shrink-0 rounded-full bg-[#007A8E] px-3 py-1 text-xs font-semibold text-white">
                    {camp.category}
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-gray-600">{camp.description}</p>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs font-semibold text-gray-700">
                    <span>Rs. {camp.raised.toLocaleString()} raised</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-[#007A8E]"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Goal: Rs. {camp.goal.toLocaleString()} | {camp.beneficiaries}
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-6 min-[380px]:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate(`/campaigns/${camp.id}`)}
                    className="flex-1 rounded-lg border border-[#007A8E] py-2 text-sm font-semibold text-[#007A8E] transition hover:bg-teal-50"
                  >
                    View More
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/donate/${camp.id}`)}
                    className="flex-1 rounded-lg bg-[#007A8E] py-2 text-sm font-semibold text-white transition hover:bg-[#005F6B]"
                  >
                    Donate Now
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-12 rounded-xl bg-white p-5 shadow-lg sm:mt-16 sm:p-8">
        <h2 className="mb-6 text-xl font-bold text-[#007A8E] sm:text-2xl">Why Your Donation Matters</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-[#007A8E]">100%</div>
            <p className="text-gray-600">Transparent fund allocation and tracking</p>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-[#007A8E]">50K+</div>
            <p className="text-gray-600">Lives positively impacted annually</p>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-[#007A8E]">15+</div>
            <p className="text-gray-600">Active campaigns across sectors</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
