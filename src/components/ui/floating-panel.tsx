// @ts-nocheck
"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"




export type FloatingPanelProps = {
    children: React.ReactNode;
    trigger: React.ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    className?: string;
    overlayClassName?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    dismissible?: boolean;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
};
const FloatingPanel = ({
    children,
    trigger,
    side = "bottom",
    align = "center",
    className,
    overlayClassName,
    open: controlledOpen,
    onOpenChange,
    modal = false,
    dismissible = true,
    closeOnEscape = true,
    closeOnOutsideClick = true,
}: FloatingPanelProps) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false)

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : uncontrolledOpen

    const handleOpenChange = useCallback((newOpen: boolean) => {
        if (!isControlled) {
            setUncontrolledOpen(newOpen)
        }
        onOpenChange?.(newOpen)
    }, [isControlled, onOpenChange])

    return (
        <PopoverPrimitive.Root
            open={open}
            onOpenChange={handleOpenChange}
            modal={modal}
        >
            <PopoverPrimitive.Trigger asChild>
                {trigger}
            </PopoverPrimitive.Trigger>

            <AnimatePresence>
                {open && (
                    <>
                        {closeOnOutsideClick && (
                            <div
                                className={cn(
                                    "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                                    overlayClassName
                                )}
                            />
                        )}

                        <PopoverPrimitive.Content
                            side={side}
                            align={align}
                            sideOffset={4}
                            collisionPadding={8}
                            className={cn(
                                "z-50 min-w-[8rem] rounded-lg border border-neutral-200 bg-white p-4 shadow-lg outline-none",
                                "dark:border-neutral-800 dark:bg-[#09090b] dark:text-neutral-100",
                                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                                "data-[side=bottom]:slide-in-from-top-2",
                                "data-[side=left]:slide-in-from-right-2",
                                "data-[side=right]:slide-in-from-left-2",
                                "data-[side=top]:slide-in-from-bottom-2",
                                className
                            )}
                            asChild
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{
                                    duration: 0.15,
                                    ease: "easeOut"
                                }}
                            >
                                {children}
                                {dismissible && (
                                    <PopoverPrimitive.Close
                                        className={cn(
                                            "absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full",
                                            "opacity-70 transition-opacity hover:opacity-100",
                                            "focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2",
                                            "dark:focus:ring-neutral-400 dark:focus:ring-offset-[#09090b]"
                                        )}
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </PopoverPrimitive.Close>
                                )}
                            </motion.div>
                        </PopoverPrimitive.Content>
                    </>
                )}
            </AnimatePresence>
        </PopoverPrimitive.Root>
    )
}

export { FloatingPanel }