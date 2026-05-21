import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Campaigns = () => {
  const navigate = useNavigate();
  const [expandedCampaign, setExpandedCampaign] = useState(null);

  const campaigns = [
    {
      id: 1,
      title: "Help Children for Education",
      category: "Education",
      description: "Support poor children with books, meals & school fees.",
      detailedDescription: "Provide quality education to underprivileged children by covering tuition fees, school supplies, uniforms, and nutritious meals. Our program reaches 500+ students across 15 schools in rural areas.",
      goal: 50000,
      raised: 23000,
      image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=60",
      beneficiaries: "500+ students",
      duration: "12 months",
      fundAllocation: [
        { label: "School Fees", percentage: 40 },
        { label: "Books & Supplies", percentage: 30 },
        { label: "Meals & Nutrition", percentage: 20 },
        { label: "Administration", percentage: 10 },
      ],
      impact: [
        "100% school attendance rate",
        "Average grade improvement: 25%",
        "Dropout rate reduced to 5%",
      ],
    },
    {
      id: 2,
      title: "Emergency Medical Support",
      category: "Medical",
      description: "Help patients needing emergency treatment.",
      detailedDescription: "Provide critical emergency medical care to patients without financial resources. We partner with 8 major hospitals to offer free surgeries, treatments, and medications.",
      goal: 100000,
      raised: 65000,
      image: "https://images.unsplash.com/photo-1599700403969-f77b3aa74837?auto=format&fit=crop&w=800&q=60",
      beneficiaries: "1000+ patients",
      duration: "12 months",
      fundAllocation: [
        { label: "Surgeries & Procedures", percentage: 45 },
        { label: "Medications", percentage: 25 },
        { label: "Hospital Bills", percentage: 20 },
        { label: "Transportation", percentage: 10 },
      ],
      impact: [
        "1000+ patients treated",
        "250+ surgeries completed",
        "98% survival rate",
      ],
    },
    {
      id: 3,
      title: "Disaster Relief Support",
      category: "Emergency",
      description: "Provide food, shelter and emergency kits.",
      detailedDescription: "Immediate relief to disaster-affected families with food, shelter, water purification kits, and medical supplies. Rapid deployment team covers flood, earthquake, and cyclone affected areas.",
      goal: 75000,
      raised: 30000,
      image: "https://images.unsplash.com/photo-1764684994219-8347a5ab0e5e?auto=format&fit=crop&w=800&q=60",
      beneficiaries: "2000+ families",
      duration: "Ongoing",
      fundAllocation: [
        { label: "Food & Water", percentage: 35 },
        { label: "Temporary Shelter", percentage: 30 },
        { label: "Medical Supplies", percentage: 20 },
        { label: "Emergency Logistics", percentage: 15 },
      ],
      impact: [
        "2000+ families assisted",
        "10,000+ meals distributed",
        "500+ temporary shelters setup",
      ],
    },
    {
      id: 4,
      title: "Clean Water & Sanitation",
      category: "Health",
      description: "Install wells and provide clean drinking water access.",
      detailedDescription: "Build sustainable water infrastructure in villages lacking clean water sources. Each project includes well installation, water purification systems, and community training for maintenance.",
      goal: 60000,
      raised: 42000,
      image: "https://images.unsplash.com/photo-1559027615-cd2628902d4a?auto=format&fit=crop&w=800&q=60",
      beneficiaries: "3000+ people",
      duration: "18 months",
      fundAllocation: [
        { label: "Well Construction", percentage: 50 },
        { label: "Purification Systems", percentage: 25 },
        { label: "Community Training", percentage: 15 },
        { label: "Maintenance", percentage: 10 },
      ],
      impact: [
        "15 wells constructed",
        "Waterborne disease reduced by 60%",
        "200+ hours of training provided",
      ],
    },
    {
      id: 5,
      title: "Skills Training for Youth",
      category: "Employment",
      description: "Vocational training programs for unemployed youth.",
      detailedDescription: "Equip unemployed youth with practical skills through 6-month vocational courses in IT, tailoring, carpentry, and hospitality. Includes job placement assistance and entrepreneurship support.",
      goal: 80000,
      raised: 52000,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=60",
      beneficiaries: "300+ youth",
      duration: "24 months",
      fundAllocation: [
        { label: "Trainer Salaries", percentage: 45 },
        { label: "Learning Materials", percentage: 25 },
        { label: "Job Placement", percentage: 20 },
        { label: "Certification", percentage: 10 },
      ],
      impact: [
        "300+ youth trained",
        "75% job placement rate",
        "Average income increase: 150%",
      ],
    },
    {
      id: 6,
      title: "Women Empowerment Program",
      category: "Social",
      description: "Microfinance and skill development for women.",
      detailedDescription: "Provide microloans and business training to underprivileged women to start self-employment ventures. Support includes literacy programs, financial literacy, and mentorship.",
      goal: 70000,
      raised: 38000,
      image: "https://images.unsplash.com/photo-1494888286974-456149c63e98?auto=format&fit=crop&w=800&q=60",
      beneficiaries: "500+ women",
      duration: "24 months",
      fundAllocation: [
        { label: "Microloans", percentage: 50 },
        { label: "Business Training", percentage: 20 },
        { label: "Mentorship", percentage: 15 },
        { label: "Support Services", percentage: 15 },
      ],
      impact: [
        "500+ women empowered",
        "2000+ family members benefited",
        "Average business success rate: 85%",
      ],
    },
    {
      id: 7,
      title: "Environmental Conservation",
      category: "Environment",
      description: "Tree plantation and habitat restoration projects.",
      detailedDescription: "Plant trees, restore forests, and protect natural habitats. Our green initiative combats climate change while creating green jobs and improving air quality in urban and rural areas.",
      goal: 45000,
      raised: 18000,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=60",
      beneficiaries: "10,000+ trees",
      duration: "12 months",
      fundAllocation: [
        { label: "Tree Planting", percentage: 40 },
        { label: "Maintenance", percentage: 30 },
        { label: "Community Education", percentage: 20 },
        { label: "Monitoring", percentage: 10 },
      ],
      impact: [
        "50,000+ trees planted",
        "100+ hectares restored",
        "2000+ community volunteers",
      ],
    },
    {
      id: 8,
      title: "Elderly Care & Support",
      category: "Welfare",
      description: "Healthcare and livelihood support for elderly citizens.",
      detailedDescription: "Provide comprehensive care to elderly citizens including healthcare, nutrition, social engagement, and pension support. Our centers offer medical checkups, activities, and community support.",
      goal: 55000,
      raised: 28000,
      image: "https://images.unsplash.com/photo-1576091160550-112173f7f869?auto=format&fit=crop&w=800&q=60",
      beneficiaries: "600+ elderly",
      duration: "12 months",
      fundAllocation: [
        { label: "Healthcare", percentage: 40 },
        { label: "Nutrition & Food", percentage: 30 },
        { label: "Care Staff", percentage: 20 },
        { label: "Activities & Support", percentage: 10 },
      ],
      impact: [
        "600+ elderly supported",
        "1200+ medical checkups",
        "98% satisfaction rate",
      ],
    },
  ];

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
