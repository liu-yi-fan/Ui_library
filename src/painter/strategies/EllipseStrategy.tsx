import { DrawingContext, DrawingStrategy } from "./DrawingStrategy";
import { EllipseShape, Point } from "@/painter/stores/painterType";
import { drawEllipse } from "@/painter/renderers/shapeDrawers";

function getEllipseFromPoints(start: Point, end: Point) {
  const minX = Math.min(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxX = Math.max(start.x, end.x);
  const maxY = Math.max(start.y, end.y);

  return {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
    radiusX: (maxX - minX) / 2,
    radiusY: (maxY - minY) / 2,
  };
}

export class EllipseStrategy implements DrawingStrategy {
  name = "ellipse";
  isDrawing = false;

  private startPoint: Point | null = null;
  private currentPoint: Point | null = null;

  onStart(
    point: Point,
    context: DrawingContext,
    tempCanvas?: HTMLCanvasElement
  ) {
    this.isDrawing = true;
    this.startPoint = point;
    this.currentPoint = point;

    if (tempCanvas) {
      this.drawPreview(tempCanvas, context);
    }
  }

  onMove(
    point: Point,
    context: DrawingContext,
    tempCanvas?: HTMLCanvasElement
  ) {
    if (!this.isDrawing || !this.startPoint || !tempCanvas) return;

    this.currentPoint = point;
    this.drawPreview(tempCanvas, context);
  }

  onEnd(point: Point | null, context: DrawingContext) {
    if (!this.isDrawing || !this.startPoint || !point) {
      this.onCancel();
      return;
    }

    const ellipse = getEllipseFromPoints(this.startPoint, point);
    if (ellipse.radiusX === 0 || ellipse.radiusY === 0) {
      this.onCancel();
      return;
    }

    const shape: EllipseShape = {
      id: `ellipse-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "ellipse",
      data: {
        ...ellipse,
        color: context.color,
        strokeWidth: context.strokeWidth,
        fill: false,
        fillColor: context.color,
        rotation: 0,
      },
      createdAt: Date.now(),
    };

    context.onDrawComplete(shape);
    this.onCancel();
  }

  onCancel() {
    this.isDrawing = false;
    this.startPoint = null;
    this.currentPoint = null;
  }

  getCursor() {
    return "crosshair";
  }

  private drawPreview(canvas: HTMLCanvasElement, context: DrawingContext) {
    const ctx = canvas.getContext("2d");
    if (!ctx || !this.startPoint || !this.currentPoint) return;

    const ellipse = getEllipseFromPoints(this.startPoint, this.currentPoint);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawEllipse(
      ctx,
      {
        ...ellipse,
        color: context.color,
        strokeWidth: context.strokeWidth,
        fill: false,
        fillColor: context.color,
        rotation: 0,
      },
      {
        lineDash: [6, 4],
      }
    );
  }
}
