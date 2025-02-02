import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { useNavigate } from "react-router-dom";

const Prologue = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const [textIndex, setTextIndex] = useState(0);
  const [storyTexts, setStoryTexts] = useState([]);
  const navigate = useNavigate();

  // Google Apps Scriptからシナリオデータを取得
  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbwNZuwy1gBdrdl3apLPEIy-oKW76pi7EtNAKp9L0d4FEuDTU_gx268DUQA59qa9PJR-/exec"
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
    character.x = 50;
    character.y = app.screen.height / 2 - 320;
    character.width = 700;
    character.height = 1050;
    character.visible = false;
    app.stage.addChild(character);

    // 封筒スプライトの設定
    const futou = new PIXI.Sprite();
    futou.name = "futou";
    futou.x = app.screen.width / 2 - 250;
    futou.y = app.screen.height / 2 - 225;
    futou.width = 525;
    futou.height = 375;
    futou.visible = false;
    app.stage.addChild(futou);

    // shashinスプライトの設定
    const shashin = new PIXI.Sprite();
    shashin.name = "shashin";
    shashin.anchor.set(0.5); // 中心を基準に回転させる
    shashin.x = app.screen.width / 2;
    shashin.y = app.screen.height / 2;
    shashin.width = 500;
    shashin.height = 300;
    shashin.rotation = 0.1; // 少し傾ける（ラジアン値）
    shashin.visible = false;
    app.stage.addChild(shashin);
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

      const background = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Sprite && child.name === "background"
      );
      const character = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Sprite && child.name === "character"
      );

      const futou = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Sprite && child.name === "futou"
      );
      const shashin = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Sprite && child.name === "shashin"
      );
      const stage = appRef.current.stage;
      const currentStory = storyTexts[textIndex] || {};
      storyText.text = currentStory.text || "";
      nameText.text = currentStory.name || "";

      const imagePath = currentStory.image;

      if (currentStory.text === "next") {
        navigate("/chapter1");
      }
      // 背景画像の切り替え
      if (background && imagePath === "assets/car.png") {
        background.texture = PIXI.Texture.from(imagePath);
        character.visible = false;
        futou.visible = false;
        shashin.visible = false;
      } else if (
        imagePath === "assets/futou.png" ||
        imagePath === "assets/futou_open.png"
      ) {
        futou.texture = PIXI.Texture.from(imagePath);
        futou.visible = true;
        character.visible = false;
        shashin.visible = false;
      } else if (
        imagePath === "assets/help.png" ||
        imagePath === "assets/shashin.png"
      ) {
        shashin.texture = PIXI.Texture.from(imagePath);
        shashin.visible = true;
        character.visible = false;
        futou.visible = false;
      } else if (imagePath) {
        character.texture = PIXI.Texture.from(imagePath);
        character.visible = true;
        futou.visible = false;
        shashin.visible = false;
      } else {
        character.visible = false;
        futou.visible = false;
        shashin.visible = false;
      }
      // 画面揺れアニメーション
      if (currentStory.se === "sway") {
        let elapsed = 0;
        const swayDuration = 750; // 揺れの継続時間 (ミリ秒)
        const swayAmplitude = 10; // 揺れの振幅 (ピクセル)
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
      }
    }
  }, [textIndex, storyTexts]);

  return <div ref={canvasRef}></div>;
};

export default Prologue;
