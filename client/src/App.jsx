import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/forgot-password' element={<ForgotPasswordPage/>} />
        <Route path='/reset' element={<ResetPasswordPage/>} />

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