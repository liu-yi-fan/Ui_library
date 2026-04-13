import { useEffect } from "react";
import { Layer, Shape } from "@/painter/stores/painterType";

interface UseCanvasRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  layers: Layer[];
}

function drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
  if (shape.visible === false) return;

  switch (shape.type) {
    case "line": {
      const { start, end, color, strokeWidth, dash, lineCap } = shape.data;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = lineCap ?? "round";
      ctx.setLineDash(dash ?? []);
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.restore();
      return;
    }

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

    case "polygon": {
      const { points, color, strokeWidth, fill, fillColor, closed } = shape.data;

      if (points.length === 0) return;

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = color;
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      if (closed) {
        ctx.closePath();
      }

      if (fill) {
        ctx.fillStyle = fillColor ?? color;
        ctx.fill();
      }

      ctx.stroke();
      ctx.restore();
      return;
    }
  }
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
