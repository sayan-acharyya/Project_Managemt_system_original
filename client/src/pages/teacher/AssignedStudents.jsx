import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getAssignedStudents } from '../../store/slices/teacherSlice';

const AssignedStudents = () => {

  const [sortBy, setSortBy] = useState("name");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    title: "",
    message: "",
    type: "general"
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAssignedStudents())
  }, [dispatch])


  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border border-green-300"
        break;
      case "approved":
        return "bg-blue-100 text-blue-700 border border-blue-300"
        break;

      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-300"
        break;
    }
  }

  const getStatusText = (status) => {
    if (status === "completed") return "Completed";
    if (status === "approved") return "Approved";

    return "Pending"
  }


  //23:44:51

















  const stats = [
    {
      label: "Total Students",
      value: sortedStudents.length,
      bg: "bg-blue-50",
      text: "text-blue-700",
      sub: "text-blue-600",
    },
    {
      label: "Projects Completed",
      value: sortedStudents.filter(
        (s) => s.project?.status === "completed"
      ).length,
      bg: "bg-green-50",
      text: "text-green-700",
      sub: "text-green-600",
    },
    {
      label: "In Progress",
      value: sortedStudents.filter(
        (s) => s.project?.status === "in_progress"
      ).length,
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      sub: "text-yellow-600",
    },
    {
      label: "Total Projects",
      value: sortedStudents.length,
      bg: "bg-purple-50",
      text: "text-purple-700",
      sub: "text-purple-600",
    },
  ];






  return (
    <div>AssignedStudents</div>
  )
}

export default AssignedStudents