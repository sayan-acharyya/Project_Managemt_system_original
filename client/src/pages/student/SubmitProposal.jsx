import React from 'react'
import { submitProjectProposal } from '../../store/slices/studentSlice'
import { useState } from 'react'
import { useDispatch } from 'react-redux';


const SubmitProposal = () => {

  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      dispatch(submitProjectProposal(formData));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }

  }
  return (
    <>

    </>
  )
}

export default SubmitProposal