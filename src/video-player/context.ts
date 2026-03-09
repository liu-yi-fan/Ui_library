// context.ts
import { createContext, useContext } from "react"

export interface VideoContextValue {
  isPlaying: boolean
  currentTime: number
  duration: number
  togglePlay: () => void
  seek: (time: number) => void
  videoRef: React.RefObject<HTMLVideoElement | null>
}

export const VideoContext = createContext<VideoContextValue | null>(null)

export const useVideoPlayer = () => {
  const ctx = useContext(VideoContext)
  if (!ctx) throw new Error("useVideoPlayer must be used inside VideoPlayer")
  return ctx
}
