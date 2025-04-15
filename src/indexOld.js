import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";


// project 1----------------

function App() {
  const [uploadedFile, setUploadedFile] = useState(null); // State for the uploaded file
  const [resultVisible, setResultVisible] = useState(false); // State for result visibility
  const [dummyScore, setDummyScore] = useState(null); // State for the dummy score
  const [suggestions, setSuggestions] = useState(null); // State for suggestions

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (uploadedFile) {
      // Simulate dummy score
      setDummyScore(85); // Example: 85 out of 100

      // Simulate suggestions from the API
      const fakeSuggestions = [
        "Add more keywords related to your desired job role.",
        "Expand on your accomplishments in past experiences.",
        "Focus more on soft skills such as leadership or teamwork."
      ];
      setSuggestions(fakeSuggestions);

      setResultVisible(true); // Show results
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-200 min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header Section */}
      <header className="w-full text-center mb-6">
        <h1 className="text-4xl font-bold text-white">Smart Resume Analyser</h1>
        <p className="text-lg text-white mt-2">
          Upload your resume and see the magic unfold!
        </p>
      </header>

      {/* Upload Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        {!resultVisible && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Upload Your Resume
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Let us help you analyze your resume to unlock better opportunities.
            </p>
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
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
              <span className="text-blue-500 font-bold">{dummyScore}</span>
            </p>
            <h3 className="text-xl font-bold mb-2">Suggestions:</h3>
            <ul className="text-gray-600">
              {suggestions.map((suggestion, index) => (
                <li key={index}>- {suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <footer className="absolute bottom-0 w-full text-center text-white font-bold bg-blue-500 py-2">
        <p>&copy; 2025 Smart Resume Analyser</p>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// project 2----------------

// import React, { useState } from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";

// function App() {
//   const [uploadedFile, setUploadedFile] = useState(null); // State for the uploaded file
//   const [resultVisible, setResultVisible] = useState(false); // State for result visibility
//   const [resumeScore, setResumeScore] = useState(null); // State for the resume score
//   const [suggestions, setSuggestions] = useState(null); // State for suggestions

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setUploadedFile(file);
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (uploadedFile) {
//       const formData = new FormData();
//       formData.append("resume", uploadedFile);

//       try {
//         // Send request to Google Gemini API (Replace with actual API URL)
//         const response = await fetch("https://api.google-gemini.example.com/analyze", {
//           method: "POST",
//           body: formData,
//         });

//         if (response.ok) {
//           const data = await response.json();

//           // Update state with API response
//           setResumeScore(data.score); // Example API response includes 'score'
//           setSuggestions(data.suggestions); // Example API response includes 'suggestions'
//           setResultVisible(true);
//         } else {
//           console.error("Failed to fetch suggestions from API");
//         }
//       } catch (error) {
//         console.error("Error while calling the API:", error);
//       }
//     }
//   };

//   return (
//     <div className="bg-gradient-to-b from-blue-500 to-blue-200 min-h-screen flex flex-col items-center justify-center p-4">
//       {/* Header Section */}
//       <header className="w-full text-center mb-6">
//         <h1 className="text-4xl font-bold text-white">Smart Resume Analyser</h1>
//         <p className="text-lg text-white mt-2">
//           Upload your resume and see the magic unfold!
//         </p>
//       </header>

//       {/* Upload Section */}
//       <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
//         {!resultVisible && (
//           <>
//             <h2 className="text-2xl font-semibold mb-4 text-center">
//               Upload Your Resume
//             </h2>
//             <p className="text-gray-600 text-center mb-4">
//               Let us help you analyze your resume to unlock better opportunities.
//             </p>
//             <form className="flex flex-col items-center" onSubmit={handleSubmit}>
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 className="mb-4 text-gray-600 bg-gray-100 rounded-lg p-2 w-full"
//                 onChange={handleFileUpload}
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
//               >
//                 Upload
//               </button>
//             </form>
//           </>
//         )}

//         {resultVisible && (
//           <div className="text-center">
//             <h2 className="text-2xl font-semibold mb-4">
//               Resume Analysis Results
//             </h2>
//             <p className="text-gray-600 mb-4">
//               Your resume score is:{" "}
//               <span className="text-blue-500 font-bold">{resumeScore}</span>
//             </p>
//             <h3 className="text-xl font-bold mb-2">Suggestions:</h3>
//             <ul className="text-gray-600">
//               {suggestions.map((suggestion, index) => (
//                 <li key={index}>- {suggestion}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* Footer Section */}
//       <footer className="absolute bottom-0 w-full text-center text-white font-bold bg-blue-500 py-2">
//         <p>&copy; 2025 Smart Resume Analyser</p>
//       </footer>
//     </div>
//   );
// }

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

