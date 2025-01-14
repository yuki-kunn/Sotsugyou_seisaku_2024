import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import GameCanvas from "./Prologue.jsx";
import Chapter1 from "./Chapter1.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/prologue" element={<GameCanvas />} />
        <Route path="/chapter1" element={<Chapter1 />} />
      </Routes>
    </Router>
  </StrictMode>
);
