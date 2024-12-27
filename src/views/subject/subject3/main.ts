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
    //
    const pt1 = [
      rangeMapping(x, 0, canvasWidth, -1, 1),
      rangeMapping(y, 0, canvasHeight, 1, -1),
      0,
    ];
    const pt2 = [
      rangeMapping(x + width, 0, canvasWidth, -1, 1),
      rangeMapping(y, 0, canvasHeight, 1, -1),
      0,
    ];
    const pt3 = [
      rangeMapping(x, 0, canvasWidth, -1, 1),
      rangeMapping(y + height, 0, canvasHeight, 1, -1),
      0,
    ];
    const pt4 = [
      rangeMapping(x + width, 0, canvasWidth, -1, 1),
      rangeMapping(y + height, 0, canvasHeight, 1, -1),
      0,
    ];
    const postions = [...pt1, ...pt3, ...pt2, ...pt2, ...pt3, ...pt4];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(postions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    //test
    const startColorLocation = gl.getUniformLocation(program!, "u_start_color");
    const endColorLocation = gl.getUniformLocation(program!, "u_end_color");
    const startColor: [number, number, number] = [
      Math.random(),
      Math.random(),
      Math.random(),
    ];
    const endColor: [number, number, number] = [
      Math.random(),
      Math.random(),
      Math.random(),
    ];
    console.log("start color", startColor);
    console.log("end color", endColor);
    gl.uniform3fv(startColorLocation, startColor);
    gl.uniform3fv(endColorLocation, endColor);
    const startPt = [Math.random() * 2 - 1, Math.random() * 2 - 1, 0];
    const endPt = [Math.random() * 2 - 1, Math.random() * 2 - 1, 0];
    // const a = pt3[1] - pt1[1];
    // const b = pt1[0] - pt3[0];
    // const c = pt3[0] * pt1[1] - pt1[0] * pt3[1];
    // const d = Math.sqrt(a * a + b * b);
    const a = endPt[1] - startPt[1];
    const b = startPt[0] - endPt[0];
    const c = endPt[0] * startPt[1] - startPt[0] * endPt[1];
    const d = Math.sqrt(a * a + b * b);
    console.log("start pt", pt1);
    console.log("end pt", pt3);

    const aLocation = gl.getUniformLocation(program!, "u_a");
    aLocation && gl.uniform1f(aLocation, a);
    const bLocation = gl.getUniformLocation(program!, "u_b");
    bLocation && gl.uniform1f(bLocation, b);
    const cLocation = gl.getUniformLocation(program!, "u_c");
    cLocation && gl.uniform1f(cLocation, c);
    const dLocation = gl.getUniformLocation(program!, "u_d");
    dLocation && gl.uniform1f(dLocation, d);
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
    drawRect(0, 0, 600, 500);
    // drawRect(canvasWidth / 2 - 150, canvasHeight / 2 - 150, 100, 100);
  }
  render();
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
