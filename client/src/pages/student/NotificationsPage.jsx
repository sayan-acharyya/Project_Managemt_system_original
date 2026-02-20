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
    
    </>
  )
}

export default NotificationsPage 