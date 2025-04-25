import React, { useState, useEffect } from "react";

const Typewriter = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (index < text.length) {
      interval = setInterval(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prevIndex) => prevIndex + 1);
      }, speed);
    }
    return () => clearInterval(interval);
  }, [index, text, speed]);

  return (
    <h1 className="text-4xl sm:text-6xl font-bold text-white text-center drop-shadow-lg">
      {displayedText}
    </h1>
  );
};

export default Typewriter;
