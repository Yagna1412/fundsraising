import React from "react";
import { useParams, useNavigate } from "react-router-dom";

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

  const userLoggedIn = localStorage.getItem("loggedInUser"); 

  const startFund = () => {
    if (!userLoggedIn) {
      navigate("/loginSignup");
    } else {
      navigate(`/create-fundraiser?category=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <img
        src={images[name]}
        alt={name}
        className="rounded-xl shadow-lg w-full h-60 object-cover"
      />

      <h1 className="text-3xl font-bold mt-5 text-[#007A8E]">{name}</h1>

      <p className="text-gray-700 mt-3 text-lg">
        {descriptions[name]}
      </p>

      <button
        onClick={startFund}
        className="mt-6 px-5 py-3 bg-[#007A8E] text-white font-semibold rounded-lg hover:bg-[#005F6B]"
      >
        Start Fundraiser in {name}
      </button>
    </div>
  );
};

export default CategoryDetails;
