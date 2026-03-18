import type React from "react"

const cx = (...values: Array<string | undefined | null | false>) =>
  values.filter(Boolean).join(" ")

export type PopOverSide = "top" | "right" | "bottom" | "left"
export type PopOverAlign = "start" | "center" | "end"

export interface PopOverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: PopOverSide
  align?: PopOverAlign
  offset?: number
}

export interface PopOverContentInjectedProps {
  open?: boolean
  contentId?: string
}

export type PopOverContentComponentProps = PopOverContentProps & PopOverContentInjectedProps

const sideClassMap: Record<PopOverSide, string> = {
  top: "bottom-full",
  right: "left-full top-1/2 -translate-y-1/2",
  bottom: "top-full",
  left: "right-full top-1/2 -translate-y-1/2",
}

const alignClassMap: Record<PopOverSide, Record<PopOverAlign, string>> = {
  top: {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  },
  bottom: {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  },
  left: {
    start: "top-0",
    center: "top-1/2 -translate-y-1/2",
    end: "bottom-0",
  },
  right: {
    start: "top-0",
    center: "top-1/2 -translate-y-1/2",
    end: "bottom-0",
  },
}

export function PopOverContent({
  children,
  className,
  side = "bottom",
  align = "center",
  offset = 8,
  open,
  contentId,
  style,
  ...props
}: PopOverContentComponentProps) {

  if (!open) return null

  const spacingStyle =
    side === "top"
      ? { marginBottom: offset }
      : side === "bottom"
        ? { marginTop: offset }
        : side === "left"
          ? { marginRight: offset }
          : { marginLeft: offset }

  return (
    <div
      {...props}
      id={contentId}
      role="dialog"
      className={cx(
        "absolute z-50 min-w-3 rounded-lg border border-zinc-200 bg-white p-1 text-sm text-zinc-900 shadow-lg",
        sideClassMap[side],
        alignClassMap[side][align],
        className,
      )}
      style={{
        ...spacingStyle,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
