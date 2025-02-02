import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Prologue from "./Prologue.jsx";
import Chapter1 from "./Chapter1.jsx";
import Chapter1_1 from "./Chapter1_1.jsx";
import Chapter1_2 from "./Chapter1_2.jsx";
import Chapter2 from "./Chapter2.jsx";
import Chapter2_1 from "./Chapter2_1.jsx";
import Chapter2_2 from "./Chapter2_2.jsx";
import Chapter3 from "./Chapter3.jsx";
import Chapter3_1 from "./Chapter3_1.jsx";
import Chapter3_2 from "./Chapter3_2.jsx";
import Epilogue from "./Epilogue.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/prologue" element={<Prologue />} />
        <Route path="/chapter1" element={<Chapter1 />} />
        <Route path="/chapter1_1" element={<Chapter1_1 />} />
        <Route path="/chapter1_2" element={<Chapter1_2 />} />
        <Route path="/chapter2" element={<Chapter2 />} />
        <Route path="/chapter2_1" element={<Chapter2_1 />} />
        <Route path="/chapter2_2" element={<Chapter2_2 />} />
        <Route path="/chapter3" element={<Chapter3 />} />
        <Route path="/chapter3_1" element={<Chapter3_1 />} />
        <Route path="/chapter3_2" element={<Chapter3_2 />} />
        <Route path="/epilogue" element={<Epilogue />} />
      </Routes>
    </Router>
  </StrictMode>
);
