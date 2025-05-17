// import React, { useEffect, useState } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import CustomSelect from "../components/CustomSelect";

// const AnalysePage = () => {
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [jobCategories, setJobCategories] = useState([]);
//   const [selectedJobCategory, setSelectedJobCategory] = useState("");
//   const [resultVisible, setResultVisible] = useState(false);
//   const [resumeScore, setResumeScore] = useState(null);
//   const [suggestions, setSuggestions] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchJobCategories = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/get-job-categories");
//         const data = await response.json();
//         setJobCategories(data.categories || []);
//       } catch (error) {
//         console.error("Error fetching job categories:", error);
//       }
//     };
//     fetchJobCategories();
//   }, []);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!uploadedFile || !selectedJobCategory) {
//       alert("Upload resume and select job category.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("resume", uploadedFile);
//     formData.append("jobtitle", selectedJobCategory);

//     try {
//       setLoading(true);
//       const response = await fetch("http://localhost:5000/upload_resume", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       if (data.error) {
//         alert(data.error);
//         return;
//       }

//       setResumeScore(Math.round(data.score * 100));
//       setSuggestions(data.suggestions || "");
//       setResultVisible(true);
//     } catch (error) {
//       alert("Error uploading resume: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatSuggestions = (suggestionString) => {
//     if (!suggestionString) return <p className="text-center text-gray-700">No suggestions available for this resume.</p>;
//     const formattedElements = [];
//     const suggestionsArray = suggestionString.split('\n');
//     suggestionsArray.forEach((suggestion, index) => {
//       var i=0;
//       for(i=0;i<suggestion.length;i++)if(suggestion[i]==='*')break;
//       if(suggestion[0]==='*'&&suggestion[1]==='*')formattedElements.push(<h1 key={`point-${index}`} className="text-lg font-semibold text-blue-900">{suggestion.substring(2,suggestion.length-2).trim()}</h1 >);
//       else if (suggestion[i+4]==='*') {
//         var j=i+4;for(j=i+6;j<suggestion.length;j++)if(suggestion[j]==='*')break
//         const headingText = suggestion.substring(i+6, j-1).trim();
//         const pointText = suggestion.substring(j+2).trim();
//         formattedElements.push(
//           <div key={`suggestion-${index}`} className="mb-2">
//             <h4 className="text-lg font-semibold text-gray-900">{headingText}</h4>
//             {pointText && <span className="text-gray-700 text-md">{pointText}</span>}
//           </div>
//         );
//       }
//       else if(suggestion[0]==='*'){
//         formattedElements.push(<li key={`point-${index}`} className="list-disc ml-6 text-gray-700">{suggestion.substring(1).trim()}</li >);
//       }
//        else if (suggestion.trim() !== "") {
//         formattedElements.push(<p key={`point-${index}`} className="list-disc ml-6 text-gray-700">{suggestion.substring(0).trim()}</p >);
//       }
//     });
//     return formattedElements;
//   };

//   return (
//     <div className="bg-[#0D0B37] mb-12 text-white min-h-screen flex flex-col">
//       <Header showAboutButton={false} />


//       {!resultVisible && (
//         <div className="flex flex-col items-center justify-center py-12 px-4">
//           <h2 className="text-2xl font-semibold mb-6">Upload Your Resume</h2>
          

//           <form onSubmit={handleSubmit} className="bg-[#1E1B4B] p-8 rounded-xl w-full max-w-xl text-center">
//             <label
//               htmlFor="resume-upload"
//               className="border-2 border-dashed border-gray-400 rounded-lg py-12 px-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition"
//             >
//               <div className="text-5xl text-gray-400">⬆️</div>
//               <p className="mt-2">
//                 Click the button above or drop your resume in here.<br />
//                 English resumes in <span className="font-bold">PDF</span> only. Max 2MB file size.
//               </p>
//               <input
//                 id="resume-upload"
//                 type="file"
//                 accept=".pdf"
//                 className="hidden"
//                 onChange={(e) => setUploadedFile(e.target.files[0])}
//               />
//             </label>

//             <div className="mt-8 text-black">
//               <CustomSelect
//                 options={jobCategories}
//                 selectedValue={selectedJobCategory}
//                 onSelect={setSelectedJobCategory}
//                 placeholder="Select Job Category"
//               />
//             </div>

//             <button
//               type="submit"
//               className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
//             >
//               {loading ? "Analyzing..." : "Upload"}
//             </button>
//           </form>

//           <p className="text-xs mt-4 text-gray-400">
//             🔒 We're committed to your privacy. Your resume is processed securely on our platfoem and is private to you.
//           </p>

//           <div className="mt-16 text-center">
//             <p className="uppercase text-sm tracking-wide text-gray-400">Guidelines Below</p>
//             <div className="text-white text-2xl animate-bounce">↓</div>
//           </div>

//           <div className="mt-10 max-w-2xl text-left text-sm text-gray-300">
//             <h3 className="text-white text-lg font-semibold mb-3 text-center">Guidelines for uploading your resume</h3>
//             <p className="mb-4 text-center">
//               To make sure we analyze your resume correctly and generate the right recommendations, please ensure that the resume you upload meets the following guidelines:
//             </p>
//             <ul className="list-disc list-inside space-y-2">
//               <li>Is in PDF</li>
//               <li>Is in English</li>
//               <li>Contains readable text & is not an image</li>
//               <li>Is a maximum of 2 MB in filesize</li>
//               <li>Is a resume and not any other file</li>
//               <li>Is not password protected</li>
//               <li>Contains only your resume and no other additional documents</li>
//             </ul>
//           </div>
//         </div>
//       )}

//       {loading && (
//         <div className="text-center mt-6 animate-pulse text-blue-400 font-semibold">
//           Processing your resume...
//         </div>
//       )}

//       {resultVisible && (
//         <div className="card-container mt-8 px-4">
//           <div className="floating-card bg-white text-black shadow-lg rounded-xl p-6 max-w-md mx-auto">
//             <h2 className="text-xl font-bold text-blue-700 mb-2">Resume Score</h2>
//             <p className="text-3xl font-semibold text-green-600">{resumeScore}</p>
//           </div>

//           <div className="floating-card bg-white text-black shadow-md rounded-xl p-4 max-w-md mx-auto mt-4">
//             <h3 className="text-xl font-bold text-blue-600 capitalize mb-2">Suggestions</h3>
//             {formatSuggestions(suggestions)}
//           </div>
//         </div>
//       )}

//       <footer className="bg-blue-950 mt-auto">
//         <Footer />
//       </footer>
//     </div>
//   );
// };

// export default AnalysePage;


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

      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        formattedElements.push(
          <h1 key={`point-${index}`} className="text-lg font-semibold text-blue-900">
            {trimmed.replace(/\*/g, "")}
          </h1>
        );
      } else if (trimmed.includes("*###*")) {
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
      } else if (trimmed.startsWith("*")) {
        formattedElements.push(
          <li key={`point-${index}`} className="list-disc ml-6 text-gray-700">
            {trimmed.replace(/^\*/, "").trim()}
          </li>
        );
      } else if (trimmed !== "") {
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
    <div className="bg-[#0D0B37] text-white min-h-screen flex flex-col">
      <Header />

      {!resultVisible && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <h2 className="text-2xl font-semibold mb-6">Upload Your Resume</h2>
          
          <form onSubmit={handleSubmit} className="bg-[#1E1B4B] p-8 rounded-xl w-full max-w-xl text-center">
            <label
              htmlFor="resume-upload"
              className="border-2 border-dashed border-gray-400 rounded-lg py-12 px-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition"
            >
              <div className="text-5xl text-gray-400">⬆️</div>
              <p className="mt-2">
                Click the button above or drop your resume in here.<br />
                English resumes in <span className="font-bold">PDF </span> only. Max 2MB file size.
              </p>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => setUploadedFile(e.target.files[0])}
              />
            </label>

            <div className="mt-6 text-black">
              <CustomSelect
                options={jobCategories}
                selectedValue={selectedJobCategory}
                onSelect={setSelectedJobCategory}
                placeholder="Select Job Category"
              />
            </div>

            <button
              type="submit"
              className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Analyzing..." : "Upload"}
            </button>
          </form>
          <div className="flex flex-col items-center justify-center py-12 px-4">
    {/* … your existing upload form code … */}

    {/* PRIVACY NOTICE */}
    <p className="text-xs mt-4 text-gray-400">
      🔒 We’re committed to your privacy. Your resume is processed securely on our platform and is private to you.
    </p>

    {/* GUIDELINES HEADER */}
    <div className="mt-16 text-center">
      <p className="uppercase text-sm tracking-wide text-gray-400">Guidelines Below</p>
      <div className="text-white text-2xl animate-bounce">↓</div>
    </div>

    {/* GUIDELINES LIST */}
    <div className="mt-10 max-w-2xl text-left text-sm text-gray-300">
      <h3 className="text-white text-lg font-semibold mb-3 text-center">
        Guidelines for uploading your resume
      </h3>
      <p className="mb-4 text-center">
        To make sure we analyze your resume correctly and generate the right recommendations, please ensure that the resume you upload meets the following guidelines:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>Is in PDF or DOCX format</li>
        <li>Is in English</li>
        <li>Contains readable text & is not an image</li>
        <li>Is a maximum of 2 MB in filesize</li>
        <li>Is a resume and not any other file</li>
        <li>Is not password protected</li>
        <li>Contains only your resume and no other additional documents</li>
      </ul>
    </div>
  </div>
        </div>
      )}

      {loading && (
        <div className="text-center mt-6 animate-pulse text-blue-400 font-semibold">
          Processing your resume...
        </div>
      )}

      {resultVisible && (
  <div className="flex justify-center px-4 mt-16 mb-36">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b">
        <button className="flex-1 py-3 text-center font-medium text-purple-600 border-b-2 border-purple-600">
          Latest Score
        </button>
        
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Your resume scored {resumeScore} out of 100.
        </h2>
        <p className="text-sm text-gray-600">
          This is a decent start, but there’s clear room for improvement on your resume. It scored low on some key criteria hiring managers and resume-screening software look for, but they can be easily improved. Let’s dive into what we checked your resume for, and how you can improve your score by 30+ points.
        </p>

        {/* Gradient Bar */}
        <div className="relative h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-300 to-green-500">
          <div
            className="absolute -top-1 w-2 h-4 bg-purple-600 rounded"
            style={{ left: `${resumeScore}%` }}
          />
        </div>

        {/* Axis Labels */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>100</span>
        </div>

        {/* Footnote */}
        <div className="flex items-start bg-yellow-50 border-l-4 border-yellow-300 p-3 rounded">
          <svg
            className="w-5 h-5 text-yellow-400 flex-shrink-0 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 2a7 7 0 00-7 7v1a7 7 0 0014 0v-1a7 7 0 00-7-7zM8 9h2v4H8V9zM8 15h2v2H8v-2z" />
          </svg>
          <p className="text-xs text-gray-700">
            Your score is benchmarked against 20k+ resumes at your career level, and is based on top 3 key recruiter checks. The higher your resume score, the stronger your resume is and the more interviews you are likely to get.
          </p>
        </div>

        {/* Suggestions Section */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Suggestions</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {formatSuggestions(suggestions)}
          </ul>
        </div>
      </div>
    </div>
  </div>
)}


      <footer className="bg-blue-950 mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default AnalysePage;
