import { useEffect, useRef, useState } from "react";
import Subject3 from "./subject3/Subject3.tsx";

export default function Subject() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gl, setGl] = useState<WebGL2RenderingContext | null | undefined>(null);
  useEffect(() => {
    setGl(canvasRef.current?.getContext("webgl2"));
  }, []);
  return (
    <>
      <canvas ref={canvasRef} width={600} height={480}>
        your browser do not support canvas
      </canvas>
      <Subject3 gl={gl} />
    </>
  );
}
