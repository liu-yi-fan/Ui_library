import { DrawingContext, DrawingStrategy } from "./DrawingStrategy";
import {
  findShapeAtPoint,
  getShapeBounds,
  translateShape,
} from "@/painter/utils/shapeSelection";
import { Point, Shape } from "@/painter/stores/painterType";
import { drawSelectionBounds, drawShape } from "@/painter/renderers/shapeDrawers";

export class SelectStrategy implements DrawingStrategy {
  name = "select";
  isDrawing = false;
  private isDragging = false;
  private dragStartPoint: Point | null = null;
  private dragLayerId: string | null = null;
  private dragShapeId: string | null = null;
  private originalShape: Shape | null = null;
  private previewShape: Shape | null = null;

  onStart(point: Point, context: DrawingContext, tempCanvas?: HTMLCanvasElement) {
    const hit = findShapeAtPoint(point, context.layers);

    if (!hit) {
      this.clearPreview(tempCanvas);
      context.clearDraggingShape();
      context.clearSelection();
      this.onCancel();
      return;
    }

    context.setSelectedShape(hit.shape.id, hit.layerId);
    context.setDraggingShape(hit.shape.id, hit.layerId);
    this.dragStartPoint = point;
    this.dragLayerId = hit.layerId;
    this.dragShapeId = hit.shape.id;
    this.originalShape = hit.shape;
    this.previewShape = hit.shape;
    this.isDrawing = true;
  }

  onMove(point: Point, _context: DrawingContext, tempCanvas?: HTMLCanvasElement) {
    if (
      !this.isDrawing ||
      !this.dragStartPoint ||
      !this.originalShape ||
      !tempCanvas
    ) {
      return;
    }

    const deltaX = point.x - this.dragStartPoint.x;
    const deltaY = point.y - this.dragStartPoint.y;

    if (!this.isDragging) {
      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
        return;
      }
      _context.setDraggingShape(this.dragShapeId!, this.dragLayerId!);
      this.isDragging = true;
    }

    this.previewShape = translateShape(this.originalShape, deltaX, deltaY);

    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    drawShape(ctx, this.previewShape);
    drawSelectionBounds(ctx, getShapeBounds(this.previewShape));
  }

  onEnd(_point: Point | null, context: DrawingContext) {
    if (this.isDragging && this.dragLayerId && this.dragShapeId && this.previewShape) {
      context.updateShape(this.dragLayerId, this.dragShapeId, this.previewShape);
    }

    context.clearDraggingShape();
    this.onCancel();
  }

  onCancel() {
    this.isDrawing = false;
    this.isDragging = false;
    this.dragStartPoint = null;
    this.dragLayerId = null;
    this.dragShapeId = null;
    this.originalShape = null;
    this.previewShape = null;
  }

  getCursor() {
    return "default";
  }

  private clearPreview(tempCanvas?: HTMLCanvasElement) {
    if (!tempCanvas) return;
    const ctx = tempCanvas.getContext("2d");
    ctx?.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
  }
}
