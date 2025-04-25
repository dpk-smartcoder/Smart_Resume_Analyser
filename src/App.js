import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AnalysePage from "./pages/AnalysePage";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/analyse" element={<AnalysePage />} />
    </Routes>
  </Router>
);

export default App;
