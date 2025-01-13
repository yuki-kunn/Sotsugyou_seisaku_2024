import React, { useState, useEffect } from "react";
import PixiApp from "./PixiApp";

const GameCanvas = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [storyTexts, setStoryTexts] = useState([]);

  // Google Apps Scriptからシナリオデータを取得
  useEffect(() => {
    fetch(
      "https://script.googleusercontent.com/macros/echo?user_content_key=EugM9cuzbjQCHzOL1YPpRLecKREIpACw-hXn4e1tMMAcbFLJg0ybOxFhRKtiHg4UN3eRy_mP1Y3frFeqGD_Uxvko9CVK5I1Bm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnOFUigQjl745NXxhyGs8MfM-OK1UkkUNaC8LpJP3GaUizOyxI_gLJxW5C5DMWl84Z1HQwMBubtfPnjaVwtVr6anN_Ni-iJkYIg&lib=McBanqb4XeEBemR2SV5_aDeu9HG4VFNme"
    )
      .then((response) => response.json())
      .then((data) => {
        const cleanedData = data.items.map((item) => ({
          name: item.name || "",
          text: item.text || "",
          image: item.image || "",
          sounds: item.sounds || "",
          se: item.se || ""
        }));
        setStoryTexts(cleanedData);
      })
      .catch((error) => console.error("Error fetching scenario data:", error));
  }, []);

  return (
    <PixiApp
      storyTexts={storyTexts}
      textIndex={textIndex}
      setTextIndex={setTextIndex}
    />
  );
};

export default GameCanvas;
