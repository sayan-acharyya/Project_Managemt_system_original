import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSudent,
  deleteSudent,
  getAllUsers,
  updateSudent,
} from "../../store/slices/adminSlice";
import { CheckCircle, ChevronDown, Filter, Plus, Search, TriangleAlert, Users, UserSquare2 } from "lucide-react";
import { toggleStudentModel } from "../../store/slices/popupSlice";

const ManageStudents = () => {
  const { users, projects } = useSelector((state) => state.admin);
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
    department: "",
  });

  // Fetch users
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Prepare student list with project info
  const students = useMemo(() => {
    const studentUsers = (users || []).filter(
      (u) => u.role?.toLowerCase() === "student"
    );

    return studentUsers.map((student) => {
      const studentProject = (projects || []).find(
        (p) => p.student?._id === student._id
      );

      return {
        ...student,
        projectTitle: studentProject?.title || null,
        supervisor: studentProject?.supervisor || null,
        projectStatus: studentProject?.status || null,
      };
    });
  }, [users, projects]);

  // Unique departments
  const departments = useMemo(() => {
    const uniqueDepartments = new Set(
      students.map((s) => s.department).filter(Boolean)
    );
    return Array.from(uniqueDepartments);
  }, [students]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        (student.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (student.email || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterDepartment === "all" ||
        student.department === filterDepartment;

      return matchesSearch && matchesFilter;
    });
  }, [students, searchTerm, filterDepartment]);

  // Handlers
  const handleCloseModel = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      department: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingStudent) {
      dispatch(updateSudent({ id: editingStudent._id, data: formData }));
    } else {
      dispatch(createSudent(formData));
    }

    handleCloseModel();
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || "",
      email: student.email || "",
      department: student.department || "",
    });
    setShowModal(true);
  };

  const handleDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModel(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      dispatch(deleteSudent(studentToDelete._id));
      setShowDeleteModel(false);
      setStudentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModel(false);
    setStudentToDelete(null);
  };

  return (
    <div className="space-y-8 p-4 md:p-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Manage Students
          </h1>
          <p className="text-base text-gray-500 mt-1">
            Monitor performance, track assignments, and manage student records.
          </p>
        </div>

        <button
          onClick={() => dispatch(toggleStudentModel())}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                   text-white font-medium px-6 py-3 rounded-xl
                   transition-all duration-200 shadow-sm hover:shadow-blue-200 hover:shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            label: "Total Students",
            value: students.length,
            icon: <UserSquare2 className="w-6 h-6 text-blue-600" />,
            bg: "bg-blue-50"
          },
          {
            label: "Completed Projects",
            value: students.filter((s) => s.status === "completed").length,
            icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
            bg: "bg-emerald-50"
          },
          {
            label: "Unassigned",
            value: students.filter((s) => !s.supervisor).length,
            icon: <TriangleAlert className="w-6 h-6 text-amber-600" />,
            bg: "bg-amber-50"
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className={`p-4 ${stat.bg} rounded-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 
                       focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 
                       outline-none transition-all text-gray-700"
            />
          </div>

          {/* Department Filter */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 
                       focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 
                       outline-none appearance-none transition-all text-gray-700 font-medium"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {/* Custom Arrow for Select */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* student table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Students List</h2>
        </div>

        <div className="overflow-x-auto ">
          <table className="w-full">
            <thead className="bg-slate-100 ">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Student Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Department & Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Supervisor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Project Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-200 ">
              {
                filteredStudents.map(student => {
                  return (
                    <tr
                      className="hover:bg-slate-50"
                      key={student._id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {student.email}
                          </div>
                          {
                            student.studentId && (
                              <div className="text-xs text-slate-400 ">
                                ID:{student.studentId}
                              </div>
                            )
                          }
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {student.department || "--"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {
                            student.createdAt ? new Date(student.createdAt).getFullYear()
                              : "--"
                          }
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {
                          student.supervisor ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-green-800 bg-green-100 text-xs font-medium ">
                              {
                                typeof student.supervisor === "object" ? student.supervisor.name || "--" : student.supervisor
                              }
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-red-800 bg-red-100 text-xs font-medium ">
                              {
                                student.projectStatus === "rejected" ? "Rejected" : "Not Assigned"
                              }

                            </span>
                          )
                        }
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 ">
                          {student.projectTitle}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900 px-3 py-1 rounded-md transition-colors duration-200"
                            onClick={() => handleEdit(student)}
                          >
                            Edit
                          </button>

                          <button
                            className="bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900 px-3 py-1 rounded-md transition-colors duration-200"
                            onClick={() => handleDelete(student)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ManageStudents;