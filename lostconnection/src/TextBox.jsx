import React from "react";
import * as PIXI from "pixi.js";

const TextBox = ({ app }) => {
  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 24,
    fill: "#ffffff",
    align: "center"
  });

  const storyText = new PIXI.Text("", style);
  storyText.anchor.set(0.5);
  storyText.x = app.screen.width / 2;
  storyText.y = app.screen.height / 1.17;

  const nameStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 20,
    fill: "#ffffff"
  });

  const nameText = new PIXI.Text("", nameStyle);
  nameText.x = 10;
  nameText.y = 10;

  return [storyText, nameText];
};

export default TextBox;
