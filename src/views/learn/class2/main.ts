import { initShaderProgram } from "@/util/webgl";
import vsSource from "./vs.vert?raw";
import fsSource from "./fs.frag?raw";
import { mat3 } from "gl-matrix";
export function main(gl: WebGL2RenderingContext) {
  //创建并连接着色器程序
  const program = initShaderProgram(gl, vsSource, fsSource);
  if (!program) return;
  //获取着色器程序中的属性位置
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const colorLocation = gl.getAttribLocation(program, "a_color");
  const matrixLocation = gl.getUniformLocation(program, "u_matrix");

  //创建并绑定缓冲区
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  //创建并绑定VAO
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  //启用属性并指定属性位置和数据格式
  gl.enableVertexAttribArray(positionAttributeLocation);
  const size = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const vertexOffset = 0;
  //将缓冲区绑定到属性位置
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    vertexOffset
  );
  //从归一化设备坐标转换到屏幕坐标
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  //清除画布
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //使用着色器程序和VAO绘制
  gl.useProgram(program);
  gl.bindVertexArray(vao);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([50, 50, 50, 150, 150, 150, 150, 150, 50, 50, 150, 50]),
    gl.STATIC_DRAW
  );

  //colors
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);
  gl.enableVertexAttribArray(colorLocation);
  const sizeColor = 3;
  const typeColor = gl.UNSIGNED_BYTE;
  const normalizeColor = true;
  const strideColor = 0;
  const vertexOffsetColor = 0;
  gl.vertexAttribPointer(
    colorLocation,
    sizeColor,
    typeColor,
    normalizeColor,
    strideColor,
    vertexOffsetColor
  );

  const translation = new Float32Array([100, 100]);
  const angleInradians = 0;
  const scale = new Float32Array([1, 1]);
  const matrix = mat3.projection(
    mat3.create(),
    gl.canvas.width,
    gl.canvas.height
  );
  mat3.translate(matrix, matrix, translation);
  mat3.rotate(matrix, matrix, angleInradians);
  mat3.scale(matrix, matrix, scale);
  gl.uniformMatrix3fv(matrixLocation, false, matrix);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function setColors(gl: WebGL2RenderingContext) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 256,
    ]),
    gl.STATIC_DRAW
  );
}
