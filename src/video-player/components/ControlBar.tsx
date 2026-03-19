import { useRef, useState } from "react"
import ActivityGraph, { type ActivityData } from "./ActivityGraph"
import PlayButton from "./PlayButton"
import { Timeline, type TimelineSegment } from "./Timeline"
import { TimeDisplay } from "./TimeDisplay"

interface ControlBarProps {
  segments?: TimelineSegment[]
  activity?: ActivityData
  showSegmentPopover?: boolean
}

export function ControlBar({ segments, activity, showSegmentPopover = true }: ControlBarProps) {
  const timelineAreaRef = useRef<HTMLDivElement>(null)
  const [showActivityGraph, setShowActivityGraph] = useState(false)

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!timelineAreaRef.current || !activity) return

    const rect = timelineAreaRef.current.getBoundingClientRect()
    const proximityPadding = 36
    const isNearTimeline =
      event.clientX >= rect.left - proximityPadding &&
      event.clientX <= rect.right + proximityPadding &&
      event.clientY >= rect.top - proximityPadding &&
      event.clientY <= rect.bottom + proximityPadding

    setShowActivityGraph(isNearTimeline)
  }

  return (
    <div
      className="flex flex-col"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setShowActivityGraph(false)}
    >
      <div ref={timelineAreaRef} className="flex flex-col gap-2">
         {activity ? (
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              showActivityGraph
                ? "max-h-16 -translate-y-14 opacity-100 absolute"
                : "max-h-5 -translate-y-2 opacity-0 absolute"
            }`}
          >
            <ActivityGraph data={activity} />
          </div>
        ) : null}
        <Timeline segments={segments} showSegmentPopover={showSegmentPopover} />
      </div>
      <div className="flex flex-row justify-between items-center">
        <PlayButton />
        <TimeDisplay />
      </div>
    </div>
  )
}
