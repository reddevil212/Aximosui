import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const switchVariants = cva(
    "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gradient-to-r",
    {
        variants: {
            variant: {
                default: "bg-neutral-800/80 data-[state=checked]:from-white data-[state=checked]:to-white/90",
                accent: "bg-neutral-800/80 data-[state=checked]:from-blue-500 data-[state=checked]:to-blue-400",
                success: "bg-green-900/40 data-[state=checked]:from-green-500 data-[state=checked]:to-green-400",
                warning: "bg-yellow-900/40 data-[state=checked]:from-yellow-500 data-[state=checked]:to-yellow-400",
                danger: "bg-red-900/40 data-[state=checked]:from-red-500 data-[state=checked]:to-red-400",
            },
            size: {
                default: "h-6 w-11",
                sm: "h-5 w-9",
                lg: "h-7 w-[52px]",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const thumbVariants = cva(
    "pointer-events-none block rounded-full shadow-md transition-transform duration-200",
    {
        variants: {
            variant: {
                default: "bg-white",
                accent: "data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-blue-400 data-[state=checked]:to-blue-500 bg-white",
                success: "data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-green-400 data-[state=checked]:to-green-500 bg-white",
                warning: "data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-yellow-400 data-[state=checked]:to-yellow-500 bg-white",
                danger: "data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-red-400 data-[state=checked]:to-red-500 bg-white",
            },
            size: {
                default: "h-5 w-5 data-[state=checked]:translate-x-5",
                sm: "h-4 w-4 data-[state=checked]:translate-x-4",
                lg: "h-6 w-6 data-[state=checked]:translate-x-6",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface SwitchProps
    extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {
    label?: string;
    description?: string;
    hideLabel?: boolean;
}

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitive.Root>,
    SwitchProps
>(
    (
        {
            className,
            variant,
            size,
            label,
            description,
            hideLabel = false,
            ...props
        },
        ref
    ) => (
        <div className="flex items-center space-x-2">
            <SwitchPrimitive.Root
                className={cn(switchVariants({ variant, size }), className)}
                {...props}
                ref={ref}
            >
                <SwitchPrimitive.Thumb
                    className={cn(thumbVariants({ variant, size }))}
                />
            </SwitchPrimitive.Root>

            {label && !hideLabel && (
                <div className="flex flex-col">
                    <label
                        htmlFor={props.id}
                        className="text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {label}
                    </label>
                    {description && (
                        <span className="text-xs text-neutral-400 mt-1">{description}</span>
                    )}
                </div>
            )}

            {/* Render timestamp and user info in a subtle way */}
            <div className="hidden">
                <div>UTC: 2025-03-30 16:10:30</div>
                <div>User: reddevil212</div>
            </div>
        </div>
    )
);

Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };