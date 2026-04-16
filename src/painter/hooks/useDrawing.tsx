import { useState, useCallback, useRef, useEffect } from "react";
import { Point, Shape } from "@/painter/stores/painterType";
import {
  DrawingContext,
  DrawingStrategy,
} from "@/painter/strategies/DrawingStrategy";
import { EllipseStrategy } from "@/painter/strategies/EllipseStrategy";
import { LineStrategy } from "@/painter/strategies/LineStrategy";
import { PolygonStrategy } from "@/painter/strategies/PolygonStrategy";
import { SquareStrategy } from "@/painter/strategies/SquareStrategy";

interface UseDrawingProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  mode: "line" | "polygon" | "square" | "ellipse" | "select";
  currentLayerId: string | null;
  color: string;
  strokeWidth: number;
  onDrawComplete: (shape: Shape) => void;
}

export function useDrawing({
  canvasRef,
  mode,
  currentLayerId,
  color,
  strokeWidth,
  onDrawComplete,
}: UseDrawingProps) {
  const [strategy, setStrategy] = useState<DrawingStrategy | null>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawingContext: DrawingContext = {
    color,
    strokeWidth,
    currentLayerId,
    onDrawComplete,
    drawOnCurrentLayer: onDrawComplete,
  };

  useEffect(() => {
    let newStrategy: DrawingStrategy | null = null;

    switch (mode) {
      case "line":
        newStrategy = new LineStrategy();
        break;
      case "polygon":
        newStrategy = new PolygonStrategy();
        break;
      case "square":
        newStrategy = new SquareStrategy();
        break;
      case "ellipse":
        newStrategy = new EllipseStrategy();
        break;
      case "select":
        break;
    }

    setStrategy(newStrategy);
  }, [mode]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
    tempCanvas.style.position = "absolute";
    tempCanvas.style.top = "10px";
    tempCanvas.style.left = "72px";
    tempCanvas.style.pointerEvents = "none";
    tempCanvasRef.current = tempCanvas;

    return () => {
      tempCanvas.remove();
    };
  }, [canvasRef]);

  const getCanvasCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);

      return { x, y };
    },
    [canvasRef]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!strategy) return;

      const point = getCanvasCoordinates(e);
      if (!point) return;

      strategy.onStart(point, drawingContext, tempCanvasRef.current || undefined);
      strategy.isDrawing = true;

      if (tempCanvasRef.current && canvasRef.current?.parentNode) {
        canvasRef.current.parentNode.appendChild(tempCanvasRef.current);
      }
    },
    [strategy, getCanvasCoordinates, drawingContext, canvasRef]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!strategy || !strategy.isDrawing) return;

      const point = getCanvasCoordinates(e);
      if (!point) return;

      strategy.onMove(point, drawingContext, tempCanvasRef.current || undefined);
    },
    [strategy, getCanvasCoordinates, drawingContext]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!strategy) return;

      if (strategy.isDrawing && strategy.name !== "polygon") {
        const point = getCanvasCoordinates(e);
        strategy.onEnd(point, drawingContext);
      }

      if (!strategy.isDrawing && tempCanvasRef.current) {
        const ctx = tempCanvasRef.current.getContext("2d");
        ctx?.clearRect(
          0,
          0,
          tempCanvasRef.current.width,
          tempCanvasRef.current.height
        );

        if (tempCanvasRef.current.parentNode) {
          tempCanvasRef.current.parentNode.removeChild(tempCanvasRef.current);
        }
      }
    },
    [strategy, getCanvasCoordinates, drawingContext]
  );

  const cursor = strategy?.getCursor() || "default";

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cursor,
    isDrawing: strategy?.isDrawing || false,
  };
}
