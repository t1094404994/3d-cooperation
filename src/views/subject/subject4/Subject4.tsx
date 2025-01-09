import { useEffect, useState } from "react";
import { renderImage } from "./main";

interface Subject1Props {
  gl: WebGL2RenderingContext | null | undefined;
}
export default function Subject1(props: Subject1Props) {
  const [textureSize, setTextureSize] = useState({ width: 100, height: 100 });
  const onChangeSize = (width: number, height: number) => {
    if (isNaN(width) || isNaN(height)) {
      console.error("width and height must be a number");
      return;
    }
    setTextureSize({ width, height });
    if (props.gl) {
      renderImage(props.gl, {
        size: { width, height },
        postion: texturePostion,
        flipLeftRight,
        flipUpDown,
      });
    }
  };
  const [texturePostion, setTexturePostion] = useState({ x: 0, y: 0 });
  const onChangePostion = (x: number, y: number) => {
    if (isNaN(x) || isNaN(y)) {
      console.error("x and y must be a number");
      return;
    }
    setTexturePostion({ x, y });
    if (props.gl) {
      renderImage(props.gl, {
        size: textureSize,
        postion: { x, y },
        flipLeftRight,
        flipUpDown,
      });
    }
  };
  const [flipLeftRight, setFlipLeftRight] = useState(false);
  const onChangeFlipLeftRight = (flipLeftRight: boolean) => {
    setFlipLeftRight(flipLeftRight);
    if (props.gl) {
      renderImage(props.gl, {
        size: textureSize,
        postion: texturePostion,
        flipLeftRight,
        flipUpDown,
      });
    }
  };
  const [flipUpDown, setFlipUpDown] = useState(false);
  const onChangeFlipUpDown = (flipUpDown: boolean) => {
    setFlipUpDown(flipUpDown);
    if (props.gl) {
      renderImage(props.gl, {
        size: textureSize,
        postion: texturePostion,
        flipLeftRight,
        flipUpDown,
      });
    }
  };

  useEffect(() => {
    if (props.gl) {
      renderImage(props.gl, {
        size: textureSize,
        postion: texturePostion,
        flipLeftRight,
        flipUpDown,
      });
    }
  }, []);
  return (
    <div>
      <h2>Subject3</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <span style={{ minWidth: "80px" }}>width {textureSize.width}</span>
        <input
          type="range"
          min={100}
          max={640}
          step={1}
          value={textureSize.width}
          onChange={(e) => onChangeSize(+e.target.value, textureSize.height)}
        />
        <span style={{ minWidth: "80px" }}>height {textureSize.height}</span>
        <input
          type="range"
          min="100"
          max="480"
          step="1"
          value={textureSize.height}
          onChange={(e) => onChangeSize(textureSize.width, +e.target.value)}
        />
        <span style={{ minWidth: "80px" }}>x {texturePostion.x}</span>
        <input
          type="range"
          min={0}
          max={640}
          step={1}
          value={texturePostion.x}
          onChange={(e) => onChangePostion(+e.target.value, texturePostion.y)}
        />
        <span style={{ minWidth: "80px" }}>y {texturePostion.y}</span>
        <input
          type="range"
          min={0}
          max={480}
          step={1}
          value={texturePostion.y}
          onChange={(e) => onChangePostion(texturePostion.x, +e.target.value)}
        />
        <span style={{ minWidth: "80px" }}>flipLeftRight</span>
        <input
          type="checkbox"
          onChange={(e) => {
            onChangeFlipLeftRight(e.target.checked);
          }}
        />
        <span style={{ minWidth: "80px" }}>flipUpDown</span>
        <input
          type="checkbox"
          onChange={(e) => {
            onChangeFlipUpDown(e.target.checked);
          }}
        />
      </div>
    </div>
  );
}
