import { mat3 } from "gl-matrix";
import {
  ObjectArrays,
  createCubeVertices,
  createSphereVertices,
  createTruncatedConeVertices,
} from "./primitives";

export function loadShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string
) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function initShaderProgram(
  gl: WebGL2RenderingContext,
  vsSource: string,
  fsSource: string
) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)!;
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)!;
  const shaderProgram = gl.createProgram()!;
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }
  return shaderProgram;
}

export function createAndSetupTexture(gl: WebGL2RenderingContext) {
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return texture;
}

function setBufferFromTypedArray(
  gl: WebGL2RenderingContext,
  type: GLenum,
  buffer: WebGLBuffer | null,
  array: ArrayBuffer | ArrayBufferView,
  drawType?: GLenum
) {
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, array, drawType || gl.STATIC_DRAW);
}

function createBufferFromTypedArray(
  gl: WebGL2RenderingContext,
  typedArray: ArrayBuffer | ArrayBufferView,
  type?: GLenum,
  drawType?: GLenum
) {
  type = type || gl.ARRAY_BUFFER;
  const buffer = gl.createBuffer();
  setBufferFromTypedArray(gl, type, buffer, typedArray, drawType);
  return buffer;
}

export interface BufferInfo {
  numElements: number;
  elementType?: number;
  indices?: WebGLBuffer | null;
  attribs?: ObjectArrays;
}

export function createBufferFromArrays(
  gl: WebGL2RenderingContext,
  arrays: ObjectArrays
): BufferInfo {
  const bufferInfo: BufferInfo = { numElements: 0 };
  bufferInfo.attribs = { ...arrays };
  bufferInfo.indices = createBufferFromTypedArray(
    gl,
    arrays.indices.data,
    gl.ELEMENT_ARRAY_BUFFER
  );
  bufferInfo.numElements = arrays.indices.data.length;
  bufferInfo.elementType = getGLTypeForTypedArray(gl, arrays.indices.data);
  return bufferInfo;
}

export function createSphereBufferInfo(
  gl: WebGL2RenderingContext,
  radius: number,
  subdivisionsAxis: number,
  subdivisionsHeight: number
) {
  const arrays = createSphereVertices(
    radius,
    subdivisionsAxis,
    subdivisionsHeight
  );
  return createBufferFromArrays(gl, arrays);
}

export function createCubeBufferInfo(gl: WebGL2RenderingContext, size: number) {
  const arrays = createCubeVertices(size);
  return createBufferFromArrays(gl, arrays);
}

export function createTruncatedConeBufferInfo(
  gl: WebGL2RenderingContext,
  bottomRadius: number,
  topRadius: number,
  height: number,
  radialSubdivisions: number,
  verticalSubdivisions: number,
  opt_topCap: boolean,
  opt_bottomCap: boolean
) {
  const arrays = createTruncatedConeVertices(
    topRadius,
    bottomRadius,
    height,
    radialSubdivisions,
    verticalSubdivisions,
    opt_topCap,
    opt_bottomCap
  );
  return createBufferFromArrays(gl, arrays);
}

function getGLTypeForTypedArray(
  gl: WebGL2RenderingContext,
  typedArray: ArrayBuffer
) {
  if (typedArray instanceof Int8Array) {
    return gl.BYTE;
  }
  if (typedArray instanceof Uint8Array) {
    return gl.UNSIGNED_BYTE;
  }
  if (typedArray instanceof Uint8ClampedArray) {
    return gl.UNSIGNED_BYTE;
  }
  if (typedArray instanceof Int16Array) {
    return gl.SHORT;
  }
  if (typedArray instanceof Uint16Array) {
    return gl.UNSIGNED_SHORT;
  }
  if (typedArray instanceof Int32Array) {
    return gl.INT;
  }
  if (typedArray instanceof Uint32Array) {
    return gl.UNSIGNED_INT;
  }
  if (typedArray instanceof Float32Array) {
    return gl.FLOAT;
  }
  throw new Error("unsupported typed array type");
}

export function createVAO(gl: WebGL2RenderingContext, bufferInfo: BufferInfo) {
  if (!bufferInfo.indices) return null;
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices);
  gl.bindVertexArray(null);
  return vao;
}
