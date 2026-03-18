import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react"
import type React from "react"
import type { PopOverContentComponentProps, PopOverContentProps } from "./components/PopOverContent"
import type { PopOverTriggerComponentProps, PopOverTriggerProps } from "./components/PopOverTrigger"

const cx = (...values: Array<string | undefined | null | false>) =>
  values.filter(Boolean).join(" ")

export interface PopOverProps {
  trigger: React.ReactElement<PopOverTriggerProps>
  content: React.ReactElement<PopOverContentProps>
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  style?: React.CSSProperties
}

export function PopOver({
  trigger,
  content,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  className,
  style,
}: PopOverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement>(null)
  const contentId = useId()

  const open = openProp ?? uncontrolledOpen

  const setOpen = (nextOpen: boolean) => {
    if (openProp === undefined) {
      setUncontrolledOpen(nextOpen)
    }

    onOpenChange?.(nextOpen)
  }

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent | PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (containerRef.current?.contains(target)) return
      setOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  if (!isValidElement(trigger) || !isValidElement(content)) {
    return null
  }

  const triggerElement = cloneElement(trigger as React.ReactElement<PopOverTriggerComponentProps>, {
    open,
    setOpen,
    contentId,
    triggerRef,
  })

  const contentElement = cloneElement(content as React.ReactElement<PopOverContentComponentProps>, {
    open,
    contentId,
  })
//relative 
  return (
    <div
      ref={containerRef}
      className={cx("inline-flex", className)}
      style={style}
    >
      {triggerElement}
      {contentElement}
    </div>
  )
}
