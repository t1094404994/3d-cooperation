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
  const a = line.end.y - line.start.y;
  const b = line.start.x - line.end.x;
  const c = line.end.x * line.start.y - line.start.x * line.end.y;
  const d = Math.sqrt(a * a + b * b);
  const distance = Math.abs(a * point.x + b * point.y + c) / d;
  const t = distance / d;
  return [
    startColor[0] * (1 - t) + endColor[0] * t,
    startColor[1] * (1 - t) + endColor[1] * t,
    startColor[2] * (1 - t) + endColor[2] * t,
  ];
}
