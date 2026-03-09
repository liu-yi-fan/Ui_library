import  PlayButton  from "./PlayButton"
import  {Timeline}  from "./Timeline"
import { TimeDisplay } from "./TimeDisplay"

export function ControlBar() {
  return (
    <div className="flex items-center gap-3">
      <PlayButton />
      <Timeline />
      <TimeDisplay />
    </div>
  )
}