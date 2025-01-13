import React from "react";
import * as PIXI from "pixi.js";

const Character = ({ app }) => {
  const character = new PIXI.Sprite();
  character.name = "character";
  character.x = 50;
  character.y = app.screen.height / 2 - 320;
  character.width = 700;
  character.height = 1050;
  character.visible = false;
  return character;
};

export default Character;
