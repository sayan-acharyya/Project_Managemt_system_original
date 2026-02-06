import React, {  useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from './store/slices/authSlice'
import { Loader } from 'lucide-react'
import DashboardLayout from './components/layout/DashboardLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageStudents from './pages/admin/ManageStudents'
import ManageTeachers from './pages/admin/ManageTeachers'
import AssignSupervisor from './pages/admin/AssignSupervisor'
import DeadlinesPage from './pages/admin/DeadlinesPage'
import ProjectsPage from './pages/admin/ProjectsPage'

const App = () => {

  const { authUser, isCheckingAuth } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const ProtectedRoute = ({ children, allowedRoles }) => {

    if (!authUser) {
     return  <Navigate to={"/login"} replace />
    }
    if (allowedRoles?.length && authUser?.role && !allowedRoles.includes(authUser.role)) {
      const redirectPath =
        authUser.role === "Admin"
          ? "/admin"
          : authUser.role === "Teacher"
            ? "/teacher"
            : "/student";


      return <Navigate to={redirectPath} replace />
    }
    return children;
  }

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />

        {/* admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <DashboardLayout userRole={"Admin"}/>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path='students' element={<ManageStudents />} />
          <Route path='teachers' element={<ManageTeachers />} />
          <Route path='assign-supervisor' element={<AssignSupervisor />} />
          <Route path='deadlines' element={<DeadlinesPage />} />
          <Route path='projects' element={<ProjectsPage />} />

        </Route>

      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </BrowserRouter>
  )
}

export default App