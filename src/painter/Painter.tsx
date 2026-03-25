import React from 'react'
import { ToolBar } from '@/painter/components'
import { Canvas } from '@/painter/components/Canvas'
import  Layers  from '@/painter/components/Layers'
import { usePainterStore } from './painterStore'

export type ToolBarMode = 'line' | 'polygon' |'square' | 'ellipse' | 'select'

export const Painter = () => {
  const { setMode } = usePainterStore()

  return (
    <div className='flex flex-row'>
      <ToolBar onModeChange={setMode} />
      <Canvas />
      <Layers />
    </div>
  )
}

