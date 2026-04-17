import { useEffect } from "react";
import { Layer } from "@/painter/stores/painterType";
import { drawShape } from "@/painter/renderers/shapeDrawers";
import { getShapeBounds } from "@/painter/utils/shapeSelection";

interface UseCanvasRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  layers: Layer[];
  selectedShapeId: string | null;
  selectedLayerId: string | null;
  draggingShapeId: string | null;
  draggingLayerId: string | null;
}

export function useCanvasRenderer({
  canvasRef,
  layers,
  selectedShapeId,
  selectedLayerId,
  draggingShapeId,
  draggingLayerId,
}: UseCanvasRendererProps) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const layer of layers) {
      if (!layer.visible) continue;

      context.save();
      context.globalAlpha = layer.opacity;

      for (const shape of layer.shapes) {
        if (layer.id === draggingLayerId && shape.id === draggingShapeId) {
          continue;
        }
        drawShape(context, shape);
      }

      context.restore();
    }

    if (selectedShapeId && selectedLayerId && !draggingShapeId) {
      const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);
      const selectedShape = selectedLayer?.shapes.find(
        (shape) => shape.id === selectedShapeId
      );

      if (selectedLayer?.visible && selectedShape?.visible !== false && selectedShape) {
        const bounds = getShapeBounds(selectedShape);
        context.save();
        context.setLineDash([6, 4]);
        context.strokeStyle = "#2563eb";
        context.lineWidth = 1.5;
        context.strokeRect(
          bounds.minX,
          bounds.minY,
          bounds.maxX - bounds.minX,
          bounds.maxY - bounds.minY
        );
        context.restore();
      }
    }
  }, [
    canvasRef,
    layers,
    selectedShapeId,
    selectedLayerId,
    draggingShapeId,
    draggingLayerId,
  ]);
}
