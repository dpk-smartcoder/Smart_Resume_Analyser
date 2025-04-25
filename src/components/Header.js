import React from "react";
import logo from "../images/logoLanding.png";

const Header = () => (
  <header className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold text-blue-600">Smart Resume Analyser</h1>
    <img src={logo} alt="Logo" className="h-10" />
  </header>
);

export default Header;
