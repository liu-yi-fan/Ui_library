import { create } from "zustand";
import { ToolBarMode } from "@/painter/Painter";
import { Layer, Shape } from "@/painter/stores/painterType";

interface PainterState {
  currentMode: ToolBarMode;
  currentLayerId: string;
  selectedShapeId: string | null;
  selectedLayerId: string | null;
  draggingShapeId: string | null;
  draggingLayerId: string | null;
  color: string;
  strokeWidth: number;
  layers: Layer[];
  setCurrentMode: (mode: PainterState["currentMode"]) => void;
  setCurrentLayer: (layerId: string) => void;
  setSelectedShape: (shapeId: string, layerId: string) => void;
  clearSelection: () => void;
  setDraggingShape: (shapeId: string, layerId: string) => void;
  clearDraggingShape: () => void;
  setColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  addLayer: () => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  addShape: (shape: Shape) => void;
  updateShape: (layerId: string, shapeId: string, nextShape: Shape) => void;
}

const initialLayerId = "layer-1";

function createLayer(index: number): Layer {
  const now = Date.now();

  return {
    id: `layer-${now}-${index}`,
    name: `圖層 ${index}`,
    shapes: [],
    visible: true,
    locked: false,
    opacity: 1,
    createdAt: now,
    updatedAt: now,
  };
}

export const usePainterStore = create<PainterState>((set) => ({
  currentMode: "line",
  currentLayerId: initialLayerId,
  selectedShapeId: null,
  selectedLayerId: null,
  draggingShapeId: null,
  draggingLayerId: null,
  color: "#000000",
  strokeWidth: 2,
  layers: [
    {
      id: initialLayerId,
      name: "圖層 1",
      shapes: [],
      visible: true,
      locked: false,
      opacity: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
  setCurrentMode: (currentMode) => set({ currentMode }),
  setCurrentLayer: (currentLayerId) => set({ currentLayerId }),
  setSelectedShape: (selectedShapeId, selectedLayerId) =>
    set({ selectedShapeId, selectedLayerId }),
  clearSelection: () =>
    set({ selectedShapeId: null, selectedLayerId: null }),
  setDraggingShape: (draggingShapeId, draggingLayerId) =>
    set({ draggingShapeId, draggingLayerId }),
  clearDraggingShape: () =>
    set({ draggingShapeId: null, draggingLayerId: null }),
  setColor: (color) => set({ color }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  addLayer: () =>
    set((state) => {
      const nextLayer = createLayer(state.layers.length + 1);

      return {
        currentLayerId: nextLayer.id,
        layers: [nextLayer, ...state.layers],
      };
    }),
  toggleLayerVisibility: (layerId) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id !== layerId
          ? layer
          : {
              ...layer,
              visible: !layer.visible,
              updatedAt: Date.now(),
            }
      ),
    })),
  toggleLayerLock: (layerId) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id !== layerId
          ? layer
          : {
              ...layer,
              locked: !layer.locked,
              updatedAt: Date.now(),
            }
      ),
    })),
  setLayerOpacity: (layerId, opacity) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id !== layerId
          ? layer
          : {
              ...layer,
              opacity,
              updatedAt: Date.now(),
            }
      ),
    })),
  addShape: (shape) =>
    set((state) => {
      const targetLayer = state.layers.find(
        (layer) => layer.id === state.currentLayerId
      );

      if (!targetLayer || targetLayer.locked || !targetLayer.visible) {
        return state;
      }

      const timestamp = Date.now();
      const normalizedShape: Shape = {
        ...shape,
        createdAt: shape.createdAt ?? timestamp,
        updatedAt: timestamp,
        visible: shape.visible ?? true,
        locked: shape.locked ?? false,
      };

      return {
        layers: state.layers.map((layer) =>
          layer.id !== state.currentLayerId
            ? layer
            : {
                ...layer,
                shapes: [...layer.shapes, normalizedShape],
                updatedAt: timestamp,
              }
        ),
      };
    }),
  updateShape: (layerId, shapeId, nextShape) =>
    set((state) => {
      const timestamp = Date.now();

      return {
        layers: state.layers.map((layer) =>
          layer.id !== layerId
            ? layer
            : {
                ...layer,
                shapes: layer.shapes.map((shape) =>
                  shape.id !== shapeId
                    ? shape
                    : {
                        ...nextShape,
                        updatedAt: timestamp,
                      }
                ),
                updatedAt: timestamp,
              }
        ),
      };
    }),
}));
