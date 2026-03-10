import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// import {

//   approveProject,
//   rejectProject,
// } from "../../store/slices/projectSlice";

import { AlertTriangle, Eye, BadgeCheck, CheckCircle, CheckCircle2, ChevronDown, Clock, FileDown, Filter, Folder, Plus, Search, X, XCircle, FileTextIcon } from "lucide-react";
import { downloadProjectFiles } from "../../store/slices/projectSlice";
import { approveProject, rejectProject } from "../../store/slices/adminSlice";

const ProjectsPage = () => {
  const dispatch = useDispatch();

  const { projects = [] } = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSupervisor, setFilterSupervisor] = useState("all");

  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [reportSearch, setReportSearch] = useState("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [currentProject, setCurrentProject] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  /* ---------------- Supervisors ---------------- */

  const supervisors = useMemo(() => {
    const set = new Set(
      projects.map((p) => p?.supervisor?.name).filter(Boolean)
    );
    return Array.from(set);
  }, [projects]);

  /* ---------------- Filter Projects ---------------- */

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        (project.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (project.student?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || project.status === filterStatus;

      const matchesSupervisor =
        filterSupervisor === "all" ||
        project.supervisor?.name === filterSupervisor;

      return matchesSearch && matchesStatus && matchesSupervisor;
    });
  }, [projects, searchTerm, filterStatus, filterSupervisor]);

  /* ---------------- Flatten Files ---------------- */

  const files = useMemo(() => {
    return projects.flatMap((p) =>
      (p.files || []).map((f) => ({
        projectId: p._id,
        fileId: f._id,
        originalName: f.originalName,
        uploadedAt: f.uploadedAt,
        projectTitle: p.title,
        studentName: p.student?.name,
      }))
    );
  }, [projects]);

  /* ---------------- Filter Files ---------------- */

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      return (
        (file.originalName || "")
          .toLowerCase()
          .includes(reportSearch.toLowerCase()) ||
        (file.projectTitle || "")
          .toLowerCase()
          .includes(reportSearch.toLowerCase()) ||
        (file.studentName || "")
          .toLowerCase()
          .includes(reportSearch.toLowerCase())
      );
    });
  }, [files, reportSearch]);

  /* ---------------- Download File ---------------- */

const handleDownload = async (projectId, fileId, name) => {
  try {
    const res = await dispatch(
      downloadProjectFiles({ projectId, fileId })
    ).unwrap();

    const fileUrl = res?.fileUrl;

    window.open(fileUrl, "_blank");

  } catch (error) {
    console.error("error downloading file:", error);
  }
};;

  /* ---------------- Status Color ---------------- */

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";

      case "approved":
        return "bg-blue-100 text-blue-800";

      case "pending":
        return "bg-orange-100 text-orange-800";

      case "rejected":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /* ---------------- Project Stats ---------------- */

  const projectStats = [
    {
      title: "Total Projects",
      value: projects.length,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      Icon: Folder,
    },
    {
      title: "Pending Review",
      value: projects.filter((p) => p.status === "pending").length,
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      Icon: AlertTriangle,
    },
    {
      title: "Completed",
      value: projects.filter((p) => p.status === "completed").length,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      Icon: CheckCircle2,
    },
    {
      title: "Rejected",
      value: projects.filter((p) => p.status === "rejected").length,
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      Icon: X,
    },
  ];

  /* ---------------- Change Status ---------------- */

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      if (newStatus === "approved") {
        await dispatch(approveProject(projectId));
      }

      if (newStatus === "rejected") {
        await dispatch(rejectProject(projectId));
      }
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  const projectFiles = useMemo(() => {
    if (!currentProject) return [];
    return (currentProject.files || []).map((f) => ({
      projectId: currentProject._id,
      fileId: f._id,
      originalName: f.originalName,
      uploadedAt: f.uploadedAt
    }));
  }, [currentProject]);

  /* ---------------- UI ---------------- */

  return <>

    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-indigo-50 
                border border-slate-200 rounded-3xl p-6 md:p-8 mb-6 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* Left Section */}
          <div className="flex items-start gap-4">

            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl 
                      bg-blue-100 text-blue-600">
              <Folder className="w-6 h-6" />
            </div>

            {/* Text */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                Projects Dashboard
              </h1>

              <p className="text-slate-500 mt-1 text-sm md:text-base max-w-xl">
                Manage, review, and download reports for all submitted student projects
                in one place.
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => setIsReportsOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                   text-white px-5 py-3 rounded-xl font-medium
                   transition-all duration-200
                   shadow-sm hover:shadow-lg hover:shadow-blue-200
                   active:scale-95"
            >
              <FileDown className="w-5 h-5" />
              Download Reports
            </button>

          </div>

        </div>

      </div>

      {/* STATS CARD*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {projectStats.map((stat, index) => {
          const Icon = stat.Icon;

          return (
            <div
              key={index}
              className={`border border-slate-200 rounded-2xl p-5 shadow-sm 
        hover:shadow-md transition-all duration-200 ${stat.bg}`}
            >
              <div className="flex items-center justify-between">

                {/* Text */}
                <div>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <h2 className="text-2xl font-bold text-slate-800 mt-1">
                    {stat.value}
                  </h2>
                </div>

                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-11 h-11 rounded-xl ${stat.iconBg}`}
                >
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* FILTER */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search Projects
            </label>
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by project title or studnet name......"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 
                       focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 
                       outline-none transition-all text-gray-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Status
            </label>
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 
                       focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 
                       outline-none appearance-none transition-all text-gray-700 font-medium"
              >

                <option value="all">All Projects</option>
                <option value="pending">Pending Projects</option>
                <option value="approved">Approved Projects</option>
                <option value="completed">Completed Projects</option>
                <option value="rejected">Rejected Projects</option>

              </select>
              {/* Custom Arrow for Select */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
          < div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter Supervisor
            </label>
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterSupervisor}
                onChange={(e) => setFilterSupervisor(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 
                       focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 
                       outline-none appearance-none transition-all text-gray-700 font-medium"
              >
                <option value="all">All Supervisors</option>
                {
                  supervisors.map((supervisor, i) => {
                    return (
                      <option key={i} value={supervisor}>{supervisor}</option>
                    )
                  })
                }

              </select>
              {/* Custom Arrow for Select */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* PROJECT TABLE */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Project Overview</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">

            {/* TABLE HEAD */}
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Project Details
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Student
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Supervisor
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Deadline
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredProjects.map((project) => (
                <tr
                  key={project._id}
                  className="hover:bg-slate-50 transition"
                >

                  {/* PROJECT DETAILS */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {project.title}
                      </div>

                      <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {project.description}
                      </div>
                    </div>
                  </td>

                  {/* STUDENT */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {project?.student?.name || "N/A"}
                    </div>
                  </td>

                  {/* SUPERVISOR */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700">
                      {project?.supervisor?.name ? (
                        <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800'>
                          {project?.supervisor?.name}
                        </span>
                      ) : (
                        <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-200 text-red-800'>
                          Not Assigned
                        </span>
                      )}
                    </div>
                  </td>

                  {/* DEADLINE */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700">
                      {project?.deadline
                        ? <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium border border-emerald-100">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          {project.deadline.split("T")[0]}
                        </div>
                        : <div className="inline-flex items-center  px-3 py-1 rounded-full bg-gray-200 text-blue-600 text-xs font-medium border border-slate-200">
                          Not Set yet
                        </div>}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {project.status === "pending" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold border border-yellow-200">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                      </div>
                    )}

                    {project.status === "approved" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Approved
                      </div>
                    )}

                    {project.status === "rejected" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold border border-red-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Rejected
                      </div>
                    )}

                    {project.status === "completed" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </div>
                    )}
                  </td>

                  {/* ACTIONS (EMPTY FOR NOW) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">

                      <button
                        onClick={async () => {

                          setCurrentProject(project);
                          setShowViewModal(true);
                        }}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-lg transition"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      {
                        project.status === "pending" && (
                          <div className="flex gap-2">

                            <button

                              onClick={() => handleStatusChange(project._id, "approved")}
                              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded-lg transition">
                              <CheckCircle size={16} />
                              Approve
                            </button>

                            <button
                              onClick={() => handleStatusChange(project._id, "rejected")}
                              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-lg transition">
                              <XCircle size={16} />
                              Reject
                            </button>

                          </div>
                        )
                      }

                    </div>
                  </td>
                </tr>


              ))}

              {
                filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-12">
                      <div className="flex flex-col items-center justify-center text-center">

                        {/* Icon */}
                        <div className="bg-slate-100 p-4 rounded-full mb-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-slate-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 17v-6h13M9 5h13M5 5h.01M5 11h.01M5 17h.01"
                            />
                          </svg>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-slate-700">
                          No Projects Found
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-slate-500 mt-1">
                          There are currently no projects matching your filters.
                        </p>

                      </div>
                    </td>
                  </tr>
                )
              }
            </tbody>

          </table>


        </div>
      </div>

      {/* VIEW MODEL */}
      {showViewModal && currentProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="relative w-full max-w-3xl mx-4 rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]">

            {/* HEADER */}
            <div className="flex justify-between items-center border-b px-6 py-4 flex-shrink-0">
              <h3 className="text-lg font-semibold text-slate-900">
                Project Details
              </h3>

              <button
                onClick={() => setShowViewModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* BODY (SCROLLABLE) */}
            <div className="p-6 space-y-6 overflow-y-auto">

              {/* TITLE */}
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Project Title
                </p>
                <div className="bg-slate-50 rounded-lg p-3 text-slate-800">
                  {currentProject.title || "-"}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Description
                </p>
                <div className="bg-slate-50 rounded-lg p-3 text-slate-800">
                  {currentProject.description || "-"}
                </div>
              </div>

              {/* INFO GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Student</p>
                  <div className="bg-slate-50 rounded-lg p-3">
                    {currentProject.student?.name || "N/A"}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Supervisor</p>
                  <div className="bg-slate-50 rounded-lg p-3">
                    {currentProject.supervisor?.name || "Not Assigned"}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Status</p>
                  <div className="bg-slate-50 rounded-lg p-3 capitalize">
                    {currentProject.status}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Deadline</p>
                  <div className="bg-slate-50 rounded-lg p-3">
                    {currentProject.deadline
                      ? currentProject.deadline.split("T")[0]
                      : "Not Set"}
                  </div>
                </div>

              </div>

              {/* FILES */}
              <div>
                <h4 className="text-md font-semibold text-slate-800 mb-3">
                  Project Files
                </h4>

                {projectFiles.length === 0 ? (
                  <div className="text-sm text-slate-500">
                    No files uploaded
                  </div>
                ) : (
                  <div className="space-y-2">
                    {projectFiles.map((file) => (
                      <div
                        key={file.fileId}
                        className="flex items-center justify-between bg-slate-50 rounded-lg p-3"
                      >
                        <span className="text-sm text-slate-700">
                          {file.originalName}
                        </span>

                        <button
                          onClick={() =>
                            handleDownload(
                              file.projectId,
                              file.fileId,
                              file.originalName
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md"
                        >
                          Download
                        </button>

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}


      {/* report model */}
      {
        isReportsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsReportsOpen(false)}
            />

            {/* Modal */}
            <div className="
              relative w-full max-w-4xl mx-4
              bg-white rounded-2xl shadow-2xl
              border border-slate-100
              overflow-hidden
              animate-[fadeIn_.25s_ease-out]
            ">

              {/* Header */}
              <div className="relative px-6 py-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-slate-100">

                {/* Soft Glow */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-200/30 rounded-full blur-2xl"></div>

                <div className="relative flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-800 tracking-wide">
                    All Files
                  </h3>

                  <button
                    onClick={() => setIsReportsOpen(false)}
                    className="
                      p-2 rounded-lg
                      text-slate-400 hover:text-slate-700
                      hover:bg-white/60
                      transition-all duration-200
                    "
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>


              {/* Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto bg-gradient-to-b from-slate-50 to-white">

                {/* Search Section */}
                <div className="mb-6">
                  <div className="relative group">

                    {/* Search Icon */}
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35m1.6-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>

                    <input
                      type="text"
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                      placeholder="Search by file name, project title, or student name..."
                      className="
                w-full pl-11 pr-4 py-3
                rounded-xl border border-slate-200
                bg-white text-sm text-slate-700
                shadow-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                transition-all duration-200
              "
                    />
                  </div>

                  {/* Small helper text */}
                  <p className="text-xs text-slate-400 mt-2">
                    Quickly find uploaded reports by name or related project.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 pt-6">

                  {/* Empty state example */}
                  {filteredFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <FileTextIcon className="w-10 h-10 mb-3 opacity-40" />
                      <p className="text-sm">No matching files found</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredFiles.map((f, i) => {
                        return (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded"
                          >
                            <div>
                              <div className="font-medium text-slate-800 ">
                                {f.originalName}
                              </div>
                              <div className="text-sm text-slate-500">
                                {f.projectTitle} - {f.studentName}
                              </div>
                            </div>

                            <button
                              onClick={() => handleDownload(f.projectId, f.fileId, f.originalName)}
                              className="btn-outline btn-small bg-blue-600 rounded-lg px-2 py-1 text-white">Download </button>
                          </div>
                        )
                      })}
                    </div>

                  )}

                </div>
              </div>



            </div>
          </div>
        )
      }

    </div >

  </>;
};

export default ProjectsPage;