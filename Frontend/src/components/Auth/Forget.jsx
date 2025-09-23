import React, { useState } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

const App = () => {
  const [currentPage, setCurrentPage] = useState("forgot");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailForOTP, setEmailForOTP] = useState(""); // store email for OTP verification

  const url = `${import.meta.env.VITE_SERVER_URL}/api`;

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");

    const handleResetRequest = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await Axios.post(`${url}/forgot-password`, { email }, { headers: { "Content-Type": "application/json" } });
        showMessage("success", response.data.msg);
        setEmailForOTP(email); 
        setCurrentPage("otpVerify");
      } catch (err) {
        showMessage("error", err.response?.data?.msg || "Something went wrong");
      }
      setLoading(false);
    };

    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Forgot Password</h2>
        <p className="text-center text-gray-500 mb-8">Enter your email to receive a verification code</p>
        <form onSubmit={handleResetRequest} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email-forgot">Email Address</label>
            <input
              type="email"
              id="email-forgot"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john.doe@example.com"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full text-white font-bold p-3 rounded-xl shadow-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Code"}
          </button>
        </form>
        <div className="text-center mt-6 text-sm">
          <p className="text-gray-600">
            Remember your password? 
            <Link to="/login">
              <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Login</span>
            </Link>
          </p>
        </div>
      </div>
    );
  };

  const OTPVerificationPage = () => {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleVerify = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await Axios.post(`${url}/reset-password`, { email: emailForOTP, otp, newPassword }, { headers: { "Content-Type": "application/json" } });
        showMessage("success", response.data.msg);
        setCurrentPage("forgot");
      } catch (err) {
        showMessage("error", err.response?.data?.msg || "OTP verification failed");
      }
      setLoading(false);
    };

    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Verify Code</h2>
        <p className="text-center text-gray-500 mb-8">Enter the code sent to your email and your new password.</p>
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="otp">Verification Code</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter 6-digit code"
              maxLength="6"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full text-white font-bold p-3 rounded-xl shadow-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Reset Password"}
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm">
        {message && (
          <div className={`p-4 mb-4 rounded-xl text-center font-bold ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            {message.text}
          </div>
        )}
        {currentPage === "forgot" ? <ForgotPasswordPage /> : <OTPVerificationPage />}
      </div>
    </div>
  );
};

export default App;
