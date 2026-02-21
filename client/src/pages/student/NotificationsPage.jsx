import React, { useEffect } from 'react'
import { AlertCircle, BadgeCheck, BellOff, Calendar, CheckCircle2, ChevronDown, Clock, Clock5, MessageCircle, Settings, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { deleteNotification, getNotifications, markAllAsRead, markAsRead } from '../../store/slices/notificationSlice';
const NotificationsPage = () => {

  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notification.list);
  const unreadCount = useSelector(state => state.notification.unreadCount);

  useEffect(() => {
    dispatch(getNotifications())
  }, [dispatch]);

  const markAsReadHandler = (id) => dispatch(markAsRead(id));
  const markAllAsReadHandler = () => dispatch(markAllAsRead());
  const deleteNotificationHandler = (id) => dispatch(deleteNotification(id))

  const getNotificationIcon = (type) => {
    switch (type) {
      case "feedback":
        return <MessageCircle className="w-6 h-6 text-blue-500" />;

      case "deadline":
        return <Clock5 className="w-6 h-6 text-red-500" />;

      case "approval":
        return <BadgeCheck className="w-6 h-6 text-green-500" />;

      case "meeting":
        return <Calendar className="w-6 h-6 text-purple-500" />;

      case "system":
        return <Settings className="w-6 h-6 text-gray-500" />;

      default:
        // Custom combined icon (User + Down Arrow)
        return (
          <div
            className="relative w-6 h-6 text-slate-500 
        flex items-center justify-center"
          >
            <User className="w-5 h-5 absolute" />
            <ChevronDown className="w-4 h-4 absolute top-4" />
          </div>
        );
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-1-red-500";
        break;
      case "medium":
        return "border-1-yellow-500";
        break;
      case "low":
        return "border-1-green-500";
        break;

      default:
        return "border-1-slate-300";
        break;
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();

    const diffTime = now - date; // no need for Math.abs
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    }
  };


  const stats = [
    {
      title: "Total",
      value: notifications.length,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
      titleColor: "text-blue-800",
      valueColor: "text-blue-900",
      Icon: User,
    },
    {
      title: "Unread",
      value: unreadCount,
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      textColor: "text-red-600",
      titleColor: "text-red-800",
      valueColor: "text-red-900",
      Icon: AlertCircle,
    },
    {
      title: "High Priority",
      value: notifications.filter((n) => n.priority === "high").length,
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      textColor: "text-yellow-600",
      titleColor: "text-yellow-800",
      valueColor: "text-yellow-900",
      Icon: Clock,
    },
    {
      title: "This Week",
      value: notifications.filter((n) => {
        const notifDate = new Date(n.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return notifDate >= weekAgo;
      }).length,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      textColor: "text-green-600",
      titleColor: "text-green-800",
      valueColor: "text-green-900",
      Icon: CheckCircle2,
    },
  ];





  return (
    <>
      <div className="space-y-6">
        <div className="card">

          {/* CARD HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mt-2">
                Notifications 🔔
              </h2>
              <p className="text-xs text-slate-500  ">
                stay updated with your project progress and deadlines
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsReadHandler}
                className="
      group relative flex items-center gap-2.5 px-4 py-2 
      text-sm font-semibold tracking-tight
      text-slate-700 bg-white border border-slate-200 
      rounded-lg shadow-sm
      hover:bg-slate-50 hover:border-blue-300 hover:text-blue-700
      active:bg-blue-100 active:scale-[0.97]
      focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-1
      transition-all duration-200 ease-out
    "
              >
                {/* Animated Icon Container */}
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <span>Mark all as read</span>

                {/* Professional Badge Design */}
                <div className="flex items-center justify-center px-2 py-0.5 min-w-[24px] text-[11px] font-bold bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                  {unreadCount}
                </div>
              </button>
            )}

          </div>

          {/* NOTIFICATION STATES */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-5'>
            {
              stats.map((item, i) => {
                return (
                  <div
                    key={i}
                    className={`${item.bg} rounded-lg p-4 `}>
                    <div className='flex items-center '>
                      <div className={`p-2 ${item.iconBg} rounded-lg `}>
                        <item.Icon className={`w-5 h-5 ${item.textColor} `} />
                      </div>

                      <div className='ml-3'>
                        <p className={`text-sm font-medium ${item.titleColor}`}>
                          {item.title}
                        </p>
                        <p className={`text-sm font-medium ${item.valueColor}`}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>

          {/* NOTIFICATION LIST */}
          <div className='space-y-3'>
            {
              notifications.map(notification => {
                return (
                  <div
                    className={`border-2 border-slate-200 rounded-lg p-4 transition-all duration-200 
                      ${getPriorityColor(notification.priority)}  ${!notification.isRead ? "bg-blue-50" : "bg-white hover:bg-slate-50"}`}
                    key={notification._id}>

                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>


                      <div className='flex min-w-0 '>
                        <div className='flex items-center justify-between mb-2'>
                          <h3 className={`font-medium ${!notification.isRead ? "text-slate-900" : "text-slate-700"}`}>
                            {notification.title} {!notification.isRead && (<span className='ml-2 w-2 h-2 bg-blue-50 rounded-full inline-block ' />)}
                          </h3>

                          <div className='flex items-center space-x-2'>
                            <span className='text-sm text-slate-500'>
                              {formatDate(notification.createdAt)}
                            </span>
                            <span className={`badge capitalize ${notification.priority === "high" ?
                              "badge-rejected"
                              : notification.priority === "medium" ?
                                "badge-pending" : "badge-approved"
                              }`}>
                              {notification.priority}
                            </span>
                          </div>
                        </div>

                        <p className='text-slate-600 text-sm leading-relaxed mb-3'>
                          {notification.message}
                        </p>

                        <div className='flex items-center justify-between'>
                          <span className={`badge capitalize  ${notification.type === "feedback" ?
                            "bg-blue-100 text-blue-800" : notification.type === "deadline" ?
                              "bg-red-100 text-red-800" : notification.type === "approval" ?
                                "bg-green-100 text-green-800" : notification.type === "meeting" ?
                                  "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {notification.type}
                          </span>
                          <div className='flex items-center space-x-2'>
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsReadHandler(notification._id)}
                                className='text-sm text-blue-600 hover:text-blue-500'>
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotificationHandler(notification._id)}
                              className='text-sm text-red-600 hover:text-red-500'>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>

          {
            notifications.length === 0 && (
              <>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-slate-100 text-2xl">
                    <BellOff className='text-slate-600'/>
                  </div>

                  <p className="mt-4 text-slate-600 font-medium">
                    No notifications yet   
                  </p>

                  <p className="text-sm text-slate-400"> 
                    You're all updated 🎉
                  </p>
                </div>
              </>
            )
          }

        </div>
      </div >
    </>
  )
}

export default NotificationsPage 