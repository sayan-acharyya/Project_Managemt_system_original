import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { forgotPassword } from "../../store/slices/authSlice";
import { Loader, MailCheck } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const { isRequestingForToken } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");

    try {
      //await dispatch(forgotPassword({ email })).unwrap();
      setIsSubmitted(true);
    } catch (err) {
      setError(err || "Failed to send reset link. Please try again.");
    }
  };

  /* ✅ Success state */
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
            <MailCheck className="w-7 h-7 text-green-600" />
          </div>

          <h2 className="text-xl font-semibold text-slate-800">
            Check your email
          </h2>
          <p className="text-slate-600 mt-2 text-sm">
            We’ve sent a password reset link to <br />
            <span className="font-medium">{email}</span>
          </p>
        </div>
      </div>
    );
  }

  /* ✅ Form state */
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-slate-800 text-center">
          Forgot Password
        </h1>
        <p className="text-slate-600 text-sm text-center mt-2">
          Enter your email and we’ll send you a reset link
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isRequestingForToken}
              className={`w-full rounded-lg border px-3 py-2 text-slate-700
                focus:outline-none focus:ring-2 transition
                ${error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isRequestingForToken}
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
            {isRequestingForToken ? (
              <>
                <Loader className="animate-spin h-5 w-5 text-white" />
                <span>Sending link...</span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 ">
            Remember your password ? <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
