// Flex.tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
    ({
        children,
        direction = 'row',
        wrap = 'nowrap',
        align = 'stretch',
        justify = 'start',
        gap = 'none',
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
                        "flex-row-reverse": direction === "row-reverse",
                        "flex-col": direction === "column",
                        "flex-col-reverse": direction === "column-reverse",
                        "flex-nowrap": wrap === "nowrap",
                        "flex-wrap": wrap === "wrap",
                        "flex-wrap-reverse": wrap === "wrap-reverse",
                        "items-start": align === "start",
                        "items-center": align === "center",
                        "items-end": align === "end",
                        "items-stretch": align === "stretch",
                        "items-baseline": align === "baseline",
                        "justify-start": justify === "start",
                        "justify-center": justify === "center",
                        "justify-end": justify === "end",
                        "justify-between": justify === "between",
                        "justify-around": justify === "around",
                        "justify-evenly": justify === "evenly",
                        "gap-0": gap === "none",
                        "gap-2": gap === "sm",
                        "gap-4": gap === "md",
                        "gap-6": gap === "lg",
                        "gap-8": gap === "xl",
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
Flex.displayName = "Flex"

export { Flex }