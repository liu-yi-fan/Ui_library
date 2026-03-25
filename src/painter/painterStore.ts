import { create } from 'zustand'
import { ToolBarMode } from './Painter'

interface PainterState {
  mode: ToolBarMode
  setMode: (mode: ToolBarMode) => void
}

export const usePainterStore = create<PainterState>((set) => ({
  mode: 'select',
  setMode: (mode) => set({ mode }),
}))