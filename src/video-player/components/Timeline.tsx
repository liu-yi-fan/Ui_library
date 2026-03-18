import { useRef } from "react"
import { useVideoPlayer } from "../context"
import { PopOver, PopOverContent, PopOverTrigger } from "@/pop-over"

export type TimelineSegment = {
  id: string
  startMs: number
  endMs: number
  detType: string
  snapdshot?: string
}

export interface TimelineProps {
  segments?: TimelineSegment[]
}

export function Timeline({ segments }: TimelineProps) {
  const { currentTime, duration, seek } = useVideoPlayer()
  const ref = useRef<HTMLDivElement>(null)
  const durationMs = duration ? duration * 1000 : 0 

  const handleClick = (e: React.MouseEvent) => {
    if (!ref.current || !duration) return
    const rect = ref.current.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    seek(ratio * duration)
  }

  const percent = duration ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className="h-2 bg-zinc-700 rounded cursor-pointer relative"
    >
      <div
        className="h-full bg-white/50 rounded"
        style={{ width: `${percent}%` }}
      />
      {/* Render segments */}
      {segments?.map((segment) => {
        if (!durationMs) return null

        const startPercent = (segment.startMs / durationMs) * 100
        const endPercent = (segment.endMs / durationMs) * 100
        const widthPercent = endPercent - startPercent

        return (
          <PopOver
            key={segment.id}
            className="absolute top-1/2 -translate-y-1/2 h-2"
            style={{
              left: `${startPercent}%`,
              width: `${widthPercent}%`,
            }}
            content={
              <PopOverContent>
                <div className="space-y-2 flex flex-col items-center w-28">
                  <h3 className="font-medium text-zinc-900">Time: {segment.startMs / 1000}s - {segment.endMs / 1000}s</h3>
                  {segment.snapdshot && (
                    <img src={segment.snapdshot} alt="Snapshot" className="max-w-12 h-auto rounded" />
                  )}
                 
                </div>
              </PopOverContent>
            }
            trigger={
              <PopOverTrigger asChild>
                <div
                  className="h-full w-full rounded"
                  style={{
                    backgroundColor: segment.detType === "person" ? "#717d93" : "#7090ab",
                  }}
                />
              </PopOverTrigger>
            }
          />
        )
      })}
      
      <div className="rounded-full w-3 h-3 bg-slate-500 absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${percent}%` }} />
    </div>
  )
}
