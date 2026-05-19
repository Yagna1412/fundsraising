import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  
  const adminName = localStorage.getItem("username") || "Admin";

  return (
    <div className="flex min-h-screen bg-gray-100">

      <aside className="w-64 bg-teal-700 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

        <nav className="space-y-4">
          <button className="w-full text-left hover:text-gray-300"
            onClick={() => navigate("/admin")}>
            📊 Dashboard
          </button>

          <button className="w-full text-left hover:text-gray-300"
            onClick={() => navigate("/admin/campaigns")}>
            📁 Manage Campaigns
          </button>

          <button className="w-full text-left hover:text-gray-300"
            onClick={() => navigate("/admin/users")}>
            👥 User List
          </button>

          <button className="w-full text-left hover:text-gray-300"
            onClick={() => navigate("/admin/donations")}>
            💰 Donations Overview
          </button>

          <button className="w-full text-left text-red-300 font-semibold mt-10"
            onClick={() => {
              localStorage.clear();
              navigate("/loginSignup");
            }}>
            🚪 Logout
          </button>
        </nav>
      </aside>

    
      <main className="flex-1 p-10">
        
       
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-[#007A8E]">
            Welcome, {adminName}
          </h1>
          <p className="text-gray-600">Admin Dashboard Overview</p>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-white shadow-lg p-6 rounded-xl border-l-4 border-teal-600">
            <h3 className="text-xl font-bold">Total Campaigns</h3>
            <p className="text-3xl font-bold mt-3 text-gray-700">42</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl border-l-4 border-teal-600">
            <h3 className="text-xl font-bold">Total Donations</h3>
            <p className="text-3xl font-bold mt-3 text-gray-700">₹ 1,20,000</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl border-l-4 border-teal-600">
            <h3 className="text-xl font-bold">Total Users</h3>
            <p className="text-3xl font-bold mt-3 text-gray-700">150</p>
          </div>

        </div>

      
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-[#007A8E] mb-4">Recent Donations</h2>

          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">Donor</th>
                <th className="p-3 border">Campaign</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Date</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="p-3 border">Rahul</td>
                <td className="p-3 border">Child Education</td>
                <td className="p-3 border">₹ 1000</td>
                <td className="p-3 border">12/01/2025</td>
              </tr>
              <tr>
                <td className="p-3 border">Priya</td>
                <td className="p-3 border">Medical Help</td>
                <td className="p-3 border">₹ 2000</td>
                <td className="p-3 border">11/01/2025</td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
