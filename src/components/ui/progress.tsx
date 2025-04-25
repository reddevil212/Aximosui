"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Root = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, children, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn(
            "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
            className
        )}
        {...props}
    >
        {children || (
            <ProgressPrimitive.Indicator
                className="h-full w-full flex-1 bg-primary transition-all"
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        )}
    </ProgressPrimitive.Root>
))
Root.displayName = "Progress"

const Indicator = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Indicator>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Indicator>
>(({ className, ...props }, ref) => (
    <ProgressPrimitive.Indicator
        ref={ref}
        className={cn("h-full w-full flex-1 bg-primary transition-all", className)}
        {...props}
    />
))
Indicator.displayName = "Progress.Indicator"

const Progress = Object.assign(Root, { Indicator })

export { Progress }