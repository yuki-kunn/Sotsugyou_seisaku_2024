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
      "https://script.google.com/macros/s/AKfycbwNZuwy1gBdrdl3apLPEIy-oKW76pi7EtNAKp9L0d4FEuDTU_gx268DUQA59qa9PJR-/exec?action=chaP1"
    )
      .then((response) => response.json())
      .then((data) => {
        const cleanedData = data.items.map((item) => ({
          name: item.name || "",
          text: item.text || "",
          image: item.image || "",
          character: item.character || "",
          misaki: item.misaki || ""
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

    // 主人公スプライトの設定
    const character = new PIXI.Sprite();
    character.name = "character";
    character.x = 50;
    character.y = app.screen.height / 2 - 320;
    character.width = 700;
    character.height = 1050;
    character.visible = false;
    app.stage.addChild(character);

    // Misakiスプライトの設定
    const misaki = new PIXI.Sprite();
    misaki.name = "misaki";
    misaki.x = app.screen.width - 750;
    misaki.y = app.screen.height / 2 - 320;
    misaki.width = 700;
    misaki.height = 1050;
    misaki.visible = false;
    app.stage.addChild(misaki);

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

    // 話者テキストスプライトの設定
    const nameBox = new PIXI.Graphics();
    nameBox.beginFill(0x4682b4);
    nameBox.drawRoundedRect(0, 0, 150, 40, 10);
    nameBox.endFill();
    nameBox.x = textBox.x - textBox.width / 2 + 10;
    nameBox.y = textBox.y - textBox.height / 2 - 40;
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

    app.stage.addChild(textBox);
    app.stage.addChild(storyText);
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

      const speakerText = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Text && child.style.fontSize === 20
      );

      const character = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Sprite && child.name === "character"
      );

      const misaki = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Sprite && child.name === "misaki"
      );

      const background = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Sprite && child.name === "background"
      );

      const currentStory = storyTexts[textIndex] || {};

      // 話者テキストを更新
      speakerText.text = currentStory.name || "";

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

      // 主人公スプライトの切り替え
      if (character && currentStory.character) {
        character.texture = PIXI.Texture.from(currentStory.character);
        character.visible = true;
      } else if (character) {
        character.visible = false;
      }

      // Misakiスプライトの切り替え
      if (misaki && currentStory.misaki) {
        misaki.texture = PIXI.Texture.from(currentStory.misaki);
        misaki.visible = true;
      } else if (misaki) {
        misaki.visible = false;
      }
    }
  }, [textIndex, storyTexts]);

  return <div ref={canvasRef}></div>;
};

export default Chapter1;
