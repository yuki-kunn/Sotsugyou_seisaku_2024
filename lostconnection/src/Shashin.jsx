import React from "react";
import * as PIXI from "pixi.js";

const Shashin = ({ app }) => {
  const shashin = new PIXI.Sprite();
  shashin.name = "shashin";
  shashin.anchor.set(0.5);
  shashin.x = app.screen.width / 2;
  shashin.y = app.screen.height / 2;
  shashin.width = 500;
  shashin.height = 300;
  shashin.rotation = 0.1;
  shashin.visible = false;
  return shashin;
};

export default Shashin;
