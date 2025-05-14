import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import laptopHalf from "../images/sra-showcase.png";       
import featureImage from "../images/featureImage.svg";     
import featureImage2 from "../images/featureImage2.png"; 

const LandingPage = () => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);

  const goAnalyse = () => navigate("/analyse");


  return (
    <div className="flex flex-col min-h-screen select-none bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white">

      {/* Header */}
      <div className="bg-blue-950">
        <Header
        showAbout={showAbout}
        onToggleAbout={() => setShowAbout((s) => !s)}
        onAnalyse={() => navigate("/analyse")}
      />
      </div>

      {/* Main */}
      <main className="flex-1 relative">

        {/* — Hero or About toggle — */}
        {!showAbout ? (
          <div className="container mx-auto mb-44 px-8 pt-24 relative flex items-start">
            {/* Left text */}
            <div className="w-1/2 pr-8 ml-16 mb-10">
              <p className="uppercase tracking-widest text-blue-200 mb-4">
                Score my resume – Free Resume Checker
              </p>
              <h1 className="text-5xl font-bold leading-tight mb-6">
                Get expert feedback on your resume, instantly
              </h1>
              <p className="text-blue-200 mb-8 max-w-lg">
                Our free AI-powered resume checker scores your resume on key
                criteria recruiters and hiring managers look for. Get actionable
                steps to revamp your resume and land more interviews.
              </p>
              <div className="flex space-x-4 mb-10">
                <button
                  onClick={goAnalyse}
                  className="bg-green-500 hover:bg-green-400 font-semibold py-3 px-6 rounded-lg"
                >
                  Upload Resume &raquo;
                </button>
                <button
                  onClick={goAnalyse}
                  className="bg-indigo-700 hover:bg-indigo-600 font-semibold py-3 px-6 rounded-lg"
                >
                  View your last review
                </button>
              </div>
              <p className="text-blue-300 text-sm mb-1">
                Instant, recruiter-inspired insights at your fingertips—no signup required.
              </p>
              <p className="text-blue-300 text-sm">
                Ready for your next career move? Get instant feedback now.
              </p>
            </div>

            {/* Half-visible laptop */}
            <div
              className="w-1/2 absolute right-0 bottom-10 overflow-hidden pointer-events-none"
              style={{ transform: "translateX(20%)" }}
            >
              <img
                src={laptopHalf}
                alt="Resume analysis on laptop"
                className="w-[180%] h-auto"
              />
            </div>

            {/* Learn More button */}
            <div className="absolute inset-x-0 bottom-0 flex justify-center -mb-20">
              <a
                href="#features"
                className="flex flex-col items-center text-sm uppercase tracking-wide hover:underline"
              >
                <span>Learn More</span>
                <svg
                  className="w-4 h-4 mt-1 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          /* — About Us Section — */
          <div className="container justify-center mt-36 mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Our Mission",
                text:
                  "Empower every job seeker with instant, data-driven feedback to craft a resume that stands out.",
              },
              {
                title: "What We Do",
                text:
                  "We use AI and recruiter-backed criteria to analyze your resume, highlight gaps, and give you clear next steps.",
              },
              {
                title: "Why Choose Us",
                text:
                  "Receive personalized, AI-driven recommendations that boost your resume’s impact, style, and clarity—tailored to your industry.",
              }
              ,
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2"
              >
                <h3 className="text-2xl font-semibold mb-4">{card.title}</h3>
                <p className="text-blue-200">{card.text}</p>
              </div>
            ))}
          </div>
        )}

                {/* — Curve + Features Section — */}
        {!showAbout && (
          <section id="features" className="relative bg-[#10244d] text-white pt-0">
            {/* SVG Wave Divider */}
            <div className="absolute inset-x-0 -top-7 overflow-hidden leading-none z-6">
              <svg
                viewBox="0 0 1440 320"
                className="block w-full h-24"
                preserveAspectRatio="none"
              >
                <path fill="#032153" fillRule="nonzero" d="M720 38.936531C571.07999 57.866238 321 119.5040168 0 41.09718v66.4480438h1440V40.491756c-320.2408-78.406837-571.07999-20.484932-720-1.555225z"></path>
              </svg>
            </div>

            {/* Content */}
            <div className="container mx-auto px-8 py-20 flex flex-col md:flex-row items-center gap-12">
              {/* Illustration */}
              <div className="md:w-1/2">
                <img src={featureImage} alt="AI-powered analysis" className="w-full h-auto" />
              </div>
              {/* Text */}
              <div className="md:w-1/2 space-y-6">
                <h2 className="text-3xl font-semibold">
                  The most advanced resume checker, powered by AI
                </h2>
                <p className="text-blue-200">
                  Score My Resume goes beyond basic spell checking and uses leading
                  Artificial Intelligence technology to grade your resume on 20+ resume
                  checks that recruiters and hiring managers pay attention to.
                  Specifically, the platform analyzes your resume’s impact by evaluating
                  the strength of your word choice, and also checks your resume’s style
                  and brevity.
                </p>
                <p className="text-blue-200">
                  Similarly, it also scores each of the bullet points on your resume and
                  checks for key elements such as inconsistencies, length, word choice,
                  filler words, keywords and buzzwords.
                </p>
                <button
                  onClick={goAnalyse}
                  className="bg-green-500 hover:bg-green-400 font-semibold py-3 px-6 rounded-lg"
                >
                  Get your resume checked instantly &raquo;
                </button>
              </div>
            </div>

            <div className="container mx-auto px-16 py-20 flex flex-col md:flex-row items-center gap-12">
              {/* Text */}
              <div className="md:w-1/2 space-y-6">
                <h2 className="text-3xl font-semibold">
                  Improve your resume's score
                </h2>
                <p className="text-blue-200">
                  We use Artificial Intelligence to analyze and benchmark your resume and generate a detailed assessment and score based on key evaluation criteria such as Impact, Skills, and Style. Our criteria are based on key checks recruiters look for.
                </p>
                <button
                  onClick={goAnalyse}
                  className="bg-green-500 hover:bg-green-400 font-semibold py-3 px-6 rounded-lg"
                >
                  Get your Score » &raquo;
                </button>
              </div>
              {/* Illustration */}
              <div className="md:w-1/2">
                <img src={featureImage2} alt="AI-powered analysis2" className="w-full h-auto" />
              </div>
            </div>

            
          </section>
        )}
      </main>

      {/* Footer */}
      <div className="bg-blue-950">
        <Footer/>
      </div>

    </div>
  );
};

export default LandingPage;
