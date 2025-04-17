import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./index.css";

// Typewriter component 
const Typewriter = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0); // Track current index for typing animation

  useEffect(() => {
    let interval;

    // Start typing
    if (index < text.length) {
      interval = setInterval(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prevIndex) => prevIndex + 1);
      }, speed);
    }

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [index, text, speed]);

  return (
    <h1 className="text-4xl sm:text-6xl font-bold text-white text-center drop-shadow-lg">
      {displayedText}
    </h1>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-500 to-cyan-400 min-h-screen flex flex-col justify-between items-center p-6">
      <div className="absolute top-6 right-6">
        <img src="/logo.png" alt="Logo" className="h-12" />
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

      <footer className="text-white text-sm mt-6">&copy; 2025 Smart Resume Analyser. All rights reserved.</footer>
    </div>
  );
};

const AnalysePage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jobCategories, setJobCategories] = useState([]);
  const [selectedJobCategory, setSelectedJobCategory] = useState("");
  const [resultVisible, setResultVisible] = useState(false);
  const [resumeScore, setResumeScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-job-categories");
        const data = await response.json();
        setJobCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching job categories:", error);
      }
    };
    fetchJobCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!uploadedFile || !selectedJobCategory) return alert("Upload resume and select job category.");

    const formData = new FormData();
    formData.append("resume", uploadedFile);
    formData.append("jobtitle", selectedJobCategory);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setResumeScore(data.score * 100);
      setSuggestions(data.suggestions || []);
      setResultVisible(true);
    } catch (error) {
      alert("Error uploading resume: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Smart Resume Analyser</h1>
        <img src="/logo.png" alt="Logo" className="h-10" />
      </header>

      {!resultVisible && (
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl mx-auto">
          <h2 className="text-xl font-semibold text-center mb-4">Upload Resume</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <select
              value={selectedJobCategory}
              onChange={(e) => setSelectedJobCategory(e.target.value)}
              className="p-3 rounded-lg border border-gray-300"
            >
              <option value="">Select Job Category</option>
              {jobCategories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setUploadedFile(e.target.files[0])}
              className="p-3 rounded-lg border border-gray-300"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Analyzing..." : "Upload"}
            </button>
          </form>
        </div>
      )}

      {loading && (
        <div className="text-center mt-6 animate-pulse text-blue-600 font-semibold">Processing your resume...</div>
      )}

      {resultVisible && (
        <div className="card-container mt-8">
          <div className="floating-card bg-white shadow-lg rounded-xl p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Resume Score</h2>
            <p className="text-3xl font-semibold text-green-600">{resumeScore}</p>
          </div>

          {suggestions.length > 0 ? (
            suggestions.map((suggestion, idx) => (
              <div key={idx} className="floating-card bg-white shadow-md rounded-xl p-4 max-w-md mx-auto mt-4">
                <h3 className="text-lg font-bold text-blue-600 capitalize mb-2">Suggestions</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {suggestion.split('\n').map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-700">No suggestions available for this resume.</p>
          )}
        </div>
      )}

      <footer className="text-center mt-12 text-gray-500 text-sm">&copy; 2025 Smart Resume Analyser. All rights reserved.</footer>
    </div>
  );
};


const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/analyse" element={<AnalysePage />} />
    </Routes>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
