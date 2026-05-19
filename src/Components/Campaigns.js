import React from "react";
import { useNavigate } from "react-router-dom";

const Campaigns = () => {
  const navigate = useNavigate();

  
  const campaigns = [
    {
      id: 1,
      title: "Help Children for Education",
      category: "Education",
      description: "Support poor children with books, meals & school fees.",
      goal: 50000,
      raised: 23000,
      image:
        "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 2,
      title: "Emergency Medical Support",
      category: "Medical",
      description: "Help patients needing emergency treatment.",
      goal: 100000,
      raised: 65000,
      image:
        "https://images.unsplash.com/photo-1580281657521-389c76a8e9a0?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 3,
      title: "Disaster Relief Support",
      category: "Emergency",
      description: "Provide food, shelter and emergency kits.",
      goal: 75000,
      raised: 30000,
      image:
        "https://images.unsplash.com/photo-1584466991050-5d9f1c2b49b7?auto=format&fit=crop&w=800&q=60",
    },
  ];

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#007A8E] mb-8 text-center">
        Active Fundraising Campaigns
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-white shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition"
          >
            <img
              src={camp.image}
              alt={camp.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-5">
              <h2 className="text-xl font-bold">{camp.title}</h2>
              <p className="text-sm text-gray-500">{camp.category}</p>

              <p className="mt-3 text-gray-700">{camp.description}</p>

          
              <div className="mt-4">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Raised: ₹{camp.raised}</span>
                  <span>Goal: ₹{camp.goal}</span>
                </div>

               
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-[#007A8E] h-2 rounded-full"
                    style={{
                      width: `${(camp.raised / camp.goal) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

             
              <button
                onClick={() => navigate(`/donate/${camp.id}`)}
                className="mt-5 w-full bg-[#007A8E] hover:bg-[#005F6B] text-white py-2 rounded-lg font-semibold"
              >
                Donate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
