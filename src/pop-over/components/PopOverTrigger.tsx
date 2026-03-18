import { Children, cloneElement, isValidElement } from "react"
import type React from "react"

export interface PopOverTriggerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "aria-expanded" | "aria-haspopup"> {
  asChild?: boolean
  type?: "button" | "submit" | "reset"
}

export interface PopOverTriggerInjectedProps {
  open?: boolean
  setOpen?: (open: boolean) => void
  contentId?: string
  triggerRef?: React.RefObject<HTMLElement | null>
}

export type PopOverTriggerComponentProps = PopOverTriggerProps & PopOverTriggerInjectedProps

export function PopOverTrigger({
  children,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  type = "button",
  asChild = false,
  open,
  setOpen,
  contentId,
  triggerRef,
  ...props
}: PopOverTriggerComponentProps) {
  const resolvedOpen = open ?? false

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    onMouseEnter?.(event)
    if (event.defaultPrevented) return
    setOpen?.(true)
  }

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    onMouseLeave?.(event)
    if (event.defaultPrevented) return
    setOpen?.(false)
  }

  const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
    onFocus?.(event)
    if (event.defaultPrevented) return
    setOpen?.(true)
  }

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    onBlur?.(event)
    if (event.defaultPrevented) return
    setOpen?.(false)
  }

  const triggerProps = {
    ...props,
    ref: triggerRef,
    "aria-expanded": resolvedOpen,
    "aria-haspopup": "dialog" as const,
    "aria-controls": contentId,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
  }

  if (asChild) {
    const child = Children.only(children)

    if (!isValidElement(child)) {
      return null
    }

    return cloneElement(child, triggerProps)
  }

  return (
    <button
      {...triggerProps}
      ref={triggerRef as React.Ref<HTMLButtonElement> | undefined}
      type={type}
    >
      {children}
    </button>
  )
}
