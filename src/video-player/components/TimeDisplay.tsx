import React from "react"

export interface TimeDisplayProps {
  currentTime: number   // seconds
  duration: number      // seconds
  showHours?: boolean
  className?: string
}

const formatTime = (seconds: number, showHours?: boolean) => {
  if (!isFinite(seconds)) return "00:00"

  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (showHours || hrs > 0) {
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  currentTime,
  duration,
  showHours,
  className,
}) => {
  return (
    <div className={`font-mono text-sm text-zinc-300 ${className ?? ""}`}>
      {formatTime(currentTime, showHours)} /{" "}
      {formatTime(duration, showHours)}
    </div>
  )
}