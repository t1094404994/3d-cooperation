import { initShaderProgram } from "@/util/webgl";
import fsSource from "./fs.frag?raw";
import vsSource from "./vs.vert?raw";
import { ReadonlyVec3 } from "gl-matrix";
import { linearGradientColor, rangeMapping } from "@/util/math";
export function main(gl: WebGL2RenderingContext) {
  const program = initShaderProgram(gl, vsSource, fsSource);
  if (!program) return;
  const canvasWidth = gl.canvas.width;
  const canvasHeight = gl.canvas.height;
  gl.useProgram(program);
  gl.viewport(0, 0, canvasWidth, canvasHeight);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  function drawRect(x: number, y: number, width: number, height: number) {
    const positionAttributeLocation = gl.getAttribLocation(
      program!,
      "a_position"
    );
    gl.enableVertexAttribArray(positionAttributeLocation);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const leftTopPt = mappingPtToCanvas([x, y, 0], canvasWidth, canvasHeight);
    const rightTopPt = mappingPtToCanvas(
      [x + width, y, 0],
      canvasWidth,
      canvasHeight
    );
    const leftBottomPt = mappingPtToCanvas(
      [x, y + height, 0],
      canvasWidth,
      canvasHeight
    );
    const rightBottomPt = mappingPtToCanvas(
      [x + width, y + height, 0],
      canvasWidth,
      canvasHeight
    );

    const postions = [
      ...leftTopPt,
      ...leftBottomPt,
      ...rightTopPt,
      ...rightTopPt,
      ...leftBottomPt,
      ...rightBottomPt,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(postions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    //test
    const startColorLocation = gl.getUniformLocation(program!, "u_start_color");
    const endColorLocation = gl.getUniformLocation(program!, "u_end_color");
    const startColor: [number, number, number] = [1, 0, 0];
    const endColor: [number, number, number] = [0, 1, 0];
    console.log("start color", startColor);
    console.log("end color", endColor);
    gl.uniform3fv(startColorLocation, startColor);
    gl.uniform3fv(endColorLocation, endColor);
    const startPt = leftTopPt;
    const endPt = rightBottomPt;
    const startPtLocation = gl.getUniformLocation(program!, "u_start_point");
    const endPtLocation = gl.getUniformLocation(program!, "u_end_point");
    gl.uniform3fv(startPtLocation, startPt);
    gl.uniform3fv(endPtLocation, endPt);

    const l = Math.floor(postions.length / 3 / 3);
    for (let i = 0; i < l; i++) {
      gl.drawArrays(gl.TRIANGLES, i * 3, 3);
    }
  }
  function render() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(program);
    drawRect(0, 0, 600, 480);
    // drawRect(canvasWidth / 2 - 150, canvasHeight / 2 - 150, 100, 100);
  }
  render();
  //test

  const line = { start: { x: -1, y: 1 }, end: { x: -1, y: -1 } };
  const startColor: [number, number, number] = [1, 0, 0];
  const endColor: [number, number, number] = [0, 1, 0];
  console.log(
    "test pt",
    linearGradientColor({ x: -0.5, y: 0.1 }, line, startColor, endColor),
    linearGradientColor({ x: -0.1, y: 0.1 }, line, startColor, endColor),
    linearGradientColor({ x: -0.1, y: 0.3 }, line, startColor, endColor)
  );
}

interface LinearGradient {
  colors: Array<ReadonlyVec3>;
  degree: number;
}
interface LineSegmentProps {
  points: [ReadonlyVec3, ReadonlyVec3];
  color: ReadonlyVec3 | LinearGradient;
  width: number;
}

/**
 * tip y-y1/y2-y1 = x-x1/x2-x1
 * @param gl
 * @param param1
 */
function drawLineSegment(
  gl: WebGL2RenderingContext,
  { points, color, width }: LineSegmentProps
) {
  //
}

function mappingPtToCanvas(
  pt: ReadonlyVec3,
  canvasWidth: number,
  canvasHeight: number
): ReadonlyVec3 {
  return [
    rangeMapping(pt[0], 0, canvasWidth, -1, 1),
    rangeMapping(pt[1], 0, canvasHeight, 1, -1),
    rangeMapping(pt[2], 0, 1, 0, 1),
  ];
}
