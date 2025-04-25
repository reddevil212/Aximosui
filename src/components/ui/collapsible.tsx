"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = React.forwardRef<
    React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> &
    VariantProps<typeof triggerVariants>
>(({ className, variant, size, ...props }, ref) => (
    <CollapsiblePrimitive.Trigger
        ref={ref}
        className={cn(triggerVariants({ variant, size }), className)}
        {...props}
    />
))

CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName

const triggerVariants = cva(
    "flex w-full items-center justify-between rounded-md border px-4 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                default: "border-neutral-800 bg-neutral-950 hover:bg-neutral-900",
                accent: "border-blue-900/50 bg-blue-950/20 hover:bg-blue-900/30",
                success: "border-green-900/50 bg-green-950/20 hover:bg-green-900/30",
                warning: "border-yellow-900/50 bg-yellow-950/20 hover:bg-yellow-900/30",
                danger: "border-red-900/50 bg-red-950/20 hover:bg-red-900/30",
            },
            size: {
                default: "py-3 px-4 text-sm",
                sm: "py-2 px-3 text-xs",
                lg: "py-4 px-5 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const CollapsibleContent = React.forwardRef<
    React.ElementRef<typeof CollapsiblePrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content> &
    VariantProps<typeof contentVariants>
>(({ className, variant, ...props }, ref) => (
    <CollapsiblePrimitive.Content
        ref={ref}
        className={cn(contentVariants({ variant }), className)}
        {...props}
    />
))

CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName

const contentVariants = cva(
    "overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
    {
        variants: {
            variant: {
                default: "border-neutral-800 bg-neutral-950/50",
                accent: "border-blue-900/20 bg-blue-950/10",
                success: "border-green-900/20 bg-green-950/10",
                warning: "border-yellow-900/20 bg-yellow-950/10",
                danger: "border-red-900/20 bg-red-950/10",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

// Current Date and Time (UTC): 2025-03-30 16:49:58
// Current User's Login: reddevil212