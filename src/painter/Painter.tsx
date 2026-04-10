import React, { useRef } from "react";
import { ToolBar } from "@/painter/components";
import { Canvas } from "@/painter/components/Canvas";
import Layers from "@/painter/components/Layers";
import { usePainterStore } from "./stores/painterStore";
import { useDrawing } from "@/painter/hooks/useDrawing";

export type ToolBarMode = "line" | "polygon" | "square" | "ellipse" | "select";

export const Painter = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    currentMode, // 當前模式
    setCurrentMode, // 切換模式的方法
    color,
    strokeWidth,
    addShape,
  } = usePainterStore();

  const handleDrawComplete = (shape: any) => {
    console.log("繪製完成，形狀數據：", shape);
    addShape({
      id: `${shape.type}-${Date.now()}-${Math.random()}`,
      type: shape.type,
      data: shape.data,
      createdAt: Date.now(),
    });
  };

  const drawing = useDrawing({
    canvasRef,
    mode: currentMode, // 從 store 來
    color,
    strokeWidth,
    onDrawComplete: handleDrawComplete,
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
