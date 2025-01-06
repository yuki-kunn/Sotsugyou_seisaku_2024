import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const characterRef = useRef(null); // 主人公スプライトを参照
  const [textIndex, setTextIndex] = useState(0);
  const [storyTexts, setStoryTexts] = useState([]);

  useEffect(() => {
    fetch(
      "https://script.googleusercontent.com/macros/echo?user_content_key=A7oUalxTPiXJZo-Ymw9isbYbI0loGQuS1Bl5teXY7L2Bb-VjQp1OFu4GKKi9PBh5qIjV-It-2GwsudXlGLN_njhgBvQE-Gp9m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnOFUigQjl745NXxhyGs8MfM-OK1UkkUNaC8LpJP3GaUizOyxI_gLJxW5C5DMWl84Z1HQwMBubtfPnjaVwtVr6anN_Ni-iJkYIg&lib=McBanqb4XeEBemR2SV5_aDeu9HG4VFNme"
    ) // シナリオデータ取得
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

    // 背景スプライトの設定
    const background = PIXI.Sprite.from("assets/shujinnkou_jitaku.png");
    app.stage.addChild(background);

    // 主人公スプライトの設定
    const character = PIXI.Sprite.from("assets/shujinnkou.png");
    character.x = 50; // 左端から50px
    character.y = app.screen.height / 2 - 350; // 縦中央に配置（高さ750pxの半分）
    character.width = 700; // 幅を500pxに設定
    character.height = 1050; // 高さを750pxに設定
    app.stage.addChild(character);

    // テキスト背景ボックスの設定
    const backgroundBox = new PIXI.Graphics();
    backgroundBox.beginFill(0x4682b4); // ボックスの色
    backgroundBox.drawRoundedRect(0, 0, 850, 110, 20); // 幅850、高さ110の角丸矩形
    backgroundBox.endFill();
    backgroundBox.pivot.set(backgroundBox.width / 2, backgroundBox.height / 2);
    backgroundBox.x = app.screen.width / 2;
    backgroundBox.y = app.screen.height / 1.17;
    backgroundBox.alpha = 0.7; // 半透明
    app.stage.addChild(backgroundBox);

    // テキスト表示用の設定
    const textStyle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 24,
      fill: "#ffffff",
      align: "center"
    });
    const storyText = new PIXI.Text("", textStyle);
    storyText.anchor.set(0.5);
    storyText.x = app.screen.width / 2;
    storyText.y = app.screen.height / 1.17;
    app.stage.addChild(storyText);

    // 話者ボックスの設定
    const nameBox = new PIXI.Graphics();
    nameBox.beginFill(0x4682b4);
    nameBox.drawRoundedRect(0, 0, 150, 40, 10); // 幅150、高さ40の角丸矩形
    nameBox.endFill();
    nameBox.pivot.set(0, 0);
    nameBox.x = backgroundBox.x - backgroundBox.width / 2 + 5;
    nameBox.y = backgroundBox.y - backgroundBox.height / 2 - 40;
    nameBox.alpha = 0.9;
    app.stage.addChild(nameBox);

    // 話者名テキストの設定
    const nameTextStyle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 20,
      fill: "#ffffff",
      align: "left"
    });
    const nameText = new PIXI.Text("", nameTextStyle);
    nameText.x = nameBox.x + 10; // nameBox内に余白を設ける
    nameText.y = nameBox.y + 10;
    app.stage.addChild(nameText);

    // リサイズ時の処理
    const onResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
      background.width = app.screen.width;
      background.height = app.screen.height;
    };

    onResize();
    window.addEventListener("resize", onResize);

    // クリック時の処理
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
        (child) => child instanceof PIXI.Text && child.style.fontSize === 24
      );
      const nameText = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Text && child.style.fontSize === 20
      );

      storyText.text = storyTexts[textIndex]?.text || "";
      nameText.text = storyTexts[textIndex]?.name || "";

      // 主人公画像の更新
      if (characterRef.current) {
        const imagePath = storyTexts[textIndex]?.image || "assets/default.png";
        characterRef.current.texture = PIXI.Texture.from(imagePath);
      }
    }
  }, [textIndex, storyTexts]);

  return <div ref={canvasRef}></div>;
};

export default GameCanvas;
