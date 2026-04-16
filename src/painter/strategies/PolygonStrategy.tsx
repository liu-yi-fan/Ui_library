import { DrawingContext, DrawingStrategy } from "./DrawingStrategy";
import { Point, PolygonShape } from "@/painter/stores/painterType";
import {
  drawPolygon,
  drawPolygonClosingHint,
  drawPolygonVertices,
} from "@/painter/renderers/shapeDrawers";

enum PolygonState {
  IDLE,
  DRAWING,
  CLOSING,
}

export class PolygonStrategy implements DrawingStrategy {
  name = "polygon";
  isDrawing = false;

  private state: PolygonState = PolygonState.IDLE;
  private points: Point[] = [];
  private tempPoint: Point | null = null;
  private snapDistance = 8;
  private minPoints = 3;

  onStart(
    point: Point,
    context: DrawingContext,
    tempCanvas?: HTMLCanvasElement
  ) {
    if (!tempCanvas) return;

    switch (this.state) {
      case PolygonState.IDLE:
        this.isDrawing = true;
        this.state = PolygonState.DRAWING;
        this.points = [point];
        this.tempPoint = null;
        this.drawPreview(tempCanvas, context);
        break;

      case PolygonState.DRAWING:
        if (this.shouldClosePolygon(point)) {
          this.completePolygon(context);
        } else {
          this.points.push(point);
          this.tempPoint = null;
          this.drawPreview(tempCanvas, context);
        }
        break;

      case PolygonState.CLOSING:
        this.completePolygon(context);
        break;
    }
  }

  onMove(
    point: Point,
    context: DrawingContext,
    tempCanvas?: HTMLCanvasElement
  ) {
    if (this.state !== PolygonState.DRAWING || !tempCanvas) return;

    this.tempPoint = point;
    // this.state = this.isNearStartPoint(point)
    //   ? PolygonState.CLOSING
    //   : PolygonState.DRAWING;

    this.drawPreview(tempCanvas, context);
  }

  onEnd(point: Point | null, context: DrawingContext) {
    if (this.points.length >= this.minPoints) {
      this.completePolygon(context);
    } else {
      this.onCancel();
    }
  }

  onCancel() {
    this.isDrawing = false;
    this.state = PolygonState.IDLE;
    this.points = [];
    this.tempPoint = null;
  }

  getCursor(): string {
    switch (this.state) {
      case PolygonState.CLOSING:
        return "pointer";
      case PolygonState.IDLE:
      case PolygonState.DRAWING:
        return "crosshair";
      default:
        return "default";
    }
  }

  private shouldClosePolygon(currentPoint: Point): boolean {
    if (this.points.length < 2) return false;
    return this.isNearStartPoint(currentPoint);
  }

  private isNearStartPoint(point: Point): boolean {
    if (this.points.length === 0) return false;

    const firstPoint = this.points[0];
    const distance = Math.hypot(point.x - firstPoint.x, point.y - firstPoint.y);

    return distance < this.snapDistance;
  }

  private completePolygon(context: DrawingContext) {
    if (this.points.length < this.minPoints) {
      this.onCancel();
      return;
    }

    const shape: PolygonShape = {
      id: `polygon-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "polygon",
      data: {
        points: [...this.points],
        color: context.color,
        strokeWidth: context.strokeWidth,
        fill: false,
        fillColor: context.color,
        closed: true,
      },
      createdAt: Date.now(),
    };

    context.onDrawComplete(shape);
    this.onCancel();
  }

  private drawPreview(canvas: HTMLCanvasElement, context: DrawingContext) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPolygon(
      ctx,
      {
        points: this.points,
        color: context.color,
        strokeWidth: context.strokeWidth,
        fill: false,
        fillColor: context.color,
        closed: false,
      },
      {
        previewPoint: this.tempPoint,
        lineDash: [5, 5],
      }
    );

    if (this.points.length >= 2 && this.tempPoint) {
      drawPolygon(
        ctx,
        {
          points: this.points,
          color: context.color,
          strokeWidth: context.strokeWidth,
          fill: true,
          fillColor: context.color,
          closed: false,
        },
        {
          previewPoint: this.tempPoint,
          fill: true,
          strokeStyle: "transparent",
          globalAlpha: 0.15,
        }
      );
    }

    drawPolygonVertices(ctx, this.points, {
      color: context.color,
      showIndex: true,
    });

    if (this.state === PolygonState.CLOSING && this.points.length > 0) {
      drawPolygonClosingHint(ctx, this.points[0]);
    }
  }

  containsPoint(point: Point, polygonPoints: Point[]): boolean {
    let inside = false;
    for (
      let i = 0, j = polygonPoints.length - 1;
      i < polygonPoints.length;
      j = i++
    ) {
      const xi = polygonPoints[i].x;
      const yi = polygonPoints[i].y;
      const xj = polygonPoints[j].x;
      const yj = polygonPoints[j].y;

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  translatePolygon(points: Point[], deltaX: number, deltaY: number): Point[] {
    return points.map((point) => ({
      x: point.x + deltaX,
      y: point.y + deltaY,
    }));
  }

  getCenter(points: Point[]): Point {
    const bounds = this.getPolygonBoundsFromPoints(points);
    return {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
    };
  }

  private getPolygonBoundsFromPoints(points: Point[]) {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }
}
