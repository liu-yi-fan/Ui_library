import type React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Button, type ButtonProps } from "../stories/Button"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ButtonGroupItem extends Omit<ButtonProps, "className"> {
  className?: string
}

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ButtonGroupItem[]
  orientation?: "horizontal" | "vertical"
  fullWidth?: boolean
  buttonClassName?: string
}

export function ButtonGroup({
  items,
  orientation = "horizontal",
  fullWidth = false,
  buttonClassName,
  className,
  ...props
}: ButtonGroupProps) {
  const isVertical = orientation === "vertical"

  return (
    <div
      role="group"
      className={cn(
        "inline-flex",
        isVertical ? "flex-col" : "flex-row",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {items.map((item, index) => {
        const { label, className: itemClassName, ...buttonProps } = item
        const isFirst = index === 0
        const isLast = index === items.length - 1

        return (
          <Button
            key={item.id ?? `${label}-${index}`}
            {...buttonProps}
            label={label}
            className={cn(
              "relative rounded-none",
              fullWidth && "flex-1",
              !isVertical && !isFirst && "-ml-px",
              isVertical && !isFirst && "-mt-px",
              !isVertical && isFirst && "rounded-l",
              !isVertical && isLast && "rounded-r",
              isVertical && isFirst && "rounded-t",
              isVertical && isLast && "rounded-b",
              buttonClassName,
              itemClassName,
            )}
          />
        )
      })}
    </div>
  )
}
