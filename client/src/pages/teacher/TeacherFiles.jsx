import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { downloadTeacherFiles, getFiles } from '../../store/slices/teacherSlice';
import { FileArchive, FileSpreadsheet, FileText, File, Search, LayoutGrid, List, DownloadIcon } from "lucide-react";
import { toast } from 'react-toastify';

const TeacherFiles = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const filesFromStore = useSelector((state) => state.teacher.files || []);
  useEffect(() => {
    dispatch(getFiles());
  }, [dispatch]);

  const deriveTypeFormatName = (name) => {
    if (!name) return "Other";
    const parts = name.split(".");
    return (parts[parts.length - 1] || "").toLowerCase();

  }

  const normalizeFile = (f) => {
    const type = deriveTypeFormatName(f.originalName) || f.fileType || "other";
    let category = "other";

    if (["pdf", "doc", "docx", "txt"].includes(type)) {
      category = "report";
    } else if (["ppt", "pptx"].includes(type)) {
      category = "presentation";
    } else if (["zip", "rar", "js", "ts", "html", "css", "json"].includes(type)) {
      category = "code";
    } else if (["jpeg", "jpg", "png", "gif"].includes(type)) {
      category = "image";
    }

    return {
      id: f._id,
      name: f.originalName,
      type: type.toLowerCase(),
      size: f.size || "-",
      student: f.studentName || "-",
      uploadDate: f.uploadedAt || f.createdAt || new Date().toISOString(),
      category,
      projectId: f.projectId || f.project?._id,
      fileId: f._id
    }

  }

  const files = useMemo(
    () => (filesFromStore || []).map(normalizeFile),
    [filesFromStore]
  );

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />;

      case "doc":
      case "docx":
        return <FileText className="w-8 h-8 text-blue-500" />;

      case "ppt":
      case "pptx":
        return <FileSpreadsheet className="w-8 h-8 text-orange-500" />;

      case "zip":
      case "rar":
        return <FileArchive className="w-8 h-8 text-yellow-500" />;

      default:
        return <File className="w-8 h-8 text-slate-500" />;
    }
  };

  const filteredFiles = files.filter((file) => {
    const matchesType = filterType === "all" ? true : file.category === filterType;

    const matchesSearch = file.name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch && matchesType;
  })

  const handleDownload = async (projectId, fileId, name) => {
    try {
      const res = await dispatch(
        downloadTeacherFiles({ projectId, fileId })
      ).unwrap();

      const fileUrl = res?.fileUrl;
      window.open(fileUrl, "_blank");

    } catch (error) {
      console.log("error downloading file:", error);
      toast.error("Failed to download file. Please try again");
    }
  };


  const fileStats = [
    {
      label: "Total Files",
      count: files.length,
      bg: "bg-blue-50",
      text: "text-blue-600",
      value: "text-blue-700",
    },
    {
      label: "Reports",
      count: files.filter((f) => f.category === "report").length,
      bg: "bg-green-50",
      text: "text-green-600",
      value: "text-green-700",
    },
    {
      label: "Presentations",
      count: files.filter((f) => f.category === "presentation").length,
      bg: "bg-orange-50",
      text: "text-orange-600",
      value: "text-orange-700",
    },
    {
      label: "Code Files",
      count: files.filter((f) => f.category === "code").length,
      bg: "bg-purple-50",
      text: "text-purple-600",
      value: "text-purple-700",
    },
    {
      label: "Images",
      count: files.filter((f) => f.category === "image").length,
      bg: "bg-pink-50",
      text: "text-pink-600",
      value: "text-pink-700",
    },
  ];

  const tableHeadData = [
    "File Name",
    "Student",
    "Type",
    "Upload Date",
    "Actions",
  ];


  return (
    <>
      <div className='space-y-6'>
        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Student Files
              </h1>
              <p className="text-slate-500 mt-2 text-sm md:text-base">
                Manage files shared with and received from students
              </p>
            </div>

            {/* Optional Right Side (Search / Filter Button Later) */}
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 text-sm font-medium bg-indigo-50 text-indigo-600 rounded-xl">
                {filteredFiles.length}  {filteredFiles.length === 1 ? "file" : "files"}
              </span>
            </div>

          </div>
        </div>

        {/* Filter and search */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300">

          <div className="flex flex-col md:flex-row md:items-end gap-6">

            {/* Search Files */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Search Files
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>

                <input
                  type="text"
                  placeholder="Search by file name, project title or student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 text-sm bg-slate-50
          border border-slate-200 rounded-xl
          text-slate-700 placeholder:text-slate-400
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          focus:border-indigo-500 hover:bg-white
          hover:border-slate-300"
                />
              </div>
            </div>

            {/* Filter Files */}
            <div className="w-full md:w-56">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Filter Type
              </label>

              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm
          border border-slate-200 rounded-xl
          bg-slate-50 text-slate-700 font-medium
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          focus:border-indigo-500
          hover:bg-white hover:border-slate-300
          transition-all appearance-none"
                >
                  <option value="all">All Files</option>
                  <option value="report">Report</option>
                  <option value="presentation">Presentation</option>
                  <option value="code">Code</option>
                  <option value="image">Image</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Grid/List Toggle */}
            <div className="flex items-end gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-xl border transition ${viewMode === "grid"
                  ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-xl border transition ${viewMode === "list"
                  ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>

        {/* FILE STATES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {fileStats.map((item, i) => {
            return (
              <div
                key={i}
                className={`rounded-2xl border border-slate-100 shadow-sm p-4 ${item.bg} hover:shadow-md transition-all`}
              >
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${item.text}`}>
                    {item.label}
                  </span>

                  <span className={`text-2xl font-bold mt-1 ${item.value}`}>
                    {item.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* FILES TO DISPLAY   */}

        {
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFiles.map((file) => {
                return (
                  <div
                    key={file.id}
                    className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col items-center text-center">

                      {/* File Icon */}
                      <div className="mb-4 p-3 bg-slate-50 rounded-xl">
                        {getFileIcon(file.type)}
                      </div>

                      {/* File Name */}
                      <h3 className="font-semibold text-slate-800 text-sm truncate w-full">
                        {file.name}
                      </h3>

                      {/* Student */}
                      <p className="text-sm text-slate-600 mt-1">
                        {file.student}
                      </p>

                      {/* Upload Date */}
                      <p className="text-xs text-slate-500 mt-1 mb-4">
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </p>

                      {/* Download Button */}
                      <button
                        onClick={() =>
                          handleDownload(file.projectId, file.fileId, file.name)
                        }
                        className="w-full py-2 text-sm font-medium rounded-xl
                bg-blue-600 text-white
                hover:bg-blue-700 transition flex items-center justify-center gap-3"
                      >
                        <DownloadIcon className='w-5 h-5' /> Download
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:shadow-md hover:border-blue-200 transition"
                >

                  {/* Left Section */}
                  <div className="flex items-center gap-4">

                    {/* File Icon */}
                    <div className="p-3 bg-slate-100 rounded-xl">
                      {getFileIcon(file.type)}
                    </div>

                    {/* File Info */}
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">
                        {file.name}
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                        <span>{file.student}</span>
                        <span>•</span>
                        <span>
                          {new Date(file.uploadDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Right Section */}
                  <div className="flex items-center gap-3">

                    {/* File Type Badge */}
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md uppercase">
                      {file.type}
                    </span>

                    {/* Download Button */}
                    <button
                      onClick={() =>
                        handleDownload(file.projectId, file.fileId, file.name)
                      }
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium
              bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                    >
                      <DownloadIcon className="w-4 h-4" />
                      Download
                    </button>

                  </div>

                </div>
              ))}
            </div>

          )
        }
      </div>
    </>
  )
}

export default TeacherFiles 