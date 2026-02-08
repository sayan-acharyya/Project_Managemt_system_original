import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTeacher,
  deleteTeacher,
  getAllUsers,
  updateTeacher,
} from "../../store/slices/adminSlice";
import { toggleTeacherModel } from "../../store/slices/popupSlice";
import { BadgeCheck, CheckCircle, ChevronDown, Filter, Plus, Search, TriangleAlert, UserSquare2 } from "lucide-react";
import AddTeacher from "../../components/modal/AddTeacher";

const ManageTeachers = () => {
  const dispatch = useDispatch();

  // Redux state
  const { users } = useSelector((state) => state.admin);
  const { isCreateTeacherModalOpen } = useSelector((state) => state.popup)
  // Local UI state
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    experties: "",
    maxStudents: 10,
  });

  // Fetch users on mount
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Teachers list
  const teachers = useMemo(() => {
    return (users || []).filter(
      (u) => u.role?.toLowerCase() === "teacher"
    );
  }, [users]);

  // Unique departments
  const departments = useMemo(() => {
    const uniqueDepartments = new Set(
      teachers.map((t) => t.department).filter(Boolean)
    );
    return Array.from(uniqueDepartments);
  }, [teachers]);

  // Filtered teachers (search + department)
  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesSearch =
        (teacher.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (teacher.email || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterDepartment === "all" ||
        teacher.department === filterDepartment;

      return matchesSearch && matchesFilter;
    });
  }, [teachers, searchTerm, filterDepartment]);

  // Close modal and reset form
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTeacher(null);
    setFormData({
      name: "",
      email: "",
      department: "",
      experties: "",
      maxStudents: 10,
    });
  };

  // Submit create / update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingTeacher) {
      dispatch(
        updateTeacher({
          id: editingTeacher._id,
          data: formData,
        })
      );
    } else {
      dispatch(createTeacher(formData));
    }

    handleCloseModal();
  };

  // Edit teacher
  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name || "",
      email: teacher.email || "",
      department: teacher.department || "",
      experties: Array.isArray(teacher.experties)
        ? teacher.experties[0]
        : teacher.experties || "",
      maxStudents:
        typeof teacher.maxStudents === "number"
          ? teacher.maxStudents
          : 10,
    });
    setShowModal(true);
  };

  // Delete flow
  const handleDelete = (teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      dispatch(deleteTeacher(teacherToDelete._id));
      setTeacherToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setTeacherToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="space-y-8 p-4 md:p-0">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Manage Teachers
            </h1>
            <p className="text-base text-gray-500 mt-1">
             View, organize, and manage teacher profiles and responsibilities.
            </p>
          </div>

          <button
            onClick={() => dispatch(toggleTeacherModel())}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                   text-white font-medium px-6 py-3 rounded-xl
                   transition-all duration-200 shadow-sm hover:shadow-blue-200 hover:shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Teacher</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: "Total Teachers",
              value: teachers.length,
              icon: <UserSquare2 className="w-6 h-6 text-blue-600" />,
              bg: "bg-blue-50"
            },
            {
              label: "Assigned Students",
              value: teachers.reduce((sum, t) => sum + (t.assignedStudents?.length || 0), 0),
              icon: <BadgeCheck className="w-6 h-6 text-emerald-600" />,
              bg: "bg-emerald-50"
            },
            {
              label: "Departments",
              value: departments.length,
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

        {/* teacher table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Teachers List</h2>
          </div>

          <div className="overflow-x-auto ">
            {
              filteredTeachers && filteredTeachers.length > 0
                ? (
                  <table className="w-full">
                    <thead className="bg-slate-100 ">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Teacher Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Experties
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-slate-200 ">
                      {
                        filteredTeachers.map(teacher => {
                          return (
                            <tr
                              className="hover:bg-slate-50"
                              key={teacher._id}>
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm font-medium text-slate-900">
                                    {teacher.name}
                                  </div>
                                  <div className="text-sm text-slate-500">
                                    {teacher.email}
                                  </div>

                                </div>
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-900">
                                  {teacher.department || "--"}
                                </div>
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap">

                                {
                                  Array.isArray(teacher.experties)
                                    ? teacher.experties.join(", ")
                                    : teacher.experties
                                }

                              </td>

                              <td className="px-6 py-4">
                                <div className="text-sm text-slate-900 ">
                                  {teacher.createdAt ? new Date(teacher.createdAt).toLocaleString() : "--"}
                                </div>
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900 px-3 py-1 rounded-md transition-colors duration-200"
                                    onClick={() => handleEdit(teacher)}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    className="bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900 px-3 py-1 rounded-md transition-colors duration-200"
                                    onClick={() => handleDelete(teacher)}
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
                )
                : <div className="text-center py-8 text-slate-500">
                  No Teacher found matching your criteria.
                </div>
            }

          </div>

          {/* Edit teacher model */}
          {
            showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white p-6 shadow-xl">

                  {/* Title */}
                  <h3 className="text-center text-lg font-semibold text-slate-800">
                    Edit Teacher
                  </h3>

                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Teacher Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter student name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Department
                      </label>
                      <select
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil">Civil</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Cyber Security">Cyber Security</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Economics">Economics</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Max Students
                      </label>
                      <input
                        type="number"
                        required
                        max={10}
                        value={formData.maxStudents}
                        onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Experties
                      </label>
                      <select
                        required
                        value={formData.experties}
                        onChange={(e) => setFormData({ ...formData, experties: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Area of Experties</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Cloud Computing">Cloud Computing</option>
                        <option value="Software Development">Software Development</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Database System">Database System</option>
                        <option value="Computer Network">Computer Network</option>
                        <option value="Software System">Software System</option>
                        <option value="Human-Computer Interaction">
                          Human-Computer Interaction
                        </option>
                        <option value="Big Data Analysis">Big Data Analysis</option>
                        <option value="Blockchain Technology">Blockchain Technology</option>
                        <option value="Internet of Things">Internet of Things</option>
                      </select>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="flex-1 rounded-xl border border-slate-300 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="flex-1 rounded-xl bg-blue-600 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>

                  </form>

                </div>
              </div>
            )
          }

          {
            showDeleteModal && teacherToDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-white p-6 shadow-xl">

                  {/* Icon */}
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <span className="text-red-600 text-xl">!</span>
                  </div>

                  {/* Text */}
                  <h3 className="text-center text-lg font-semibold text-slate-800">
                    Delete Teacher?
                  </h3>

                  <p className="mt-2 text-center text-sm text-slate-600">
                    Are you sure you want to delete
                    <span className="font-medium text-slate-800">
                      {" "}{teacherToDelete.name}
                    </span>
                    ?
                    <br />
                    This action cannot be undone.
                  </p>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={cancelDelete}
                      className="flex-1 rounded-lg border border-slate-300 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={confirmDelete}
                      className="flex-1 rounded-lg bg-red-600 py-2 text-sm text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            )
          }

          {
            isCreateTeacherModalOpen && <AddTeacher />
          }
        </div>
      </div>
    </>
  );
};

export default ManageTeachers;