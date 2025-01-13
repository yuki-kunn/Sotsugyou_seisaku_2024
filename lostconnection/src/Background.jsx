import React from "react";
import * as PIXI from "pixi.js";

const Background = ({ app }) => {
  const background = PIXI.Sprite.from("assets/shujinnkou_jitaku.png");
  background.name = "background";
  background.width = app.screen.width;
  background.height = app.screen.height;
  return background;
};

export default Background;
