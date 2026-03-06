import React, { useEffect } from 'react'
import { BadgeCheck, ChevronRight, MessageCircle, MessageCircleWarning, MessageCircleX, MessageSquareQuote, TriangleAlert } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProject, getFeedback } from '../../store/slices/studentSlice';
const FeedbackPage = () => {
  const dispatch = useDispatch();
  const { project, feedback } = useSelector(state => state.student);


  useEffect(() => {
    dispatch(fetchProject());
  }, [dispatch]);

  useEffect(() => {

    if (project?._id) {
      dispatch(getFeedback(project._id))
    }
  }, [dispatch, project])

  const getFeedbackIcon = (type) => {
    if (type === "positive") {
      return <BadgeCheck className='w-6 h-6 text-green-500' />
    }
    if (type === "negative") {
      return <TriangleAlert className='w-6 h-6 text-red-500' />
    }
    return <MessageCircle className='w-6 h-6 text-blue-500' />

  }



  const feedbackStats = [
    {
      type: "general",
      title: "Total Feedback",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-800",
      valueColor: "text-blue-900",
      getCount: (feedback) => feedback?.length || 0,
    },
    {
      type: "positive",
      title: "Positive",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      textColor: "text-green-800",
      valueColor: "text-green-900",
      getCount: (feedback) =>
        feedback.filter((f) => f.type === "positive").length,
    },
    {
      type: "negative",
      title: "Needs Revision",
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      textColor: "text-yellow-800",
      valueColor: "text-yellow-900",
      getCount: (feedback) =>
        feedback.filter((f) => f.type === "negative").length,
    },
  ];

  return (
    <>
      <div className='space-y-6'>
        <div className='card'>

          {/* HEADER */}
          <div className='group card p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                {/* Icon with a soft background circle */}
                <div className='p-2.5 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors'>
                  <MessageSquareQuote className="w-6 h-6 text-indigo-600" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                    Supervisor Feedback
                  </h2>
                  <p className="text-xs font-medium text-slate-400">
                    View feedback and comments from your Supervisor
                  </p>
                </div>
              </div>


            </div>
          </div>

          {/* FEEDBACK STATES */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-5'>
            {
              feedbackStats.map((item, i) => {
                return (
                  <div
                    key={i}
                    className={`${item.bg} rounded-lg p-4 `}>
                    <div className='flex items-center '>
                      <div className={`p-2 ${item.iconBg} rounded-lg `}>
                        {getFeedbackIcon(item.type)}
                      </div>

                      <div className='ml-3'>
                        <p className={`text-sm font-medium ${item.textColor}`}>
                          {item.title}
                        </p>
                        <p className={`text-sm font-medium ${item.valueColor}`}>
                          {item.getCount(feedback)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>

          {/* FEEDBACK LIST */}
          <div className="space-y-5">
            {feedback && feedback.length > 0 ? (
              feedback.map((f, i) => {
                return (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all duration-200"
                  >
                    {/* HEADER */}
                    <div className="flex items-start justify-between mb-4">

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50">
                          {getFeedbackIcon(f.type)}
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-800 text-sm">
                            {f.title || "Supervisor Feedback"}
                          </h3>

                          <p className="text-xs text-slate-500 mt-1">
                            {f.supervisorName || "Supervisor"}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </span>

                    </div>

                    {/* MESSAGE */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {f.message}
                      </p>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center bg-white border border-slate-100 rounded-2xl">

                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 mb-4">
                  <MessageCircleWarning className="w-8 h-8 text-slate-400" />
                </div>

                <p className="text-slate-600 font-medium">
                  No feedback received yet
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Your supervisor feedback will appear here.
                </p>

              </div>
            )}
          </div>

        </div>
      </div>

    </>
  )
}

export default FeedbackPage 