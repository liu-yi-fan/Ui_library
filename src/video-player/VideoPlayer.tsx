import { useRef, useState, useEffect } from "react"
import { VideoContext } from "./context"
import { VideoPanel } from "./components/VideoPanel"
import { ControlBar } from "./components/ControlBar"

interface Props {
  src: string
}

export function VideoPlayer({ src }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

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
    const video = videoRef.current
    if (!video) return
    video.currentTime = time
    setCurrentTime(time)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onLoaded = () => setDuration(video.duration)

    video.addEventListener("timeupdate", onTimeUpdate)
    video.addEventListener("loadedmetadata", onLoaded)

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate)
      video.removeEventListener("loadedmetadata", onLoaded)
    }
  }, [])

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
      <div className="space-y-2">
        <VideoPanel ref={videoRef} src={src} />
        <ControlBar />
      </div>
    </VideoContext.Provider>
  )
}