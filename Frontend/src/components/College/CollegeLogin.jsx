import { useState } from "react";
import Axios from "axios";
import {useNotification} from "../../context/NotificationContext"
import {useNavigate} from "react-router-dom"
export default function LoginPage() {
  const [form, setForm] = useState({ contactEmail: "", password: "" });
    const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { showNotification } = useNotification();
    const navigate = useNavigate();
    const url = `${import.meta.env.VITE_SERVER_URL}/api`;
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await Axios.post(
          `${url}/colleges/login`,
          { form},
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.status === 200) {
            console.log(response.data);
          showNotification(response.data.message, "success");
          await localStorage.setItem("userToken", response.data.token);
            navigate("/organizer-dashboard");
        } else if (response.data?.msg) {
          showNotification(response.data.msg, "error");
        }
      } catch (err) {
        showNotification(
          err.response?.data?.msg || "Login failed. Please try again.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">Login</h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Please enter your <span className="font-semibold">registered college email</span> and <span className="font-semibold">password</span> to continue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600">College Email</label>
            <input
              type="email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="yourname@college.edu"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Enter your password"
              required
            />
          </div>
         <button
          type="submit"
          className={`w-full text-white font-bold p-3 rounded-xl shadow-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/college-register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}