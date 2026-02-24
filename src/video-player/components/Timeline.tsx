import React, { useRef, useState } from "react"

export interface TimelineProps {
  startTimeMs: number
  durationMs: number
  currentTimeMs: number
  isPlaying?: boolean
  onSeek?: (timeMs: number) => void
}

const Timeline: React.FC<TimelineProps> = ({
  startTimeMs,
  durationMs,
  currentTimeMs,
  onSeek,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const progress = Math.min(
    Math.max((currentTimeMs - startTimeMs) / durationMs, 0),
    1
  )

  const getSeekTime = (clientX: number) => {
    if (!timelineRef.current) return

    const rect = timelineRef.current.getBoundingClientRect()
    const percent = (clientX - rect.left) / rect.width
    const clamped = Math.min(Math.max(percent, 0), 1)

    return startTimeMs + clamped * durationMs
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const time = getSeekTime(e.clientX)
    if (time && onSeek) onSeek(time)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const time = getSeekTime(e.clientX)
    if (time && onSeek) onSeek(time)
  }

  const handleMouseUp = () => setIsDragging(false)

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  })

  return (
    <div
      ref={timelineRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "relative",
        height: 8,
        background: "#ddd",
        cursor: "pointer",
        borderRadius: 4,
      }}
    >
      {/* progress */}
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: `${progress * 100}%`,
          background: "#2563eb",
          borderRadius: 4,
        }}
      />

      {/* thumb */}
      <div
        style={{
          position: "absolute",
          left: `${progress * 100}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 14,
          height: 14,
          background: "#2563eb",
          borderRadius: "50%",
        }}
      />
    </div>
  )
}

export default Timeline