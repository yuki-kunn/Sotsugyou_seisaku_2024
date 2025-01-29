import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import GameCanvas from "./Prologue.jsx";
import Chapter1 from "./Chapter1.jsx";
import Chapter1_1 from "./Chapter1_1.jsx";
import Chapter1_2 from "./Chapter1_2.jsx";
import Chapter2 from "./Chapter2.jsx";
import Chapter2_1 from "./Chapter2_1.jsx";
import Chapter2_2 from "./Chapter2_2.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/prologue" element={<GameCanvas />} />
        <Route path="/chapter1" element={<Chapter1 />} />
        <Route path="/chapter1_1" element={<Chapter1_1 />} />
        <Route path="/chapter1_2" element={<Chapter1_2 />} />
        <Route path="/chapter2" element={<Chapter2 />} />
        <Route path="/chapter2_1" element={<Chapter2_1 />} />
        <Route path="/chapter2_2" element={<Chapter2_2 />} />
      </Routes>
    </Router>
  </StrictMode>
);
