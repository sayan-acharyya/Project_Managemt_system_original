import React from 'react'
import { Archive, File, FileCodeCorner, FileText, Presentation } from "lucide-react"
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
      <div className='space-y-6'>
        <div className='card'>
          <div className='card-header'>
            <h1 className='card-title'>Upload Project Files</h1>
            <p className='card-subtitle'>
              upload your project decuments including
              reports, presentations and code files.
            </p>
          </div>

          {/* UPLOAD SECTION */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            <div className='border-2 border-dashed mt-5 border-slate-300 rounded-lg 
            p-6 text-center hover:border-blue-400 transition-colors '>
              <div className='mb-4'>
                <FileText className='w-12 h-12 text-slate-400 mx-auto ' />
              </div>
              <h3 className='text-lg font-medium text-slate-800 mb-2'>Report</h3>
              <p className='text-sm text-slate-600 mb-4'>Upload your project report(PDF,DOC)</p>
              <label className='btn-outline cursor-pointer'>
                Choose File
                <input
                  type="file"
                  ref={reportRef}
                  className='hidden' accept='.pdf,.doc,.docx '
                  onChange={handleFilePick}
                  multiple
                />
              </label>
            </div>


            <div className='border-2 border-dashed mt-5 border-slate-300 rounded-lg 
            p-6 text-center hover:border-blue-400 transition-colors '>
              <div className='mb-4'>
                <Presentation className='w-12 h-12 text-slate-400 mx-auto ' />
              </div>
              <h3 className='text-lg font-medium text-slate-800 mb-2'>Presentation</h3>
              <p className='text-sm text-slate-600 mb-4'>Upload your project Presentation(PPT,PPTX,PDF)</p>
              <label className='btn-outline cursor-pointer'>
                Choose File
                <input
                  type="file"
                  ref={presRef}
                  className='hidden' accept='.pdf,.ppt,.pptx '
                  onChange={handleFilePick}
                  multiple
                />
              </label>
            </div>

            <div className='border-2 border-dashed mt-5 border-slate-300 rounded-lg 
            p-6 text-center hover:border-blue-400 transition-colors '>
              <div className='mb-4'>
                <FileCodeCorner className='w-12 h-12 text-slate-400 mx-auto ' />
              </div>
              <h3 className='text-lg font-medium text-slate-800 mb-2'>Code Files</h3>
              <p className='text-sm text-slate-600 mb-4'>Upload your project Source Code(ZIP,RAR)</p>
              <label className='btn-outline cursor-pointer'>
                Choose File
                <input
                  type="file"
                  ref={codeRef}
                  className='hidden' accept='.zip,.rar,.tar,.gz'
                  onChange={handleFilePick}
                  multiple
                />
              </label>
            </div>

          </div>

          
        </div>
      </div>
    </>
  )
}

export default UploadFiles 