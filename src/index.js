import React, { useState, useEffect, useRef } from "react";
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

const CustomSelect = ({ options, selectedValue, onSelect, placeholder = "Select an option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm(''); // Clear search term when closed
        setFilteredOptions(options); // Reset options
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, options]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus on the input when opening (optional)
      // document.querySelector(`#${placeholder.replace(/\s+/g, '-')}-search`)?.focus();
    } else {
      setSearchTerm(''); // Clear search term when closing
      setFilteredOptions(options); // Reset options
    }
  };

  const handleOptionClick = (option) => {
    onSelect(option);
    setIsOpen(false);
    setSearchTerm(''); // Clear search term
    setFilteredOptions(options); // Reset options
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredOptions(options.filter(opt => opt.toLowerCase().includes(term)));
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        className="flex items-center justify-between w-full p-3 rounded-lg border border-gray-300 bg-white text-left focus:outline-none focus:ring focus:ring-indigo-200"
        onClick={toggleDropdown}
      >
        <span>{selectedValue || placeholder}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {/* Search Input (Optional but recommended for long lists) */}
          <div className="px-2 py-2">
            <input
              type="text"
              id={`${placeholder.replace(/\s+/g, '-')}-search`}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-sm"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Option List */}
          <ul
            className="max-h-60 overflow-auto py-1 text-base focus:outline-none" // Adjust max-h as needed (e.g., max-h-56 for ~7 options)
            role="listbox"
            aria-labelledby="listbox-label"
            aria-activedescendant="listbox-option-0" // You might need dynamic handling for this in a more complex scenario
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => (
                <li
                  key={idx}
                  className={`relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100 ${
                    option === selectedValue ? 'bg-indigo-600 text-white' : ''
                  }`}
                  onClick={() => handleOptionClick(option)}
                  role="option"
                  aria-selected={option === selectedValue}
                >
                  <div className="flex items-center">
                    <span className={`truncate ${option === selectedValue ? 'font-semibold' : 'font-normal'}`}>
                      {option}
                    </span>
                  </div>
                  {option === selectedValue && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900">
                No options found
              </li>
            )}
            {filteredOptions.length > 8 && (
              <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500">
                Showing top 8 of {filteredOptions.length} options
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
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
    if (!uploadedFile || !selectedJobCategory) return alert("Upload resume and select job category.");

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

      setResumeScore(data.score * 100);
      setSuggestions(data.suggestions || "");
      setResultVisible(true);
    } catch (error) {
      alert("Error uploading resume: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatSuggestions = (suggestionString) => {
    if (!suggestionString) return <p className="text-center text-gray-700">No suggestions available for this resume.</p>;

    const formattedElements = [];
    const suggestionsArray = suggestionString.split('\n');

    suggestionsArray.forEach((suggestion, index) => {
      var i=0;
      for(i=0;i<suggestion.length;i++)if(suggestion[i]==='*')break;
      if(suggestion[0]=='*'&&suggestion[1]=='*')formattedElements.push(<h1 key={`point-${index}`} className="text-lg font-semibold text-blue-900">{suggestion.substring(2,suggestion.length-2).trim()}</h1 >);
      else if (suggestion[i+4]==='*') {
        var j=i+4;for(j=i+6;j<suggestion.length;j++)if(suggestion[j]==='*')break;
        const headingText = suggestion.substring(i+6, j-1).trim();
        const pointText = suggestion.substring(j+2).trim();
        formattedElements.push(
          <div key={`suggestion-${index}`} className="mb-2">
            <h4 className="text-lg font-semibold text-gray-900">{headingText}</h4>
            {pointText && <span className="text-gray-700 text-md">{pointText}</span>}
          </div>
        );
      }
      else if(suggestion[0]=='*'){
        
        formattedElements.push(<li key={`point-${index}`} className="list-disc ml-6 text-gray-700">{suggestion.substring(1).trim()}</li >);
      }
       else if (suggestion.trim() !== "") {
        formattedElements.push(<p key={`point-${index}`} className="list-disc ml-6 text-gray-700">{suggestion.substring(0).trim()}</p >);
      }

    });
    
    return formattedElements;
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
            {/* Replace the default select with the CustomSelect component */}
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
        <div className="text-center mt-6 animate-pulse text-blue-600 font-semibold">Processing your resume...</div>
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