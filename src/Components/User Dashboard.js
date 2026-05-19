import React from "react";

const UserDashboard = () => {
  const donations = JSON.parse(localStorage.getItem("userDonations")) || [];

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-[#007A8E] mb-8">Your Donations</h1>

      {donations.length === 0 ? (
        <p>You have not donated yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {donations.map((don, index) => (
            <div
              key={index}
              className="bg-white shadow-xl p-6 rounded-lg border-l-4 border-[#007A8E]"
            >
              <h2 className="text-xl font-bold">
                Campaign #{don.campaignId}
              </h2>
              <p className="mt-2">Name: {don.name}</p>
              <p>Email: {don.email}</p>
              <p className="font-semibold mt-2">Amount Donated: ₹{don.amount}</p>
              <p className="text-sm text-gray-500 mt-2">Date: {don.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
