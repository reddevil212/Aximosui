"use client"

import * as React from "react"
import { cn } from "@/lib/utils"



// Container.tsx
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    padding?: boolean;
    centered?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ children, maxWidth = 'lg', padding = true, centered = true, className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "w-full",
                    {
                        "mx-auto": centered,
                        "px-4 sm:px-6 lg:px-8": padding,
                        "max-w-screen-sm": maxWidth === "sm",
                        "max-w-screen-md": maxWidth === "md",
                        "max-w-screen-lg": maxWidth === "lg",
                        "max-w-screen-xl": maxWidth === "xl",
                        "max-w-screen-2xl": maxWidth === "2xl",
                        "max-w-full": maxWidth === "full"
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
Container.displayName = "Container"

export { Container }