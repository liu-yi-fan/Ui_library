import { DrawingContext, DrawingStrategy } from "./DrawingStrategy";
import { LineShape, Point } from "@/painter/stores/painterType";
import { drawLine } from "@/painter/renderers/shapeDrawers";

export class LineStrategy implements DrawingStrategy {
  name = "line";
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

    const shape: LineShape = {
      id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "line",
      data: {
        start: this.startPoint,
        end: point,
        color: context.color,
        strokeWidth: context.strokeWidth,
        lineCap: "round",
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawLine(
      ctx,
      {
        start: this.startPoint,
        end: this.currentPoint,
        color: context.color,
        strokeWidth: context.strokeWidth,
        lineCap: "round",
      },
      {
        lineDash: [6, 4],
      }
    );
  }
}
