import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createDeadline } from '../../store/slices/deadlineSlice';
import { BadgeCheck, CalendarMinus2, CheckCircle2, Clock, Search, X, XCircle } from 'lucide-react';

const DeadlinesPage = () => {

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    projectTitle: "",
    studentName: "",
    supervisor: "",
    deadlineDate: "",
    description: "",
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [query, setQuery] = useState('');

  const dispatch = useDispatch();

  const { projects } = useSelector(state => state.admin);

  const [viewProjects, setViewProjects] = useState(projects || [])

  useEffect(() => {
    setViewProjects(projects || []);
  }, [projects])

  const projectRows = useMemo(() => {
    return (viewProjects || []).map((p) => ({
      _id: p._id,
      title: p.title,
      status: p.status,
      studentName: p.student?.name || "-",
      studentEmail: p.student?.email || "-",
      studentDept: p.student?.department || "-",
      supervisor: p.supervisor?.name || "-",
      deadline: p.deadline ? new Date(p.deadline).toISOString().slice(0, 10) : "-",
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleString().slice(0, 10) : "-",
      raw: p
    }))
  }, [viewProjects])

  const filteredProjects = projectRows.filter(row => {
    const matchesSearch =
      (row.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.studentName || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject || !formData.deadlineDate) return;

    let deadlineData = {
      name: selectedProject?.student?.name,
      dueDate: formData.deadlineDate,
      project: selectedProject?._id
    };

    try {
      const updated = await dispatch(createDeadline({ id: selectedProject._id, data: deadlineData })).unwrap();
      const updatedProject = updated?.project || updated;

      if (updatedProject?._id) {
        setViewProjects(prev => prev.map(p => p._id === updatedProject._id ? { ...p, ...updatedProject } : p))
      }
    } finally {
      setShowModal(false);
      setFormData({
        projectTitle: "",
        studentName: "",
        supervisor: "",
        deadlineDate: "",
        description: "",
      })
      setSelectedProject(null);
      setQuery("");
      window.location.reload();
    }
  }
  return (
    <>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-[1px] rounded-3xl shadow-sm">
          <div className="group bg-white rounded-3xl p-6 transition-all duration-300 hover:shadow-xl">

            <div className="flex items-center justify-between">

              {/* Left Section */}
              <div className="flex items-center gap-5">

                {/* Icon Box */}
                <div className="p-3 bg-indigo-100 rounded-2xl transition-all duration-300 group-hover:bg-indigo-200 group-hover:scale-105">
                  <CalendarMinus2 className="w-7 h-7 text-indigo-600" />
                </div>

                {/* Text Content */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                    Manage Deadlines
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Create and monitor project deadlines easily
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowModal(true)}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl shadow-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2">
                Add / Update Deadline
              </button>

            </div>

          </div>
        </div>
        {/* FILTERS */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300">

          <div className="flex flex-col md:flex-row gap-6">

            <div className="flex-1">

              <label className="block text-sm font-semibold text-slate-700 mb-3 tracking-wide">
                Search Deadlines
              </label>

              <div className="relative">

                {/* Search Icon */}
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>

                <input
                  type="text"
                  placeholder="Search by project or student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
            w-full
            pl-12 pr-4 py-3
            text-sm
            bg-slate-50
            border border-slate-200
            rounded-2xl
            text-slate-700
            placeholder:text-slate-400
            transition-all duration-300
            focus:outline-none
            focus:ring-2 focus:ring-indigo-500
            focus:border-indigo-500
            hover:bg-white
            hover:border-slate-300
          "
                />
              </div>

            </div>
          </div>

        </div>

        <div className='card'>
          <div className='card-header'>
            <h2 className='card-title'>Project Deadlines</h2>
          </div>
          <div className='overflow-y-auto'>
            <table className='w-full'>
              <thead className='bg-slate-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                    Student
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                    Project Title
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                    Supervisor
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                    Deadline
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                    Project Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                    Updated At
                  </th>
                </tr>
              </thead>

              <tbody className='bg-white divide-y divide-slate-200'>
                {
                  filteredProjects.map((row) => {
                    return (
                      <tr
                        className='hover:bg-slate-50'
                        key={row._id}>
                        <td className='px-6 py-4 whitespace-nowrap '>
                          <div>
                            <div className='text-sm font-medium text-slate-900'>
                              {row.studentName}
                            </div>
                            <div className='text-xs font-medium text-slate-500'>
                              {row.studentEmail}
                            </div>
                          </div>
                        </td>

                        <td className='px-6 py-4 text-sm font-semibold'>
                          {row.title}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {row.supervisor !== "-" ?
                            (
                              <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800'>
                                {row.supervisor}
                              </span>
                            ) : (
                              <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-200 text-red-800'>
                                Not Assigned
                              </span>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {row.deadline !== "-" ? (
                            new Date(row.deadline) < new Date() ? (
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium border border-red-100">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                {row.deadline}
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium border border-emerald-100">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                {row.deadline}
                              </div>
                            )
                          ) : (
                            <div className="inline-flex items-center  px-3 py-1 rounded-full bg-gray-200 text-blue-600 text-xs font-medium border border-slate-200">
                              Not Set yet
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {row.status === "pending" && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold border border-yellow-200">
                              <Clock className="w-3.5 h-3.5" />
                              Pending
                            </div>
                          )}

                          {row.status === "approved" && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
                              <BadgeCheck className="w-3.5 h-3.5" />
                              Approved
                            </div>
                          )}

                          {row.status === "rejected" && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold border border-red-200">
                              <XCircle className="w-3.5 h-3.5" />
                              Rejected
                            </div>
                          )}

                          {row.status === "completed" && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Completed
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {row.updatedAt && !isNaN(new Date(row.updatedAt)) ? (
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-800">
                                {new Date(row.updatedAt).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-slate-400">
                                {new Date(row.updatedAt).toLocaleTimeString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-sm">
                              Not Updated
                            </span>
                          )}
                        </td>

                      </tr>
                    )
                  })
                }
              </tbody>


            </table>
          </div>

          {
            filteredProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">

                {/* Icon */}
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 mb-4">
                  <svg
                    className="w-8 h-8 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 17v-6m6 6v-6M5 7h14M4 7h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"
                    />
                  </svg>
                </div>

                {/* Text */}
                <h3 className="text-lg font-semibold text-slate-700">
                  No Projects Found
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )
          }
        </div>

        {/* MODEL */}

        {
          showModal && (
            <div className='fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-screen overflow-y-auto'>
                <div className='flex justify-between  items-center mb-4'>
                  <h3 className='text-lg font-semibold text-slate-900'>
                    Create or Updated Deadline
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className='text-slate-400 hover:text-slate-600'
                  >
                    <X className='w-5 h-5' />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5"
                >
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Project Title
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Start typing to search projects..."
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setSelectedProject(null);
                          setFormData({ ...formData, projectTitle: e.target.value })
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-blue-500 transition-all duration-200
                   text-sm text-slate-700 placeholder:text-slate-400"
                      />

                      {/* Search Icon */}
                      <svg
                        className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    {
                      query && !selectedProject && (
                        <div className="mt-3 bg-white border border-slate-200 rounded-2xl shadow-lg max-h-64 overflow-y-auto divide-y divide-slate-100">

                          {(projects || [])
                            .filter(p =>
                              (p.title || "")
                                .toLowerCase()
                                .includes(query.toLowerCase())
                            )
                            .slice(0, 8)
                            .map((p) => (
                              <button
                                type="button"
                                key={p._id}
                                onClick={() => {
                                  setSelectedProject(p);
                                  setQuery(p.title);
                                  setFormData({
                                    ...formData,
                                    projectTitle: p.title,
                                    deadlineDate: p.deadline
                                      ? new Date(p.deadline).toISOString().slice(0, 10)
                                      : ""
                                  });
                                }}
                                title={p.title}
                                className="w-full text-left px-4 py-3 transition-all duration-150 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                              >
                                <div className="flex items-start justify-between gap-2">

                                  {/* Left Content */}
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-800 truncate">
                                      {p.title}
                                    </span>

                                    <span className="text-xs text-slate-500 mt-1 truncate">
                                      👨‍🎓 {p.student?.name || "--"}
                                      <span className="mx-2 text-slate-300">|</span>
                                      👨‍🏫 {p.supervisor?.name || "--"}
                                    </span>
                                  </div>

                                  {/* Optional Badge if Deadline exists */}
                                  {p.deadline && (
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-700 whitespace-nowrap">
                                      {new Date(p.deadline).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </button>
                            ))}
                        </div>
                      )
                    }
                  </div>

                  <div className="text-sm font-medium text-slate-700">
                    <label className=''>Deadline</label>
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-blue-500 transition-all duration-200
                   text-sm text-slate-700 placeholder:text-slate-400 mt-2"
                      disabled={!selectedProject}
                      value={formData.deadlineDate}
                      onChange={(e) => setFormData({ ...formData, deadlineDate: e.target.value })}
                    />
                  </div>

                  {
                    selectedProject && (
                      <div className="mt-5 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-2xl p-5 shadow-sm">

                        {/* Header */}
                        <div className="mb-4">
                          <h3 className="text-base font-semibold text-slate-800">
                            Project Details
                          </h3>
                        </div>

                        {/* Project Title */}
                        <div className="mb-4">
                          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                            Project Title
                          </div>
                          <div className="text-sm font-semibold text-slate-900 truncate">
                            {selectedProject.title}
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mb-5">
                          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                            Description
                          </div>
                          <div
                            className="text-sm text-slate-700 leading-relaxed"
                            title={selectedProject.description || ""}
                          >
                            {(selectedProject.description || "").length > 180
                              ? `${selectedProject.description.slice(0, 180)}...`
                              : selectedProject.description || "No description available"}
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                          {/* Student */}
                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">
                              Student
                            </div>

                            {selectedProject.student ? (
                              <div className="space-y-1">
                                <div className="text-sm font-semibold text-slate-800">
                                  {selectedProject.student.name}
                                </div>

                                <div className="text-xs text-slate-500">
                                  {selectedProject.student.email}
                                </div>


                              </div>
                            ) : (
                              <div className="text-sm text-slate-400">
                                Not Assigned
                              </div>
                            )}
                          </div>

                          {/* Supervisor */}
                          <div className="bg-white border border-slate-200 rounded-xl p-3">
                            <div className="text-xs text-slate-500 mb-1">Supervisor</div>
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-slate-800">
                                {selectedProject.supervisor?.name || "Not Assigned"}
                              </div>
                              <div className="text-xs text-slate-500">
                                {selectedProject.supervisor?.email}
                              </div>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="bg-white border border-slate-200 rounded-xl p-3">
                            <div className="text-xs text-slate-500 mb-1">Status</div>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
              ${selectedProject.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : selectedProject.status === "pending"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                            >
                              {selectedProject.status || "Unknown"}
                            </span>
                          </div>

                        </div>
                      </div>
                    )
                  }

                  <div className="flex justify-end items-center gap-3 pt-6 border-t border-slate-200">

                    {/* Cancel Button */}
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2.5 text-sm font-medium rounded-xl
               border border-slate-300 text-slate-600
               hover:bg-slate-100 hover:border-slate-400
               transition-all duration-200 active:scale-95"
                    >
                      Cancel
                    </button>

                    {/* Save Button */}
                    <button
                      type="submit"
                      disabled={!selectedProject || !formData.deadlineDate}
                      className="px-6 py-2.5 text-sm font-medium rounded-xl text-white
               bg-blue-600 hover:bg-blue-700
               disabled:bg-slate-300 disabled:cursor-not-allowed
               shadow-sm hover:shadow-md
               transition-all duration-200 active:scale-95"
                    >
                      Save Deadline
                    </button>

                  </div>
                </form>
              </div>
            </div>
          )
        }
      </div>
    </>
  )
}

export default DeadlinesPage 