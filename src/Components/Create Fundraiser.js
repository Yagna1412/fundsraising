import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateFundraiser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    goalAmount: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    let userFunds = JSON.parse(localStorage.getItem("userFunds")) || [];
    userFunds.push(form);
    localStorage.setItem("userFunds", JSON.stringify(userFunds));

    navigate("/dashboard");
  };

  return (
    <div className="p-10 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-[#007A8E] mb-6">Create a Fundraiser</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-xl rounded-lg">
        <input 
          type="text" 
          placeholder="Fundraiser Title" 
          className="w-full p-3 border rounded" 
          value={form.title}
          onChange={(e)=> setForm({...form, title: e.target.value})}
          required
        />
        <textarea 
          placeholder="Description"
          className="w-full p-3 border rounded"
          value={form.description}
          onChange={(e)=> setForm({...form, description: e.target.value})}
          required
        />
        <input 
          type="number" 
          placeholder="Goal Amount"
          className="w-full p-3 border rounded"
          value={form.goalAmount}
          onChange={(e)=> setForm({...form, goalAmount: e.target.value})}
          required
        />
        <button className="bg-[#007A8E] text-white px-6 py-3 rounded">
          Create Fundraiser
        </button>
      </form>
    </div>
  );
};

export default CreateFundraiser;
