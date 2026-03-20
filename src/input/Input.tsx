import type React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputSize?: "small" | "medium" | "large"
  invalid?: boolean
  fullWidth?: boolean
}

export function Input({
  inputSize = "medium",
  invalid = false,
  fullWidth = false,
  className,
  type = "text",
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "rounded border border-slate-300 bg-white text-slate-900 shadow-sm outline-none transition-colors",
        "placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
        "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
        inputSize === "small" && "h-8 px-3 text-sm",
        inputSize === "medium" && "h-10 px-3 text-sm",
        inputSize === "large" && "h-12 px-4 text-base",
        invalid && "border-red-500 focus:border-red-500 focus:ring-red-200",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  )
}
