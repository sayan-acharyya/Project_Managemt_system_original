import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createSudent, getAllUsers, updateSudent } from '../../store/slices/adminSlice';

const ManageStudents = () => {
  const { users, projects } = useSelector(state => state.admin);
  const { isCreateStudentModalOpen } = useSelector(state => state.popup);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [showDeleteModel, setShowDeleteModel] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: ""
  })

  const students = useMemo(() => {
    const studentUsers = (users || []).filter(u => u.role?.toLowerCase() === "student");

    return studentUsers.map(student => {
      const studentProject = (projects || []).find(
        p => p.student?._id === student._id
      );
      return {
        ...student,
        projectTitle: studentProject?.title || null,
        supervisor: studentProject?.supervisor || null,
        projectStatus: studentProject?.status || null,
      }
    })
  }, [users, projects])


  useEffect(() => {
    dispatch(getAllUsers());
  }, [])

  const departments = useMemo(() => {
    const set = new Set(students || [])
      .map((s) => s.department)
      .filter(Boolean);
    return Array.from(set);
  }, [students]);

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      (student.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    (student.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterDepartment === "all" || student.department === filterDepartment;

    return matchesSearch && matchesFilter;
  })

  const handleCloseModel = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      department: "",
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingStudent) {
      dispatch(updateSudent({ id: editingStudent._id, data: formData }))
    } else {
      dispatch(createSudent(formData))
    }
    handleCloseModel();
  }
 
  return (
    <div>ManageStudents</div>
  )
}

export default ManageStudents