import { useRef, useState } from "react"
import { VideoContext } from "./context"
import { VideoPanel } from "./components/VideoPanel"

export interface VideoPlayerProps {
  src: string
  children?: React.ReactNode
}

export const VideoPlayer = ({ src, children }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null as any)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const seek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  return (
    <VideoContext.Provider
      value={{
        isPlaying,
        currentTime,
        duration,
        togglePlay,
        seek,
        videoRef,
      }}
    >
      <VideoPanel
        ref={videoRef}
        src={src}
        onTimeUpdate={() =>
          setCurrentTime(videoRef.current?.currentTime ?? 0)
        }
        onLoadedMetadata={() =>
          setDuration(videoRef.current?.duration ?? 0)
        }
      />

      {children}
    </VideoContext.Provider>
  )
}