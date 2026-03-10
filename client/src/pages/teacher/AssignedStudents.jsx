import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { addFeedback, getAssignedStudents, markComplete } from '../../store/slices/teacherSlice';
import { CheckCircle, Loader, MessageSquare, Users, X } from "lucide-react"
import { get } from 'mongoose';
const AssignedStudents = () => {

  const [sortBy, setSortBy] = useState("name");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    title: "",
    message: "",
    type: "general"
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAssignedStudents())
  }, [dispatch])

  const { assignedStudents, loading, error } = useSelector(state => state.teacher);


  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border border-green-300"
        break;
      case "approved":
        return "bg-blue-100 text-blue-700 border border-blue-300"
        break;

      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-300"

    }
  }

  const getStatusText = (status) => {
    if (status === "completed") return "Completed";
    if (status === "approved") return "Approved";

    return "Pending"
  }


  const handleFeedback = (student) => {
    setSelectedStudent(student);
    setFeedbackData({ title: "", message: "", type: "general" });
    setShowFeedbackModal(true)
  }

  const handleMarkComplete = (student) => {
    setSelectedStudent(student);
    setShowCompleteModal(true);

  }

  const closeModel = () => {
    setShowFeedbackModal(false);
    setShowCompleteModal(false);
    setSelectedStudent(null);
    setFeedbackData({ title: "", message: "", type: "general" });
  }

  const submitFeedback = () => {
    if (selectedStudent?.project?._id && feedbackData.title && feedbackData.message) {
      dispatch(addFeedback({
        projectId: selectedStudent.project._id,
        payload: feedbackData
      })
      );
      closeModel()
    }
  }


  const confirmMarkComplete = () => {
    if (selectedStudent?.project?._id) {
      dispatch(markComplete(selectedStudent.project._id));
      closeModel()
    }
  }

 const sortedStudents = [...(assignedStudents || [])].sort((a, b) => {
  switch (sortBy) {
    case "name":
      return a.name?.localeCompare(b.name);
    case "lastActivity":
      return new Date(b.project?.updatedAt) - new Date(a.project?.updatedAt);
    default:
      return 0;
  }
});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
          <p className="font-semibold">Something went wrong</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }


  const stats = [
    {
      label: "Total Students",
      value: sortedStudents.length,
      bg: "bg-blue-50",
      text: "text-blue-700",
      sub: "text-blue-500",
    },
    {
      label: "Completed Projects",
      value: sortedStudents.filter(
        (s) => s.project?.status === "completed"
      ).length,
      bg: "bg-green-50",
      text: "text-green-700",
      sub: "text-green-500",
    },
    {
      label: "In Progress",
      value: sortedStudents.filter(
        (s) => s.project?.status === "in_progress"
      ).length,
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      sub: "text-yellow-500",
    },
    {
      label: "Pending Review",
      value: sortedStudents.filter(
        (s) => s.project?.status === "approved"
      ).length,
      bg: "bg-purple-50",
      text: "text-purple-700",
      sub: "text-purple-500",
    },
  ];





  return (
    <>
      <div className='space-y-6'>
        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Assigned Students
              </h1>
              <p className="text-slate-500 mt-2 text-sm md:text-base">
                Manage your assigned students and their projects
              </p>
            </div>

            {/* Optional Right Side (Search / Filter Button Later) */}
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 text-sm font-medium bg-indigo-50 text-indigo-600 rounded-xl">
                {sortedStudents.length}  {sortedStudents.length === 1 ? "student" : "students"}
              </span>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-6">
          {stats.map((item) => (
            <div
              key={item.label}
              className={`${item.bg} p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition`}
            >
              <div className="flex flex-col gap-1">

                <p className={`text-sm font-medium ${item.sub}`}>
                  {item.label}
                </p>

                <p className={`text-3xl font-bold ${item.text}`}>
                  {item.value}
                </p>

              </div>
            </div>
          ))}
        </div>

        {/* STUDENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {student.name?.charAt(0)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 text-base">
                      {student.name}
                    </h3>
                    <p className="text-slate-500 text-xs">{student.email}</p>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                    student.project?.status
                  )}`}
                >
                  {getStatusText(student.project?.status)}
                </span>
              </div>

              {/* Project Info */}
              <div className="bg-slate-50 rounded-xl p-4 mb-5">
                <p className="text-xs uppercase text-slate-500 mb-1">
                  Project Title
                </p>

                <h4 className="font-medium text-slate-800 text-sm mb-3">
                  {student.project?.title || "No project assigned"}
                </h4>

                <p className="text-xs text-slate-500 uppercase">
                  deadline:{" "}
                  {student.project?.updatedAt
                    ? new Date(student.project?.deadline).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleFeedback(student)}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  Feedback
                </button>

                <button
                  onClick={() => handleMarkComplete(student)}
                  disabled={student.project?.status === "completed"}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition 
          ${student.project?.status === "completed"
                      ? "bg-green-200 text-white cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </button>
              </div>
            </div>
          ))}
        </div>

        {
          sortedStudents.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">

              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 mb-4">
                <Users className="w-8 h-8 text-slate-500" />
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                No Assigned Students
              </h3>

              <p className="text-sm text-slate-500 text-center max-w-sm">
                You currently don't have any students assigned. Once students request
                supervision and you approve them, they will appear here.
              </p>

            </div>
          )
        }

        {/* FEEDBACK MODEL */}
        {
          showFeedbackModal && selectedStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

              <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white p-6 shadow-xl">

                {/* Close Icon */}
                <button
                  onClick={closeModel}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition"
                >
                  <X size={20} />
                </button>

                {/* Title */}
                <h3 className="text-center text-lg font-semibold text-slate-800">
                  Provide Feedback
                </h3>

                {/* PROJECT INFO */}
                <div className='bg-slate-50 rounded-lg p-4 mb-6'>
                  <div className='space-y-2 text-sm'>
                    <div>
                      <span className='font-medium text-slate-600 uppercase'>
                        Project:
                      </span>
                      <span className='text-slate-800 ml-2'>
                        {selectedStudent.project?.title}
                      </span>
                    </div>

                    <div>
                      <span className='font-medium text-slate-600 uppercase'>
                        Student:
                      </span>
                      <span className='text-slate-800 ml-2'>
                        {selectedStudent.name}
                      </span>
                    </div>

                    {
                      selectedStudent.project?.deadline && (
                        <div>
                          <span className='font-medium text-slate-600 uppercase'>
                            deadline:
                          </span>
                          <span className='text-slate-800 ml-2'>
                            {new Date(selectedStudent.project?.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )
                    }

                    <div>
                      <span className='font-medium text-slate-600 uppercase'>
                        status:
                      </span>
                      <span className='text-slate-800 ml-2'>
                        {selectedStudent.project.status}
                      </span>
                    </div>

                    {/* FEEDBACK FORM */}
                    <div className="space-y-5 mt-5">

                      {/* Feedback Title */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Feedback Title
                        </label>

                        <input
                          value={feedbackData.title}
                          onChange={(e) =>
                            setFeedbackData({ ...feedbackData, title: e.target.value })
                          }
                          type="text"
                          placeholder="Enter feedback title"
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg 
      text-sm outline-none transition
      focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Feedback Type */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Feedback Type
                        </label>

                        <select
                          value={feedbackData.type}
                          onChange={(e) =>
                            setFeedbackData({ ...feedbackData, type: e.target.value })
                          }
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg 
      text-sm bg-white outline-none transition
      focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="general">General</option>
                          <option value="positive">Positive</option>
                          <option value="negative">Negative</option>
                        </select>
                      </div>

                      {/* Feedback Message */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Feedback Message
                        </label>

                        <textarea
                          rows="4"
                          placeholder="Give your feedback here..."
                          value={feedbackData.message}
                          onChange={(e) =>
                            setFeedbackData({
                              ...feedbackData,
                              message: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg 
      text-sm resize-none outline-none transition
      focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          onClick={closeModel}
                          className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={submitFeedback}

                          className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                        >
                          Submit Feedback
                        </button>
                      </div>

                    </div>


                  </div>
                </div>
              </div>
            </div>
          )
        }

        {/* MARK_AS_COMPLETE MODAL */}

        {
          showCompleteModal && selectedStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

              <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl p-6">

                {/* Close Icon */}
                <button
                  onClick={closeModel}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition"
                >
                  <X size={20} />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-center text-lg font-semibold text-slate-800 mb-2">
                  Mark Project as Completed
                </h3>

                {/* Description */}
                <p className="text-center text-sm text-slate-500 mb-6">
                  Are you sure you want to mark this project as completed?
                  This action will notify the student.
                </p>

                {/* Project Info */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student</span>
                    <span className="font-medium text-slate-800">
                      {selectedStudent.name}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Project</span>
                    <span className="font-medium text-slate-800">
                      {selectedStudent.project?.title}
                    </span>
                  </div>

                  {selectedStudent.project?.deadline && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Deadline</span>
                      <span className="font-medium text-slate-800">
                        {new Date(selectedStudent.project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3">

                  <button
                    onClick={closeModel}
                    className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmMarkComplete}
                    className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm
                  </button>

                </div>

              </div>
            </div>
          )
        }

      </div>
    </>
  )
}

export default AssignedStudents