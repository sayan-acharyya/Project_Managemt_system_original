import React from 'react'
import { File } from "lucide-react"
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { fetchProject, uploadFiles } from '../../store/slices/studentSlice';
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

  return (
    <>

    </>
  )
}

export default UploadFiles 