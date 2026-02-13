import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import {
  fetchAllSupervisor,
  fetchProject,
  getSupervisor,
  requestSupervisor
} from "../../store/slices/studentSlice"


const SupervisorPage = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(state => state.auth);
  const { project, supervisors, supervisor } = useSelector(state => state.student);

  const [showRequestModel, setShowRequestModel] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  useEffect(() => {
    dispatch(fetchProject());
    dispatch(getSupervisor());
    dispatch(fetchAllSupervisor())
  }, [dispatch])

  const hashSupervisor = useMemo(
    () => !!(supervisor && supervisor._id),
    [supervisor]
  )

  const formatDeadline = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) return "-";

    const day = date.getDate();
    const month = date.getMonth() + 1; // Month starts from 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleOpenRequest = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setShowRequestModel(true);
  }

  return (
    <>

    </>
  )
}

export default SupervisorPage 