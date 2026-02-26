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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* vertical Bar Chart */}
          <div className="lg:col-span-2 card">
            <div className="card-header">
              <h3>
                Project Distribution by supervisor
              </h3>
            </div>
            <div className="p-4">
              {
                supervisorsBucket.length === 0 ? (
                  <div className="h-64 flex items-center justify-center bg-slate-50 rounded text-slate-500">
                    No data
                  </div>
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                      <BarChart
                        data={supervisorsBucket}
                        margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                        barCategoryGap={"20%"}
                      >
                        <CartesianGrid s
                          trokeDasharray="3 3"
                          stroke="#E2E8F0" />
                        <XAxis
                          dataKey={"name"}
                          tick={{ fontSize: 12, fill: "#334155" }}
                          axisLine={{ stroke: "#CBD5E1" }}
                          tickLine={{ stroke: "#CBD5E1" }}
                          interval={0}
                          height={50}
                          dy={10}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12, fill: "#334155" }}
                          axisLine={{ stroke: "#CBD5E1" }}
                          tickLine={{ stroke: "#CBD5E1" }}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(99,102,241,0.05)" }}
                          contentStyle={{
                            borderRadius: 8,
                            borderColor: "#E2E8F0"
                          }}
                          formatter={(value, name) => [
                            value,
                            name === "count" ? "Project Assigned" : name
                          ]}
                          labelFormatter={(label) => `Supervisor: ${label}`}
                        />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]} >
                          {
                            supervisorsBucket.map((entry, index) => {
                              const colors = [
                                "#1E3A8A",
                                "#2563EB",
                                "#3B82F6",
                                "60A5FA",
                                "#93C5FD"
                              ]

                              return (
                                <Cell 
                                fill={colors[index % colors.length]}
                                key={`cell-${index}`} />
                              )
                            })
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard 