"use client"

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
    "flex min-h-20 w-full rounded-md border bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-black dark:text-white ring-offset-white dark:ring-offset-zinc-950 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
    {
        variants: {
            variant: {
                default: "border-gray-200 dark:border-zinc-800",
                accent: "border-gray-200 dark:border-zinc-800 focus-visible:border-blue-500",
                success: "border-gray-200 dark:border-zinc-800 focus-visible:border-green-500",
                warning: "border-gray-200 dark:border-zinc-800 focus-visible:border-yellow-500",
                danger: "border-gray-200 dark:border-zinc-800",
            },
            size: {
                default: "min-h-20 px-3 py-2 text-sm",
                sm: "min-h-16 px-2 py-1 text-xs",
                lg: "min-h-28 px-4 py-3 text-base",
            },
            isResizable: {
                true: "resize-y",
                false: "resize-none",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            isResizable: false,
        },
    }
);

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
    label?: string;
    description?: string;
    error?: string;
    hideLabel?: boolean;
    wrapperClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            className,
            variant,
            size,
            isResizable,
            label,
            description,
            error,
            hideLabel = false,
            wrapperClassName,
            ...props
        },
        ref
    ) => {
        const id = React.useId();
        const textareaId = props.id || `textarea-${id}`;

        return (
            <div className={cn("space-y-2", wrapperClassName)}>
                {label && !hideLabel && (
                    <div className="flex items-baseline justify-between">
                        <label
                            htmlFor={textareaId}
                            className="text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {label}
                        </label>
                        {description && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>
                        )}
                    </div>
                )}

                <textarea
                    id={textareaId}
                    className={cn(
                        textareaVariants({ variant, size, isResizable }),
                        error && "border-red-500 focus-visible:border-red-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />

                {error && (
                    <p className="text-xs text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

export { Textarea };