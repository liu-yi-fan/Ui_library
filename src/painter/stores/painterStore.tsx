// stores/painter/painterStore.ts
import { create } from "zustand";
import { ToolBarMode } from "@/painter/Painter";
import { Layer, Shape } from "@/painter/stores/painterType";

interface PainterState {
  currentMode: ToolBarMode;
  color: string;
  strokeWidth: number;
  layers: Layer[];

  setCurrentMode: (mode: PainterState["currentMode"]) => void;
  setColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  addShape: (shape: Shape) => void;
}

export const usePainterStore = create<PainterState>((set) => ({
  currentMode: "line", // ✅ 唯一的 truth source
  color: "#000000",
  strokeWidth: 2,
  layers: [
    {
      id: "layer-1",
      name: "圖層 1",
      shapes: [],
      visible: true,
      locked: false,
      opacity: 1,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    },
  ],

  setCurrentMode: (mode) => set({ currentMode: mode }),
  setColor: (color) => set({ color }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  addShape: (shape) => {
    // 添加形狀邏輯
  },
}));
