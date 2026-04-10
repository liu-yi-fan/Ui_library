import React from 'react'

interface CanvasProps {
  innerRef: React.RefObject<HTMLCanvasElement | null>
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void
  cursor?: string
}

export const Canvas = ({
  innerRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  cursor = 'default'
}: CanvasProps) => {
  return (
    <div className="flex justify-center items-center">
      <canvas
        ref={innerRef}
        width={680}
        height={400}
        
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        className="border"
        style={{ cursor }}
      />
    </div>
  )
}
