// @ts-nocheck
"use client"


import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"
import { motion  } from "framer-motion"
import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
    className,
    ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
    <ResizablePrimitive.PanelGroup
        className={cn(
            "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
            "bg-white dark:bg-[#09090b]",
            className
        )}
        {...props}
    />
)

// Wrap the Panel with Framer Motion
const MotionPanel = motion(ResizablePrimitive.Panel)

const ResizablePanel = ({
    className,
    ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) => (
    <MotionPanel
        className={cn(
            "relative",
            "bg-white text-black dark:bg-[#09090b] dark:text-white",
            className
        )}
        transition={{
            duration: 0.2,
            ease: "easeInOut"
        }}
        layout
        {...props}
    />
)

const ResizableHandle = ({
    withHandle,
    className,
    ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
    withHandle?: boolean
}) => {
    const handleVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.1 },
        drag: { scale: 0.95 }
    }

    return (
        <ResizablePrimitive.PanelResizeHandle
            className={cn(
                "relative flex w-px items-center justify-center",
                "bg-gray-200 dark:bg-gray-800",
                "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
                "focus-visible:outline-none",
                "focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white",
                "focus-visible:ring-offset-1",
                "data-[panel-group-direction=vertical]:h-px",
                "data-[panel-group-direction=vertical]:w-full",
                "data-[panel-group-direction=vertical]:after:left-0",
                "data-[panel-group-direction=vertical]:after:h-1",
                "data-[panel-group-direction=vertical]:after:w-full",
                "data-[panel-group-direction=vertical]:after:-translate-y-1/2",
                "data-[panel-group-direction=vertical]:after:translate-x-0",
                "[&[data-panel-group-direction=vertical]>div]:rotate-90",
                className
            )}
            {...props}
        >
            {withHandle && (
                <motion.div
                    className={cn(
                        "z-10 flex h-4 w-3 items-center justify-center rounded-sm border",
                        "bg-white dark:bg-[#09090b]",
                        "border-gray-200 dark:border-gray-800",
                        "cursor-grab active:cursor-grabbing"
                    )}
                    initial="idle"
                    whileHover="hover"
                    whileDrag="drag"
                    variants={handleVariants}
                    transition={{ duration: 0.2 }}
                >
                    <GripVertical className="h-2.5 w-2.5 text-gray-500 dark:text-gray-400" />
                </motion.div>
            )}
        </ResizablePrimitive.PanelResizeHandle>
    )
}

// Custom hook for smooth resize animation
const useResizeAnimation = (minSize: number = 10, maxSize: number = 90) => {
    return {
        onDrag: (size: number) => {
            return {
                scale: size < minSize ? 0.95 : size > maxSize ? 1.05 : 1,
                transition: { duration: 0.2 }
            }
        }
    }
}

export {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
    useResizeAnimation
}