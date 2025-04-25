import React from "react";
import { useNavigate } from "react-router-dom";
import Typewriter from "../components/Typewriter";
import Footer from "../components/Footer";
import logoLanding from "../images/logoLanding.png";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-500 to-cyan-400 min-h-screen flex flex-col justify-between items-center p-6">
      <div className="absolute top-6 right-6">
        <img src={logoLanding} alt="Logo" className="h-20 w-20 rounded-full" />
      </div>

      <div className="flex-grow flex flex-col justify-center items-center">
        <Typewriter text="Smart Resume Analyser" />
        <p className="text-white text-lg mt-4 text-center max-w-lg">
          Upload your resume and let our smart engine evaluate and enhance it for your dream job.
        </p>
        <button
          onClick={() => navigate("/analyse")}
          className="mt-8 bg-white text-blue-600 font-semibold py-3 px-6 rounded-xl shadow-md hover:scale-105 transition transform duration-300"
        >
          Start Resume Analysis
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
