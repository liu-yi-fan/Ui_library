import PlayButton from "./PlayButton"
import { Timeline, type TimelineSegment } from "./Timeline"
import { TimeDisplay } from "./TimeDisplay"

interface ControlBarProps {
  segments: TimelineSegment[]
}

export function ControlBar({ segments }: ControlBarProps) {
  return (
    <div className="flex items-center gap-3">
      <PlayButton />
      <Timeline segments={segments} />
      <TimeDisplay />
    </div>
  )
}
