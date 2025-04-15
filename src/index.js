// const API_KEY = process.env.REACT_APP_API_KEY;
// console.log("API Key:", API_KEY);

import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [resultVisible, setResultVisible] = useState(false);
  const [resumeScore, setResumeScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(API_KEY);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFile(reader.result); // Store file content as text
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!uploadedFile) {
      alert("Please upload a resume before submitting.");
      return;
    }

    try {
      console.log("API Key:", API_KEY); // Debugging API Key

      if (!API_KEY) {
        throw new Error("API Key is undefined. Check environment variables.");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Analyze the following resume and provide suggestions for improvement:\n\n${uploadedFile}`;

      const response = await model.generateContent({ contents: [{ text: prompt }] });

      if (!response || !response.candidates || response.candidates.length === 0) {
        throw new Error("Invalid response from Gemini API");
      }

      const data = response.candidates[0].content.parts[0].text; // Extract response text
      console.log("API Response:", data); // Debugging API Output

      setResumeScore(Math.floor(Math.random() * 100)); // Placeholder score
      setSuggestions(data.split("\n").filter((s) => s.trim() !== "")); // Extract suggestions
      setResultVisible(true);
    } catch (error) {
      console.error("Error while analyzing the resume:", error);
      alert("Failed to process your resume. Ensure API Key is set up correctly and try again.");
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
                accept=".txt"
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
