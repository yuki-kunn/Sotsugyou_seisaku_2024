import React, { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import Background from "./Background";
import Character from "./Character";
import Futou from "./Futou";
import Shashin from "./Shashin";
import TextBox from "./TextBox";

const PixiApp = ({ storyTexts, textIndex, setTextIndex }) => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1099bb,
      resizeTo: window
    });
    appRef.current = app;
    canvasRef.current.appendChild(app.view);

    const stage = app.stage;
    const components = [
      <Background app={app} />,
      <Character app={app} />,
      <Futou app={app} />,
      <Shashin app={app} />,
      <TextBox app={app} />
    ];
    components.forEach((Component) => stage.addChild(Component));

    const onResize = () =>
      app.renderer.resize(window.innerWidth, window.innerHeight);
    const onClick = () =>
      setTextIndex((prev) => (prev + 1) % storyTexts.length);

    window.addEventListener("resize", onResize);
    app.view.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("resize", onResize);
      app.view.removeEventListener("click", onClick);
      app.destroy(true, { children: true });
    };
  }, [storyTexts]);

  return <div ref={canvasRef}></div>;
};

export default PixiApp;
