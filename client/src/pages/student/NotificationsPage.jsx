import React, { useEffect } from "react";
import {
  AlertCircle,
  BadgeCheck,
  BellOff,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Clock5,
  MessageCircle,
  Settings,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../../store/slices/notificationSlice";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notification.list);
  const unreadCount = useSelector((state) => state.notification.unreadCount);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const markAsReadHandler = (id) => dispatch(markAsRead(id));
  const markAllAsReadHandler = async () => {
    await dispatch(markAllAsRead());
    dispatch(getNotifications());
  };
  const deleteNotificationHandler = (id) =>
    dispatch(deleteNotification(id));

  /* ---------------- ICON ---------------- */
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
        return (
          <div className="relative w-6 h-6 text-slate-500 flex items-center justify-center">
            <User className="w-5 h-5 absolute" />
            <ChevronDown className="w-4 h-4 absolute top-3" />
          </div>
        );
    }
  };

  /* ---------------- PRIORITY BORDER ---------------- */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500";
      case "medium":
        return "border-l-4 border-yellow-500";
      case "low":
        return "border-l-4 border-green-500";
      default:
        return "border-l-4 border-slate-300";
    }
  };

  /* ---------------- DATE FORMAT ---------------- */
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ---------------- STATS ---------------- */
  const stats = [
    {
      title: "Total",
      value: notifications.length,
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
      Icon: User,
    },
    {
      title: "Unread",
      value: unreadCount,
      iconBg: "bg-red-100",
      textColor: "text-red-600",
      Icon: AlertCircle,
    },
    {
      title: "High Priority",
      value: notifications.filter((n) => n.priority === "high").length,
      iconBg: "bg-yellow-100",
      textColor: "text-yellow-600",
      Icon: Clock,
    },
    {
      title: "This Week",
      value: notifications.filter((n) => {
        const notifDate = new Date(n.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return notifDate >= weekAgo;
      }).length,
      iconBg: "bg-green-100",
      textColor: "text-green-600",
      Icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">

        {/* ---------------- HEADER ---------------- */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Notifications
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Stay updated with your project progress and deadlines
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsReadHandler}
              className="flex items-center gap-2 px-4 py-2 
                         text-sm font-semibold 
                         bg-blue-600 text-white 
                         rounded-xl shadow-sm
                         hover:bg-blue-700 transition"
            >
              Mark all as read
              <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            </button>
          )}
        </div>

        {/* ---------------- STATS ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-8">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-slate-50 border border-slate-200 
                         rounded-2xl p-5 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.iconBg}`}>
                  <item.Icon className={`w-5 h-5 ${item.textColor}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <p className="text-xl font-semibold text-slate-800">
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- NOTIFICATION LIST ---------------- */}
        <div className="space-y-4 mt-8">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-2xl shadow-sm 
                          border border-slate-200 
                          ${getPriorityColor(notification.priority)}
                          p-5 hover:shadow-md transition
                          ${!notification.isRead ? "bg-blue-50/40" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1">
                  {/* TOP */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        {notification.title}
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </h3>

                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-400">
                        {formatDate(notification.createdAt)}
                      </p>

                      <span
                        className={`mt-2 inline-block px-2 py-1 text-xs font-medium rounded-full capitalize
                          ${notification.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : notification.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                      >
                        {notification.priority}
                      </span>
                    </div>
                  </div>

                  {/* BOTTOM */}
                  <div className="flex justify-between items-center mt-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full capitalize
                        ${notification.type === "feedback"
                          ? "bg-blue-100 text-blue-700"
                          : notification.type === "deadline"
                            ? "bg-red-100 text-red-700"
                            : notification.type === "approval"
                              ? "bg-green-100 text-green-700"
                              : notification.type === "meeting"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {notification.type}
                    </span>

                    <div className="flex items-center gap-4 text-sm">
                      {!notification.isRead && (
                        <button
                          onClick={() =>
                            markAsReadHandler(notification._id)
                          }
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Mark as read
                        </button>
                      )}

                      <button
                        onClick={() =>
                          deleteNotificationHandler(notification._id)
                        }
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* EMPTY STATE */}
          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center 
                            py-16 text-center border border-dashed 
                            border-slate-300 rounded-3xl bg-white">
              <div className="w-20 h-20 flex items-center justify-center 
                              rounded-full bg-slate-100">
                <BellOff className="w-8 h-8 text-slate-400" />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-slate-700">
                No Notifications Yet
              </h3>

              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                You're all caught up. New updates will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;