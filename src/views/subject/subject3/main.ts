import { initShaderProgram } from "@/util/webgl";
import fsSource from "./fs.frag?raw";
import vsSource from "./vs.vert?raw";
import { ReadonlyVec3 } from "gl-matrix";
import { rangeMapping } from "@/util/math";
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
    drawRect(canvasWidth / 2 - 150, canvasHeight / 2 - 150, 300, 300);
    // drawRect(0, 0, 300, 300);
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
