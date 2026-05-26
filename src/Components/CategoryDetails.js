import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const descriptions = {
  "Help Children": "Support food, shelter, education and basic needs for children.",
  "Medical Support": "Provide funds for surgeries, treatments, and emergency medical help.",
  "Education Aid": "Help students with fees, books, college admission and more.",
  "Emergency Help": "Provide urgent funds for accidents, natural disasters, or crises."
};

const images = {
  "Help Children": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
  "Medical Support": "https://images.unsplash.com/photo-1580281657521-389c76a8e9a0",
  "Education Aid": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc",
  "Emergency Help": "https://source.unsplash.com/photo-1580281657521-389c76a8e9a0"
}; 

const CategoryDetails = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); 

  const startFund = () => {
    if (!token) {
      navigate("/loginSignup");
    } else {
      navigate(`/create-fundraiser?category=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:p-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-teal-800 shadow-sm transition hover:bg-teal-50"
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <img
        src={images[name]}
        alt={name}
        className="rounded-xl shadow-lg w-full h-60 object-cover"
      />

      <h1 className="mt-5 text-2xl font-bold text-[#007A8E] sm:text-3xl">{name}</h1>

      <p className="mt-3 text-base text-gray-700 sm:text-lg">
        {descriptions[name]}
      </p>

      <button
        onClick={startFund}
        className="mt-6 w-full rounded-lg bg-[#007A8E] px-5 py-3 font-semibold text-white hover:bg-[#005F6B] sm:w-auto"
      >
        Start Fundraiser in {name}
      </button>
    </div>
  );
};

export default CategoryDetails;
