import React from "react";
import * as PIXI from "pixi.js";

const Futou = ({ app }) => {
  const futou = new PIXI.Sprite();
  futou.name = "futou";
  futou.x = app.screen.width / 2 - 250;
  futou.y = app.screen.height / 2 - 225;
  futou.width = 525;
  futou.height = 375;
  futou.visible = false;
  return futou;
};

export default Futou;
