import { forwardRef, type CSSProperties } from "react"
import type React from "react"

const cx = (...values: Array<string | undefined | null | false>) =>
  values.filter(Boolean).join(" ")

export type VideoObjectFit = "contain" | "cover" | "fill" | "none" | "scale-down"

export interface VideoPanelProps
  extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "className"> {
  containerClassName?: string
  videoClassName?: string
  overlay?: React.ReactNode
  overlayClassName?: string
  aspectRatio?: "video" | "square" | "auto"
  fit?: VideoObjectFit
}

const aspectClassMap: Record<NonNullable<VideoPanelProps["aspectRatio"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  auto: "",
}

const fitClassMap: Record<VideoObjectFit, string> = {
  contain: "object-contain",
  cover: "object-cover",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
}

export const VideoPanel = forwardRef<HTMLVideoElement, VideoPanelProps>(
  (
    {
      containerClassName,
      videoClassName,
      overlay,
      overlayClassName,
      aspectRatio = "video",
      fit = "contain",
      style,
      ...videoProps
    },
    ref,
  ) => {
    const mergedStyle: CSSProperties = {
      borderRadius: "var(--radius-video-panel)",
      ...(style ?? {}),
    }

    return (
      <div
        className={cx(
          "relative w-full overflow-hidden bg-zinc-900",
          aspectClassMap[aspectRatio],
          containerClassName,
        )}
        style={mergedStyle}
      >
        <video ref={ref} className={cx("h-full w-full", fitClassMap[fit], videoClassName)} {...videoProps} />
        {overlay ? (
          <div className={cx("pointer-events-none absolute inset-0", overlayClassName)}>{overlay}</div>
        ) : null}
      </div>
    )
  },
)

VideoPanel.displayName = "VideoPanel"