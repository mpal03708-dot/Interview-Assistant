import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_PATHS } from "../utils/apiPaths";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleForm = (e) => {
    let { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async (e) => {  // ← yahan (e) add kar
  e.preventDefault();  // ← YE LINE ADD KAR BHAI
  try {
    const res = await axios.post(API_PATHS.AUTH.LOGIN, form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid email and password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-2">Welcome Back 👋</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Login to continue your interview preparation
        </p>

        {/* Email */}
        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          onChange={handleForm}
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Enter your password"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          onChange={handleForm}
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-200"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          <p className="px-3 text-gray-400 text-sm">OR</p>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-500 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;