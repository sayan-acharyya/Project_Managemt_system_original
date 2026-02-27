import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";
import AddTeacher from "../../components/modal/AddTeacher";
import { toast } from "react-toastify";
import { getAllProjects, getDashboardStates } from "../../store/slices/adminSlice";
import { getNotifications } from "../../store/slices/notificationSlice";
import { downloadProjectFiles } from "../../store/slices/projectSlice";
import { AlertCircle, AlertTriangle, Box, CheckCircle, FileTextIcon, Folder, PlusIcon, User, Users } from "lucide-react";
import { toggleStudentModel, toggleTeacherModel } from "../../store/slices/popupSlice";


const AdminDashboard = () => {

  const { isCreateStudentModalOpen, isCreateTeacherModalOpen } = useSelector(state => state.popup);

  const { stats } = useSelector(state => state.admin);
  const { projects } = useSelector(state => state.project);
  const { notifications } = useSelector(state => state.notification.list);


  const dispatch = useDispatch();
  const { authUser } = useSelector(state => state.auth)
  const [isReportsModelOpen, setIsReportsModelOpen] = useState(false);
  const [reportSearch, setReportSearch] = useState("");

  useEffect(() => {
    dispatch(getDashboardStates());
    dispatch(getNotifications());
    dispatch(getAllProjects());
  }, [dispatch])

  const nearingDeadlines = useMemo(() => {
    const now = new Date();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    return (projects || []).filter((p) => {
      if (!p.deadline) return false;

      const d = new Date(p.deadline);
      return d >= now && d.getTime() <= threeDays
    }).length;
  }, [projects])

  const files = useMemo(() => {
    return (projects || []).flatMap(p => (p.files || []).map(f => ({
      projectId: p._id,
      originalName: f.originalName,
      uploadedAt: f.uploadedAt,
      projectTitle: p.title,
      studentName: p.student?.name,

    })))
  }, [projects])

  const filteredFiles = files.filter((f) =>
    (f.originalName || "").toLowerCase().includes(reportSearch.toLowerCase()) ||
    (f.projectTitle || "").toLowerCase().includes(reportSearch.toLowerCase()) ||
    (f.studentName || "").toLowerCase().includes(reportSearch.toLowerCase())
  )

  const handleDownload = async (projectId, fileId, name) => {
    const res = await dispatch(downloadProjectFiles({ projectId, fileId })).then(res => {
      const { blob } = res.payload;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name || "download");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    })

  }

  const supervisorsBucket = useMemo(() => {
    const map = new Map();
    (projects || []).forEach((p) => {
      if (!p?.supervisor?.name) return;

      const name = p.supervisor.name;
      map.set(name, (map.get(name) || 0) + 1);

    });

    const arr = Array.from(map.entries()).map(([name, count]) => ({
      name,
      count
    }));
    arr.sort((a, b) => b.count - a.count);
    return arr;

  }, [projects])

  const latestNotifications = useMemo(
    () => (notifications || []).slice(0, 6),
    [notifications]
  );

  const getBulletColor = (type, priority) => {
    const t = (type || "").toLowerCase();
    const p = (priority || "").toLowerCase();
    if (p === "high" && (t === "rejection" || t === "reject")) return "bg-red-600";
    if (p === "medium" && (t === "deadline" || t === "due")) return "bg-orange-500";
    if (p === "high") return "bg-red-500";
    if (p === "medium") return "bg-yellow-500";
    if (p === "low") return "bg-slate-400";
    // type-based fallback
    if (t === "approval" || t === "approved") return "bg-green-600";
    if (t === "request") return "bg-blue-600";
    if (t === "feedback") return "bg-purple-600";
    if (t === "meeting") return "bg-cyan-600";
    if (t === "system") return "bg-slate-600";
    return "bg-slate-400";
  };

  const getBadgeClasses = (kind, value) => {
    const v = (value || "").toLowerCase();
    if (kind === "type") {
      if (["rejection", "reject"].includes(v)) return "bg-red-100 text-red-800";
      if (["approval", "approved"].includes(v)) return "bg-green-100 text-green-800";
      if (["deadline", "due"].includes(v)) return "bg-orange-100 text-orange-800";
      if (v === "request") return "bg-blue-100 text-blue-800";
      if (v === "feedback") return "bg-purple-100 text-purple-800";
      if (v === "meeting") return "bg-cyan-100 text-cyan-800";
      if (v === "system") return "bg-slate-100 text-slate-800";
      return "bg-gray-100 text-gray-800";
    }
    // priority
    if (v === "high") return "bg-red-100 text-red-800";
    if (v === "medium") return "bg-yellow-100 text-yellow-800";
    if (v === "low") return "bg-gray-100 text-gray-800";
    return "bg-slate-100 text-slate-800";
  };




  const dashboardStats = [
    {
      title: "Total Students",
      value: stats?.totalStudents ?? 0,
      bg: "bg-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      Icon: User,
    },
    {
      title: "Total Teachers",
      value: stats?.totalTeachers ?? 0,
      bg: "bg-green-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      Icon: Box,
    },
    {
      title: "Pending Requests",
      value: stats?.pendingRequests ?? 0,
      bg: "bg-orange-100",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      Icon: AlertCircle,
    },
    {
      title: "Active Projects",
      value: stats?.totalProjects ?? 0,
      bg: "bg-yellow-100",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      Icon: Folder,
    },
    {
      title: "Nearing Deadlines",
      value: nearingDeadlines,
      bg: "bg-red-100",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      Icon: AlertTriangle,
    },
  ];

  const actionButtons = [
    {
      label: "Add Student",
      onClick: () => dispatch(toggleStudentModel()),
      btnClass: "btn-primary",
      Icon: PlusIcon, // lucide-react icon
    },
    {
      label: "Add Teacher",
      onClick: () => dispatch(toggleTeacherModel()),
      btnClass: "btn-secondary",
      Icon: PlusIcon,
    },
    {
      label: "View Reports",
      onClick: () => setIsReportsModelOpen(true),
      btnClass: "btn-outline",
      Icon: FileTextIcon,
    },
  ];



  // const dashboardCards = [
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



  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-3xl 
      bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 
      p-10 text-white shadow-2xl">

          {/* Soft Glow Effects */}
          <div className="absolute -top-12 -right-12 w-52 h-52 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Admin Control Panel
            </h1>

            <p className="mt-4 text-indigo-100 text-lg max-w-2xl">
              Monitor system performance, manage users, and control project workflows
              from one powerful dashboard.
            </p>
          </div>
        </div>

        {/* STATES CARDS */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6  '>
          {
            dashboardStats.map((item, i) => {
              return (
                <div
                  key={i}
                  className={`${item.bg} rounded-lg p-4 `}>
                  <div className='flex items-center '>
                    <div className={`p-2 ${item.iconBg} rounded-lg `}>
                      <item.Icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>

                    <div className='ml-3'>
                      <p className={`text-sm font-medium text-slate-600`}>
                        {item.title}
                      </p>
                      <p className={`text-sm font-medium text-slate-800`}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>

        {/* CHARTS & ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===================== CHART CARD ===================== */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">
                Project Distribution by Supervisor
              </h3>
               
            </div>

            {/* Body */}
            <div className="p-6">
              {supervisorsBucket.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
                  <Folder className="w-10 h-10 mb-3 opacity-40" />
                  <p>No supervisor data available</p>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={supervisorsBucket}
                      margin={{ top: 10, right: 20, bottom: 20, left: 0 }}
                      barCategoryGap="25%"
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E2E8F0"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12, fill: "#475569" }}
                        axisLine={{ stroke: "#CBD5E1" }}
                        tickLine={false}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12, fill: "#475569" }}
                        axisLine={{ stroke: "#CBD5E1" }}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(99,102,241,0.08)" }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #E2E8F0",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
                        }}
                        formatter={(value) => [`${value}`, "Projects Assigned"]}
                        labelFormatter={(label) => `Supervisor: ${label}`}
                      />
                      <Bar
                        dataKey="count"
                        radius={[10, 10, 0, 0]}
                      >
                        {supervisorsBucket.map((_, index) => {
                          const colors = [
                            "#4F46E5",
                            "#6366F1",
                            "#8B5CF6",
                            "#A855F7",
                            "#C084FC"
                          ];
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % colors.length]}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* ===================== RECENT ACTIVITY CARD ===================== */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">
                Recent Activity
              </h3>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">

              {latestNotifications.length === 0 && (
                <div className="text-center text-slate-400 text-sm py-10">
                  No recent notifications
                </div>
              )}

              {latestNotifications.map((n) => (
                <div
                  key={n._id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition"
                >
                  <div
                    className={`mt-1 w-2.5 h-2.5 rounded-full ${getBulletColor(
                      n.type,
                      n.priority
                    )}`}
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 leading-snug">
                      {n.message}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${getBadgeClasses(
                          "type",
                          n.type
                        )}`}
                      >
                        {n.type}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${getBadgeClasses(
                          "priority",
                          n.priority
                        )}`}
                      >
                        {n.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        
      </div>
    </>
  )
}

export default AdminDashboard 