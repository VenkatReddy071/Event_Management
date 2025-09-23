import React, { useState } from 'react';
import { useNotification } from "../../context/NotificationContext";
import Axios from "axios"
import { Link } from "react-router-dom";

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M21.5,12.2c0-0.7-0.1-1.3-0.2-1.9H12v3.8h5.3c-0.2,1.3-1,2.5-2.2,3.3v2.6h3.4C20.6,18.4,21.5,15.5,21.5,12.2z" />
    <path fill="#34A853" d="M12,22c2.7,0,5-0.9,6.7-2.4l-3.4-2.6c-1,0.7-2.3,1.1-3.3,1.1c-2.6,0-4.8-1.7-5.6-4h-3.5v2.7C4.1,20.2,7.7,22,12,22z" />
    <path fill="#FBBC05" d="M6.4,14.6c-0.2-0.7-0.3-1.4-0.3-2.2c0-0.8,0.1-1.5,0.3-2.2V7.5H2.9C2.2,9.2,1.8,11,1.8,12.8c0,1.8,0.4,3.6,1.1,5.2l3.5-2.7C6.4,15.1,6.4,14.6,6.4,14.6z" />
    <path fill="#EA4335" d="M12,5.2c1.4,0,2.6,0.5,3.6,1.4l3-3c-1.8-1.7-4.1-2.7-6.6-2.7C7.7,0.9,4.1,2.7,1.8,5.8L5.3,8.5C6.1,6.2,8.4,5.2,12,5.2z" />
  </svg>
);

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  
  const url = `${import.meta.env.VITE_SERVER_URL}/api`;

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Axios.post(
        `${url}/signup`,
        { username: name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 201) {
        showNotification(response.data.msg, "success");
        localStorage.setItem("userToken", response.data.token);
      } else if (response.data?.msg) {
        showNotification(response.data.msg, "error");
      }
    } catch (err) {
      showNotification(
        err.response?.data?.msg || "Signup failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
    
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
      <p className="text-center text-gray-500 mb-8">Join us and start your journey</p>
      <form onSubmit={handleSignup} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email-signup">Email Address</label>
          <input
            type="email"
            id="email-signup"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john.doe@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password-signup">Password</label>
          <input
            type="password"
            id="password-signup"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full text-white font-bold p-3 rounded-xl shadow-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm">or continue with</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <button
        onClick={handleGoogleSignup}
        className="w-full bg-white text-gray-700 font-semibold p-3 rounded-xl border border-gray-300 hover:bg-gray-50 shadow-sm flex items-center justify-center"
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>

      <div className="text-center mt-6 text-sm">
        <p className="text-gray-600">
          Already have an account? 
          <Link to="/login">
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
