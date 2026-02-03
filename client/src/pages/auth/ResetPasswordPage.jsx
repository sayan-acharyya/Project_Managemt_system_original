import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader, Lock } from "lucide-react";
import { resetPassword } from "../../store/slices/authSlice";
 
const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isUpdatingPassword } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(
        resetPassword({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })
      ).unwrap();

      navigate("/login");
    } catch (error) {
      setErrors({
        general: error || "Failed to reset password. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
            <Lock className="w-7 h-7 text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Reset Password
          </h1>
          <p className="text-slate-600 text-sm text-center mt-2">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isUpdatingPassword}
              placeholder="Enter new password"
              className={`w-full rounded-lg border px-3 py-2 text-slate-700
                focus:outline-none focus:ring-2 transition
                ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isUpdatingPassword}
              placeholder="Confirm new password"
              className={`w-full rounded-lg border px-3 py-2 text-slate-700
                focus:outline-none focus:ring-2 transition
                ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.general && (
            <p className="text-sm text-red-600 text-center">
              {errors.general}
            </p>
          )}

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="
              w-full flex items-center justify-center gap-2
              bg-blue-600 hover:bg-blue-700
              text-white font-semibold
              py-2.5 rounded-lg
              transition duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            "
          >
            {isUpdatingPassword ? (
              <>
                <Loader className="animate-spin h-5 w-5 text-white" />
                <span>Updating...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Back to{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
