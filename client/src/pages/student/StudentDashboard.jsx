import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { fetchDashboardStats } from '../../store/slices/studentSlice';
const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(state => state.auth)
  const { dashboardStats } = useSelector(state => state.auth)

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


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "upcoming":
        return "badge-pending";

      case "completed":
        return "badge-approved";

      case "overdue":
        return "badge-rejected";

      default:
        return "badge-pending";
    }
  };

  return (
    <>
      <div>
         
      </div>
    </>
  )
}

export default StudentDashboard  