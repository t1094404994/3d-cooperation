import { initShaderProgram } from "@/util/webgl";
import fsSource from "./fs.frag?raw";
import vsSource from "./vs.vert?raw";
import { ReadonlyVec3, mat4 } from "gl-matrix";
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
  const pt1: ReadonlyVec3 = [150, 0, 0];
  const pt2: ReadonlyVec3 = [0, 150, 0];
  const pt3: ReadonlyVec3 = [-150, 0, 0];
  const pt4: ReadonlyVec3 = [10, 10, 150];
  const postions = [
    ...pt1,
    ...pt2,
    ...pt4,
    ...pt1,
    ...pt3,
    ...pt2,
    ...pt2,
    ...pt3,
    ...pt4,
    ...pt1,
    ...pt4,
    ...pt3,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(postions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  gl.enableVertexAttribArray(colorAttributeLocation);
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  const color1 = [0, 255, 0];
  const color2 = [255, 0, 255];
  const color3 = [0, 0, 255];
  const color4 = [255, 255, 0];
  const colors = [
    ...color1,
    ...color1,
    ...color1,
    ...color2,
    ...color2,
    ...color2,
    ...color3,
    ...color3,
    ...color3,
    ...color4,
    ...color4,
    ...color4,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    colorAttributeLocation,
    3,
    gl.UNSIGNED_BYTE,
    true,
    0,
    0
  );

  //矩阵变换
  const uniformMatrix = gl.getUniformLocation(program, "u_matrix");
  let rotate = 0;
  // const depth = 300;
  function render() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(program);
    const matrix = mat4.create();
    //归一化
    matrix[0] = 2 / gl.canvas.width;
    matrix[5] = 2 / gl.canvas.height;
    matrix[10] = 0;
    //透视投影
    // matrix[14] = 0.9;
    // matrix[15] = 1 - 150 / depth;
    //旋转中心
    // mat4.rotateX(matrix, matrix, rotate);
    // mat4.rotateX(matrix, matrix, Math.PI / 8);
    // mat4.rotateY(matrix, matrix, rotate);
    // mat4.rotateZ(matrix, matrix, rotate);

    rotate += 0.01;
    if (rotate > Math.PI * 2) rotate = 0;
    gl.uniformMatrix4fv(uniformMatrix, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 12);
    requestAnimationFrame(render);
  }
  render();
}
