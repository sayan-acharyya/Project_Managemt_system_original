import React, { useState } from "react";
import { submitProjectProposal } from "../../store/slices/studentSlice";
import { useDispatch } from "react-redux";

const SubmitProposal = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(submitProjectProposal(formData));
      setFormData({ title: "", description: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Top Accent Bar */}
        <div className="h-2 bg-blue-600" />

        <div className="p-10">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-gray-800">
              Submit Project Proposal
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              Fill in the details carefully before submitting your proposal.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Title Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter project title"
                className="w-full border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none py-2 transition-all duration-200"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Project Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Describe your project idea..."
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Submitting..." : "Submit Proposal"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitProposal;