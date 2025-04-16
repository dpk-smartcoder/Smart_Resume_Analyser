// const API_KEY = process.env.REACT_APP_API_KEY;
// console.log("API Key:", API_KEY);

import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { GoogleGenerativeAI } from "@google/generative-ai";



function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [resultVisible, setResultVisible] = useState(false);
  const [resumeScore, setResumeScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Initialize Gemini API (you might still need this for the backend response)
  const genAI = new GoogleGenerativeAI(API_KEY);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file); // Store the File object directly
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!uploadedFile) {
      alert("Please upload a resume before submitting.");
      return;
    }

    const jobTitle = "Frontend Developer"; // Replace with how you get the job title from your UI

    try {
      console.log("API Key:", API_KEY); // Debugging API Key

      if (!API_KEY) {
        throw new Error("API Key is undefined. Check environment variables.");
      }

      const formData = new FormData();
      formData.append('resume', uploadedFile);
      formData.append('jobtitle', jobTitle); // Send the job title

      const response = await fetch('http://localhost:5000/upload-resume', { // Update the backend URL if needed
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Backend Error: ${response.status} - `;
        try {
          const errorData = await response.json();
          errorMessage += (errorData.error || 'Something went wrong');
        } catch (jsonError) {
          // If the response is not JSON, read it as text
          const errorText = await response.text();
          errorMessage += (errorText || 'Something went wrong');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      console.log("Backend Response:", data);

      setResumeScore(data.score * 100); // Assuming the score is between 0 and 1
      setSuggestions(data.suggestions); // Backend is now responsible for analysis, so suggestions might come from there later
      setResultVisible(true);

    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-200 min-h-screen flex flex-col items-center justify-center p-4">
      <header className="w-full text-center mb-6">
        <h1 className="text-4xl font-bold text-white">Smart Resume Analyser</h1>
        <p className="text-lg text-white mt-2">
          Upload your resume and see the magic unfold!
        </p>
      </header>

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        {!resultVisible && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Upload Your Resume
            </h2>
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
              <input
                type="file"
                accept=".pdf,.txt" // Accept both PDF and TXT
                className="mb-4 text-gray-600 bg-gray-100 rounded-lg p-2 w-full"
                onChange={handleFileUpload}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Upload
              </button>
            </form>
          </>
        )}

        {resultVisible && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Resume Analysis Results
            </h2>
            <p className="text-gray-600 mb-4">
              Your resume score is:{" "}
              <span className="text-blue-500 font-bold">{resumeScore}</span>
            </p>
            <h3 className="text-xl font-bold mb-2">Suggestions:</h3>
            {suggestions.length > 0 ? (
              <ul className="text-gray-600">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>- {suggestion}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No suggestions available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);