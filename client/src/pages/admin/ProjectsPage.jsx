import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import {

//   approveProject,
//   rejectProject,
// } from "../../store/slices/projectSlice";

import { AlertTriangle, CheckCircle2, FileDown, Folder, Plus, X } from "lucide-react";
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

      {/* STATS */}
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

      
    </div>

  </>;
};

export default ProjectsPage;