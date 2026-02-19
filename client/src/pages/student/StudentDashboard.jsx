import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { fetchDashboardStats } from '../../store/slices/studentSlice';
import { MessageCircleMore } from 'lucide-react'
const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(state => state.auth)
  const { dashboardStats } = useSelector(state => state.student)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  const project = dashboardStats?.project || {}
  const supervisorName = dashboardStats?.supervisorName || "N/A"
  const upcomingDeadlines = dashboardStats?.upcomingDeadlines || []
  const topNotifications = dashboardStats?.topNotifications || []
  const feedbackList = dashboardStats?.feedbackList?.slice(-2).reverse() || []

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";

    const date = new Date(dateStr);

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };


  // const getStatusColor = (status) => {
  //   switch (status?.toLowerCase()) {
  //     case "upcoming":
  //       return "badge-pending";

  //     case "completed":
  //       return "badge-approved";

  //     case "overdue":
  //       return "badge-rejected";

  //     default:
  //       return "badge-pending";
  //   }
  // };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-10">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-10 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome back{authUser?.name ? `, ${authUser.name}` : ""} 👋
          </h1>
          <p className="mt-3 text-blue-100">
            Here's your project overview and recent updates.
          </p>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {[
          {
            label: "Project Title",
            value: project?.title || "No Project",
            icon: "💻",
            color: "bg-indigo-100 text-indigo-600"
          },
          {
            label: "Supervisor",
            value: supervisorName,
            icon: "🧑‍🏫",
            color: "bg-emerald-100 text-emerald-600"
          },
          {
            label: "Next Deadline",
            value: formatDate(project?.deadline),
            icon: "📅",
            color: "bg-amber-100 text-amber-600"
          },
          {
            label: "Recent Feedback",
            value: feedbackList?.length
              ? formatDate(feedbackList[0]?.createdAt)
              : "No Feedback Yet",
            icon: "💬",
            color: "bg-rose-100 text-rose-600"
          }
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[140px]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{item.label}</p>
              <div className={`h-10 w-10 flex items-center justify-center rounded-xl ${item.color}`}>
                {item.icon}
              </div>
            </div>

            <p className="mt-5 text-lg font-semibold text-slate-800 truncate">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PROJECT OVERVIEW */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              📘 Project Overview
            </h2>

            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
              ${project?.status === "approved"
                  ? "bg-emerald-100 text-emerald-700"
                  : project?.status === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : project?.status === "rejected"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-100 text-slate-600"
                }`}
            >
              {project?.status || "Unknown"}
            </span>
          </div>

          <div className="h-px bg-slate-100"></div>

          <div>
            <p className="text-sm text-slate-500">Title</p>
            <p className="text-lg font-semibold text-slate-800 mt-1">
              {project?.title || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Description</p>
            <p className="text-slate-700 mt-1 leading-relaxed">
              {project?.description || "No project description provided."}
            </p>
          </div>

          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
            <div>
              <p className="text-sm text-slate-500">Submission Deadline</p>
              <p className="font-semibold text-slate-800">
                {formatDate(project?.deadline)}
              </p>
            </div>
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              📅
            </div>
          </div>

        </div>

        {/* LATEST FEEDBACK */}
        <div className='card'>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              Latest Feedback
            </h2>
            <Link
              to="/student/feedback"
              className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all duration-200 relative group"
            >
              View All
              <span className="text-lg leading-none transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>

              {/* Animated underline */}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

          </div>
          {
            feedbackList && feedbackList.length > 0 ?
              (
                <div className='space-y-4 p-4 '>
                  {
                    feedbackList.map((feedback, index) => {
                      return (
                        <div
                          className='border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow'
                          key={index}
                        >
                          <div className='flex items-center justify-between mb-2'>
                            <div className='flex items-center space-x-2'>
                              <MessageCircleMore className='w-5 h-5 text-blue-500' />
                              <h3 className='font-medium text-slate-800'>{feedback.title || "Supervisor Feedback"}</h3>
                            </div>
                            <p className='text-xs text-slate-500'>
                              {formatDate(feedback.createdAt)}</p>
                          </div>

                          <div className='text-slate-50 rounded-lg p-3'>
                            <p className='text-slate-700 text-sm leading-relaxed'>
                              {feedback.message}
                            </p>
                          </div>


                          <div className='flex justify-between items-center mt-3'>
                            <p className='text-xs text-slate-500'>
                              - {supervisorName || "Supervisor"}
                            </p>
                          </div>

                        </div>
                      )
                    })
                  }
                </div>
              ) : (
                <div className='text-center py-8 '>
                  <MessageCircleMore className='w-10 h-10 text-slate-300 mx-auto mb-3' />
                  <p className='text-slate-500 text-sm '>
                    No feedback available yet.</p>
                </div>
              )
          }
        </div>
      </div>

      {/* UPCOMING DEADLINES & NOTIFICATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Upcoming Deadlines Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              📅 Upcoming Deadlines
            </h2>


          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Content */}
          {upcomingDeadlines && upcomingDeadlines.length > 0 ? (
            <div className="space-y-4">

              {upcomingDeadlines.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all duration-200"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {d.title}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {formatDate(d.deadline)}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    Upcoming
                  </div>

                </div>
              ))}

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-slate-100 text-2xl">
                📭
              </div>
              <p className="mt-4 text-slate-600 font-medium">
                No upcoming deadlines
              </p>
              <p className="text-sm text-slate-400">
                You're all caught up 🎉
              </p>
            </div>
          )}

        </div>


        {/* RESENT NOTIFICATION */}

        <div className='card'>
          <div className="flex items-center justify-between  ">
            <h2 className="text-xl font-semibold text-slate-800 mt-2">
              🔔 Resent Notification
            </h2>
          </div>


          {
            topNotifications && topNotifications.length > 0 ?
              (
                <>
                  <div className='space-y-3'>
                    {
                      topNotifications.map((n, i) => {
                        return (
                          <div
                            className='p-3 bg-slate-50 rounded-lg border border-slate-100'
                            key={i}>
                            <p className='font-medium text-slate-800'>{n.message}</p>
                            <p className='text-xs text-slate-500 mt-1'>{formatDate(n.createdAt)}</p>
                          </div>
                        )
                      })
                    }
                  </div>
                </>
              )
              :
              (<>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-slate-100 text-2xl">
                    🔕
                  </div>

                  <p className="mt-4 text-slate-600 font-medium">
                    No notifications yet   
                  </p>

                  <p className="text-sm text-slate-400"> 
                    You're all updated 🎉
                  </p>
                </div>
              </>)
          }
        </div>


      </div>
    </div>
  )
}

export default StudentDashboard  