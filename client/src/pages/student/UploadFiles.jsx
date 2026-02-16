import React from 'react'
import { Archive, File, FileCodeCorner, FilePlus, FileText, Presentation } from "lucide-react"
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { downloadFile, fetchProject, uploadFiles } from '../../store/slices/studentSlice';
const UploadFiles = () => {
  const dispatch = useDispatch();
  const { project, files } = useSelector(state => state.student);


  const [selectedFiles, setSelectedFiles] = useState([])
  const reportRef = useRef(null)
  const presRef = useRef(null)
  const codeRef = useRef(null)

  useEffect(() => {
    if (!project) {
      dispatch(fetchProject())
    }
  }, [dispatch])


  const handleFilePick = (e) => {
    const list = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...list]);
    e.target.value = ""
  }

  const handleUpload = (e) => {
    const activeProject = project;
    // if (!activeProject) {
    //   const action = dispatch(fetchProject());
    //   if (fetchProject.fulfilled.match(action)) {
    //     activeProject = action.payload?.project || action.payload ;
    //   }
    // }
    if (selectedFiles.length === 0) return;

    dispatch(uploadFiles({ projectId: project?._id, files: selectedFiles }));
    setSelectedFiles([])

  }

  const removeSelected = (name) => {
    setSelectedFiles((prev) => prev.filter((f) => f.name !== name))
  }
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();

    const color =
      extension === "pdf"
        ? "text-red-500"
        : ["doc", "docx"].includes(extension)
          ? "text-blue-500"
          : ["xls", "xlsx"].includes(extension)
            ? "text-green-600"
            : ["ppt", "pptx"].includes(extension)
              ? "text-orange-500"
              : ["js", "jsx", "ts", "tsx", "html", "css", "json"].includes(extension)
                ? "text-yellow-500"
                : ["png", "jpg", "jpeg", "gif"].includes(extension)
                  ? "text-purple-500"
                  : ["zip", "rar"].includes(extension)
                    ? "text-amber-600"
                    : "text-gray-500";

    return <File className={`w-8 h-8 ${color}`} />;
  };

  const handleDownloadFile = async (file) => {
    if (!file.projectId || !file.fileId) {
      return;
    }
    const res = await dispatch(downloadFile({ projectId: file.projectId, fileId: file.fileId }));

    if (res.meta.requestStatus !== "fulfilled") {
      return;
    }

    const url = URL.createObjectURL(res.payload.blob);

    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: file.name || "download"
    });
    a.click();
    URL.revokeObjectURL(url);
  }

  
  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Upload Project Files
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Upload your project documents including reports, presentations and source code.
        </p>

        {/* UPLOAD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          {/* REPORT */}
          <div className="group border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200">
            <FileText className="w-12 h-12 text-slate-400 mx-auto group-hover:text-indigo-500 transition" />
            <h3 className="text-lg font-semibold mt-4 text-slate-800">Report</h3>
            <p className="text-sm text-slate-500 mt-1">
              PDF, DOC, DOCX
            </p>

            <label className="inline-block mt-4 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer transition">
              Choose File
              <input
                type="file"
                ref={reportRef}
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFilePick}
                multiple
              />
            </label>
          </div>

          {/* PRESENTATION */}
          <div className="group border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-200">
            <Presentation className="w-12 h-12 text-slate-400 mx-auto group-hover:text-blue-500 transition" />
            <h3 className="text-lg font-semibold mt-4 text-slate-800">Presentation</h3>
            <p className="text-sm text-slate-500 mt-1">
              PPT, PPTX, PDF
            </p>

            <label className="inline-block mt-4 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition">
              Choose File
              <input
                type="file"
                ref={presRef}
                className="hidden"
                accept=".pdf,.ppt,.pptx"
                onChange={handleFilePick}
                multiple
              />
            </label>
          </div>

          {/* CODE */}
          <div className="group border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-amber-500 hover:bg-amber-50 transition-all duration-200">
            <FileCodeCorner className="w-12 h-12 text-slate-400 mx-auto group-hover:text-amber-500 transition" />
            <h3 className="text-lg font-semibold mt-4 text-slate-800">Source Code</h3>
            <p className="text-sm text-slate-500 mt-1">
              ZIP, RAR
            </p>

            <label className="inline-block mt-4 px-4 py-2 text-sm font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 cursor-pointer transition">
              Choose File
              <input
                type="file"
                ref={codeRef}
                className="hidden"
                accept=".zip,.rar,.tar,.gz"
                onChange={handleFilePick}
                multiple
              />
            </label>
          </div>

        </div>

        {/* UPLOAD BUTTON */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
            className={`px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200
            ${selectedFiles.length === 0
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl active:scale-95"
              }`}
          >
            Upload Selected Files
          </button>
        </div>
      </div>

      {/* SELECTED FILE PREVIEW */}
      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Ready to Upload
          </h2>

          <div className="space-y-3">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:shadow-sm transition"
              >
                <div className="flex items-center gap-4">
                  {getFileIcon(file.name)}
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeSelected(file.name)}
                  className="text-red-500 text-sm font-medium hover:text-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPLOADED FILES LIST */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800">
            Uploaded Files
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your uploaded project files
          </p>
        </div>

        {(files || []).length === 0 ? (
          <div className="text-center py-12">
            <Archive className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">
              No files uploaded yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file._id || file.fileUrl}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:shadow-sm transition"
              >
                {/* LEFT SIDE */}
                <div className="flex items-center gap-4">
                  {getFileIcon(file.originalName)}

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {file.originalName}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {file.fileType || "Project File"}
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-3">

                  <button
                    // href={file.fileUrl}
                    // target="_blank"
                    // rel="noopener noreferrer"
                    onClick={()=>handleDownloadFile(file)}
                    className="px-4 py-2 text-sm font-medium rounded-lg
                         bg-indigo-600 text-white
                         hover:bg-indigo-700
                         transition-all duration-200"
                  >
                    Download
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadFiles 