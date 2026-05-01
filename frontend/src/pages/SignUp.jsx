import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_PATHS } from "../utils/apiPaths";
import axios from "../utils/axiosInstance";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post(API_PATHS.AUTH.SIGNUP, form);
      navigate("/login");
    } catch (error) {
      console.log(error.response);
      alert("Signup failed");
    }
  };

  return   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Create Account 🚀
        </h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Start your AI-powered interview preparation
        </p>

        {/* Name */}
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Create a password"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* Button */}
        <button
          onClick={handleSignup}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-200"
        >
          Sign Up
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          <p className="px-3 text-gray-400 text-sm">OR</p>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-500 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>;
};

export default SignUp;