import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTeacher } from "../../store/slices/adminSlice";
import { toggleTeacherModel } from "../../store/slices/popupSlice";

const AddTeacher = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    experties: "",
    maxStudents: 1,
  });

  const handleCreateTeacher = (e) => {
    e.preventDefault();

    dispatch(
      createTeacher({
        ...formData,
        maxStudents: Number(formData.maxStudents),
      })
    );

    setFormData({
      name: "",
      email: "",
      password: "",
      department: "",
      experties: "",
      maxStudents: 1,
    });

    dispatch(toggleTeacherModel());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white p-6 shadow-xl">
        {/* Title */}
        <h3 className="text-center text-lg font-semibold text-slate-800">
          Add Teacher
        </h3>

        <form onSubmit={handleCreateTeacher} className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Teacher Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter teacher name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Department
            </label>
            <select
              required
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
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

          {/* Experties */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Experties
            </label>
            <select
              required
              value={formData.experties}
              onChange={(e) =>
                setFormData({ ...formData, experties: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
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

          {/* Max Students */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Max Students
            </label>
            <input
              type="number"
              min={1}
              max={10}
              required
              value={formData.maxStudents}
              onChange={(e) =>
                setFormData({ ...formData, maxStudents: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => dispatch(toggleTeacherModel())}
              className="flex-1 rounded-xl border border-slate-300 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-xl bg-blue-600 py-2 text-sm text-white hover:bg-blue-700"
            >
              Add Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacher;