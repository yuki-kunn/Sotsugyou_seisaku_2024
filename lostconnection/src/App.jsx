import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const [textIndex, setTextIndex] = useState(0);
  const [storyTexts, setStoryTexts] = useState([]);

  useEffect(() => {
    // Google Apps Scriptからシナリオデータを取得
    fetch(
      "https://script.googleusercontent.com/macros/echo?user_content_key=EugM9cuzbjQCHzOL1YPpRLecKREIpACw-hXn4e1tMMAcbFLJg0ybOxFhRKtiHg4UN3eRy_mP1Y3frFeqGD_Uxvko9CVK5I1Bm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnOFUigQjl745NXxhyGs8MfM-OK1UkkUNaC8LpJP3GaUizOyxI_gLJxW5C5DMWl84Z1HQwMBubtfPnjaVwtVr6anN_Ni-iJkYIg&lib=McBanqb4XeEBemR2SV5_aDeu9HG4VFNme"
    )
      .then((response) => response.json())
      .then((data) => setStoryTexts(data.items))
      .catch((error) => console.error("Error fetching scenario data:", error));
  }, []);

  useEffect(() => {
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1099bb,
      resizeTo: window
    });
    appRef.current = app;
    canvasRef.current.appendChild(app.view);

    const background = PIXI.Sprite.from("assets/shujinnkou_jitaku.png");
    app.stage.addChild(background);

    // キャラクター画像の設定 (JPG画像)
    const character = PIXI.Sprite.from("assets/shujinnkou.png");
    character.x = 50; // 左側に配置
    character.y = app.screen.height / 2 - character.height / 2; // 縦方向に中央配置
    // サイズを指定（具体的なピクセル値）
    character.width = 700; // 幅を設定
    character.height = 1050; // 高さを設定

    app.stage.addChild(character);

    const style = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 24,
      fill: "#ffffff",
      align: "center" // 中央揃え
    });
    const storyText = new PIXI.Text("", style);
    storyText.anchor.set(0.5);

    const backgroundBox = new PIXI.Graphics();
    backgroundBox.beginFill(0x4682b4);
    backgroundBox.drawRoundedRect(0, 0, 850, 110, 20);
    backgroundBox.endFill();
    backgroundBox.pivot.set(backgroundBox.width / 2, backgroundBox.height / 2);
    backgroundBox.x = app.screen.width / 2;
    backgroundBox.y = app.screen.height / 1.17;
    storyText.x = app.screen.width / 2;
    storyText.y = app.screen.height / 2;
    app.stage.addChild(backgroundBox);
    app.stage.addChild(storyText);
    backgroundBox.alpha = 0.7;

    const nameBox = new PIXI.Graphics();
    nameBox.beginFill(0x4682b4);
    nameBox.drawRoundedRect(0, 0, 150, 40, 10);
    nameBox.endFill();
    nameBox.pivot.set(0, 0);
    nameBox.x = backgroundBox.x - backgroundBox.width / 2 + 10;
    nameBox.y = backgroundBox.y - backgroundBox.height / 2 - 40;
    nameBox.alpha = 0.9;
    app.stage.addChild(nameBox);

    const onResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
      background.width = app.screen.width;
      background.height = app.screen.height;
      storyText.y = app.screen.height - 100;
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

  useEffect(() => {
    if (appRef.current && storyTexts.length > 0) {
      const storyText = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Text
      );
      storyText.text = storyTexts[textIndex]?.text || "";
    }
  }, [textIndex, storyTexts]);

  return <div ref={canvasRef}></div>;
};

export default GameCanvas;
