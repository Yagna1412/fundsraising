import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Donate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDonate = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.amount) {
      alert("Please fill all fields!");
      return;
    }

    
    const donations = JSON.parse(localStorage.getItem("userDonations")) || [];

    const newDonation = {
      campaignId: id,
      name: form.name,
      email: form.email,
      amount: form.amount,
      date: new Date().toLocaleString()
    };

    
    donations.push(newDonation);
    localStorage.setItem("userDonations", JSON.stringify(donations));

    alert("Donation saved successfully!");

    setForm({ name: "", email: "", amount: "" });

   
    navigate("/dashboard");
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-teal-700">
        Donate to Campaign #{id}
      </h2>

      <form className="mt-5 space-y-4" onSubmit={handleDonate}>
        <div>
          <label className="font-semibold">Your Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="example@gmail.com"
            required
          />
        </div>

        <div>
          <label className="font-semibold">Donation Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter amount"
            required
          />
        </div>

        <button className="w-full bg-teal-700 text-white py-2 rounded-md hover:bg-teal-800 font-semibold">
          Proceed to Pay
        </button>
      </form>
    </div>
  );
};

export default Donate;
