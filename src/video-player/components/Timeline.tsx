import { useRef } from "react"
import { useVideoPlayer } from "../context"

export function Timeline() {
  const { currentTime, duration, seek } = useVideoPlayer()
  const ref = useRef<HTMLDivElement>(null)

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
      className="flex-1 h-2 bg-zinc-700 rounded cursor-pointer"
    >
      <div
        className="h-full bg-amber-600 rounded relative"
        style={{ width: `${percent}%` }}
      >
      <div className="rounded-full w-3 h-3 bg-rose-600 absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${percent}%` }} />
      </div>
    </div>
  )
}