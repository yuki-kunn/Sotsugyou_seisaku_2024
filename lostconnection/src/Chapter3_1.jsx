import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { useNavigate } from "react-router-dom";

const Chapter3_1 = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const [textIndex, setTextIndex] = useState(0);
  const [storyTexts, setStoryTexts] = useState([]);
  const [showChoices, setShowChoices] = useState(false);
  const navigate = useNavigate();

  // Google Apps Scriptからシナリオデータを取得
  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbzl4lHDLLQubYmnICllcuS2rVWuvcqC8oZsNMAIOFTRqX7PQMweQkp5o9KR1xK4lmR4/exec?action=chaP3_1"
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

  // PIXIアプリケーションの初期化
  useEffect(() => {
    if (!canvasRef.current) {
      console.error("canvasRef.current is null");
      return;
    }

    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1099bb,
      resizeTo: window
    });
    appRef.current = app;
    canvasRef.current.appendChild(app.view);

    // 背景スプライトの設定
    const background = PIXI.Sprite.from("assets/koyanaka.png");
    background.name = "background";
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    // 主人公スプライトの設定 (左側に配置)
    const character = new PIXI.Sprite();
    character.name = "character";
    character.x = 50; // 左側
    character.y = app.screen.height / 2 - 320; // ここを調整
    character.width = 700;
    character.height = 1050;
    character.visible = false;
    app.stage.addChild(character);

    // 対話キャラクタースプライトの設定 (右側に配置)
    const partner = new PIXI.Sprite();
    partner.name = "partner";
    partner.x = app.screen.width - 750; // 右側
    partner.y = app.screen.height / 2 - 320; // ここを調整
    partner.width = 700;
    partner.height = 1050;
    partner.visible = false;
    app.stage.addChild(partner);

    const obj = new PIXI.Sprite();
    obj.name = "obj";
    obj.x = app.screen.width / 2 - 250;
    obj.y = app.screen.height / 2 - 225;
    obj.width = 525;
    obj.height = 375;
    obj.visible = false;
    app.stage.addChild(obj);

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
      if (showChoices) {
        setShowChoices(false);
        setTextIndex((prevIndex) => (prevIndex + 1) % storyTexts.length);
      } else {
        setTextIndex((prevIndex) => (prevIndex + 1) % storyTexts.length);
      }
    };
    app.view.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("resize", onResize);
      app.view.removeEventListener("click", onClick);
      app.destroy(true, { children: true });
    };
  }, [storyTexts, showChoices]);

  // ストーリーと画像の更新
  useEffect(() => {
    if (appRef.current && storyTexts.length > 0) {
      const storyText = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Text && child.style.fontSize === 24
      );
      const nameText = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Text && child.style.fontSize === 20
      );

      const background = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Sprite && child.name === "background"
      );
      const character = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Sprite && child.name === "character"
      );
      const partner = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Sprite && child.name === "partner"
      );
      const obj = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Sprite && child.name === "obj"
      );

      const currentStory = storyTexts[textIndex] || {};
      storyText.text = currentStory.text || "";
      nameText.text = currentStory.name || "";

      const imagePath = currentStory.image;

      // 日記 (中央表示)
      if (imagePath === "assets/nikki.png") {
        obj.texture = PIXI.Texture.from(imagePath);
        obj.visible = true;
        character.visible = false;
        partner.visible = false;
      } else if (imagePath === "assets/police.png") {
        background.texture = PIXI.Texture.from(imagePath);
        character.visible = false;
        partner.visible = false;
      } else if (
        imagePath === "assets/misaki.png" ||
        imagePath === "assets/itsuki.png"
      ) {
        partner.texture = PIXI.Texture.from(imagePath);
        partner.visible = true;
        obj.visible = false;
      } else if (imagePath === "assets/shujinnkou.png") {
        character.texture = PIXI.Texture.from(imagePath);
        character.visible = true;
        obj.visible = false;
      } else {
        obj.visible = false;
        character.visible = false;
        partner.visible = false;
      }

      if (currentStory.text === "next") {
        navigate("/epilogue");
      }

      if (currentStory.se === "sway") {
        let elapsed = 0;
        const swayDuration = 750; // 揺れの継続時間 (ミリ秒)
        const swayAmplitude = 10; // 揺れの振幅 (ピクセル)
        const stage = appRef.current.stage;

        // すでに動いている Ticker がある場合は停止
        if (appRef.current.swayTicker) {
          appRef.current.swayTicker.stop();
        }

        const swayTicker = new PIXI.Ticker();
        swayTicker.add((delta) => {
          elapsed += delta * 16.66; // ミリ秒に変換
          if (elapsed < swayDuration) {
            const offsetX = Math.sin(elapsed * 0.05) * swayAmplitude;
            const offsetY = Math.cos(elapsed * 0.05) * swayAmplitude;
            stage.x = offsetX;
            stage.y = offsetY;
          } else {
            // 揺れ終了時に位置をリセット
            stage.x = 0;
            stage.y = 0;
            swayTicker.stop();
          }
        });

        swayTicker.start();
        appRef.current.swayTicker = swayTicker; // 参照を保持
      }
    }
  }, [textIndex, storyTexts]);

  return <div ref={canvasRef}></div>;
};

export default Chapter3_1;
