import { useEffect, useRef } from "react";
import { main } from "./class5/main";

export default function Learn() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl2")!;
    main(gl);
  });
  return (
    <canvas ref={canvasRef} width={640} height={480}>
      your browser do not support canvas
    </canvas>
  );
}
