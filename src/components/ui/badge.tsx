"use client"

import * as React from "react"
import { motion, HTMLMotionProps, MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

interface BadgeProps extends Omit<HTMLMotionProps<"span">, "ref"> {
    variant?: keyof typeof variantStyles
    size?: keyof typeof sizeStyles
    rounded?: keyof typeof roundedStyles
    animated?: boolean
    icon?: React.ReactNode
    children?: React.ReactNode
}

const variantStyles = {
    default: "bg-white text-black dark:text-white  border border-[#09090b] dark:bg-[#09090b]/80",
    primary: "bg-blue-500 text-white",
    secondary: "bg-purple-500 text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-cyan-500 text-white",
}

const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
}

const roundedStyles = {
    full: "rounded-full",
    lg: "rounded-lg",
    md: "rounded-md",
    sm: "rounded-sm",
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({
    children,
    variant = "default",
    size = "sm",
    rounded = "full",
    animated = true,
    icon,
    className,
    onClick,
    ...props
}, ref) => {
    const Component = animated ? motion.span : "span"

    const baseClassName = cn(
        "inline-flex items-center justify-center gap-1 font-medium",
        "transition-colors duration-200",
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles[rounded],
        onClick && "cursor-pointer hover:opacity-80",
        className
    )

    const animationProps = animated ? {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.9, opacity: 0 },
        whileHover: onClick ? { scale: 1.05 } : undefined,
        whileTap: onClick ? { scale: 0.95 } : undefined,
    } : {}

    // Convert MotionValue to ReactNode if necessary
    const renderChildren = () => {
        if (children instanceof MotionValue) {
            return <motion.span>{children}</motion.span>
        }
        return children
    }

    return React.createElement(
        Component,
        {
            ref,
            className: baseClassName,
            onClick,
            ...animationProps,
            ...props
        },
        icon && <span className="shrink-0">{icon}</span>,
        renderChildren()
    )
})

Badge.displayName = "Badge"

export type { BadgeProps }