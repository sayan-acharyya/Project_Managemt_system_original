import React, { useState } from 'react'
import { createSudent } from '../../store/slices/adminSlice';
import { useDispatch } from 'react-redux';
import { toggleStudentModel } from '../../store/slices/popupSlice';

const AddStudent = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    password: ""
  });

  const handleCreateStudent = (e) => {
    e.preventDefault();
    dispatch(createSudent(formData));
    setFormData({
      name: "",
      email: "",
      department: "",
      password: ""
    })
    dispatch(toggleStudentModel())
  }


  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

        <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white p-6 shadow-xl">

          {/* Title */}
          <h3 className="text-center text-lg font-semibold text-slate-800">
            Add Student
          </h3>

          <form
            onSubmit={handleCreateStudent}
            className="mt-5 space-y-4">

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Student Name
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
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Password"
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

            {/* Actions */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => dispatch(toggleStudentModel())}
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
    </>
  )
}

export default AddStudent