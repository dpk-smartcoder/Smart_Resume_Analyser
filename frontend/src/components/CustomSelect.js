import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logoLanding from "../images/logoLanding.png"; // adjust the path as needed
import Typewriter from "../components/Typewriter"; // or correct path


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
  
        <footer className="text-white text-sm mt-6">&copy; 2025 Smart Resume Analyser. All rights reserved.</footer>
      </div>
    );
  };
  

export default CustomSelect;
