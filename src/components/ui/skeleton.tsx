// @ts-nocheck
"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Type of skeleton to render */
    variant?: "line" | "circular" | "rectangular" | "text"
    /** Animation type */
    animation?: "pulse" | "wave" | "none"
    /** Width of the skeleton */
    width?: string | number
    /** Height of the skeleton */
    height?: string | number
    /** Whether to make the skeleton fill its container width */
    fullWidth?: boolean
    /** Number of lines to render (for text variant) */
    lines?: number
    /** Whether to show shorter last line (for text variant) */
    shortLastLine?: boolean
}

const shimmerVariants = {
    initial: {
        x: "-100%",
    },
    animate: {
        x: "100%",
    },
}

const pulseVariants = {
    initial: {
        opacity: 0.5,
    },
    animate: {
        opacity: 1,
    },
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    ({
        variant = "line",
        animation = "pulse",
        width,
        height,
        fullWidth = false,
        lines = 1,
        shortLastLine = true,
        className,
        ...props
    }, ref) => {
        const getSkeletonStyles = () => {
            const baseStyles = cn(
                "relative isolate overflow-hidden rounded-md bg-muted/50",
                fullWidth && "w-full",
                className
            )

            switch (variant) {
                case "circular":
                    return cn(
                        baseStyles,
                        "rounded-full",
                        !width && !height && "h-12 w-12"
                    )
                case "rectangular":
                    return cn(
                        baseStyles,
                        !width && !height && "h-24 w-full"
                    )
                case "text":
                    return cn(
                        "space-y-2",
                        fullWidth && "w-full"
                    )
                default:
                    return cn(
                        baseStyles,
                        !width && !height && "h-4 w-full"
                    )
            }
        }

        const SkeletonComponent = ({ lineWidth = "100%" }: { lineWidth?: string | number }) => (
            <motion.div
                className={getSkeletonStyles()}
                style={{
                    width: width ?? lineWidth,
                    height: height ?? undefined,
                }}
                initial={animation === "pulse" ? "initial" : false}
                animate={animation === "pulse" ? "animate" : false}
                variants={pulseVariants}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                }}
            >
                {animation === "wave" && (
                    <motion.div
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted/60 to-transparent"
                        variants={shimmerVariants}
                        initial="initial"
                        animate="animate"
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "linear",
                        }}
                    />
                )}
            </motion.div>
        )

        const renderTextLines = () => {
            return Array.from({ length: lines }).map((_, index) => (
                <SkeletonComponent
                    key={index}
                    lineWidth={index === lines - 1 && shortLastLine ? "66.67%" : "100%"}
                />
            ))
        }

        if (variant === "text") {
            return (
                <div
                    ref={ref}
                    className={cn("w-full", className)}
                    {...props}
                >
                    {renderTextLines()}
                </div>
            )
        }

        return <SkeletonComponent />
    }
)

Skeleton.displayName = "Skeleton"

// Enhanced preset components with Framer Motion animations
export const SkeletonCard = ({ className, ...props }: React.ComponentProps<typeof Skeleton>) => (
    <motion.div
        className={cn("space-y-3", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        {...props}
    >
        <Skeleton variant="rectangular" height={200} />
        <Skeleton variant="text" lines={3} />
    </motion.div>
)

export const SkeletonAvatar = ({
    size = 40,
    ...props
}: {
    size?: number
} & React.ComponentProps<typeof Skeleton>) => (
    <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
    >
        <Skeleton
            variant="circular"
            width={size}
            height={size}
            {...props}
        />
    </motion.div>
)

export const SkeletonButton = ({ className, ...props }: React.ComponentProps<typeof Skeleton>) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
    >
        <Skeleton
            className={cn("h-9 w-20 rounded-md", className)}
            {...props}
        />
    </motion.div>
)

export const SkeletonTable = ({
    rows = 5,
    columns = 3,
    className,
    ...props
}: {
    rows?: number
    columns?: number
} & React.ComponentProps<typeof Skeleton>) => (
    <motion.div
        className={cn("space-y-3", className)}
        initial="initial"
        animate="animate"
        variants={{
            initial: { opacity: 0 },
            animate: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1
                }
            }
        }}
        {...props}
    >
        <motion.div
            className="flex gap-4"
            variants={{
                initial: { y: 20, opacity: 0 },
                animate: { y: 0, opacity: 1 }
            }}
        >
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1" />
            ))}
        </motion.div>
        {Array.from({ length: rows }).map((_, i) => (
            <motion.div
                key={i}
                className="flex gap-4"
                variants={{
                    initial: { y: 20, opacity: 0 },
                    animate: { y: 0, opacity: 1 }
                }}
            >
                {Array.from({ length: columns }).map((_, j) => (
                    <Skeleton key={j} className="h-4 flex-1" />
                ))}
            </motion.div>
        ))}
    </motion.div>
)