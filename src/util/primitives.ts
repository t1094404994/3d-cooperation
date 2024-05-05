import { M4, Matrix4, V3, Vector3 } from "./matrix";

interface ArrayConfig<T> {
  numComponents: number;
  numElements: number;
  data: T;
}

export interface ObjectArrays {
  position: ArrayConfig<Float32Array>;
  texcoord: ArrayConfig<Float32Array>;
  normal: ArrayConfig<Float32Array>;
  indices: ArrayConfig<Uint16Array>;
  color?: ArrayConfig<Uint8Array>;
}

function expandRLEData(rleData: Array<number>, padding?: Array<number>) {
  padding = padding || [];
  const data: Array<number> = [];
  for (let ii = 0; ii < rleData.length; ii += 4) {
    const runLength = rleData[ii];
    const element = rleData.slice(ii + 1, ii + 4);
    element.push(...padding);
    for (let jj = 0; jj < runLength; ++jj) {
      data.push(...element);
    }
  }
  return data;
}

export function create3DFVertices(): ObjectArrays {
  const positions = [
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

    // top rung front
    100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0, 30,

    // under top rung
    30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0,

    // between top rung and middle
    30, 30, 0, 30, 60, 30, 30, 30, 30, 30, 30, 0, 30, 60, 0, 30, 60, 30,

    // top of middle rung
    30, 60, 0, 67, 60, 30, 30, 60, 30, 30, 60, 0, 67, 60, 0, 67, 60, 30,

    // front of middle rung
    67, 60, 0, 67, 90, 30, 67, 60, 30, 67, 60, 0, 67, 90, 0, 67, 90, 30,

    // bottom of middle rung.
    30, 90, 0, 30, 90, 30, 67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0,

    // front of bottom
    30, 90, 0, 30, 150, 30, 30, 90, 30, 30, 90, 0, 30, 150, 0, 30, 150, 30,

    // bottom
    0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150, 0,

    // left side
    0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0,
  ];

  const texcoords = [
    // left column front
    0.22, 0.19, 0.22, 0.79, 0.34, 0.19, 0.22, 0.79, 0.34, 0.79, 0.34, 0.19,

    // top rung front
    0.34, 0.19, 0.34, 0.31, 0.62, 0.19, 0.34, 0.31, 0.62, 0.31, 0.62, 0.19,

    // middle rung front
    0.34, 0.43, 0.34, 0.55, 0.49, 0.43, 0.34, 0.55, 0.49, 0.55, 0.49, 0.43,

    // left column back
    0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1,

    // top rung back
    0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1,

    // middle rung back
    0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1,

    // top
    0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,

    // top rung front
    0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,

    // under top rung
    0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0,

    // between top rung and middle
    0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1,

    // top of middle rung
    0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1,

    // front of middle rung
    0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1,

    // bottom of middle rung.
    0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0,

    // front of bottom
    0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1,

    // bottom
    0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0,

    // left side
    0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0,
  ];

  const normals = expandRLEData([
    // left column front
    // top rung front
    // middle rung front
    18, 0, 0, 1,

    // left column back
    // top rung back
    // middle rung back
    18, 0, 0, -1,

    // top
    6, 0, 1, 0,

    // top rung front
    6, 1, 0, 0,

    // under top rung
    6, 0, -1, 0,

    // between top rung and middle
    6, 1, 0, 0,

    // top of middle rung
    6, 0, 1, 0,

    // front of middle rung
    6, 1, 0, 0,

    // bottom of middle rung.
    6, 0, -1, 0,

    // front of bottom
    6, 1, 0, 0,

    // bottom
    6, 0, -1, 0,

    // left side
    6, -1, 0, 0,
  ]);

  const colors = expandRLEData(
    [
      // left column front
      // top rung front
      // middle rung front
      18, 200, 70, 120,

      // left column back
      // top rung back
      // middle rung back
      18, 80, 70, 200,

      // top
      6, 70, 200, 210,

      // top rung front
      6, 200, 200, 70,

      // under top rung
      6, 210, 100, 70,

      // between top rung and middle
      6, 210, 160, 70,

      // top of middle rung
      6, 70, 180, 210,

      // front of middle rung
      6, 100, 70, 210,

      // bottom of middle rung.
      6, 76, 210, 100,

      // front of bottom
      6, 140, 210, 80,

      // bottom
      6, 90, 130, 110,

      // left side
      6, 160, 160, 220,
    ],
    [255]
  );

  const numVerts = positions.length / 3;

  const indicesData: Array<number> = [];
  for (let ii = 0; ii < numVerts; ++ii) {
    indicesData.push(ii);
  }
  const arrays: ObjectArrays = {
    position: {
      data: new Float32Array(positions),
      numComponents: 3,
      numElements: numVerts,
    },
    texcoord: {
      data: new Float32Array(texcoords),
      numComponents: 2,
      numElements: numVerts,
    },
    normal: {
      data: new Float32Array(normals),
      numComponents: 3,
      numElements: numVerts,
    },
    color: {
      data: new Uint8Array(colors),
      numComponents: 4,
      numElements: numVerts,
    },
    indices: {
      data: new Uint16Array(indicesData),
      numComponents: 3,
      numElements: numVerts / 3,
    },
  };

  return arrays;
}

const CUBE_FACE_INDICES = [
  [3, 7, 5, 1], // right
  [6, 2, 0, 4], // left
  [6, 7, 3, 2], // ??
  [0, 1, 5, 4], // ??
  [7, 6, 4, 5], // front
  [2, 3, 1, 0], // back
];
export function createCubeVertices(size?: number): ObjectArrays {
  size = size || 1;
  const k = size / 2;

  const cornerVertices = [
    [-k, -k, -k],
    [+k, -k, -k],
    [-k, +k, -k],
    [+k, +k, -k],
    [-k, -k, +k],
    [+k, -k, +k],
    [-k, +k, +k],
    [+k, +k, +k],
  ];

  const faceNormals = [
    [+1, +0, +0],
    [-1, +0, +0],
    [+0, +1, +0],
    [+0, -1, +0],
    [+0, +0, +1],
    [+0, +0, -1],
  ];

  const uvCoords = [
    [1, 0],
    [0, 0],
    [0, 1],
    [1, 1],
  ];

  const numVertices = 6 * 4;
  const positions: Array<number> = [];
  const normals: Array<number> = [];
  const texcoords: Array<number> = [];
  const indices: Array<number> = [];

  for (let f = 0; f < 6; ++f) {
    const faceIndices = CUBE_FACE_INDICES[f];
    for (let v = 0; v < 4; ++v) {
      const position = cornerVertices[faceIndices[v]];
      const normal = faceNormals[f];
      const uv = uvCoords[v];

      // Each face needs all four vertices because the normals and texture
      // coordinates are not all the same.
      positions.push(...position);
      normals.push(...normal);
      texcoords.push(...uv);
    }
    // Two triangles make a square face.
    const offset = 4 * f;
    indices.push(offset + 0, offset + 1, offset + 2);
    indices.push(offset + 0, offset + 2, offset + 3);
  }

  return {
    position: {
      data: new Float32Array(positions),
      numComponents: 3,
      numElements: numVertices,
    },
    normal: {
      data: new Float32Array(normals),
      numComponents: 3,
      numElements: numVertices,
    },
    texcoord: {
      data: new Float32Array(texcoords),
      numComponents: 2,
      numElements: numVertices,
    },
    indices: {
      data: new Uint16Array(indices),
      numComponents: 3,
      numElements: 6 * 2,
    },
  };
}

export function createPlaneVertices(
  width: number,
  depth: number,
  subdivisionsWidth: number,
  subdivisionsDepth: number,
  matrix: Matrix4
): ObjectArrays {
  width = width || 1;
  depth = depth || 1;
  subdivisionsWidth = subdivisionsWidth || 1;
  subdivisionsDepth = subdivisionsDepth || 1;
  matrix = matrix || M4.identity();

  const numVertices = (subdivisionsWidth + 1) * (subdivisionsDepth + 1);
  const positions: Array<number> = [];
  const normals: Array<number> = [];
  const texcoords: Array<number> = [];

  for (let z = 0; z <= subdivisionsDepth; z++) {
    for (let x = 0; x <= subdivisionsWidth; x++) {
      const u = x / subdivisionsWidth;
      const v = z / subdivisionsDepth;
      positions.push(width * u - width * 0.5, 0, depth * v - depth * 0.5);
      normals.push(0, 1, 0);
      texcoords.push(u, v);
    }
  }

  const numVertsAcross = subdivisionsWidth + 1;
  const indices: Array<number> = [];

  for (let z = 0; z < subdivisionsDepth; z++) {
    // eslint-disable-line
    for (let x = 0; x < subdivisionsWidth; x++) {
      // eslint-disable-line
      // Make triangle 1 of quad.
      indices.push(
        (z + 0) * numVertsAcross + x,
        (z + 1) * numVertsAcross + x,
        (z + 0) * numVertsAcross + x + 1
      );

      // Make triangle 2 of quad.
      indices.push(
        (z + 1) * numVertsAcross + x,
        (z + 1) * numVertsAcross + x + 1,
        (z + 0) * numVertsAcross + x + 1
      );
    }
  }

  const arrays: ObjectArrays = {
    position: {
      data: new Float32Array(reorientPositions(positions, matrix)),
      numComponents: 3,
      numElements: numVertices,
    },
    normal: {
      data: new Float32Array(reorientNormals(normals, matrix)),
      numComponents: 3,
      numElements: numVertices,
    },
    texcoord: {
      data: new Float32Array(texcoords),
      numComponents: 2,
      numElements: numVertices,
    },
    indices: {
      data: new Uint16Array(indices),
      numComponents: 3,
      numElements: subdivisionsWidth * subdivisionsDepth * 2,
    },
  };
  return arrays;
}

export function createSphereVertices(
  radius: number,
  subdivisionsAxis: number,
  subdivisionsHeight: number,
  opt_startLatitudeInRadians?: number,
  opt_endLatitudeInRadians?: number,
  opt_startLongitudeInRadians?: number,
  opt_endLongitudeInRadians?: number
): ObjectArrays {
  if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
    throw new Error("subdivisionAxis and subdivisionHeight must be > 0");
  }

  opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0;
  opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI;
  opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0;
  opt_endLongitudeInRadians = opt_endLongitudeInRadians || Math.PI * 2;

  const latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
  const longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

  // We are going to generate our sphere by iterating through its
  // spherical coordinates and generating 2 triangles for each quad on a
  // ring of the sphere.
  const numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
  const positions: Array<number> = [];
  const normals: Array<number> = [];
  const texcoords: Array<number> = [];

  // Generate the individual vertices in our vertex buffer.
  for (let y = 0; y <= subdivisionsHeight; y++) {
    for (let x = 0; x <= subdivisionsAxis; x++) {
      // Generate a vertex based on its spherical coordinates
      const u = x / subdivisionsAxis;
      const v = y / subdivisionsHeight;
      const theta = longRange * u + opt_startLongitudeInRadians;
      const phi = latRange * v + opt_startLatitudeInRadians;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const ux = cosTheta * sinPhi;
      const uy = cosPhi;
      const uz = sinTheta * sinPhi;
      positions.push(radius * ux, radius * uy, radius * uz);
      normals.push(ux, uy, uz);
      texcoords.push(1 - u, v);
    }
  }

  const numVertsAround = subdivisionsAxis + 1;
  const indices: Array<number> = [];
  for (let x = 0; x < subdivisionsAxis; x++) {
    // eslint-disable-line
    for (let y = 0; y < subdivisionsHeight; y++) {
      // eslint-disable-line
      // Make triangle 1 of quad.
      indices.push(
        (y + 0) * numVertsAround + x,
        (y + 0) * numVertsAround + x + 1,
        (y + 1) * numVertsAround + x
      );

      // Make triangle 2 of quad.
      indices.push(
        (y + 1) * numVertsAround + x,
        (y + 0) * numVertsAround + x + 1,
        (y + 1) * numVertsAround + x + 1
      );
    }
  }

  return {
    position: {
      data: new Float32Array(positions),
      numComponents: 3,
      numElements: numVertices,
    },
    normal: {
      data: new Float32Array(normals),
      numComponents: 3,
      numElements: numVertices,
    },
    texcoord: {
      data: new Float32Array(texcoords),
      numComponents: 2,
      numElements: numVertices,
    },
    indices: {
      data: new Uint16Array(indices),
      numComponents: 3,
      numElements: subdivisionsAxis * subdivisionsHeight * 2,
    },
  };
}

export function createTruncatedConeVertices(
  bottomRadius: number,
  topRadius: number,
  height: number,
  radialSubdivisions: number,
  verticalSubdivisions: number,
  opt_topCap: boolean,
  opt_bottomCap: boolean
): ObjectArrays {
  if (radialSubdivisions < 3) {
    throw new Error("radialSubdivisions must be 3 or greater");
  }

  if (verticalSubdivisions < 1) {
    throw new Error("verticalSubdivisions must be 1 or greater");
  }

  const topCap = opt_topCap === undefined ? true : opt_topCap;
  const bottomCap = opt_bottomCap === undefined ? true : opt_bottomCap;

  const extra = (topCap ? 2 : 0) + (bottomCap ? 2 : 0);

  const numVertices =
    (radialSubdivisions + 1) * (verticalSubdivisions + 1 + extra);
  const positions: Array<number> = [];
  const normals: Array<number> = [];
  const texcoords: Array<number> = [];
  const indices: Array<number> = [];

  const vertsAroundEdge = radialSubdivisions + 1;

  // The slant of the cone is constant across its surface
  const slant = Math.atan2(bottomRadius - topRadius, height);
  const cosSlant = Math.cos(slant);
  const sinSlant = Math.sin(slant);

  const start = topCap ? -2 : 0;
  const end = verticalSubdivisions + (bottomCap ? 2 : 0);

  for (let yy = start; yy <= end; ++yy) {
    let v = yy / verticalSubdivisions;
    let y = height * v;
    let ringRadius;
    if (yy < 0) {
      y = 0;
      v = 1;
      ringRadius = bottomRadius;
    } else if (yy > verticalSubdivisions) {
      y = height;
      v = 1;
      ringRadius = topRadius;
    } else {
      ringRadius =
        bottomRadius + (topRadius - bottomRadius) * (yy / verticalSubdivisions);
    }
    if (yy === -2 || yy === verticalSubdivisions + 2) {
      ringRadius = 0;
      v = 0;
    }
    y -= height / 2;
    for (let ii = 0; ii < vertsAroundEdge; ++ii) {
      const sin = Math.sin((ii * Math.PI * 2) / radialSubdivisions);
      const cos = Math.cos((ii * Math.PI * 2) / radialSubdivisions);
      positions.push(sin * ringRadius, y, cos * ringRadius);
      if (yy < 0) {
        normals.push(0, -1, 0);
      } else if (yy > verticalSubdivisions) {
        normals.push(0, 1, 0);
      } else if (ringRadius === 0.0) {
        normals.push(0, 0, 0);
      } else {
        normals.push(sin * cosSlant, sinSlant, cos * cosSlant);
      }
      texcoords.push(ii / radialSubdivisions, 1 - v);
    }
  }

  for (let yy = 0; yy < verticalSubdivisions + extra; ++yy) {
    // eslint-disable-line
    if (
      (yy === 1 && topCap) ||
      (yy === verticalSubdivisions + extra - 2 && bottomCap)
    ) {
      continue;
    }
    for (let ii = 0; ii < radialSubdivisions; ++ii) {
      // eslint-disable-line
      indices.push(
        vertsAroundEdge * (yy + 0) + 0 + ii,
        vertsAroundEdge * (yy + 0) + 1 + ii,
        vertsAroundEdge * (yy + 1) + 1 + ii
      );
      indices.push(
        vertsAroundEdge * (yy + 0) + 0 + ii,
        vertsAroundEdge * (yy + 1) + 1 + ii,
        vertsAroundEdge * (yy + 1) + 0 + ii
      );
    }
  }

  return {
    position: {
      data: new Float32Array(positions),
      numComponents: 3,
      numElements: numVertices,
    },
    normal: {
      data: new Float32Array(normals),
      numComponents: 3,
      numElements: numVertices,
    },
    texcoord: {
      data: new Float32Array(texcoords),
      numComponents: 2,
      numElements: numVertices,
    },
    indices: {
      data: new Uint16Array(indices),
      numComponents: 3,
      numElements: radialSubdivisions * (verticalSubdivisions + extra / 2) * 2,
    },
  };
}

export function createXYQuadVertices(
  size: number,
  xOffset: number,
  yOffset: number
): ObjectArrays {
  size = size || 2;
  xOffset = xOffset || 0;
  yOffset = yOffset || 0;
  size *= 0.5;
  return {
    position: {
      numComponents: 3,
      numElements: 4,
      data: new Float32Array([
        -size + xOffset,
        -size + yOffset,
        0,
        size + xOffset,
        -size + yOffset,
        0,
        -size + xOffset,
        size + yOffset,
        0,
        size + xOffset,
        size + yOffset,
        0,
      ]),
    },
    normal: {
      numComponents: 3,
      numElements: 4,
      data: new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]),
    },
    texcoord: {
      numComponents: 2,
      numElements: 4,
      data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
    },
    indices: {
      numComponents: 3,
      numElements: 2,
      data: new Uint16Array([0, 1, 2, 2, 1, 3]),
    },
  };
}

export function createCrescentVertices(
  verticalRadius: number,
  outerRadius: number,
  innerRadius: number,
  thickness: number,
  subdivisionsDown: number,
  startOffset: number,
  endOffset: number
): ObjectArrays {
  if (subdivisionsDown <= 0) {
    throw new Error("subdivisionDown must be > 0");
  }

  startOffset = startOffset || 0;
  endOffset = endOffset || 1;

  const subdivisionsThick = 2;

  const offsetRange = endOffset - startOffset;
  const numVertices = (subdivisionsDown + 1) * 2 * (2 + subdivisionsThick);
  const positions: Array<number> = [];
  const normals: Array<number> = [];
  const texcoords: Array<number> = [];

  function lerp(a: number, b: number, s: number) {
    return a + (b - a) * s;
  }

  function createArc(
    arcRadius: number,
    x: number,
    normalMult: Vector3,
    normalAdd: Vector3,
    uMult: number,
    uAdd: number
  ) {
    for (let z = 0; z <= subdivisionsDown; z++) {
      const uBack = x / (subdivisionsThick - 1);
      const v = z / subdivisionsDown;
      const xBack = (uBack - 0.5) * 2;
      const angle = (startOffset + v * offsetRange) * Math.PI;
      const s = Math.sin(angle);
      const c = Math.cos(angle);
      const radius = lerp(verticalRadius, arcRadius, s);
      const px = xBack * thickness;
      const py = c * verticalRadius;
      const pz = s * radius;
      positions.push(px, py, pz);
      const n = V3.add(V3.multiply([0, s, c], normalMult), normalAdd);
      normals.push(...n);
      texcoords.push(uBack * uMult + uAdd, v);
    }
  }

  // Generate the individual vertices in our vertex buffer.
  for (let x = 0; x < subdivisionsThick; x++) {
    const uBack = (x / (subdivisionsThick - 1) - 0.5) * 2;
    createArc(outerRadius, x, [1, 1, 1], [0, 0, 0], 1, 0);
    createArc(outerRadius, x, [0, 0, 0], [uBack, 0, 0], 0, 0);
    createArc(innerRadius, x, [1, 1, 1], [0, 0, 0], 1, 0);
    createArc(innerRadius, x, [0, 0, 0], [uBack, 0, 0], 0, 1);
  }

  // Do outer surface.
  const indices: Array<number> = [];

  function createSurface(leftArcOffset: number, rightArcOffset: number) {
    for (let z = 0; z < subdivisionsDown; ++z) {
      // Make triangle 1 of quad.
      indices.push(
        leftArcOffset + z + 0,
        leftArcOffset + z + 1,
        rightArcOffset + z + 0
      );

      // Make triangle 2 of quad.
      indices.push(
        leftArcOffset + z + 1,
        rightArcOffset + z + 1,
        rightArcOffset + z + 0
      );
    }
  }

  const numVerticesDown = subdivisionsDown + 1;
  // front
  createSurface(numVerticesDown * 0, numVerticesDown * 4);
  // right
  createSurface(numVerticesDown * 5, numVerticesDown * 7);
  // back
  createSurface(numVerticesDown * 6, numVerticesDown * 2);
  // left
  createSurface(numVerticesDown * 3, numVerticesDown * 1);

  return {
    position: {
      data: new Float32Array(positions),
      numComponents: 3,
      numElements: numVertices,
    },
    normal: {
      data: new Float32Array(normals),
      numComponents: 3,
      numElements: numVertices,
    },
    texcoord: {
      data: new Float32Array(texcoords),
      numComponents: 2,
      numElements: numVertices,
    },
    indices: {
      data: new Uint16Array(indices),
      numComponents: 3,
      numElements: subdivisionsDown * 2 * (2 + subdivisionsThick),
    },
  };
}

export function createCylinderVertices(
  radius: number,
  height: number,
  radialSubdivisions: number,
  verticalSubdivisions: number,
  topCap: boolean,
  bottomCap: boolean
): ObjectArrays {
  return createTruncatedConeVertices(
    radius,
    radius,
    height,
    radialSubdivisions,
    verticalSubdivisions,
    topCap,
    bottomCap
  );
}

export function createTorusVertices(
  radius: number,
  thickness: number,
  radialSubdivisions: number,
  bodySubdivisions: number,
  startAngle?: number,
  endAngle?: number
): ObjectArrays {
  if (radialSubdivisions < 3) {
    throw new Error("radialSubdivisions must be 3 or greater");
  }

  if (bodySubdivisions < 3) {
    throw new Error("verticalSubdivisions must be 3 or greater");
  }

  startAngle = startAngle || 0;
  endAngle = endAngle || Math.PI * 2;
  const range = endAngle - startAngle;

  const radialParts = radialSubdivisions + 1;
  const bodyParts = bodySubdivisions + 1;
  const numVertices = radialParts * bodyParts;
  const positions: Array<number> = [];
  const normals: Array<number> = [];
  const texcoords: Array<number> = [];
  const indices: Array<number> = [];

  for (let slice = 0; slice < bodyParts; ++slice) {
    const v = slice / bodySubdivisions;
    const sliceAngle = v * Math.PI * 2;
    const sliceSin = Math.sin(sliceAngle);
    const ringRadius = radius + sliceSin * thickness;
    const ny = Math.cos(sliceAngle);
    const y = ny * thickness;
    for (let ring = 0; ring < radialParts; ++ring) {
      const u = ring / radialSubdivisions;
      const ringAngle = startAngle + u * range;
      const xSin = Math.sin(ringAngle);
      const zCos = Math.cos(ringAngle);
      const x = xSin * ringRadius;
      const z = zCos * ringRadius;
      const nx = xSin * sliceSin;
      const nz = zCos * sliceSin;
      positions.push(x, y, z);
      normals.push(nx, ny, nz);
      texcoords.push(u, 1 - v);
    }
  }

  for (let slice = 0; slice < bodySubdivisions; ++slice) {
    for (let ring = 0; ring < radialSubdivisions; ++ring) {
      const nextRingIndex = 1 + ring;
      const nextSliceIndex = 1 + slice;
      indices.push(
        radialParts * slice + ring,
        radialParts * nextSliceIndex + ring,
        radialParts * slice + nextRingIndex
      );
      indices.push(
        radialParts * nextSliceIndex + ring,
        radialParts * nextSliceIndex + nextRingIndex,
        radialParts * slice + nextRingIndex
      );
    }
  }

  return {
    position: {
      data: new Float32Array(positions),
      numComponents: 3,
      numElements: numVertices,
    },
    normal: {
      data: new Float32Array(normals),
      numComponents: 3,
      numElements: numVertices,
    },
    texcoord: {
      data: new Float32Array(texcoords),
      numComponents: 2,
      numElements: numVertices,
    },
    indices: {
      data: new Uint16Array(indices),
      numComponents: 3,
      numElements: radialSubdivisions * bodySubdivisions * 2,
    },
  };
}

export function createDiscVertices(
  radius: number,
  divisions: number,
  stacks: number,
  innerRadius: number,
  stackPower: number
): ObjectArrays {
  if (divisions < 3) {
    throw new Error("divisions must be at least 3");
  }

  stacks = stacks ? stacks : 1;
  stackPower = stackPower ? stackPower : 1;
  innerRadius = innerRadius ? innerRadius : 0;

  // Note: We don't share the center vertex because that would
  // mess up texture coordinates.
  const numVertices = (divisions + 1) * (stacks + 1);

  const positions: Array<number> = [];
  const normals: Array<number> = [];
  const texcoords: Array<number> = [];
  const indices: Array<number> = [];

  let firstIndex = 0;
  const radiusSpan = radius - innerRadius;
  const pointsPerStack = divisions + 1;

  // Build the disk one stack at a time.
  for (let stack = 0; stack <= stacks; ++stack) {
    const stackRadius =
      innerRadius + radiusSpan * Math.pow(stack / stacks, stackPower);

    for (let i = 0; i <= divisions; ++i) {
      const theta = (2.0 * Math.PI * i) / divisions;
      const x = stackRadius * Math.cos(theta);
      const z = stackRadius * Math.sin(theta);

      positions.push(x, 0, z);
      normals.push(0, 1, 0);
      texcoords.push(1 - i / divisions, stack / stacks);
      if (stack > 0 && i !== divisions) {
        // a, b, c and d are the indices of the vertices of a quad.  unless
        // the current stack is the one closest to the center, in which case
        // the vertices a and b connect to the center vertex.
        const a = firstIndex + (i + 1);
        const b = firstIndex + i;
        const c = firstIndex + i - pointsPerStack;
        const d = firstIndex + (i + 1) - pointsPerStack;

        // Make a quad of the vertices a, b, c, d.
        indices.push(a, b, c);
        indices.push(a, c, d);
      }
    }

    firstIndex += divisions + 1;
  }

  return {
    position: {
      data: new Float32Array(positions),
      numComponents: 3,
      numElements: numVertices,
    },
    normal: {
      data: new Float32Array(normals),
      numComponents: 3,
      numElements: numVertices,
    },
    texcoord: {
      data: new Float32Array(texcoords),
      numComponents: 2,
      numElements: numVertices,
    },
    indices: {
      data: new Uint16Array(indices),
      numComponents: 3,
      numElements: divisions * stacks * 2,
    },
  };
}

function reorientPositions(array: Array<number>, matrix: Matrix4) {
  applyFuncToV3Array(array, matrix, M4.transformPoint);
  return array;
}

function reorientDirections(array: Array<number>, matrix: Matrix4) {
  applyFuncToV3Array(array, matrix, M4.transformDirection);
  return array;
}

function reorientNormals(array: Array<number>, matrix: Matrix4) {
  applyFuncToV3Array(array, matrix, M4.transformNormal);
  return array;
}

function applyFuncToV3Array(
  array: Array<number>,
  matrix: Matrix4,
  fn: (matrix: Matrix4, a: Vector3, b: Vector3) => void
) {
  const len = array.length;
  const tmp: Vector3 = [0, 0, 0];
  for (let ii = 0; ii < len; ii += 3) {
    fn(matrix, [array[ii], array[ii + 1], array[ii + 2]], tmp);
    array[ii] = tmp[0];
    array[ii + 1] = tmp[1];
    array[ii + 2] = tmp[2];
  }
}
