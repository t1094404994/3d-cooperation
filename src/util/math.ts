export function rangeMapping(
  x: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  return ((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

//过点做垂线到线段的交点，该点到线段起点的距离
export function pointToLineDistance(
  point: { x: number; y: number },
  line: { start: { x: number; y: number }; end: { x: number; y: number } }
) {
  const a = line.end.y - line.start.y;
  const b = line.start.x - line.end.x;
  const c = line.end.x * line.start.y - line.start.x * line.end.y;
  return Math.abs(a * point.x + b * point.y + c) / Math.sqrt(a * a + b * b);
}

//计算该点的线性渐变颜色
export function linearGradientColor(
  point: { x: number; y: number },
  line: { start: { x: number; y: number }; end: { x: number; y: number } },
  startColor: [number, number, number],
  endColor: [number, number, number]
) {
  const t = pointToLineFootDistanceRatio(point, line);
  return [
    startColor[0] * (1 - t) + endColor[0] * t,
    startColor[1] * (1 - t) + endColor[1] * t,
    startColor[2] * (1 - t) + endColor[2] * t,
  ];
}

//计算点到线段的最近点(垂足)
export function pointToLineFoot(
  point: { x: number; y: number },
  line: { start: { x: number; y: number }; end: { x: number; y: number } }
) {
  const k1 = (line.end.y - line.start.y) / (line.end.x - line.start.x);
  if (k1 === Infinity || k1 === -Infinity) {
    return { x: line.start.x, y: point.y };
  } else if (k1 === 0) {
    return { x: point.x, y: line.start.y };
  } else {
    const a1 = line.start.y - line.start.x * k1;
    const k2 = -1 / k1;
    const a2 = point.y - point.x * k2;
    const x = (a2 - a1) / (k1 - k2);
    const y = k1 * x + a1;
    return { x, y };
  }
}

//计算点到线段的最近点(垂足)到线段起点的距离
export function pointToLineFootDistance(
  point: { x: number; y: number },
  line: { start: { x: number; y: number }; end: { x: number; y: number } }
) {
  const foot = pointToLineFoot(point, line);
  const distance = Math.sqrt(
    (foot.x - line.start.x) ** 2 + (foot.y - line.start.y) ** 2
  );
  return distance;
}

//计算点到线段的最近点(垂足)到线段起点的距离占线段长度的比例
export function pointToLineFootDistanceRatio(
  point: { x: number; y: number },
  line: { start: { x: number; y: number }; end: { x: number; y: number } }
) {
  const foot = pointToLineFoot(point, line);
  const distancePow2 =
    (foot.x - line.start.x) ** 2 + (foot.y - line.start.y) ** 2;

  const lineLengthPow2 =
    (line.end.x - line.start.x) ** 2 + (line.end.y - line.start.y) ** 2;
  return Math.sqrt(distancePow2 / lineLengthPow2);
}
