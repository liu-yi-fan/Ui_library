import { DrawingContext, DrawingStrategy } from "./DrawingStrategy";
import { Point, RectangleShape } from "@/painter/stores/painterType";
import { drawSquare } from "@/painter/renderers/shapeDrawers";

function getRectangleFromPoints(start: Point, end: Point) {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
}

export class SquareStrategy implements DrawingStrategy {
  name = "square";
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

    const rect = getRectangleFromPoints(this.startPoint, point);
    if (rect.width === 0 || rect.height === 0) {
      this.onCancel();
      return;
    }

    const shape: RectangleShape = {
      id: `square-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "square",
      data: {
        ...rect,
        color: context.color,
        strokeWidth: context.strokeWidth,
        fill: false,
        fillColor: context.color,
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

    const rect = getRectangleFromPoints(this.startPoint, this.currentPoint);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSquare(
      ctx,
      {
        ...rect,
        color: context.color,
        strokeWidth: context.strokeWidth,
        fill: false,
        fillColor: context.color,
      },
      {
        lineDash: [6, 4],
      }
    );
  }
}
