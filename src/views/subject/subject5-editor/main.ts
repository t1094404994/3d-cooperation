import { ReadonlyVec2, mat3 } from "gl-matrix";
import { initShaderProgram } from "@/util/webgl";

import fsSource from "./fs.frag?raw";
import vsSource from "./vs.vert?raw";
import { initTransformMat3 } from "@/util/matrix";

export interface RenderProps {
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  angle: number;
  flipLeftRight: boolean;
  flipUpDown: boolean;
}

let program: WebGLProgram | null = null;
export async function renderImage(
  gl: WebGL2RenderingContext,
  props: RenderProps
) {
  console.log("renderImage", props);
  const canvasWidth = gl.canvas.width;
  const canvasHeight = gl.canvas.height;
  if (!program) {
    program = initShaderProgram(gl, vsSource, fsSource);
    if (!program) {
      console.error("Failed to initialize shader program");
      return;
    }
    gl.viewport(0, 0, canvasWidth, canvasHeight);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
  }

  //clear canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  //use program
  gl.useProgram(program);

  //set rect position
  const originPts: ReadonlyVec2[] = [
    [0, 0],
    [props.width, 0],
    [0, props.height],
    [props.width, props.height],
  ];
  const triangles: Array<number> = [
    ...originPts[0],
    ...originPts[2],
    ...originPts[1],
    ...originPts[1],
    ...originPts[2],
    ...originPts[3],
  ];
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangles), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  //set transform matrix
  const resolutionLocation = gl.getUniformLocation(program, "u_matrix");
  const matrix = initTransformMat3({
    ...props,
    width: canvasWidth,
    height: canvasHeight,
  });
  gl.uniformMatrix3fv(resolutionLocation, false, matrix);

  //draw rect
  const l = Math.floor(triangles.length / 3 / 2);
  for (let i = 0; i < l; i++) {
    gl.drawArrays(gl.TRIANGLES, i * 3, 3);
  }
}

interface LinearGradientColor {
  startColor: BaseColorType;
  endColor: BaseColorType;
  startPoint: ReadonlyVec2 | "left" | "right" | "top" | "bottom";
  endPoint: ReadonlyVec2 | "left" | "right" | "top" | "bottom";
}
type BaseColorType = string | [number, number, number, number];
type ColorType = BaseColorType | LinearGradientColor;
interface RectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: ColorType;
  scaleX: number;
  scaleY: number;
  angle: number;
  flipLeftRight: boolean;
  flipUpDown: boolean;
}

function createRectData(_data: Partial<RectProps>): RectProps {
  return {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    color: "#ff0000",
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    flipLeftRight: false,
    flipUpDown: false,
    ..._data,
  };
}
