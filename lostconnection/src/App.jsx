import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const [textIndex, setTextIndex] = useState(0);
  const [storyTexts, setStoryTexts] = useState([]);

  // Google Apps Scriptからシナリオデータを取得
  useEffect(() => {
    fetch(
      "https://script.googleusercontent.com/macros/echo?user_content_key=EugM9cuzbjQCHzOL1YPpRLecKREIpACw-hXn4e1tMMAcbFLJg0ybOxFhRKtiHg4UN3eRy_mP1Y3frFeqGD_Uxvko9CVK5I1Bm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnOFUigQjl745NXxhyGs8MfM-OK1UkkUNaC8LpJP3GaUizOyxI_gLJxW5C5DMWl84Z1HQwMBubtfPnjaVwtVr6anN_Ni-iJkYIg&lib=McBanqb4XeEBemR2SV5_aDeu9HG4VFNme"
    )
      .then((response) => response.json())
      .then((data) => setStoryTexts(data.items))
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
    const background = PIXI.Sprite.from("assets/shujinnkou_jitaku.png");
    background.name = "background";
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    // 主人公スプライトの設定
    const character = new PIXI.Sprite();
    character.name = "character";
    character.x = 50; // 左端に配置
    character.y = app.screen.height / 2 - 320; // 縦方向中央
    character.width = 700;
    character.height = 1050;
    character.visible = false; // 初期状態は非表示
    app.stage.addChild(character);

    // テキストボックスの設定
    const style = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 24,
      fill: "#ffffff",
      align: "center"
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
    storyText.y = app.screen.height / 1.17;
    backgroundBox.alpha = 0.8;
    app.stage.addChild(backgroundBox);
    app.stage.addChild(storyText);

    // 話者名ボックスの設定
    const nameBox = new PIXI.Graphics();
    nameBox.beginFill(0x4682b4);
    nameBox.drawRoundedRect(0, 0, 150, 40, 10);
    nameBox.endFill();
    nameBox.x = backgroundBox.x - backgroundBox.width / 2 + 10;
    nameBox.y = backgroundBox.y - backgroundBox.height / 2 - 40;
    nameBox.alpha = 0.6;
    app.stage.addChild(nameBox);

    const nameStyle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 20,
      fill: "#ffffff"
    });
    const nameText = new PIXI.Text("", nameStyle);
    nameText.x = nameBox.x + 10;
    nameText.y = nameBox.y + 10;
    app.stage.addChild(nameText);

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
      const nameText = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Text && child.style.fontSize === 20
      );

      const character = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Sprite && child.name === "character"
      );

      const currentStory = storyTexts[textIndex] || {};
      storyText.text = currentStory.text || "";
      nameText.text = currentStory.name || "";

      const imagePath = currentStory.image;
      if (imagePath) {
        character.texture = PIXI.Texture.from(imagePath);
        character.visible = true;
      } else {
        character.visible = false;
      }
    }
  }, [textIndex, storyTexts]);

  return <div ref={canvasRef}></div>;
};

export default GameCanvas;
