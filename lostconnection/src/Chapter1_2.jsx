import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { useNavigate } from "react-router-dom";

const Chapter1_2 = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const [textIndex, setTextIndex] = useState(0);
  const [storyTexts, setStoryTexts] = useState([]);
  const [showChoices, setShowChoices] = useState(false);
  const navigate = useNavigate();

  // Google Apps Scriptからシナリオデータを取得
  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbzdNGNxJm-lbQmFAEXyiz_RhaadYw1Z9JVr2uhCfbLaYmCPPTAZAcAjLqH8Z82_EHTH/exec?action=chaP1_2"
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
    const background = PIXI.Sprite.from("assets/kichinaka.png");
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

      if (currentStory.text === "一章～完～") {
        navigate("/chapter2");
      }

      // 日記 (中央表示)
      if (
        imagePath === "assets/nikki.png" ||
        imagePath === "assets/futou.png"
      ) {
        obj.texture = PIXI.Texture.from(imagePath);
        obj.visible = true;
        character.visible = false;
        partner.visible = false;
      } else if (imagePath === "assets/ituki_house.png") {
        background.texture = PIXI.Texture.from(imagePath);
        character.visible = false;
        partner.visible = false;
      }

      // 美咲 (右側に表示)
      else if (imagePath === "assets/misaki.png") {
        partner.texture = PIXI.Texture.from(imagePath);
        partner.visible = true;
        obj.visible = false;
      }

      // 主人公 (左側に表示)
      else if (imagePath === "assets/shujinnkou.png") {
        character.texture = PIXI.Texture.from(imagePath);
        character.visible = true;
        obj.visible = false;
      }
      // 他の画像がない場合
      else {
        obj.visible = false;
        character.visible = false;
        partner.visible = false;
      }
    }
  }, [textIndex, storyTexts]);

  return <div ref={canvasRef} style={{ width: "100%", height: "100%" }}></div>;
};

export default Chapter1_2;
