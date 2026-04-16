import { useEffect } from "react";
import { Layer } from "@/painter/stores/painterType";
import { drawShape } from "@/painter/renderers/shapeDrawers";

interface UseCanvasRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  layers: Layer[];
}

export function useCanvasRenderer({
  canvasRef,
  layers,
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
        drawShape(context, shape);
      }

      context.restore();
    }
  }, [canvasRef, layers]);
}
