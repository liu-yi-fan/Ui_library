// hooks/useDrawing.ts
import { useState, useCallback, useRef, useEffect } from 'react'
import { Point } from "@/painter/stores/painterType"
import { DrawingContext, DrawingStrategy } from "@/painter/strategies/DrawingStrategy"
import { PolygonStrategy } from "@/painter/strategies/PolygonStrategy"

interface UseDrawingProps {
  canvasRef: React.RefObject<HTMLCanvasElement|null>
  mode: 'line' | 'polygon' | 'square' | 'ellipse' | 'select'
  color: string
  strokeWidth: number
  onDrawComplete: (shape: any) => void
}

export function useDrawing({ 
  canvasRef, 
  mode, 
  color, 
  strokeWidth, 
  onDrawComplete 
}: UseDrawingProps) {
  const [strategy, setStrategy] = useState<DrawingStrategy | null>(null)
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null)
  
  // 繪製上下文
  const drawingContext: DrawingContext = {
    color,
    strokeWidth,
    currentLayerId: null,
    onDrawComplete,
    drawOnCurrentLayer: onDrawComplete
  }
  
  // 根據 mode 切換策略
  useEffect(() => {
    let newStrategy: DrawingStrategy | null = null
    
    switch (mode) {
      case 'line':
        console.log('切換到線條工具')
        // newStrategy = new LineStrategy()
        break
      case 'square':
        console.log('切換到矩形工具')
        // newStrategy = new SquareStrategy()
        break
      case 'ellipse':
        console.log('切換到橢圓工具')
        // newStrategy = new EllipseStrategy()
        break
      case 'polygon':
        console.log('切換到多邊形工具')
        newStrategy = new PolygonStrategy()
        break
      case 'select':
        console.log('切換到選擇工具')
        // newStrategy = new SelectStrategy()
        break
    }
    
    setStrategy(newStrategy)
  }, [mode])
  
  // 創建臨時 canvas（用於預覽）
  useEffect(() => {
    if (!canvasRef.current) return
    
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvasRef.current.width
    tempCanvas.height = canvasRef.current.height
    tempCanvas.style.position = 'absolute'
    tempCanvas.style.top = '0'
    tempCanvas.style.left = '0'
    tempCanvas.style.pointerEvents = 'none'
    tempCanvasRef.current = tempCanvas
    
    return () => {
      tempCanvas.remove()
    }
  }, [canvasRef])
  
  // 獲取 canvas 座標
  const getCanvasCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }, [canvasRef])
  
  // 事件處理
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!strategy) return
    
    const point = getCanvasCoordinates(e)
    if (!point) return
    
    strategy.onStart(point, drawingContext)
    
    // 添加臨時 canvas
    if (tempCanvasRef.current && canvasRef.current?.parentNode) {
      canvasRef.current.parentNode.appendChild(tempCanvasRef.current)
    }
  }, [strategy, getCanvasCoordinates, drawingContext])
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!strategy || !strategy.isDrawing) return
    
    const point = getCanvasCoordinates(e)
    if (!point) return
    
    // 清除臨時 canvas
    if (tempCanvasRef.current) {
      const ctx = tempCanvasRef.current.getContext('2d')
      ctx?.clearRect(0, 0, tempCanvasRef.current.width, tempCanvasRef.current.height)
    }
    
    strategy.onMove(point, drawingContext, tempCanvasRef.current || undefined)
  }, [strategy, getCanvasCoordinates, drawingContext])
  
  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!strategy || !strategy.isDrawing) return
    
    const point = getCanvasCoordinates(e)
    strategy.onEnd(point, drawingContext)
    
    // 移除臨時 canvas
    if (tempCanvasRef.current?.parentNode) {
      tempCanvasRef.current.parentNode.removeChild(tempCanvasRef.current)
    }
  }, [strategy, getCanvasCoordinates, drawingContext])
  
  const cursor = strategy?.getCursor() || 'default'
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cursor,
    isDrawing: strategy?.isDrawing || false
  }
}
