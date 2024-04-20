import { useState } from "react";
import { EffectList, Effect, main, render } from "./main";

interface Subject1Props {
  gl: WebGL2RenderingContext | null | undefined;
}
export default function Subject1(props: Subject1Props) {
  const [effectsList, setEffectList] = useState<EffectList>([
    { name: "normal", on: true },
    { name: "gaussianBlur" },
    { name: "gaussianBlur2", on: true },
    { name: "gaussianBlur3", on: true },
    { name: "unsharpen" },
    { name: "sharpness" },
    { name: "sharpen" },
    { name: "edgeDetect" },
    { name: "edgeDetect2" },
    { name: "edgeDetect3" },
    { name: "edgeDetect4" },
    { name: "edgeDetect5" },
    { name: "edgeDetect6" },
    { name: "sobelHorizontal" },
    { name: "sobelVertical" },
    { name: "previtHorizontal" },
    { name: "previtVertical" },
    { name: "boxBlur" },
    { name: "triangleBlur" },
    { name: "emboss" },
  ]);
  if (props.gl) {
    main(props.gl, effectsList);
  }

  const onchange = (effect: Effect) => {
    const newList = effectsList.map((item) => {
      if (item.name === effect.name) {
        return { ...item, on: !item.on };
      }
      return item;
    });
    setEffectList(newList);
    if (props.gl) {
      render(props.gl, newList);
    }
  };
  return (
    <ul>
      {effectsList.map((effect, index) => (
        <li key={index}>
          <input
            type="checkbox"
            checked={effect.on}
            onChange={() => onchange(effect)}
          />
          {effect.name}
        </li>
      ))}
    </ul>
  );
}
