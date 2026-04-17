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
    selectedShapeId,
    selectedLayerId,
    draggingShapeId,
    draggingLayerId,
    setCurrentMode,
    setColor,
    setSelectedShape,
    clearSelection,
    setDraggingShape,
    clearDraggingShape,
    color,
    strokeWidth,
    layers,
    addShape,
    updateShape,
  } = usePainterStore();

  const handleDrawComplete = (shape: Shape) => {
    addShape(shape);
  };

  const drawing = useDrawing({
    canvasRef,
    mode: currentMode,
    currentLayerId,
    layers,
    selectedShapeId,
    selectedLayerId,
    color,
    strokeWidth,
    onDrawComplete: handleDrawComplete,
    setSelectedShape,
    clearSelection,
    setDraggingShape,
    clearDraggingShape,
    updateShape,
  });

  useCanvasRenderer({
    canvasRef,
    layers,
    selectedShapeId,
    selectedLayerId,
    draggingShapeId,
    draggingLayerId,
  });

  return (
    <div className="flex flex-row">
      <ToolBar onModeChange={setCurrentMode} onColorChange={setColor}/>
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
