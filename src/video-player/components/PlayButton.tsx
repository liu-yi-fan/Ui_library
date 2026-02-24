import React from "react"

export interface PlayButtonProps {
  isPlaying: boolean
  onToggle: () => void
  size?: number
  color?: string
  className?: string
}

const PlayButton: React.FC<PlayButtonProps> = ({
  isPlaying,
  onToggle,
  size = 36,
  color = "#ffffff",
  className = "",
}) => {
  return (
    <button
      onClick={onToggle}
      className={className}
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        background: "rgba(0,0,0,0.5)",
      }}
    >
      {isPlaying ? (
        // pause icon
        <svg
          width={size * 0.45}
          height={size * 0.45}
          viewBox="0 0 24 24"
          fill={color}
        >
          <rect x="5" y="4" width="5" height="16" />
          <rect x="14" y="4" width="5" height="16" />
        </svg>
      ) : (
        // play icon
        <svg
          width={size * 0.45}
          height={size * 0.45}
          viewBox="0 0 24 24"
          fill={color}
        >
          <polygon points="5,3 19,12 5,21" />
        </svg>
      )}
    </button>
  )
}

export default PlayButton