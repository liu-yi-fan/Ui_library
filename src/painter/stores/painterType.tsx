export interface Point {
  x: number
  y: number
}

export interface BaseShape {
  id: string
  type: ShapeType
  createdAt?: number
  updatedAt?: number
  locked?: boolean
  visible?: boolean
}

/**
 * 線條形狀
 */
export interface LineShape extends BaseShape {
  type: 'line'
  data: {
    start: Point
    end: Point
    color: string
    strokeWidth: number
    dash?: number[]  // 虛線樣式，如 [5, 5]
    lineCap?: 'butt' | 'round' | 'square'
  }
}

/**
 * 矩形形狀
 */
export interface RectangleShape extends BaseShape {
  type: 'square'
  data: {
    x: number
    y: number
    width: number
    height: number
    color: string
    strokeWidth: number
    fill?: boolean
    fillColor?: string
    borderRadius?: number  // 圓角半徑
  }
}

/**
 * 橢圓形狀
 */
export interface EllipseShape extends BaseShape {
  type: 'ellipse'
  data: {
    x: number      // 中心點 X
    y: number      // 中心點 Y
    radiusX: number
    radiusY: number
    color: string
    strokeWidth: number
    fill?: boolean
    fillColor?: string
    rotation?: number  // 旋轉角度（弧度）
  }
}

/**
 * 多邊形形狀
 */
export interface PolygonShape extends BaseShape {
  type: 'polygon'
  data: {
    points: Point[]
    color: string
    strokeWidth: number
    fill?: boolean
    fillColor?: string
    closed?: boolean  // 是否封閉
  }
}

export type Shape = 
  | LineShape 
  | RectangleShape 
  | EllipseShape 
  | PolygonShape 

/**
 * 形狀類型
 */
export type ShapeType = Shape['type']

export interface Layer {
  id: string
  name: string
  visible: boolean
  locked: boolean
  opacity: number           // 0-1 之間的透明度
  shapes: Shape[]           // 該圖層的所有形狀
  
  // 可選屬性
  thumbnail?: string        // 圖層縮圖（base64）
  createdAt: number
  updatedAt: number
  metadata?: {
    width?: number
    height?: number
    backgroundColor?: string
    description?: string
  }
}
