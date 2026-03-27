import React, { useRef } from 'react'
import { usePainterStore } from '@/painter/stores/painterStore'

interface CanvasProps {
  innerRef: React.RefObject<HTMLCanvasElement | null>;
}

export const Canvas = ({ innerRef }: CanvasProps) => {
  // 
  // const { mode } = usePainterStore()

  return (
    <div className="flex justify-center items-center">
      <canvas
        ref={innerRef}
        width={680}
        height={400}
        className="border "
      />
    </div>
  )
}
