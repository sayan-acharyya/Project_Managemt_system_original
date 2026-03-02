// import React from 'react'
// import { useEffect } from 'react'
// import { useState } from 'react'
// import { useDispatch, useSelector } from "react-redux"
// import { assignSupervisor, getAllUsers } from '../../store/slices/adminSlice'
// import { useMemo } from 'react'
// import { toast } from 'react-toastify'
// import { AlertTriangle, CheckCircle, Users } from 'lucide-react'
// import { Children } from 'react'
// const AssignSupervisor = () => {
//   const dispatch = useDispatch();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [selectedSupervisor, setSelectedSupervisor] = useState({});

//   const { users, projects } = useSelector(state => state.admin)

//   useEffect(() => {
//     if (!users || !users.length === 0) {
//       dispatch(getAllUsers())
//     }
//   }, [dispatch]);

//   const teachers = useMemo(() => {
//     const teacherUsers = (users || []).filter((u) => (u.role || "").toLowerCase() === "teacher");
//     return teacherUsers.map(t => ({
//       ...t,
//       assignCount: Array.isArray(t.assignedStudents)
//         ? t.assignedStudents.length
//         : 0,
//       capacityLeft: (typeof t.maxStudents === "number" ? t.maxStudents : 0) - (Array.isArray(t.assignedStudents)
//         ? t.assignedStudents.length
//         : 0),
//     }))
//   }, [users]);

//   const studentProjects = useMemo(() => {
//     return (projects || []).filter(p => !!p.student?._id).map(p => ({
//       projectId: p._id,
//       title: p.title,
//       status: p.status,
//       supervisor: p.supervisor?.name || "-",
//       supervisorId: p.supervisor?._id || "Unknown",
//       studentId: p.student?._id || "Unknown",
//       studentName: p.student?.name || "-",
//       studentEmail: p.student?.email || "-",
//       deadline: p.deadline ? new Date(p.deadline).toISOString().slice(0, 10) : "-",
//       updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-",
//       isApproved: p.status === "approved"
//     }))
//   }, [projects]);

//   const filtered = studentProjects.filter(row => {
//     const matchesSearch =
//       (row.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (row.studentName || "").toLowerCase().includes(searchTerm.toLowerCase());
//     const status = row.supervisor ? "assigned" : "unassigned";
//     const matchesFilter = filterStatus === "all" || status === filterStatus;
//     return matchesSearch && matchesFilter;
//   });

//   const [pendingFor, setPendingFor] = useState(null)

//   const handleSupervisorSelect = (projectId, supervisorId) => {
//     setSelectedSupervisor((prev) => ({
//       ...prev, [projectId]: supervisorId

//     }))
//   }

//   const handleAssign = async (studentId, projectStatus, projectId) => {
//     const supervisorId = selectedSupervisor[projectId];
//     if (!studentId || !supervisorId) {
//       toast.error("Please select a supervisor first");
//       return;
//     }
//     if (projectStatus === "rejected") {
//       toast.error("Can't assign supervisor to a rejected project");
//       return;
//     }
//     setPendingFor(projectId);
//     const res = await dispatch(assignSupervisor({ studentId, supervisorId }));
//     setPendingFor(null);

//     if (assignSupervisor.fulfilled.match(res)) {
//       toast.success("Supervisor assined successfully");
//       setSelectedSupervisor(prev => {
//         const newState = { ...prev };
//         delete newState[projectId];
//         return newState;
//       });
//       dispatch(getAllUsers());
//     } else {
//       toast.error("Failed to assign supervisor");
//     }
//   };


//   const dashboardCards = [
//     {
//       title: "Assigned Students",
//       value: studentProjects.filter((r) => !!r.supervisor).length,
//       icon: CheckCircle,
//       bg: "bg-green-100",
//       color: "text-green-600",
//     },
//     {
//       title: "Unassigned Students",
//       value: studentProjects.filter((r) => !r.supervisor).length,
//       icon: AlertTriangle,
//       bg: "bg-red-100",
//       color: "text-red-600",
//     },
//     {
//       title: "Available Teachers",
//       value: teachers.filter(
//         (t) => (t.assignedCount ?? 0) < (t.maxStudents ?? 0)
//       ).length,
//       icon: Users,
//       bg: "bg-blue-100",
//       color: "text-blue-600",
//     },
//   ];

//   // TABLE HEADER
//   const headers = [
//     "Student",
//     "Project Title",
//     "Supervisor",
//     "Deadline",
//     "Updated",
//     "Assign Supervisor",
//     "Actions",
//   ];

//   const Badge = ({ color, Children }) => {
//     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
//       {Children}
//     </span>
//   }


//   return (
//     <div>AssignSupervisor</div>
//   )
// }

// export default AssignSupervisor 








import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignSupervisor, getAllUsers } from "../../store/slices/adminSlice";
import { toast } from "react-toastify";
import { AlertTriangle, BadgeCheck, CalendarMinus2, CheckCircle, CheckCircle2, Clock, Search, Users, XCircle } from "lucide-react";

const AssignSupervisor = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSupervisor, setSelectedSupervisor] = useState({});
  const [pendingFor, setPendingFor] = useState(null);

  const { users = [], projects = [] } = useSelector((state) => state.admin);

  // ✅ Fetch users if empty
  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(getAllUsers());
    }
  }, [dispatch, users]);

  // ✅ Prepare teachers with capacity info
  const teachers = useMemo(() => {
    return users
      .filter((u) => (u.role || "").toLowerCase() === "teacher")
      .map((t) => {
        const assignedCount = Array.isArray(t.assignedStudents)
          ? t.assignedStudents.length
          : 0;

        const maxStudents =
          typeof t.maxStudents === "number" ? t.maxStudents : 0;

        return {
          ...t,
          assignedCount,
          capacityLeft: maxStudents - assignedCount,
        };
      });
  }, [users]);

  // ✅ Prepare student projects
  const studentProjects = useMemo(() => {
    return projects
      .filter((p) => !!p.student?._id)
      .map((p) => ({
        projectId: p._id,
        title: p.title,
        status: p.status,
        hasSupervisor: !!p.supervisor?._id,
        supervisor: p.supervisor?.name || "-",
        supervisorId: p.supervisor?._id || null,
        studentId: p.student?._id,
        studentName: p.student?.name || "-",
        studentEmail: p.student?.email || "-",
        deadline: p.deadline
          ? new Date(p.deadline).toISOString().slice(0, 10)
          : "-",
        updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-",
        isApproved: p.status === "approved"
      }));
  }, [projects]);



  // ✅ Filter logic
  const filtered = useMemo(() => {
    return studentProjects.filter((row) => {
      const matchesSearch =
        row.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.studentName.toLowerCase().includes(searchTerm.toLowerCase());

      const status = row.hasSupervisor ? "assigned" : "unassigned";
      const matchesFilter =
        filterStatus === "all" || status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [studentProjects, searchTerm, filterStatus]);

  // ✅ Handle dropdown select
  const handleSupervisorSelect = (projectId, supervisorId) => {
    setSelectedSupervisor((prev) => ({
      ...prev,
      [projectId]: supervisorId,
    }));
  };

  // ✅ Handle assignment
  const handleAssign = async (studentId, projectStatus, projectId) => {
    const supervisorId = selectedSupervisor[projectId];

    if (!supervisorId) {
      toast.error("Please select a supervisor first");
      return;
    }

    if (projectStatus === "rejected") {
      toast.error("Cannot assign supervisor to rejected project");
      return;
    }

    setPendingFor(projectId);

    const res = await dispatch(
      assignSupervisor({ studentId, supervisorId })
    );

    setPendingFor(null);

    if (assignSupervisor.fulfilled.match(res)) {

      setSelectedSupervisor((prev) => {
        const updated = { ...prev };
        delete updated[projectId];
        return updated;
      });

      dispatch(getAllUsers());
    } else {
      toast.error("Failed to assign supervisor");
    }
  };

  // ✅ Dashboard cards
  const dashboardCards = [
    {
      title: "Assigned Students",
      value: studentProjects.filter((r) => r.hasSupervisor).length,
      icon: CheckCircle,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Unassigned Students",
      value: studentProjects.filter((r) => !r.hasSupervisor).length,
      icon: AlertTriangle,
      bg: "bg-red-100",
      color: "text-red-600",
    },
    {
      title: "Available Teachers",
      value: teachers.filter(
        (t) => t.assignedCount < (t.maxStudents || 0)
      ).length,
      icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
  ];

  // ✅ Badge Component
  const Badge = ({ color, children }) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}
      >
        {children}
      </span>
    );
  };

  // TABLE HEADER
  const headers = [
    "Student",
    "Project Title",
    "Supervisor",
    "Deadline",
    "Project Status",
    "Assign Supervisor",
    "Actions",
  ];


  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">

          <div className="flex items-center justify-between p-6">

            {/* Left Section */}
            <div className="flex items-center gap-4">

              {/* Icon Box */}
              <div className="p-3 bg-indigo-50 rounded-xl transition-all duration-300 hover:bg-indigo-100">
                <BadgeCheck className="w-6 h-6 text-indigo-600" />
              </div>

              {/* Text Content */}
              <div>
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                  Assign Supervisor
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Manage supervisor assignments for students and projects.
                </p>
              </div>

            </div>

            {/* Optional Right Side Tag */}
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              Admin Panel
            </span>

          </div>

        </div>

        {/* FILTER */}
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
                  <option value="all">All Students</option>
                  <option value="assigned">Assigned</option>
                  <option value="unassigned">Unassigned</option>
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

        {/* TABLE */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Student Assignments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  {
                    headers.map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))
                  }
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {
                  filtered.map(row => (
                    <tr key={row.projectId} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {row.studentName}
                          </div>
                          <div className="text-xs font-semibold  text-slate-500">
                            {row.studentEmail}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold">
                        {row.title}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.supervisor !== "-" ? (
                          <div className="inline-flex   items-center px-3 py-1 rounded-full bg-green-100 text-emerald-800 text-xs font-medium border border-emerald-100">
                            {row.supervisor}
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-200 text-red-800 text-xs  font-medium border border-slate-200">
                            {row.status === "rejected" ? "Rejected" : "Not Assigned"}
                          </div>
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
                        <div className="relative">
                          <select
                            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                 hover:bg-white hover:border-slate-300
                 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                            value={selectedSupervisor[row.projectId] || ""}
                            disabled={
                              row.hasSupervisor ||
                              row.status === "rejected" ||
                              !row.isApproved
                            }
                            onChange={(e) =>
                              handleSupervisorSelect(row.projectId, e.target.value)
                            }
                          >
                            <option value="" disabled>
                              Select Supervisor
                            </option>

                            {teachers.map((t) => (
                              <option
                                key={t._id}
                                value={t._id}
                                disabled={t.capacityLeft <= 0}
                              >
                                {t.name} ({t.capacityLeft} left)
                              </option>
                            ))}
                          </select>

                          {/* Custom Dropdown Arrow */}
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
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            handleAssign(row.studentId, row.status, row.projectId)
                          }
                          disabled={
                            pendingFor === row.projectId ||
                            row.hasSupervisor ||
                            row.status === "rejected" ||
                            !row.isApproved
                          }
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200
      ${pendingFor === row.projectId
                              ? "bg-indigo-400 text-white cursor-wait"
                              : row.hasSupervisor
                                ? "bg-emerald-100 text-emerald-700 cursor-not-allowed"
                                : row.status === "rejected"
                                  ? "bg-red-100 text-red-600 cursor-not-allowed"
                                  : !row.isApproved
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                            }`}
                        >
                          {pendingFor === row.projectId
                            ? "Assigning..."
                            : row.hasSupervisor
                              ? "Assigned"
                              : row.status === "rejected"
                                ? "Rejected"
                                : !row.isApproved
                                  ? "Not Approved"
                                  : "Assign"}
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>

            {
              filtered.length === 0 && (


                <div className="flex flex-col items-center justify-center text-center mt-10">

                  {/* Icon Circle */}
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-50 border border-indigo-100 mb-4">
                    <svg
                      className="w-8 h-8 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7h18M3 12h18M3 17h18"
                      />
                    </svg>
                  </div>

                  {/* Heading */}
                  <h3 className="text-lg font-semibold text-slate-700">
                    No Records Found
                  </h3>

                  {/* Sub text */}
                  <p className="text-sm text-slate-400 mt-1">
                    Try changing your search or filter settings.
                  </p>

                </div>


              )
            }
          </div>
        </div>

        {/* SUMMAERY */}
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 
                   hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Glow Effect */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-100 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition" />

                <div className="relative flex items-center justify-between">
                  {/* Left Side */}
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${card.bg} shadow-inner`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {card.title}
                      </p>
                      <p className="text-2xl font-bold text-slate-800 tracking-tight">
                        {card.value}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
};

export default AssignSupervisor;