import React, { useState, useEffect } from "react";
import GameCanvas from "./Prologue";

const App = () => {
  const [showGame, setShowGame] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const handleStart = () => {
    setShowGame(true);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      style={{
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`
      }}
    >
      {!showGame ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            backgroundColor: "#282c34",
            color: "#ffffff",
            textAlign: "center"
          }}
        >
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            LostConnection
          </h1>
          <button
            onClick={handleStart}
            style={{
              fontSize: "1.5rem",
              padding: "0.5rem 2rem",
              backgroundColor: "#61dafb",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Start
          </button>
        </div>
      ) : (
        <GameCanvas />
      )}
    </div>
  );
};

export default App;
