// strategies/DrawingStrategy.ts
import { Point } from "@/painter/stores/painterType"

export interface DrawingContext {
  color: string
  strokeWidth: number
  // brushSize: number
  currentLayerId: string | null
  onDrawComplete: (shape: any) => void
  drawOnCurrentLayer: (data: any) => void
}

export interface DrawingStrategy {
  // 策略名稱
  readonly name: string
  
  // 開始繪製（滑鼠按下）
  onStart: (
    point: Point, 
    context: DrawingContext
  ) => void
  
  // 繪製中（滑鼠移動）
  onMove: (
    point: Point,
    context: DrawingContext,
    tempCanvas?: HTMLCanvasElement  // 用於即時預覽
  ) => void
  
  // 結束繪製（滑鼠放開）
  onEnd: (
    point: Point | null,
    context: DrawingContext
  ) => void
  
  // 取消繪製
  onCancel: () => void
  
  // 獲取遊標樣式
  getCursor: () => string
  
  // 是否正在繪製中
  isDrawing: boolean
}