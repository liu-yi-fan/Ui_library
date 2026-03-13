export type ActivityData = {
  // durationMs: number
  // bucketSizeMs: number
  activity: number[]
}

type Props = {
  data: ActivityData
  height?: number
}

export default function ActivityGraph({ data, height = 40 }: Props) {
  const width = 1000
  const values = data.activity
  const maxValue = Math.max(...values, 1)
  const hasMultiplePoints = values.length > 1

  const stepX = hasMultiplePoints ? width / (values.length - 1) : width

  const points = values.map((v, i) => {
    const x = i * stepX
    const y = height - (v / maxValue) * height
    return { x, y }
  })

  const path = buildSmoothPath(points)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height }}
    >
      <path
        d={path}
        fill="none"
        stroke="rgb(59,130,246)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type Point = {
  x: number
  y: number
}

function buildSmoothPath(points: Point[]) {
  if (points.length === 0) return ""
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 0; i < points.length - 1; i += 1) {
    const current = points[i]
    const next = points[i + 1]
    const previous = points[i - 1] ?? current
    const afterNext = points[i + 2] ?? next

    const controlPoint1X = current.x + (next.x - previous.x) / 6
    const controlPoint1Y = current.y + (next.y - previous.y) / 6
    const controlPoint2X = next.x - (afterNext.x - current.x) / 6
    const controlPoint2Y = next.y - (afterNext.y - current.y) / 6

    path += ` C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${next.x} ${next.y}`
  }

  return path
}
