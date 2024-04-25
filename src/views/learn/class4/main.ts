import { initShaderProgram } from "@/util/webgl";
import fsSource from "./fs.vert?raw";
import vsSource from "./vs.vert?raw";
export function main(gl: WebGL2RenderingContext) {
  const program = initShaderProgram(gl, vsSource, fsSource);
  if (!program) {
    return;
  }
  gl.useProgram(program);

  const matrixLocation = gl.getUniformLocation(program, "u_matrix")!;
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution")!;
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  const postionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer();
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(postionAttributeLocation);
  gl.vertexAttribPointer(postionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column
      0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,

      // top rung
      30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,

      // middle rung
      30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
    ]),
    gl.STATIC_DRAW
  );
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  render(gl, matrixLocation, randomConfig());
}

function randomConfig(): Config {
  return {
    translation: [Math.random() * 100, Math.random() * 100],
    scale: [Math.random() * 2, Math.random() * 2],
    rotation: Math.random() * Math.PI * 2,
  };
}

interface Config {
  translation: [number, number];
  scale: [number, number];
  rotation: number;
}

function render(
  gl: WebGL2RenderingContext,
  matrixLocation: WebGLUniformLocation,
  config: Config
) {
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const translationMatrix = translation(
    config.translation[0],
    config.translation[1]
  );
  const projectionMatrix = projection(gl.canvas.width, gl.canvas.height);
  const rotationMatrix = rotation(config.rotation);
  const scaleMatrix = scaling(config.scale[0], config.scale[1]);
  const moveOriginMatrix = translation(-50, -75);
  let matrix = identity();
  matrix = multiply(matrix, projectionMatrix);
  for (let i = 0; i < 5; i++) {
    matrix = multiply(matrix, translationMatrix);
    matrix = multiply(matrix, rotationMatrix);
    matrix = multiply(matrix, scaleMatrix);
    matrix = multiply(matrix, moveOriginMatrix);
    gl.uniformMatrix3fv(matrixLocation, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 18);
  }
  requestAnimationFrame(() => render(gl, matrixLocation, randomConfig()));
}

type Martix3 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

function identity(): Martix3 {
  return [1, 0, 0, 0, 1, 0, 0, 0, 1];
}

function multiply(a: Martix3, b: Martix3): Martix3 {
  const a00 = a[0 * 3 + 0];
  const a01 = a[0 * 3 + 1];
  const a02 = a[0 * 3 + 2];
  const a10 = a[1 * 3 + 0];
  const a11 = a[1 * 3 + 1];
  const a12 = a[1 * 3 + 2];
  const a20 = a[2 * 3 + 0];
  const a21 = a[2 * 3 + 1];
  const a22 = a[2 * 3 + 2];
  const b00 = b[0 * 3 + 0];
  const b01 = b[0 * 3 + 1];
  const b02 = b[0 * 3 + 2];
  const b10 = b[1 * 3 + 0];
  const b11 = b[1 * 3 + 1];
  const b12 = b[1 * 3 + 2];
  const b20 = b[2 * 3 + 0];
  const b21 = b[2 * 3 + 1];
  const b22 = b[2 * 3 + 2];
  return [
    b00 * a00 + b01 * a10 + b02 * a20,
    b00 * a01 + b01 * a11 + b02 * a21,
    b00 * a02 + b01 * a12 + b02 * a22,
    b10 * a00 + b11 * a10 + b12 * a20,
    b10 * a01 + b11 * a11 + b12 * a21,
    b10 * a02 + b11 * a12 + b12 * a22,
    b20 * a00 + b21 * a10 + b22 * a20,
    b20 * a01 + b21 * a11 + b22 * a21,
    b20 * a02 + b21 * a12 + b22 * a22,
  ];
}

function translation(tx: number, ty: number): Martix3 {
  return [1, 0, 0, 0, 1, 0, tx, ty, 1];
}

function rotation(angleInRadians: number): Martix3 {
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);
  return [c, -s, 0, s, c, 0, 0, 0, 1];
}

function scaling(sx: number, sy: number): Martix3 {
  return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
}

function projection(width: number, height: number): Martix3 {
  return [2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1];
}

// function translate(m: Martix3, tx: number, ty: number): Martix3 {
//   return multiply(m, translation(tx, ty));
// }

// function rotate(m: Martix3, angleInRadians: number): Martix3 {
//   return multiply(m, rotation(angleInRadians));
// }

// function scale(m: Martix3, sx: number, sy: number): Martix3 {
//   return multiply(m, scaling(sx, sy));
// }
