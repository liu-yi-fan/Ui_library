import { Point, PolygonShape, LineShape, Shape } from "@/painter/stores/painterType";

interface DrawLineOptions {
  start?: Point;
  end?: Point;
  strokeStyle?: string;
  lineWidth?: number;
  lineDash?: number[];
  lineCap?: CanvasLineCap;
  globalAlpha?: number;
}

interface DrawPolygonOptions {
  previewPoint?: Point | null;
  closePath?: boolean;
  fill?: boolean;
  lineDash?: number[];
  strokeStyle?: string;
  fillStyle?: string;
  lineWidth?: number;
  globalAlpha?: number;
}

interface DrawPolygonVerticesOptions {
  radius?: number;
  innerRadius?: number;
  color?: string;
  showIndex?: boolean;
}

function tracePolygonPath(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  previewPoint?: Point | null,
  closePath = false
) {
  if (points.length === 0) return false;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  if (previewPoint) {
    ctx.lineTo(previewPoint.x, previewPoint.y);
  }

  if (closePath) {
    ctx.closePath();
  }

  return true;
}

export function drawPolygon(
  ctx: CanvasRenderingContext2D,
  polygon: PolygonShape["data"],
  {
    previewPoint,
    closePath = polygon.closed ?? false,
    fill = polygon.fill ?? false,
    lineDash,
    strokeStyle = polygon.color,
    fillStyle = polygon.fillColor ?? polygon.color,
    lineWidth = polygon.strokeWidth,
    globalAlpha,
  }: DrawPolygonOptions = {}
) {
  if (polygon.points.length === 0) return;

  ctx.save();
  ctx.strokeStyle = strokeStyle;
  ctx.fillStyle = fillStyle;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash(lineDash ?? []);

  if (typeof globalAlpha === "number") {
    ctx.globalAlpha = globalAlpha;
  }

  const hasPath = tracePolygonPath(ctx, polygon.points, previewPoint, closePath);
  if (!hasPath) {
    ctx.restore();
    return;
  }

  if (fill) {
    ctx.fill();
  }

  ctx.stroke();
  ctx.restore();
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  line: LineShape["data"],
  {
    start = line.start,
    end = line.end,
    strokeStyle = line.color,
    lineWidth = line.strokeWidth,
    lineDash = line.dash ?? [],
    lineCap = line.lineCap ?? "round",
    globalAlpha,
  }: DrawLineOptions = {}
) {
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = lineCap;
  ctx.setLineDash(lineDash);

  if (typeof globalAlpha === "number") {
    ctx.globalAlpha = globalAlpha;
  }

  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.restore();
}

export function drawPolygonVertices(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  {
    radius = 5,
    innerRadius = 3,
    color = "#000000",
    showIndex = false,
  }: DrawPolygonVerticesOptions = {}
) {
  ctx.save();

  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(point.x, point.y, innerRadius, 0, 2 * Math.PI);
    ctx.fill();

    if (showIndex) {
      ctx.font = "12px Arial";
      ctx.fillStyle = "#000000";
      ctx.fillText(`${i + 1}`, point.x + 8, point.y - 5);
    }
  }

  ctx.restore();
}

export function drawPolygonClosingHint(
  ctx: CanvasRenderingContext2D,
  point: Point,
  label = "點擊完成"
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
  ctx.strokeStyle = "#ff0000";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.font = "12px Arial";
  ctx.fillStyle = "#ff0000";
  ctx.fillText(label, point.x + 12, point.y - 8);
  ctx.restore();
}

export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
  if (shape.visible === false) return;

  switch (shape.type) {
    case "line": 
      drawLine(ctx, shape.data);
      return;

    case "square": {
      const {
        x,
        y,
        width,
        height,
        color,
        strokeWidth,
        fill,
        fillColor,
      } = shape.data;

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = color;
      ctx.rect(x, y, width, height);

      if (fill) {
        ctx.fillStyle = fillColor ?? color;
        ctx.fill();
      }

      ctx.stroke();
      ctx.restore();
      return;
    }

    case "ellipse": {
      const {
        x,
        y,
        radiusX,
        radiusY,
        color,
        strokeWidth,
        fill,
        fillColor,
        rotation,
      } = shape.data;

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = color;
      ctx.ellipse(x, y, radiusX, radiusY, rotation ?? 0, 0, Math.PI * 2);

      if (fill) {
        ctx.fillStyle = fillColor ?? color;
        ctx.fill();
      }

      ctx.stroke();
      ctx.restore();
      return;
    }

    case "polygon":
      drawPolygon(ctx, shape.data);
      return;
  }
}
