import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acceptRequests, getTeacherRequests, rejectRequests } from '../../store/slices/teacherSlice';
import { FileText, Search } from 'lucide-react';
const PendingRequests = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingMap, setLoadingMap] = useState({});
  const dispatch = useDispatch();
  const { list } = useSelector(state => state.teacher);
  const { authUser } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getTeacherRequests(authUser._id))
  }, [dispatch, authUser._id]);

  const setLoading = (id, key, value) => {
    setLoadingMap(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: value },
    }))
  }

  const handleAccept = async (request) => {
    const id = request._id;
    setLoading(id, "accepting", true);
    try {
      await dispatch(acceptRequests(id)).unwrap();
    } finally {
      setLoading(id, "accepting", false);
    }
  }

  const handleReject = async (request) => {
    const id = request._id;
    setLoading(id, "rejecting", true);
    try {
      await dispatch(rejectRequests(id)).unwrap();
    } finally {
      setLoading(id, "rejecting", false);
    }
  }

  const filterRequests = useMemo(() => {
    return list.filter((request) => {
      const matchesSearch =
        (request?.student?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||

        (request?.student?.email || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        request?.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [list, searchTerm, filterStatus]);


  return (
    <>
      <div className='space-y-6'>
        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Supervisor Requests
              </h1>
              <p className="text-slate-500 mt-2 text-sm md:text-base">
                Review and respond to student supervision requests
              </p>
            </div>

            {/* Optional Right Side (Search / Filter Button Later) */}
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 text-sm font-medium bg-indigo-50 text-indigo-600 rounded-xl">
                Manage Requests
              </span>
            </div>

          </div>
        </div>

        {/* SEARCH AND FILTER */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300">

          <div className="flex flex-col md:flex-row md:items-end gap-6">

            {/* Search Section */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Search Students
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>

                <input
                  type="text"
                  placeholder="Search by project title or student name..."
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

            {/* Filter Section */}
            <div className="w-full md:w-56">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Filter Status
              </label>

              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm
                     border border-slate-200 rounded-xl
                     bg-slate-50 text-slate-700 font-medium
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     focus:border-indigo-500
                     hover:bg-white hover:border-slate-300
                     transition-all appearance-none"
                >
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>

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

          </div>
        </div>

        {/* REQUESTS */}
        <div className="space-y-5">
          {filterRequests.map((req) => {
            const id = req._id; // ✅ fixed
            const project = req.latestProject;
            const projectStatus = project?.status?.toLowerCase() || "pending";
            const supervisorAssigned = project?.supervisor;
            const canAccept = projectStatus === "approved" && !supervisorAssigned;
            const lm = loadingMap[id] || {};

            const cardStyle =
              projectStatus === "pending"
                ? "bg-yellow-50 border-yellow-200"
                : projectStatus === "approved"
                  ? "bg-green-50 border-green-200"
                  : projectStatus === "rejected"
                    ? "bg-red-50 border-red-200"
                    : "bg-white border-slate-200";

            return (
              <div
                key={id}
                className={`rounded-3xl border ${cardStyle} p-6 shadow-sm
        hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  {/* LEFT SIDE */}
                  <div className="flex-1">

                    {/* Header Row */}
                    <div className="flex items-start  gap-4">

                      <div>
                        <h3 className="text-lg md:text-xl font-semibold text-slate-800">
                          {req?.student?.name || "Unknown Student"}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {req?.student?.email || "No email provided"}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full capitalize mt-1
                ${req.status === "pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : req.status === "accepted"
                              ? "bg-green-200 text-green-800"
                              : req.status === "rejected"
                                ? "bg-red-200 text-red-800"
                                : "bg-slate-200 text-slate-700"
                          }`}
                      >
                        {req.status
                          ? req.status.charAt(0).toUpperCase() + req.status.slice(1)
                          : "Unknown"}
                      </span>
                    </div>

                    {/* Project Title */}
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        Project Title
                      </p>
                      <p className="text-sm md:text-base font-medium text-slate-800 mt-1">
                        {project?.title || "No project title provided"}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span>
                        Submitted:{" "}
                        {req?.createdAt
                          ? new Date(req.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          : "-"}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT SIDE ACTIONS */}
                  {req.status === "pending" && (
                    <div className="flex items-center gap-3">

                      <button
                        disabled={lm.accepting || !canAccept}
                        onClick={() => handleAccept(req)}
                        className={`px-5 py-2 text-sm rounded-xl font-medium transition-all duration-200
                  ${canAccept
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                          }`}
                      >
                        {lm.accepting ? "Accepting..." : "Accept"}
                      </button>

                      <button
                        disabled={lm.rejecting}
                        onClick={() => handleReject(req)}
                        className="px-5 py-2 text-sm rounded-xl font-medium transition-all duration-200
                  bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
                      >
                        {lm.rejecting ? "Rejecting..." : "Reject"}
                      </button>

                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {/* No Requests */}
          {filterRequests.length === 0 && (
            <div className="bg-white border border-dashed border-slate-300 
                  rounded-3xl p-12 text-center 
                  shadow-sm hover:shadow-md 
                  transition-all duration-300">

              {/* Icon Circle */}
              <div className="w-16 h-16 mx-auto mb-5 
                    flex items-center justify-center
                    rounded-full bg-slate-100">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-semibold text-slate-700">
                No Requests Found
              </h3>

              {/* Subtitle */}
              <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                There are currently no supervision requests that match your selected filters.
              </p>

            </div>
          )}
        </div>
      </div>
    </>
  )
}

 
 
 export default PendingRequests  