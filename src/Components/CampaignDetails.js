import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCampaignById } from "./campaignData";

const getFallbackImage = (id) =>
  `https://picsum.photos/seed/fundraising-campaign-${id}/1200/720`;

const CampaignDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const campaign = getCampaignById(id);

  if (!campaign) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Campaign Not Found</h1>
        <p className="mt-3 text-slate-600">
          This campaign is no longer available or the link is incorrect.
        </p>
        <button
          type="button"
          onClick={() => navigate("/campaigns")}
          className="mt-8 rounded-lg bg-[#007A8E] px-6 py-3 font-semibold text-white transition hover:bg-[#005F6B]"
        >
          Back to Campaigns
        </button>
      </main>
    );
  }

  const progress = Math.round((campaign.raised / campaign.goal) * 100);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="relative h-72 overflow-hidden bg-slate-100 sm:h-96">
          <img
            src={campaign.image}
            alt={campaign.title}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = getFallbackImage(campaign.id);
            }}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          <button
            type="button"
            onClick={() => navigate("/campaigns")}
            className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-slate-700 shadow transition hover:bg-white"
          >
            Back to Campaigns
          </button>
          <div className="absolute bottom-7 left-6 right-6 sm:left-9">
            <span className="inline-flex rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-teal-700">
              {campaign.category}
            </span>
            <h1 className="mt-3 max-w-3xl text-3xl font-black text-white sm:text-5xl">
              {campaign.title}
            </h1>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_340px]">
          <section>
            <h2 className="text-xl font-black text-slate-900">About this campaign</h2>
            <p className="mt-3 leading-7 text-slate-600">{campaign.detailedDescription}</p>

            <div className="mt-8">
              <h2 className="font-black text-slate-900">
                Specific {campaign.recipientType}s you can support
              </h2>
              <div className="mt-3 grid gap-3">
                {campaign.recipients.map((recipient) => (
                  <button
                    key={recipient.id}
                    type="button"
                    onClick={() => navigate(`/donate/${campaign.id}?recipient=${recipient.id}`)}
                    className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-teal-500 hover:bg-teal-50"
                  >
                    <span className="block font-bold text-slate-900">{recipient.name}</span>
                    <span className="mt-1 block text-sm text-slate-600">{recipient.need}</span>
                    <span className="mt-1 block text-xs font-semibold text-slate-500">
                      {recipient.location} | Target Rs. {recipient.target.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-3 font-black text-slate-900">Budget Breakdown</h2>
                <div className="space-y-3">
                  {campaign.fundAllocation.map((fund) => (
                    <div key={fund.label}>
                      <div className="mb-1 flex justify-between gap-3 text-sm">
                        <span className="text-slate-700">{fund.label}</span>
                        <span className="font-bold text-slate-900">{fund.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-[#007A8E]"
                          style={{ width: `${fund.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="mb-3 font-black text-slate-900">Expected Impact</h2>
                <ul className="space-y-3 text-sm text-slate-600">
                  {campaign.impact.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="font-black text-teal-700">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-2xl bg-slate-50 p-5">
            <h2 className="text-lg font-black text-slate-900">Funding Progress</h2>
            <div className="mt-5 flex justify-between text-sm font-bold">
              <span className="text-teal-700">Rs. {campaign.raised.toLocaleString()}</span>
              <span className="text-slate-700">{progress}% funded</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-slate-200">
              <div
                className="h-3 rounded-full bg-[#007A8E]"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <dt className="font-semibold text-slate-500">Goal</dt>
                <dd className="font-bold text-slate-900">Rs. {campaign.goal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <dt className="font-semibold text-slate-500">Duration</dt>
                <dd className="font-bold text-slate-900">{campaign.duration}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-semibold text-slate-500">Beneficiaries</dt>
                <dd className="font-bold text-slate-900">{campaign.beneficiaries}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => navigate(`/donate/${campaign.id}`)}
              className="mt-7 w-full rounded-xl bg-[#007A8E] py-3 font-black text-white transition hover:bg-[#005F6B]"
            >
              Donate to this Campaign
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CampaignDetails;
