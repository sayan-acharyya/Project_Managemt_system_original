import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { downloadProjectFiles } from "../../store/slices/projectSlice";
import { AlertTriangle, CheckCircle2, Folder, X } from "lucide-react";

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

  const handleDownload = async (projectId, fileId, name) => {
    const res = await dispatch(downloadProjectFiles({ projectId, fileId })).then(res => {
      const { blob } = res.payload;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name || "download");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    })

  }


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



  const projectStats = [
    {
      title: "Total Projects",
      value: projects.length,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
      Icon: Folder,
    },
    {
      title: "Pending Review",
      value: projects.filter((p) => p.status === "pending").length,
      bg: "bg-orange-100",
      iconColor: "text-orange-600",
      Icon: AlertTriangle,
    },
    {
      title: "Completed",
      value: projects.filter((p) => p.status === "completed").length,
      bg: "bg-green-100",
      iconColor: "text-green-600",
      Icon: CheckCircle2,
    },
    {
      title: "Rejected",
      value: projects.filter((p) => p.status === "rejected").length,
      bg: "bg-red-100",
      iconColor: "text-red-600",
      Icon: X,
    },
  ];


  const handleStatusChange = async (projectId, newStatus) => {
    //1:02:28:17
  }





  return (
    <></>
  );
};

export default ProjectsPage;