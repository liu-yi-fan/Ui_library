import React from "react";
import { usePainterStore } from "@/painter/stores/painterStore";

function Layers() {
  const {
    layers,
    currentLayerId,
    setCurrentLayer,
    addLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    setLayerOpacity,
  } = usePainterStore();

  return (
    <aside className="min-w-60 space-y-3 bg-stone-100 p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-700">
          Layers
        </h2>
        <button
          type="button"
          onClick={addLayer}
          className="rounded border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700 hover:bg-stone-50"
        >
          New Layer
        </button>
      </div>

      <div className="space-y-2">
        {layers.map((layer) => {
          const isActive = layer.id === currentLayerId;

          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => setCurrentLayer(layer.id)}
              className={`block w-full rounded border p-3 text-left transition ${
                isActive
                  ? "border-stone-900 bg-white shadow-sm"
                  : "border-stone-200 bg-stone-50 hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-stone-900">
                    {layer.name}
                  </div>
                  <div className="text-xs text-stone-500">
                    {layer.shapes.length} shapes
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(layer.id);
                    }}
                    className={`rounded border px-2 py-1 text-xs ${
                      layer.visible
                        ? "border-stone-300 bg-white text-stone-700"
                        : "border-stone-200 bg-stone-200 text-stone-500"
                    }`}
                  >
                    {layer.visible ? "Visible" : "Hidden"}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerLock(layer.id);
                    }}
                    className={`rounded border px-2 py-1 text-xs ${
                      layer.locked
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-300 bg-white text-stone-700"
                    }`}
                  >
                    {layer.locked ? "Locked" : "Unlocked"}
                  </button>
                </div>
              </div>

              <label className="mt-3 block">
                <span className="mb-1 block text-xs text-stone-500">
                  Opacity {Math.round(layer.opacity * 100)}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(layer.opacity * 100)}
                  onChange={(e) => {
                    e.stopPropagation();
                    setLayerOpacity(layer.id, Number(e.target.value) / 100);
                  }}
                  className="w-full"
                />
              </label>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default Layers;
