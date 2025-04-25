import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomSelect from "../components/CustomSelect";

const AnalysePage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jobCategories, setJobCategories] = useState([]);
  const [selectedJobCategory, setSelectedJobCategory] = useState("");
  const [resultVisible, setResultVisible] = useState(false);
  const [resumeScore, setResumeScore] = useState(null);
  const [suggestions, setSuggestions] = useState("");
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
    if (!uploadedFile || !selectedJobCategory) {
      alert("Upload resume and select job category.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", uploadedFile);
    formData.append("jobtitle", selectedJobCategory);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/upload_resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setResumeScore(Math.round(data.score * 100));
      setSuggestions(data.suggestions || "");
      setResultVisible(true);
    } catch (error) {
      alert("Error uploading resume: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatSuggestions = (suggestionString) => {
    if (!suggestionString) {
      return <p className="text-center text-gray-700">No suggestions available for this resume.</p>;
    }
  
    const formattedElements = [];
    const suggestionsArray = suggestionString.split('\n');
  
    suggestionsArray.forEach((suggestion, index) => {
      const trimmed = suggestion.trim();
  
      // Handle headings wrapped in double asterisks: **Heading**
      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        formattedElements.push(
          <h1 key={`point-${index}`} className="text-lg font-semibold text-blue-900">
            {trimmed.replace(/\*/g, "")}
          </h1>
        );
      } 
      // Handle custom heading and point with *###*Heading* Point
      else if (trimmed.includes("*###*")) {
        const headingStart = trimmed.indexOf("*###*") + 5;
        const headingEnd = trimmed.indexOf("*", headingStart);
        const headingText = trimmed.substring(headingStart, headingEnd).replace(/\*/g, "").trim();
        const pointText = trimmed.substring(headingEnd + 1).trim();
        formattedElements.push(
          <div key={`suggestion-${index}`} className="mb-2">
            <h4 className="text-lg font-semibold text-gray-900">{headingText}</h4>
            {pointText && <span className="text-gray-700 text-md">{pointText}</span>}
          </div>
        );
      } 
      // Handle bullet points: *Point
      else if (trimmed.startsWith("*")) {
        formattedElements.push(
          <li key={`point-${index}`} className="list-disc ml-6 text-gray-700">
            {trimmed.replace(/^\*/, "").trim()}
          </li>
        );
      } 
      // Fallback paragraph
      else if (trimmed !== "") {
        formattedElements.push(
          <p key={`point-${index}`} className="ml-6 text-gray-700">
            {trimmed}
          </p>
        );
      }
    });
  
    return formattedElements;
  };
  

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Header />

      {!resultVisible && (
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl mx-auto">
          <h2 className="text-xl font-semibold text-center mb-4">Upload Resume</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <CustomSelect
              options={jobCategories}
              selectedValue={selectedJobCategory}
              onSelect={setSelectedJobCategory}
              placeholder="Select Job Category"
            />

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
        <div className="text-center mt-6 animate-pulse text-blue-600 font-semibold">
          Processing your resume...
        </div>
      )}

      {resultVisible && (
        <div className="card-container mt-8">
          <div className="floating-card bg-white shadow-lg rounded-xl p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Resume Score</h2>
            <p className="text-3xl font-semibold text-green-600">{resumeScore}</p>
          </div>

          <div className="floating-card bg-white shadow-md rounded-xl p-4 max-w-md mx-auto mt-4">
            <h3 className="text-xl font-bold text-blue-600 capitalize mb-2">Suggestions</h3>
            {formatSuggestions(suggestions)}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AnalysePage;
