import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import backendApi from "../services/backendApi";

const DEFAULT_PREVIEW_IMAGE =
  "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1600&q=80";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

const CreateFundraiser = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = getStoredUser();

  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    goalAmount: "",
    endDate: "",
    beneficiary: "",
    description: "",
    creator: user.name || "",
    image: "",
  });

  const handleChange = (e) => {
    setForm((currentForm) => ({
      ...currentForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);

      setForm((currentForm) => ({
        ...currentForm,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const image = location?.state?.image || DEFAULT_PREVIEW_IMAGE;
    setPreview(image);
    setForm((f) => ({ ...f, image }));
  }, [location?.state?.image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const created = await backendApi.createCampaign({
        title: form.title,
        cause: form.category,
        description: form.description,
        shortDescription: form.description?.slice(0, 180),
        imageUrl: form.image?.startsWith("data:") ? DEFAULT_PREVIEW_IMAGE : form.image,
        goalAmount: Number(form.goalAmount),
        duration: form.endDate ? `Until ${form.endDate}` : "Open",
        beneficiaries: form.beneficiary || form.creator || "Community",
      });

      // Keep a local copy for admin pending-review UI if needed
      const localFunds = JSON.parse(localStorage.getItem("userFunds") || "[]");
      localFunds.push({
        id: created.id,
        ...form,
        raised: 0,
        status: "Active",
        createdAt: new Date().toLocaleString(),
      });
      localStorage.setItem("userFunds", JSON.stringify(localFunds));

      alert("Fundraiser created successfully and is now live.");
      navigate(`/campaigns/${created.id}`);
    } catch (err) {
      alert(err.message || "Failed to create fundraiser. Is the API running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-5 sm:py-12">

      <div className="max-w-6xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-teal-800 shadow-sm hover:bg-teal-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mb-8 text-center sm:mb-10">

          <h1 className="text-3xl font-bold text-teal-700 sm:text-4xl lg:text-5xl">
            Create Your Fundraiser
          </h1>

          <p className="text-gray-500 mt-3">
            Start raising funds and make
            an impact.
          </p>

        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">

          {/* LEFT */}

          <div className="rounded-xl bg-white p-5 shadow sm:p-8">

            <h2 className="text-2xl font-bold mb-6">
              Fundraiser Details
            </h2>

            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >

              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-600 mb-2">Cover Image Preview</label>
                <div className="h-40 w-full rounded overflow-hidden bg-gray-100 flex items-center justify-center mb-2">
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400">No image selected</div>
                  )}
                </div>
                <input
                  name="title"
                  placeholder="Campaign Title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full p-4 border rounded"
                  required
                />
              </div>

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
                  className="mt-2 block w-full text-sm"
                />

              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-teal-700 py-4 text-white hover:bg-teal-800 disabled:opacity-60"
              >
                {submitting ? "Creating…" : "Launch Fundraiser"}
              </button>

            </form>

          </div>

          {/* RIGHT */}

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="h-52 bg-gray-100 sm:h-72">

              {preview ? (

                <img
                  src={preview}
                  alt="Life-saving campaign preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">

                  Campaign Preview

                </div>

              )}

            </div>

            <div className="p-5 sm:p-8">

              <h2 className="break-words text-2xl font-bold sm:text-3xl">

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

                <div className="flex flex-wrap justify-between gap-2">

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
