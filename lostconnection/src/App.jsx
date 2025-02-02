import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showModal, setShowModal] = useState(false); // モーダル表示状態

  const navigate = useNavigate();

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
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>LostConnection</h1>

        {/* Start ボタン */}
        <button
          onClick={() => navigate("/prologue")}
          style={buttonStyle}
        >
          Start
        </button>

        {/* Chapter ボタン */}
        <button
          onClick={() => setShowModal(true)}
          style={{ ...buttonStyle, marginTop: "20px", backgroundColor: "#ffcc00" }}
        >
          Chapter
        </button>
      </div>

      {/* モーダル（showModal が true のとき表示） */}
      {showModal && (
        <div
          style={modalOverlayStyle}
          onClick={() => setShowModal(false)} // モーダル外をクリックで閉じる
        >
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: "20px" }}>Select Chapter</h2>
            
            <button onClick={() => navigate("/prologue")} style={buttonStyle}>Prologue</button>
            <button onClick={() => navigate("/chapter1")} style={buttonStyle}>Chapter 1</button>
            <button onClick={() => navigate("/chapter2")} style={buttonStyle}>Chapter 2</button>
            <button onClick={() => navigate("/chapter3")} style={buttonStyle}>Chapter 3</button>
            <button onClick={() => navigate("/epilogue")} style={buttonStyle}>Epilogue</button>

            <button onClick={() => setShowModal(false)} style={{ ...buttonStyle, marginTop: "20px", backgroundColor: "#ff4444" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ボタンのスタイル
const buttonStyle = {
  fontSize: "1.5rem",
  padding: "0.5rem 2rem",
  backgroundColor: "#61dafb",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  width: "250px"
};

// モーダルのオーバーレイ（背景）
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

// モーダルのスタイル
const modalStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px"
};

export default App;
