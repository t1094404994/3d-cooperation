import { initShaderProgram } from "@/util/webgl";
import vsSource from "./vs.vert?raw";
import fsSource from "./fs.frag?raw";
export function main(gl: WebGL2RenderingContext) {
  //创建并连接着色器程序
  const program = initShaderProgram(gl, vsSource, fsSource);
  if (!program) return;
  //获取着色器程序中的属性位置
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const resloutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );
  const colorLocation = gl.getUniformLocation(program, "u_color");
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
  gl.uniform2f(resloutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.bindVertexArray(vao);

  for (let i = 0; i < 50; i++) {
    setRectangle(
      gl,
      randomInt(300),
      randomInt(300),
      randomInt(300),
      randomInt(300)
    );
    gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }
}

function randomInt(range: number) {
  return Math.floor(Math.random() * range);
}

function setRectangle(
  gl: WebGL2RenderingContext,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}
