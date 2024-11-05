import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const [textIndex, setTextIndex] = useState(0);

  const storyTexts = [
    "ここは最初のテキストです。",
    "次に進むと新しいテキストが表示されます。",
    "これが最後のテキストです。"
  ];

  useEffect(() => {
    // Pixiアプリケーションの作成
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1099bb,
      resizeTo: window
    });
    appRef.current = app;
    canvasRef.current.appendChild(app.view);

    // 背景画像の設定
    const background = PIXI.Sprite.from("/path/to/background.jpg");
    app.stage.addChild(background);

    // キャラクター画像の設定
    const character = PIXI.Sprite.from("/path/to/character.png");
    character.x = 400;
    character.y = 300;
    app.stage.addChild(character);

    // テキスト表示の設定
    const style = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 24,
      fill: "#ffffff"
    });
    const storyText = new PIXI.Text(storyTexts[textIndex], style);
    storyText.y = app.screen.height - 100; // 下部にテキストを表示
    storyText.x = 20;
    app.stage.addChild(storyText);

    // リサイズ時の処理
    const onResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
      background.width = app.screen.width;
      background.height = app.screen.height;
      storyText.y = app.screen.height - 100; // リサイズ後もテキストが下部に表示されるように
    };

    // 初期サイズ設定
    onResize();

    // リサイズイベントの監視
    window.addEventListener("resize", onResize);

    // クリックイベントでテキスト進行
    const onClick = () => {
      setTextIndex((prevIndex) => (prevIndex + 1) % storyTexts.length);
    };
    app.view.addEventListener("click", onClick);

    // クリーンアップ
    return () => {
      window.removeEventListener("resize", onResize);
      app.view.removeEventListener("click", onClick);
      app.destroy(true, { children: true });
    };
  }, []);

  // テキスト更新の監視
  useEffect(() => {
    if (appRef.current) {
      const storyText = appRef.current.stage.children.find(
        (child) => child instanceof PIXI.Text
      );
      storyText.text = storyTexts[textIndex];
    }
  }, [textIndex]);

  return <div ref={canvasRef}></div>;
};

export default GameCanvas;
