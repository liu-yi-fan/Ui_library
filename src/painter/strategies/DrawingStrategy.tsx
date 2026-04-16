import { Point, Shape } from "@/painter/stores/painterType";

export interface DrawingContext {
  color: string;
  strokeWidth: number;
  currentLayerId: string | null;
  onDrawComplete: (shape: Shape) => void;
  drawOnCurrentLayer: (shape: Shape) => void;
}

export interface DrawingStrategy {
  readonly name: string;
  onStart: (
    point: Point,
    context: DrawingContext,
    tempCanvas?: HTMLCanvasElement
  ) => void;
  onMove: (
    point: Point,
    context: DrawingContext,
    tempCanvas?: HTMLCanvasElement
  ) => void;
  onEnd: (point: Point | null, context: DrawingContext) => void;
  onCancel: () => void;
  getCursor: () => string;
  isDrawing: boolean;
}
