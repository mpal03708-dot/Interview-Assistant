import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(res.data.sessions || []);
    } catch (error) {
      console.log("Fetch sessions failed:", error.response);
    }
  };

  const createSession = async () => {
    if (!role || !experience) return alert("Please fill all fields");
    
    setLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        role,
        experience,
        topicsToFocus: "React, JavaScript, Node.js", // ← FIX 1
        description: "", // ← FIX 2
        questions: [],
      });
      
      console.log("Session created:", res.data);
      setRole("");
      setExperience("");
      await fetchSessions();
      
    } catch (error) {
      console.log("Create failed:", error.response);
      alert(error.response?.data?.message || "Session create failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Manage your interview preparation sessions
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">Create New Session</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            placeholder="Enter Role (Frontend Developer)"
            value={role}
            className="border border-gray-200 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
          />

          <input
            placeholder="Experience (2 yrs)"
            value={experience}
            className="border border-gray-200 p-3 rounded-lg w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setExperience(e.target.value)}
            disabled={loading}
          />

          <button
            onClick={createSession}
            disabled={loading}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "+ Create"}
          </button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg">No sessions yet 😕</p>
          <p className="text-sm">Create your first session to get started</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sessions.map((s) => (
            <div
              key={s._id}
              onClick={() => navigate(`/interview/${s._id}`)}
              className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md hover:scale-[1.02] transition cursor-pointer"
            >
              <h2 className="font-semibold text-lg mb-2">{s.role}</h2>
              <p className="text-gray-500 text-sm">{s.experience} experience</p>
              <p className="text-xs text-gray-400 mt-1">{s.topicsToFocus}</p>
              <div className="mt-4 text-xs text-gray-400">Click to start →</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;