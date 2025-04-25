"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Stack.tsx
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    direction?: 'row' | 'column';
    spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between';
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
    ({
        children,
        direction = 'column',
        spacing = 'md',
        align = 'stretch',
        justify = 'start',
        className,
        ...props
    }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex",
                    {
                        "flex-row": direction === "row",
                        "flex-col": direction === "column",
                        "gap-0": spacing === "none",
                        "gap-2": spacing === "sm",
                        "gap-4": spacing === "md",
                        "gap-6": spacing === "lg",
                        "gap-8": spacing === "xl",
                        "items-start": align === "start",
                        "items-center": align === "center",
                        "items-end": align === "end",
                        "items-stretch": align === "stretch",
                        "justify-start": justify === "start",
                        "justify-center": justify === "center",
                        "justify-end": justify === "end",
                        "justify-between": justify === "between",
                    },
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
Stack.displayName = "Stack"

export { Stack }