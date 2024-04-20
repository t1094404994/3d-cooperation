import { initShaderProgram } from "@/util/webgl";
import fs from "./fs.frag?raw";
import vs from "./vs.vert?raw";
import sampleUrl from "./sample.png";
import { mat3 } from "gl-matrix";

export async function main(gl: WebGL2RenderingContext) {
  const image = await loadImage(sampleUrl);
  if (!image) return;
  const program = initShaderProgram(gl, vs, fs);
  if (!program) return;
  //创建并绑定VAO
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  //从归一化设备坐标转换到屏幕坐标
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  //清除画布
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //使用着色器程序和VAO绘制
  gl.useProgram(program);
  gl.bindVertexArray(vao);

  //设置顶点数据
  const postionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const postionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, postionBuffer);
  gl.enableVertexAttribArray(postionAttributeLocation);
  gl.vertexAttribPointer(postionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, 0, 300, 300, 300, 0, 0, 300, 0, 300, 300]),
    gl.STATIC_DRAW
  );

  //设置纹理数据
  const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
  const imageLocation = gl.getUniformLocation(program, "u_image");
  gl.enableVertexAttribArray(texcoordAttributeLocation);
  const texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  //fit模式测试 宽度填满
  const heightAspect = image.width / image.height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0,
      0,
      0,
      heightAspect,
      1,
      heightAspect,
      0,
      0,
      1,
      0,
      1,
      heightAspect,
    ]),
    gl.STATIC_DRAW
  );
  gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(imageLocation, 0);

  //设置转换矩阵数据
  const matrixLocation = gl.getUniformLocation(program, "u_matrix");
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

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
