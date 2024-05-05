import vsSource from "./vs.vert?raw";
import fsSource from "./fs.frag?raw";

import { M4, Vector3 } from "@/util/matrix";
import { initShaderProgram } from "@/util/webgl";

export function main(gl: WebGL2RenderingContext) {
  const program = initShaderProgram(gl, vsSource, fsSource);
  if (!program) return;

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  setGeometry(gl);

  const normalAttributeLocation = gl.getAttribLocation(program, "a_normal");
  gl.enableVertexAttribArray(normalAttributeLocation);
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  setNormals(gl);

  const fRotationRadians = 0;

  const worldViewProjectionLocation = gl.getUniformLocation(
    program,
    "u_worldViewProjection"
  );
  const worldInverseTransposeLocation = gl.getUniformLocation(
    program,
    "u_worldInverseTranspose"
  );
  const colorLocation = gl.getUniformLocation(program, "u_color");
  const reverseLightDirectionLocation = gl.getUniformLocation(
    program,
    "u_reverseLightDirection"
  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  render(
    gl,
    program,
    fRotationRadians,
    worldViewProjectionLocation,
    worldInverseTransposeLocation,
    colorLocation,
    reverseLightDirectionLocation
  );
}

function render(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  fRotationRadians: number,
  worldViewProjectionLocation: WebGLUniformLocation | null,
  worldInverseTransposeLocation: WebGLUniformLocation | null,
  colorLocation: WebGLUniformLocation | null,
  reverseLightDirectionLocation: WebGLUniformLocation | null
) {
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.useProgram(program);

  const fieldOfViewRadians = Math.PI / 4;
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 1;
  const zFar = 2000;
  const projectionMatrix = M4.perspective(
    fieldOfViewRadians,
    aspect,
    zNear,
    zFar
  );

  const camera: Vector3 = [100, 150, 200];
  const target: Vector3 = [0, 35, 0];
  const up: Vector3 = [0, 1, 0];
  const cameraMatrix = M4.lookAt(camera, target, up);
  const viewMatrix = M4.inverse(cameraMatrix);
  const viewProjectionMatrix = M4.multiply(projectionMatrix, viewMatrix);
  const worldMatrix = M4.yRotation(fRotationRadians);
  const worldViewProjectionMatrix = M4.multiply(
    viewProjectionMatrix,
    worldMatrix
  );
  const worldInverseMatrix = M4.inverse(worldMatrix);
  const worldInverseTransposeMatrix = M4.transpose(worldInverseMatrix);

  gl.uniformMatrix4fv(
    worldViewProjectionLocation,
    false,
    worldViewProjectionMatrix
  );
  gl.uniformMatrix4fv(
    worldInverseTransposeLocation,
    false,
    worldInverseTransposeMatrix
  );
  gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]);
  gl.uniform3fv(reverseLightDirectionLocation, M4.normalize([0.5, 0.7, 1]));
  gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);

  requestAnimationFrame(() => {
    render(
      gl,
      program,
      fRotationRadians + 0.01,
      worldViewProjectionLocation,
      worldInverseTransposeLocation,
      colorLocation,
      reverseLightDirectionLocation
    );
  });
}

// Fill the current ARRAY_BUFFER buffer
// with the values that define a letter 'F'.
function setGeometry(gl: WebGL2RenderingContext) {
  const positions = new Float32Array([
    // left column front
    0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0,

    // top rung front
    30, 0, 0, 30, 30, 0, 100, 0, 0, 30, 30, 0, 100, 30, 0, 100, 0, 0,

    // middle rung front
    30, 60, 0, 30, 90, 0, 67, 60, 0, 30, 90, 0, 67, 90, 0, 67, 60, 0,

    // left column back
    0, 0, 30, 30, 0, 30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30,

    // top rung back
    30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30, 30, 100, 0, 30, 100, 30, 30,

    // middle rung back
    30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30, 67, 60, 30, 67, 90, 30,

    // top
    0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30, 0, 0, 30,

    // top rung right
    100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0, 30,

    // under top rung
    30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0,

    // between top rung and middle
    30, 30, 0, 30, 60, 30, 30, 30, 30, 30, 30, 0, 30, 60, 0, 30, 60, 30,

    // top of middle rung
    30, 60, 0, 67, 60, 30, 30, 60, 30, 30, 60, 0, 67, 60, 0, 67, 60, 30,

    // right of middle rung
    67, 60, 0, 67, 90, 30, 67, 60, 30, 67, 60, 0, 67, 90, 0, 67, 90, 30,

    // bottom of middle rung.
    30, 90, 0, 30, 90, 30, 67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0,

    // right of bottom
    30, 90, 0, 30, 150, 30, 30, 90, 30, 30, 90, 0, 30, 150, 0, 30, 150, 30,

    // bottom
    0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150, 0,

    // left side
    0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0,
  ]);

  // Center the F around the origin and Flip it around. We do this because
  // we're in 3D now with and +Y is up where as before when we started with 2D
  // we had +Y as down.

  // We could do by changing all the values above but I'm lazy.
  // We could also do it with a matrix at draw time but you should
  // never do stuff at draw time if you can do it at init time.
  let matrix = M4.xRotation(Math.PI);
  matrix = M4.translate(matrix, -50, -75, -15);

  for (let ii = 0; ii < positions.length; ii += 3) {
    const vector = M4.transformVector(matrix, [
      positions[ii + 0],
      positions[ii + 1],
      positions[ii + 2],
      1,
    ]);
    positions[ii + 0] = vector[0];
    positions[ii + 1] = vector[1];
    positions[ii + 2] = vector[2];
  }

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

function setNormals(gl: WebGL2RenderingContext) {
  const normals = new Float32Array([
    // left column front
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

    // top rung front
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

    // middle rung front
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

    // left column back
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

    // top rung back
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

    // middle rung back
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

    // top
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

    // top rung right
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

    // under top rung
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

    // between top rung and middle
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

    // top of middle rung
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

    // right of middle rung
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

    // bottom of middle rung.
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

    // right of bottom
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

    // bottom
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

    // left side
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
}
