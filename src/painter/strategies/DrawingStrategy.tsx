import { Layer, Point, Shape } from "@/painter/stores/painterType";

export interface DrawingContext {
  color: string;
  strokeWidth: number;
  currentLayerId: string | null;
  layers: Layer[];
  selectedShapeId: string | null;
  selectedLayerId: string | null;
  onDrawComplete: (shape: Shape) => void;
  drawOnCurrentLayer: (shape: Shape) => void;
  setSelectedShape: (shapeId: string, layerId: string) => void;
  clearSelection: () => void;
  setDraggingShape: (shapeId: string, layerId: string) => void;
  clearDraggingShape: () => void;
  updateShape: (layerId: string, shapeId: string, nextShape: Shape) => void;
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
