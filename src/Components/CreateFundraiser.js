import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateFundraiser = () => {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    goalAmount: "",
    endDate: "",
    beneficiary: "",
    description: "",
    creator: user.name || "",
    image: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);

      setForm({
        ...form,
        image: reader.result
      });
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const campaigns =
      JSON.parse(
        localStorage.getItem(
          "userFunds"
        )
      ) || [];

    campaigns.push({
      id: Date.now(),
      ...form,
      raised: 0,
      createdAt:
        new Date().toLocaleString()
    });

    localStorage.setItem(
      "userFunds",
      JSON.stringify(campaigns)
    );

    alert(
      "Fundraiser created successfully 🎉"
    );

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-5">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-10">

          <h1 className="text-5xl font-bold text-teal-700">
            Create Your Fundraiser
          </h1>

          <p className="text-gray-500 mt-3">
            Start raising funds and make
            an impact.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT */}

          <div className="bg-white rounded-xl shadow p-8">

            <h2 className="text-2xl font-bold mb-6">
              Fundraiser Details
            </h2>

            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >

              <input
                name="title"
                placeholder="Campaign Title"
                value={form.title}
                onChange={handleChange}
                className="w-full p-4 border rounded"
                required
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-4 border rounded"
                required
              >
                <option value="">
                  Select Category
                </option>

                <option>
                  Education
                </option>

                <option>
                  Medical
                </option>

                <option>
                  Environment
                </option>

                <option>
                  Emergency
                </option>

                <option>
                  Social
                </option>

                <option>
                  Welfare
                </option>

              </select>

              <input
                type="number"
                name="goalAmount"
                placeholder="Goal Amount ₹"
                value={form.goalAmount}
                onChange={handleChange}
                className="w-full p-4 border rounded"
                required
              />

              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full p-4 border rounded"
              />

              <input
                name="beneficiary"
                placeholder="Beneficiary Name"
                value={form.beneficiary}
                onChange={handleChange}
                className="w-full p-4 border rounded"
              />

              <textarea
                rows="5"
                name="description"
                placeholder="Tell your story..."
                value={form.description}
                onChange={handleChange}
                className="w-full p-4 border rounded"
                required
              />

              <div>

                <label className="font-semibold">

                  Upload Cover Image

                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="mt-2"
                />

              </div>

              <button
                className="w-full bg-teal-700 text-white py-4 rounded-lg hover:bg-teal-800"
              >
                Launch Fundraiser
              </button>

            </form>

          </div>

          {/* RIGHT */}

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="h-72 bg-gray-100">

              {preview ? (

                <img
                  src={preview}
                  alt=""
                  className="w-full h-full object-cover"
                />

              ) : (

                <div className="h-full flex items-center justify-center text-gray-400">

                  Campaign Preview

                </div>

              )}

            </div>

            <div className="p-8">

              <h2 className="text-3xl font-bold">

                {form.title ||
                  "Campaign Title"}

              </h2>

              <div className="mt-3 inline-block bg-teal-100 px-4 py-1 rounded-full">

                {form.category ||
                  "Category"}

              </div>

              <p className="mt-6 text-gray-600">

                {form.description ||
                  "Your campaign description will appear here..."}

              </p>

              <div className="mt-8">

                <div className="flex justify-between">

                  <span>
                    Raised ₹0
                  </span>

                  <span>
                    Goal ₹
                    {form.goalAmount ||
                      0}
                  </span>

                </div>

                <div className="h-3 bg-gray-200 rounded mt-3">

                  <div className="bg-teal-700 h-full w-0 rounded" />

                </div>

              </div>

              <div className="mt-8 space-y-3">

                <p>
                  <b>Creator:</b>{" "}
                  {user.name ||
                    "Unknown"}
                </p>

                <p>
                  <b>Beneficiary:</b>{" "}
                  {form.beneficiary ||
                    "-"}
                </p>

                <p>
                  <b>End Date:</b>{" "}
                  {form.endDate ||
                    "-"}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CreateFundraiser;