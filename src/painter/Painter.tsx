import React, { useRef } from "react";
import { ToolBar } from "@/painter/components";
import { Canvas } from "@/painter/components/Canvas";
import Layers from "@/painter/components/Layers";
import { usePainterStore } from "./stores/painterStore";
import { useDrawing } from "@/painter/hooks/useDrawing";
import { useCanvasRenderer } from "@/painter/hooks/useCanvasRenderer";
import { Shape } from "@/painter/stores/painterType";

export type ToolBarMode = "line" | "polygon" | "square" | "ellipse" | "select";

export const Painter = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    currentMode,
    currentLayerId,
    setCurrentMode,
    color,
    strokeWidth,
    layers,
    addShape,
  } = usePainterStore();

  const handleDrawComplete = (shape: Shape) => {
    addShape(shape);
  };

  const drawing = useDrawing({
    canvasRef,
    mode: currentMode,
    currentLayerId,
    color,
    strokeWidth,
    onDrawComplete: handleDrawComplete,
  });

  useCanvasRenderer({
    canvasRef,
    layers,
  });

  return (
    <div className="flex flex-row">
      <ToolBar onModeChange={setCurrentMode} />
      <Canvas
        innerRef={canvasRef}
        onMouseDown={drawing.handleMouseDown}
        onMouseMove={drawing.handleMouseMove}
        onMouseUp={drawing.handleMouseUp}
        cursor={drawing.cursor}
      />
      <Layers />
    </div>
  );
};
