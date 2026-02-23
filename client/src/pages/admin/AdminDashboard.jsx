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


const AdminDashboard = () => {

  const { isCreateStudentModalOpen, isCreateTeacherModalOpen } = useSelector(state => state.popup);

  const { stats } = useSelector(state => state.admin);
  const { projects } = useSelector(state => state.project);
  const { notifications } = useSelector(state => state.notification.list);


  const dispatch = useDispatch();

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
     
  }

  return (
    <div>

    </div>
  )
}

export default AdminDashboard 