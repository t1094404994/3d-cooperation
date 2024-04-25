import { createAndSetupTexture, initShaderProgram } from "@/util/webgl";
import fs from "./fs.frag?raw";
import vs from "./vs.vert?raw";
import sampleUrl from "./sample.png";

const kernels = {
  normal: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  gaussianBlur: [0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045],
  gaussianBlur2: [1, 2, 1, 2, 4, 2, 1, 2, 1],
  gaussianBlur3: [0, 1, 0, 1, 1, 1, 0, 1, 0],
  unsharpen: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
  sharpness: [0, -1, 0, -1, 5, -1, 0, -1, 0],
  sharpen: [-1, -1, -1, -1, 16, -1, -1, -1, -1],
  edgeDetect: [
    -0.125, -0.125, -0.125, -0.125, 1, -0.125, -0.125, -0.125, -0.125,
  ],
  edgeDetect2: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
  edgeDetect3: [-5, 0, 0, 0, 0, 0, 0, 0, 5],
  edgeDetect4: [-1, -1, -1, 0, 0, 0, 1, 1, 1],
  edgeDetect5: [-1, -1, -1, 2, 2, 2, -1, -1, -1],
  edgeDetect6: [-5, -5, -5, -5, 39, -5, -5, -5, -5],
  sobelHorizontal: [1, 2, 1, 0, 0, 0, -1, -2, -1],
  sobelVertical: [1, 0, -1, 2, 0, -2, 1, 0, -1],
  previtHorizontal: [1, 1, 1, 0, 0, 0, -1, -1, -1],
  previtVertical: [1, 0, -1, 1, 0, -1, 1, 0, -1],
  boxBlur: [0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111],
  triangleBlur: [
    0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625,
  ],
  emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
};

export interface Effect {
  name: keyof typeof kernels;
  on?: boolean;
}

export type EffectList = Array<Effect>;

let originalImageTexture: WebGLTexture | null = null;
const textures: Array<WebGLTexture> = [];
const framebuffers: Array<WebGLFramebuffer> = [];

let resolutionLocation: WebGLUniformLocation | null = null;
let imageLocation: WebGLUniformLocation | null = null;
let kernelLocation: WebGLUniformLocation | null = null;
let kernelWeightLocation: WebGLUniformLocation | null = null;
let flipYLocation: WebGLUniformLocation | null = null;
let vao: WebGLVertexArrayObject | null = null;
let width: number = 0;
let height: number = 0;
let hasInitialized = false;
export async function main(
  gl: WebGL2RenderingContext,
  effectsList: EffectList
) {
  if (hasInitialized) return;
  hasInitialized = true;
  const image = await loadImage(sampleUrl);
  if (!image) return;
  width = image.width;
  height = image.height;
  const program = initShaderProgram(gl, vs, fs);
  if (!program) return;
  gl.useProgram(program);
  const postionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");

  resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  imageLocation = gl.getUniformLocation(program, "u_image");
  kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
  kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
  flipYLocation = gl.getUniformLocation(program, "u_flipY");

  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const postionBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(postionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, postionBuffer);
  gl.vertexAttribPointer(postionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  setRectangle(gl, 0, 0, image.width, image.height);

  const texcoordBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(texcoordAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
    gl.STATIC_DRAW
  );
  gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  originalImageTexture = createAndSetupTexture(gl);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  for (let i = 0, l = 2; i < l; i++) {
    textures.push(createAndSetupTexture(gl));
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      image.width,
      image.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    const fob = gl.createFramebuffer()!;
    framebuffers.push(fob);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fob);

    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      attachmentPoint,
      gl.TEXTURE_2D,
      textures[i],
      0
    );
  }
  render(gl, effectsList);
}

export function render(gl: WebGL2RenderingContext, effectsList: EffectList) {
  function computeKernelWeight(kernel: Array<number>) {
    const weight = kernel.reduce((prev, curr) => prev + curr);
    return weight <= 0 ? 1 : weight;
  }

  function setFrameBuffer(
    fbo: WebGLFramebuffer | null,
    width: number,
    height: number
  ) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.uniform2f(resolutionLocation, width, height);
    gl.viewport(0, 0, width, height);
  }

  function drawWithKernel(name: keyof typeof kernels) {
    gl.uniform1fv(kernelLocation, kernels[name]);
    gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindVertexArray(vao);
  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);
  gl.uniform1i(imageLocation, 0);
  gl.uniform1f(flipYLocation, 1);
  let count = 0;
  effectsList.forEach((effect) => {
    if (effect.on) {
      setFrameBuffer(framebuffers[count & 1], width, height);
      drawWithKernel(effect.name);

      gl.bindTexture(gl.TEXTURE_2D, textures[count & 1]);
      count++;
    }
  });
  gl.uniform1f(flipYLocation, -1);
  setFrameBuffer(null, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  drawWithKernel("normal");
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
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
