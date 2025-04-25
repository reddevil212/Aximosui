// @ts-nocheck
import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const separatorVariants = cva(
    "shrink-0 bg-neutral-800",
    {
        variants: {
            orientation: {
                horizontal: "h-px w-full",
                vertical: "h-full w-px",
            },
            size: {
                sm: "my-1",
                default: "my-2",
                lg: "my-4",
            },
            variant: {
                default: "bg-neutral-800",
                subtle: "bg-neutral-700",
                accent: "bg-neutral-600",
                primary: "bg-blue-800",
                success: "bg-green-800",
                warning: "bg-yellow-800",
                danger: "bg-red-800",
            },
        },
        compoundVariants: [
            {
                orientation: "vertical",
                size: "sm",
                class: "mx-1 my-0",
            },
            {
                orientation: "vertical",
                size: "default",
                class: "mx-2 my-0",
            },
            {
                orientation: "vertical",
                size: "lg",
                class: "mx-4 my-0",
            },
        ],
        defaultVariants: {
            orientation: "horizontal",
            size: "default",
            variant: "default",
        },
    }
);

export interface SeparatorProps
    extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
    VariantProps<typeof separatorVariants> {
    /**
     * Changes the default rendered element for the one passed as a child,
     * merging their props and behavior.
     * @default false
     */
    asChild?: boolean;
    /**
     * Whether the separator has a decorative purpose only, in which case it'll be hidden from the accessibility tree.
     * @default true
     */
    decorative?: boolean;
}

const Separator = React.forwardRef<
    React.ElementRef<typeof SeparatorPrimitive.Root>,
    SeparatorProps
>(
    (
        {
            className,
            orientation = "horizontal",
            size,
            variant,
            decorative = true,
            ...props
        },
        ref
    ) => (
        <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn(separatorVariants({ orientation, size, variant }), className)}
            {...props}
        />
    )
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator, separatorVariants };