import React from 'react'
import { usePainterStore } from '@/painter/painterStore'

export const Canvas = () => {
  const { mode } = usePainterStore()

  return (
    <div className="flex justify-center items-center">
      <canvas
        className="border min-h-[320px] "
      />
    </div>
  )
}
