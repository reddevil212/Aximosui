"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export type TooltipProps = {
    children: React.ReactNode;
    content: string | React.ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    delayDuration?: number;
    skipDelayDuration?: number;
    className?: string;
    contentClassName?: string;
    arrowClassName?: string;
    showArrow?: boolean;
    sideOffset?: number;
    interactive?: boolean;
    variant?: 'default' | 'info' | 'warning' | 'success' | 'error';
    maxWidth?: number | string;
};

// Updated variants to follow the theme with bg #09090b and white text
const variants = {
    default: "bg-[#09090b] p-2 rounded-sm text-white border border-[#27272a]",
    info: "bg-[#09090b] text-white border border-blue-800",
    warning: "bg-[#09090b] text-white border border-amber-800",
    success: "bg-[#09090b] text-white border border-green-800",
    error: "bg-[#09090b] text-white border border-red-800",
}

const TooltipProvider = TooltipPrimitive.Provider
const TooltipTrigger = TooltipPrimitive.Trigger

// Using Framer Motion's motion-wrapped version of TooltipContent
const MotionContent = motion(TooltipPrimitive.Content)

const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
        variant?: keyof typeof variants;
        maxWidth?: number | string;
        arrowClassName?: string;
        showArrow?: boolean;
    }
>(({
    className,
    sideOffset = 8,
    variant = "default",
    maxWidth,
    arrowClassName,
    showArrow = true,
    ...props
}, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        style={{ maxWidth: maxWidth }}
        className={cn(
            "z-50 overflow-hidden  rounded-md px-3 py-1.5 text-sm shadow-md",
            variants[variant],
            className
        )}
        {...props}
    >
        {props.children}
        {showArrow && (
            <TooltipPrimitive.Arrow
                className={cn("fill-[#09090b]", arrowClassName)}
                width={10}
                height={5}
            />
        )}
    </TooltipPrimitive.Content>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

const Tooltip = ({
    children,
    content,
    side = "top",
    align = "center",
    delayDuration = 200,
    skipDelayDuration = 300,
    className,
    contentClassName,
    arrowClassName,
    showArrow = true,
    sideOffset = 8,
    interactive = false,
    variant = "default",
    maxWidth = 250,
}: TooltipProps) => {
    const triggerRef = React.useRef(null);

    return (
        <TooltipProvider
            delayDuration={delayDuration}
            skipDelayDuration={skipDelayDuration}
        >
            <TooltipPrimitive.Root
                disableHoverableContent={!interactive}
            >
                <TooltipTrigger asChild ref={triggerRef}>
                    {children}
                </TooltipTrigger>
                <TooltipPrimitive.Portal>
                    <MotionContent
                        side={side}
                        align={align}
                        className={cn(contentClassName, variants[variant], className)}
                        sideOffset={sideOffset}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{
                            duration: 0.15,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{
                            maxWidth: maxWidth,
                            pointerEvents: interactive ? 'auto' : 'none',
                            backgroundColor: '#09090b',
                            color: 'white',
                        }}
                    >
                        {content}
                        {showArrow && (
                            <TooltipPrimitive.Arrow
                                className={cn("fill-[#09090b]", arrowClassName)}
                                width={10}
                                height={5}
                            />
                        )}
                    </MotionContent>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipProvider>
    )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }