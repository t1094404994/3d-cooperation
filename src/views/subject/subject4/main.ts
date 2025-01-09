import fsSource from "./fs.frag?raw";
import vsSource from "./vs.vert?raw";
import imgUrl from "./sample.png";

function initImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

interface RenderProps {
  size: { width: number; height: number };
  postion: { x: number; y: number };
  flipLeftRight?: boolean;
  flipUpDown?: boolean;
}

let imageTexture: WebGLTexture | null = null;
let program: WebGLProgram | null = null;
export async function renderImage(
  gl: WebGL2RenderingContext,
  props: RenderProps
) {
  console.log("renderImage", props);
  const canvasWidth = gl.canvas.width;
  const canvasHeight = gl.canvas.height;
  if (!program) {
    program = initShaderProgram(gl, vsSource, fsSource);
    if (!program) {
      console.error("Failed to initialize shader program");
      return;
    }
    gl.viewport(0, 0, canvasWidth, canvasHeight);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
  }
  if (!imageTexture) {
    const imageHtmlElement = await initImage(imgUrl);
    // Create a texture.
    imageTexture = gl.createTexture();
    if (!imageTexture) {
      console.error("Failed to create texture");
      return;
    }

    // make unit 0 the active texture uint
    // (ie, the unit all other texture commands will affect
    gl.activeTexture(gl.TEXTURE0 + 0);

    // Bind it to texture unit 0' 2D bind point
    gl.bindTexture(gl.TEXTURE_2D, imageTexture);

    // Set the parameters so we don't need mips and so we're not filtering
    // and we don't repeat
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    const mipLevel = 0; // the largest mip
    const internalFormat = gl.RGBA; // format we want in the texture
    const srcFormat = gl.RGBA; // format of data we are supplying
    const srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
    gl.texImage2D(
      gl.TEXTURE_2D,
      mipLevel,
      internalFormat,
      srcFormat,
      srcType,
      imageHtmlElement
    );
    // Tell the shader to get the texture from texture unit 0
    const imageLocation = gl.getUniformLocation(program, "u_texture");
    gl.uniform1i(imageLocation, 0);
  }

  //clear canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  //use program
  gl.useProgram(program);

  //set rect position
  const originPts: ReadonlyVec3[] = [
    [props.postion.x, props.postion.y, 0],
    [props.postion.x + props.size.width, props.postion.y, 0],
    [props.postion.x, props.postion.y + props.size.height, 0],
    [
      props.postion.x + props.size.width,
      props.postion.y + props.size.height,
      0,
    ],
  ];
  const webglPostions = originPts.map((pt) =>
    mappingPtToCanvas(pt, canvasWidth, canvasHeight)
  );
  const triangles: Array<number> = [
    ...webglPostions[0],
    ...webglPostions[2],
    ...webglPostions[1],
    ...webglPostions[1],
    ...webglPostions[2],
    ...webglPostions[3],
  ];
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangles), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  //set texture position mapping
  const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  const textureMap = [
    0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
  ];
  if (props.flipLeftRight || props.flipUpDown) {
    const len = textureMap.length / 2;
    for (let i = 0; i < len; i++) {
      if (props.flipLeftRight) {
        textureMap[i * 2] = 1 - textureMap[i * 2];
      }
      if (props.flipUpDown) {
        textureMap[i * 2 + 1] = 1 - textureMap[i * 2 + 1];
      }
    }
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureMap), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texcoordAttributeLocation);
  const size = 2; // 2 components per iteration
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    texcoordAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  //draw rect
  const l = Math.floor(triangles.length / 3 / 3);
  for (let i = 0; i < l; i++) {
    gl.drawArrays(gl.TRIANGLES, i * 3, 3);
  }
}

import { ReadonlyVec3 } from "gl-matrix";
import { rangeMapping } from "@/util/math";
import { initShaderProgram } from "@/util/webgl";
function mappingPtToCanvas(
  pt: ReadonlyVec3,
  canvasWidth: number,
  canvasHeight: number
): ReadonlyVec3 {
  return [
    rangeMapping(pt[0], 0, canvasWidth, -1, 1),
    rangeMapping(pt[1], 0, canvasHeight, 1, -1),
    rangeMapping(pt[2], 0, 1, 0, 1),
  ];
}
