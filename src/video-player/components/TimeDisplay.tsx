import { useVideoPlayer } from "../context"

const format = (time: number) => {
  if (!time) return "00:00"
  const m = Math.floor(time / 60)
  const s = Math.floor(time % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function TimeDisplay() {
  const { currentTime, duration } = useVideoPlayer()

  return (
    <span className="text-xs text-zinc-400 whitespace-nowrap">
      {format(currentTime)} / {format(duration)}
    </span>
  )
}