import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white",
          "border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-inner",
          "outline-none transition-all",
          "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
