import React, { useState } from "react";
import GameCanvas from "./Prologue";

const App = () => {
  const [showGame, setShowGame] = useState(false);

  const handleStart = () => {
    setShowGame(true);
  };

  return (
    <div>
      {!showGame ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#282c34",
            color: "#ffffff",
            textAlign: "center"
          }}
        >
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            Welcome to the Visual Novel!
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
