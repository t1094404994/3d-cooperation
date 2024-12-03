import { initShaderProgram } from "@/util/webgl";
import fsSource from "./fs.frag?raw";
import vsSource from "./vs.vert?raw";
import { ReadonlyVec3 } from "gl-matrix";
export function main(gl: WebGL2RenderingContext) {
  const program = initShaderProgram(gl, vsSource, fsSource);
  if (!program) return;
  gl.useProgram(program);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const pt1: ReadonlyVec3 = [-0.5, 0.5, 0];
  const pt2: ReadonlyVec3 = [0.5, 0.5, 0];
  const pt3: ReadonlyVec3 = [-0.5, -0.5, 0];
  const pt4: ReadonlyVec3 = [0.5, -0.5, 0];
  const postions = [...pt1, ...pt3, ...pt2, ...pt2, ...pt3, ...pt4];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(postions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  const startColorLocation = gl.getUniformLocation(program, "u_start_color");
  gl.uniform4fv(startColorLocation, [0.2, 1, 0.2, 1]);
  const endColorLocation = gl.getUniformLocation(program, "u_end_color");
  gl.uniform4fv(endColorLocation, [1, 0.2, 1, 1]);
  const lengthLocation = gl.getUniformLocation(program, "u_length");
  gl.uniform1f(lengthLocation, Math.sqrt(2));
  gl.uniform1f(gl.getUniformLocation(program, "u_width"), 1);
  gl.uniform3fv(gl.getUniformLocation(program, "u_start_pt"), pt1);

  function render() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(program);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    // gl.drawArrays(gl.TRIANGLES, 3, 3);
    const l = Math.floor(postions.length / 3 / 3);
    for (let i = 0; i < l; i++) {
      gl.drawArrays(gl.TRIANGLES, i * 3, 3);
    }
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
