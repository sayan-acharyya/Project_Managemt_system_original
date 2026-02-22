import React, { useEffect } from 'react'
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
    
  }

  return (
    <>

    </>
  )
}

export default FeedbackPage 