import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import campaigns from "./campaignData";

const Campaigns = () => {
  const navigate = useNavigate();
  const [expandedCampaign, setExpandedCampaign] = useState(null);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-[#007A8E] mb-3 text-center">
        Active Fundraising Campaigns
      </h1>
      <p className="text-center text-gray-600 mb-10 text-lg">
        Support causes that make a difference. See exactly how your donation helps.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col"
          >
            {/* Image */}
            <img
              src={camp.image}
              alt={camp.title}
              loading="lazy"
              decoding="async"
              onError={(event) => {
                event.currentTarget.src =
                  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80";
              }}
              className="w-full h-48 object-cover"
            />

            <div className="p-6 flex-1 flex flex-col">
              {/* Title and Category */}
              <h2 className="text-xl font-bold text-gray-800">{camp.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-block px-3 py-1 bg-[#007A8E] text-white text-xs rounded-full font-semibold">
                  {camp.category}
                </span>
                <span className="text-sm text-gray-500">• {camp.beneficiaries}</span>
              </div>

              {/* Description */}
              <p className="mt-3 text-gray-600 text-sm">{camp.description}</p>

              <div className="mt-5 border border-teal-100 rounded-lg overflow-hidden">
                <div className="bg-teal-50 px-4 py-3">
                  <h3 className="text-sm font-bold text-gray-800">
                    Choose a specific {camp.recipientType} to support
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {camp.recipients.slice(0, 2).map((recipient) => (
                    <button
                      key={recipient.id}
                      type="button"
                      onClick={() =>
                        navigate(`/donate/${camp.id}?recipient=${recipient.id}`)
                      }
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition"
                    >
                      <span className="block text-sm font-semibold text-gray-900">
                        {recipient.name}
                      </span>
                      <span className="block text-xs text-gray-600">
                        {recipient.need}
                      </span>
                      <span className="block text-xs text-gray-500 mt-1">
                        {recipient.location} | Need: Rs.{" "}
                        {recipient.target.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-2">
                  <span>₹{camp.raised.toLocaleString()}</span>
                  <span>{Math.round((camp.raised / camp.goal) * 100)}%</span>
                  <span>Goal: ₹{camp.goal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3">
                  <div
                    className="bg-[#007A8E] h-3 rounded-full transition-all"
                    style={{
                      width: `${Math.min((camp.raised / camp.goal) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Fund Allocation Preview */}
              <div className="mt-5 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-bold text-gray-800 mb-3">Fund Allocation</h3>
                <div className="space-y-2">
                  {camp.fundAllocation.slice(0, 2).map((fund, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-gray-700">{fund.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-300 rounded-full h-2">
                          <div
                            className="bg-[#007A8E] h-2 rounded-full"
                            style={{ width: `${fund.percentage}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-800 w-8">{fund.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expand Details Button */}
              <button
                onClick={() => setExpandedCampaign(expandedCampaign === camp.id ? null : camp.id)}
                className="mt-4 text-[#007A8E] font-semibold text-sm hover:underline"
              >
                {expandedCampaign === camp.id ? "Hide Details" : "View Full Details"}
              </button>

              {/* Expanded Content */}
              {expandedCampaign === camp.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  {/* Detailed Description */}
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-3">
                      Specific People You Can Donate To
                    </h4>
                    <div className="space-y-2">
                      {camp.recipients.map((recipient) => (
                        <button
                          key={recipient.id}
                          type="button"
                          onClick={() =>
                            navigate(`/donate/${camp.id}?recipient=${recipient.id}`)
                          }
                          className="w-full border border-gray-200 rounded-lg p-3 text-left hover:border-[#007A8E] hover:bg-teal-50 transition"
                        >
                          <span className="block text-sm font-semibold text-gray-900">
                            {recipient.name}
                          </span>
                          <span className="block text-sm text-gray-600">
                            {recipient.need}
                          </span>
                          <span className="block text-xs text-gray-500 mt-1">
                            {recipient.location} | Target Rs.{" "}
                            {recipient.target.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-2">About This Campaign</h4>
                    <p className="text-sm text-gray-600">{camp.detailedDescription}</p>
                  </div>

                  {/* Complete Fund Allocation */}
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-3">Complete Budget Breakdown</h4>
                    <div className="space-y-2">
                      {camp.fundAllocation.map((fund, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{fund.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-300 rounded-full h-2">
                              <div
                                className="bg-[#007A8E] h-2 rounded-full"
                                style={{ width: `${fund.percentage}%` }}
                              ></div>
                            </div>
                            <span className="font-semibold text-gray-800 w-10">{fund.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Impact Metrics */}
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-2">Expected Impact</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {camp.impact.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-[#007A8E] font-bold mr-2">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Duration */}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Duration:</span> {camp.duration}
                    </p>
                  </div>
                </div>
              )}

              {/* Donate Button */}
              <button
                onClick={() => navigate(`/donate/${camp.id}`)}
                className="mt-4 w-full bg-[#007A8E] hover:bg-[#005F6B] text-white py-2 rounded-lg font-semibold transition"
              >
                Donate Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info Section */}
      <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#007A8E] mb-6">Why Your Donation Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#007A8E] mb-2">100%</div>
            <p className="text-gray-600">Transparent fund allocation & tracking</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#007A8E] mb-2">50K+</div>
            <p className="text-gray-600">Lives positively impacted annually</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#007A8E] mb-2">15+</div>
            <p className="text-gray-600">Active campaigns across sectors</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
