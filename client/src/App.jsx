import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from './store/slices/authSlice'
import { Loader } from 'lucide-react'

const App = () => {

  const { authUser, isCheckingAuth } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex justify-center items-center h-screen'>
         <Loader className='size-10 animate-spin'/>
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