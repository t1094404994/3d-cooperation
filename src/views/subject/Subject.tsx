import { useEffect, useRef, useState } from "react";
import Subject1 from "./subject1/Subject1";

export default function Subject() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gl, setGl] = useState<WebGL2RenderingContext | null | undefined>(null);
  useEffect(() => {
    setGl(canvasRef.current?.getContext("webgl2"));
  }, []);
  return (
    <>
      <canvas ref={canvasRef} width={640} height={480}>
        your browser do not support canvas
      </canvas>
      <Subject1 gl={gl} />
    </>
  );
}
