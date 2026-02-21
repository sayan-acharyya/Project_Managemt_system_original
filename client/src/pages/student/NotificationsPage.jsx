import React, { useEffect } from 'react'
import { AlertCircle, BadgeCheck, Calendar, CheckCircle2, ChevronDown, Clock, Clock5, MessageCircle, Settings, User } from 'lucide-react'
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
        </div>
      </div>
    </>
  )
}

export default NotificationsPage 