import { useState } from "react"
import type React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  selectSize?: "small" | "medium" | "large"
  invalid?: boolean
  fullWidth?: boolean
  options: SelectOption[]
  placeholder?: string
}

export function Select({
  selectSize = "medium",
  invalid = false,
  fullWidth = false,
  options,
  placeholder,
  className,
  onBlur,
  onChange,
  onFocus,
  onKeyDown,
  onMouseDown,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn("relative inline-flex", fullWidth && "w-full")}>
      <select
        className={cn(
          "rounded border border-slate-300 bg-white text-slate-900 shadow-sm outline-none transition-colors  truncate overflow-hidden whitespace-nowrap",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
          "appearance-none pr-10",
          selectSize === "small" && "h-8 px-3 text-sm",
          selectSize === "medium" && "h-10 px-3 text-sm",
          selectSize === "large" && "h-12 px-4 text-base",
          invalid && "border-red-500 focus:border-red-500 focus:ring-red-200",
          fullWidth? "w-full" : "w-[200px]",
          className,
        )}
        onBlur={(event) => {
          setIsOpen(false)
          onBlur?.(event)
        }}
        onChange={(event) => {
          setIsOpen(false)
          onChange?.(event)
        }}
        onFocus={(event) => {
          onFocus?.(event)
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" || event.key === "Enter") {
            setIsOpen(false)
          }
          if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === " ") {
            setIsOpen(true)
          }
          onKeyDown?.(event)
        }}
        onMouseDown={(event) => {
          if (!props.disabled) {
            setIsOpen((current) => !current)
          }
          onMouseDown?.(event)
        }}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black transition-transform",
          isOpen && "rotate-180",
        )}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.99854 7.00153L12.0006 17.0027L21.0027 7.00153"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  )
}
