import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// import {

//   approveProject,
//   rejectProject,
// } from "../../store/slices/projectSlice";

import { AlertTriangle, Eye, BadgeCheck, CheckCircle, CheckCircle2, ChevronDown, Clock, FileDown, Filter, Folder, Plus, Search, X, XCircle } from "lucide-react";
import { downloadProjectFiles } from "../../store/slices/projectSlice";

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
      );

      const { blob } = res.payload;

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", name || "download");

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

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
                          // const res = await dispatch(getProject(project._id));
                          // if (!getProject.fulfilled.match(res)) return;
                          // const detail = res.payload?.payload || res.payload;
                          // setCurrentProject(detail);
                          // setShowViewModal(true);
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

 


    </div >

  </>;
};

export default ProjectsPage;