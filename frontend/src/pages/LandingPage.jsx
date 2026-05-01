import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-4">
      <h1>
        Ace Interview with
        <span>AI-Powered </span>
        Learning
      </h1>

      <button 
      className="bg-black text-white px-6 py-3 hover:scale-105"
      onClick={() => navigate("/login")}>Get Started</button>
    </div>
  );
};

export default LandingPage;