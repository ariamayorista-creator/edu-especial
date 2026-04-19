import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-2xl bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white",
          "border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-inner",
          "outline-none transition-all resize-none",
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
Textarea.displayName = "Textarea"

export { Textarea }
