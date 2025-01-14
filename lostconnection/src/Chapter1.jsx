import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";

const Chapter1 = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const [textIndex, setTextIndex] = useState(0);
  const [storyTexts, setStoryTexts] = useState([]);

  // Google Apps ScriptからJSONデータを取得
  useEffect(() => {
    fetch(
      "https://script.googleusercontent.com/macros/echo?user_content_key=NWzOAoT6bX7n_wuZNi1Rqit552YF2PSSvtOTx-poNa1HtozVAH2LxcRmIcTwsHXN2XTH1d1sD0rk-SuvFP2GvPGQRjPx9V4km5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnCbxVZwliODGVuHX1MCCyxgC52XzUSXsnU4_g_JQ7komMjsmHKHH1hPYlVzcvodNczL4e8iuWMp7HgmXvkQAkxfKUkP_ZAHL3k7BK1kh9SWT8lLzkfl8LyY&lib=McBanqb4XeEBemR2SV5_aDeu9HG4VFNme"
    )
      .then((response) => response.json())
      .then((data) => {
        const cleanedData = data.items.map((item) => ({
          name: item.name || "???",
          text: item.text || "",
          image: item.image || "",
          sounds: item.sounds || "",
          se: item.se || ""
        }));
        setStoryTexts(cleanedData);
      })
      .catch((error) => console.error("Error fetching scenario data:", error));
  }, []);

  // PIXIアプリケーションの初期化
  useEffect(() => {
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1099bb,
      resizeTo: window
    });
    appRef.current = app;
    canvasRef.current.appendChild(app.view);

    // 背景スプライトの設定
    const background = PIXI.Sprite.from("assets/car.png");
    background.name = "background";
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    // 話者テキストスプライトの設定
    const speakerTextStyle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 20,
      fill: "#ffffff"
    });
    const speakerText = new PIXI.Text("", speakerTextStyle);
    speakerText.x = app.screen.width / 2 - 400; // 適切な位置に配置
    speakerText.y = app.screen.height / 1.2 - 40; // テキストボックスの上
    app.stage.addChild(speakerText);

    // テキストボックスの設定
    const textStyle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 24,
      fill: "#ffffff",
      align: "left",
      wordWrap: true,
      wordWrapWidth: 800
    });
    const storyText = new PIXI.Text("", textStyle);
    storyText.anchor.set(0.5);

    const textBox = new PIXI.Graphics();
    textBox.beginFill(0x4682b4);
    textBox.drawRoundedRect(0, 0, 850, 110, 20);
    textBox.endFill();
    textBox.pivot.set(textBox.width / 2, textBox.height / 2);
    textBox.x = app.screen.width / 2;
    textBox.y = app.screen.height / 1.17;
    storyText.x = app.screen.width / 2;
    storyText.y = app.screen.height / 1.17;
    textBox.alpha = 0.8;

    app.stage.addChild(textBox);
    app.stage.addChild(storyText);

    const onResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
      background.width = app.screen.width;
      background.height = app.screen.height;
    };

    onResize();
    window.addEventListener("resize", onResize);

    const onClick = () => {
      setTextIndex((prevIndex) => (prevIndex + 1) % storyTexts.length);
    };
    app.view.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("resize", onResize);
      app.view.removeEventListener("click", onClick);
      app.destroy(true, { children: true });
    };
  }, [storyTexts]);

  // ストーリーと画像の更新
  useEffect(() => {
    if (appRef.current && storyTexts.length > 0) {
      const storyText = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Text && child.style.fontSize === 24
      );

      const speakerText = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Text && child.style.fontSize === 20
      );

      const background = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Sprite && child.name === "background"
      );

      const currentStory = storyTexts[textIndex] || {};

      // 話者テキストを更新
      speakerText.text = currentStory.name || "???";

      // テキストを改行して設定
      const wrapText = (text, maxLength) =>
        text
          .split("")
          .reduce(
            (acc, char) =>
              acc[acc.length - 1].length >= maxLength
                ? [...acc, char]
                : [...acc.slice(0, -1), acc[acc.length - 1] + char],
            [""]
          )
          .join("\n");

      storyText.text = wrapText(currentStory.text || "", 40);

      // 背景画像の切り替え
      if (background && currentStory.image) {
        background.texture = PIXI.Texture.from(currentStory.image);
      }
    }
  }, [textIndex, storyTexts]);

  return <div ref={canvasRef}></div>;
};

export default Chapter1;
