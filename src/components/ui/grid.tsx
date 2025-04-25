// Grid.tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    responsive?: boolean;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    ({ children, cols = 3, gap = 'md', responsive = true, className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "grid",
                    {
                        "grid-cols-1": responsive,
                        "sm:grid-cols-2": responsive && cols >= 2,
                        "md:grid-cols-3": responsive && cols >= 3,
                        "lg:grid-cols-4": responsive && cols >= 4,
                        [`grid-cols-${cols}`]: !responsive,
                        "gap-0": gap === "none",
                        "gap-2": gap === "sm",
                        "gap-4": gap === "md",
                        "gap-6": gap === "lg",
                        "gap-8": gap === "xl"
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
Grid.displayName = "Grid"

export { Grid }