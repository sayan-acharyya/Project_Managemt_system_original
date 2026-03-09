import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTeacherDashboardStats } from '../../store/slices/teacherSlice';
import { CheckCircle, Clock, GraduationCap, Loader, MoveDiagonal, Users } from 'lucide-react';

const TeacherDashboard = () => {

  const dispatch = useDispatch();

  const { dashboardStats, loading } = useSelector(state => state.teacher);
  const { authUser } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getTeacherDashboardStats());
  }, [dispatch]);
  //{}

  const statsCards = [
    {
      title: "Assigned Students",
      value: authUser?.assignedStudents?.length || 0,
      loading,
      icon: GraduationCap,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Pending Requests",
      value: dashboardStats?.totalPendingRequests || 0,
      loading,
      icon: Clock,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      title: "Max Capacity",
      value: authUser.maxStudents || 0,
      loading,
      icon: Users,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Completed Projects",
      value: dashboardStats?.completedProjects || 0,
      loading,
      icon: CheckCircle,
      bg: "bg-green-100",
      color: "text-green-600",
    },
  ];

  return (
    <>
      <div className="space-y-8">

        {/* ================= HEADER ================= */}
        <div className="relative overflow-hidden rounded-3xl 
    bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
    p-8 md:p-10 text-white shadow-2xl">

          <div className="relative z-10 flex items-center justify-between">

            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                FACULTY DASHBOARD
              </h1>
              <p className="mt-3 text-blue-100 text-lg">
                Manage your students and provide guidance on their projects
              </p>
            </div>

            <div className="hidden md:flex">
              <span className="px-5 py-2 text-sm font-semibold 
          bg-white/20 backdrop-blur-md 
          border border-white/30 
          rounded-full shadow-md tracking-wide">
                {authUser?.name ? authUser.name : ""}
              </span>
            </div>
          </div>

          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>


        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {statsCards.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative bg-white rounded-3xl 
          border border-slate-100 p-6 shadow-sm
          hover:shadow-xl hover:-translate-y-1 
          transition-all duration-300"
              >
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                      {item.title}
                    </p>
                    <p className="mt-3 text-3xl font-extrabold text-slate-800">
                      {item.value}
                    </p>
                  </div>

                  <div className={`h-14 w-14 flex items-center justify-center 
              rounded-2xl ${item.bg} shadow-sm`}>
                    <Icon className={`w-7 h-7 ${item.color}`} />
                  </div>

                </div>
              </div>
            );
          })}
        </div>


        {/* ================= RECENT ACTIVITY ================= */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">

          {/* Card Header */}
          <div className="px-8 py-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800">
              Recent Activity
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Latest notifications and updates
            </p>
          </div>

          {/* Card Body */}
          <div className="p-8">

            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="h-14 w-14 flex items-center justify-center 
            rounded-full bg-indigo-100">
                  <Loader className="w-7 h-7 text-indigo-600 animate-spin" />
                </div>
                <p className="text-sm text-slate-500">
                  Loading dashboard data...
                </p>
              </div>
            ) : dashboardStats?.recentNotifications?.length > 0 ? (

              <div className="space-y-4">
                {dashboardStats?.recentNotifications?.map(notification => (
                  <div
                    key={notification._id}
                    className="flex items-start gap-4 p-4 rounded-2xl 
              hover:bg-slate-50 transition duration-200"
                  >
                    <div className="h-10 w-10 flex items-center justify-center 
                rounded-xl bg-indigo-100">
                      <MoveDiagonal className="w-5 h-5 text-indigo-600" />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm text-slate-800 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            ) : (
              <div className="text-center py-10 text-slate-500">
                No Recent Activity
              </div>
            )}

          </div>
        </div>

      </div>
    </>
  )
}

export default TeacherDashboard


