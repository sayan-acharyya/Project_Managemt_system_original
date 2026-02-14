import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import {
  fetchAllSupervisor,
  fetchProject,
  getSupervisor,
  requestSupervisor
} from "../../store/slices/studentSlice"
import { Link } from "react-router-dom"
import { X } from "lucide-react"
const SupervisorPage = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(state => state.auth);
  const { project, supervisors, supervisor } = useSelector(state => state.student);

  const [showRequestModel, setShowRequestModel] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  useEffect(() => {
    dispatch(fetchProject());
    dispatch(getSupervisor());
    dispatch(fetchAllSupervisor())
  }, [dispatch])

  const hasSupervisor = useMemo(
    () => !!(supervisor && supervisor._id),
    [supervisor]
  )

  const hasProject = useMemo(() => !!(project && project._id), [project])

  const formatDeadline = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) return "-";

    const day = date.getDate();
    const month = date.getMonth() + 1; // Month starts from 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleOpenRequest = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setShowRequestModel(true);
  }

  const submitRequest = () => {
    if (!selectedSupervisor) return;

    const message = requestMessage?.trim() || `${authUser.name || "Student"} has request ${selectedSupervisor.name} to be their supervisor`
    dispatch(requestSupervisor({ teacherId: selectedSupervisor._id, message }))

  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ================= SUPERVISOR SECTION ================= */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-100">

          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-indigo-600 to-blue-600">
            <h1 className="text-xl font-semibold text-white">
              Supervisor Information
            </h1>

            {hasSupervisor ? (
              <span className="px-3 py-1 text-xs font-semibold bg-white text-indigo-600 rounded-full">
                Assigned
              </span>
            ) : (
              <span className="px-3 py-1 text-xs font-semibold bg-white text-gray-600 rounded-full">
                Not Assigned
              </span>
            )}
          </div>

          {/* Body */}
          <div className="p-8">
            {hasSupervisor ? (
              <div className="flex flex-col md:flex-row gap-8">

                {/* Profile */}
                <div className="flex justify-center md:justify-start">
                  <img
                    src="/placeholder.jpg"
                    alt="Supervisor"
                    className="w-28 h-28 rounded-xl object-cover border-4 border-indigo-100 shadow-md"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="bg-indigo-50 p-5 rounded-xl">
                    <p className="text-xs uppercase text-indigo-500 mb-1">
                      Name
                    </p>
                    <p className="text-lg font-semibold text-indigo-900">
                      {supervisor?.name || "-"}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-xl">
                    <p className="text-xs uppercase text-blue-500 mb-1">
                      Department
                    </p>
                    <p className="text-blue-900">
                      {supervisor?.department || "-"}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-5 rounded-xl">
                    <p className="text-xs uppercase text-purple-500 mb-1">
                      Email
                    </p>
                    <p className="text-purple-900">
                      {supervisor?.email || "-"}
                    </p>
                  </div>

                  <div className="bg-pink-50 p-5 rounded-xl">
                    <p className="text-xs uppercase text-pink-500 mb-1">
                      Expertise
                    </p>
                    <p className="text-pink-900">
                      {Array.isArray(supervisor?.experties)
                        ? supervisor.experties.join(", ")
                        : supervisor?.experties || "-"}
                    </p>
                  </div>

                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                You have not been assigned a supervisor yet.
              </div>
            )}
          </div>
        </div>


        {/* ================= PROJECT SECTION ================= */}
        {hasProject && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">

            {/* Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600">
              <h2 className="text-xl font-semibold text-white">
                Project Overview
              </h2>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8">

              {/* Top Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 p-6 rounded-xl shadow-sm">
                  <p className="text-xs uppercase text-indigo-600 mb-2">
                    Title
                  </p>
                  <p className="font-semibold text-indigo-900">
                    {project?.title || "-"}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 p-6 rounded-xl shadow-sm">
                  <p className="text-xs uppercase text-emerald-600 mb-2">
                    Status
                  </p>
                  <span
                    className={`text-sm font-semibold capitalize
                    ${project?.status === "approved"
                        ? "text-emerald-700"
                        : project?.status === "pending"
                          ? "text-amber-600"
                          : project?.status === "rejected"
                            ? "text-red-600"
                            : "text-gray-700"
                      }`}
                  >
                    {project?.status || "-"}
                  </span>
                </div>

                <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-6 rounded-xl shadow-sm">
                  <p className="text-xs uppercase text-amber-600 mb-2">
                    Deadline
                  </p>
                  <p className="font-semibold text-amber-900">
                    {project?.deadline
                      ? formatDeadline(project.deadline)
                      : "Not Set"}
                  </p>
                </div>

              </div>

              {/* Dates */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <p className="text-xs uppercase text-blue-500 mb-1">
                  Created On
                </p>
                <p className="text-blue-900 font-medium">
                  {project?.createdAt
                    ? formatDeadline(project.createdAt)
                    : "-"}
                </p>
              </div>

              {/* Description */}
              {project?.description && (
                <div className="bg-indigo-50 p-6 rounded-xl">
                  <p className="text-xs uppercase text-indigo-500 mb-2">
                    Description
                  </p>
                  <p className="text-indigo-900 leading-relaxed">
                    {project?.description}
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ================= IF NO PROJECT ================= */}
        {!hasProject && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-100">

            {/* Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-red-500 to-pink-500">
              <h2 className="text-xl font-semibold text-white">
                Project Required
              </h2>
            </div>

            {/* Body */}
            <div className="p-10 text-center space-y-4">

              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100">
                <span className="text-2xl">⚠️</span>
              </div>

              <p className="text-gray-700 text-lg font-medium">
                You haven’t submitted any project proposal yet.
              </p>

              <p className="text-gray-500">
                Please submit your project first before requesting a supervisor.
              </p>

              <Link to={"/student/submit-proposal"} className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition">
                Submit Project
              </Link>

            </div>
          </div>
        )}


        {/* ================= AVAILABLE SUPERVISORS ================= */}
        {hasProject && !hasSupervisor && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-100">

            {/* Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-blue-600">
              <h2 className="text-xl font-semibold text-white">
                Available Supervisors
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                Browse and request a supervisor from available faculty members
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">

              {supervisors && supervisors.map((sup) => (
                <div
                  key={sup._id}
                  className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >

                  {/* Top Section */}
                  <div className="flex items-center gap-4 mb-4">

                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold text-lg shadow">
                      {sup?.name?.charAt(0).toUpperCase() || "S"}
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {sup.name}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {sup.department}
                      </p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-3 mb-6">

                    <div>
                      <p className="text-xs uppercase text-indigo-500 mb-1">
                        Email
                      </p>
                      <p className="text-sm text-slate-700">
                        {sup.email || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase text-indigo-500 mb-1">
                        Expertise
                      </p>
                      <p className="text-sm text-slate-700">
                        {Array.isArray(sup?.experties)
                          ? sup.experties.join(", ")
                          : sup?.experties || "-"}
                      </p>
                    </div>

                  </div>

                  {/* Button */}
                  <button
                    onClick={() => handleOpenRequest(sup)}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition"
                  >
                    Request Supervisor
                  </button>

                </div>
              ))}

            </div>
          </div>
        )}

  
        {/* ================= REQUEST MODAL ================= */}
        {showRequestModel && selectedSupervisor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600">
                <h3 className="text-white font-semibold text-lg">
                  Request Supervision
                </h3>

                <button
                  onClick={() => {
                    setShowRequestModel(false);
                    setSelectedSupervisor(null);
                    setRequestMessage("");
                  }}
                  className="text-white/80 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">

                {/* Selected Supervisor */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <p className="text-sm text-indigo-600 uppercase mb-1">
                    Selected Supervisor
                  </p>
                  <p className="font-semibold text-indigo-900">
                    {selectedSupervisor?.name}
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Message to Supervisor
                  </label>

                  <textarea
                    required
                    value={requestMessage}
                    placeholder="Introduce yourself and explain why you would like this supervisor for your project..."
                    onChange={(e) => setRequestMessage(e.target.value)}
                    className="w-full min-h-[120px] rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none p-4 text-sm resize-none transition"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">

                  <button
                    onClick={() => {
                      setShowRequestModel(false);
                      setSelectedSupervisor(null);
                      setRequestMessage("");
                    }}
                    className="px-5 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={!requestMessage.trim()}
                    onClick={submitRequest}
                    className={`px-5 py-2 rounded-lg text-white font-medium transition shadow-md
              ${requestMessage.trim()
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg"
                        : "bg-gray-300 cursor-not-allowed"
                      }`}
                  >
                    Send Request
                  </button>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupervisorPage 