import { useState } from "react";
import { RenderProps, renderImage } from "./main";

interface Subject1Props {
  gl: WebGL2RenderingContext | null | undefined;
}
export default function Subject1(props: Subject1Props) {
  const [renderProps, setRenderProps] = useState<RenderProps>({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    flipLeftRight: false,
    flipUpDown: false,
  });

  const updateRenderProps = (newProps: Partial<RenderProps>) => {
    setRenderProps((prev) => ({ ...prev, ...newProps }));
    if (props.gl) {
      const newData = { ...renderProps, ...newProps };
      renderImage(props.gl, newData);
    }
  };

  const getMax = (key: string) => {
    if (key === "angle") {
      return 360;
    } else if (key === "x") {
      return 640;
    } else if (key === "scaleX" || key === "scaleY") {
      return 10;
    } else {
      return 480;
    }
  };
  return (
    <div>
      <h2>Subject3</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {Object.entries(renderProps).map(([key, value]) => (
          <div key={key}>
            <label>{key}</label>
            <input
              id={key}
              type={
                key === "flipLeftRight" || key === "flipUpDown"
                  ? "checkbox"
                  : "range"
              }
              value={value}
              onChange={(e) =>
                updateRenderProps({
                  [key]:
                    e.target.type === "checkbox"
                      ? e.target.checked
                      : Number(e.target.value),
                })
              }
              min={0}
              max={getMax(key)}
              step={1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
