// @ts-nocheck
"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: number
    value?: number
    count?: number
    disabled?: boolean
    onChange?: (value: number) => void
    size?: "sm" | "md" | "lg"
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
    (
        {
            defaultValue = 0,
            value,
            count = 5,
            disabled = false,
            onChange,
            size = "md",
            className,
            ...props
        },
        ref
    ) => {
        const [rating, setRating] = React.useState(value ?? defaultValue)
        const [hoverRating, setHoverRating] = React.useState(0)

        React.useEffect(() => {
            if (value !== undefined) {
                setRating(value)
            }
        }, [value])

        const sizes = {
            sm: "h-4 w-4",
            md: "h-5 w-5",
            lg: "h-6 w-6",
        }

        const handleRate = (newRating: number) => {
            if (!disabled) {
                setRating(newRating)
                onChange?.(newRating)
            }
        }

        const handleKeyDown = (
            event: React.KeyboardEvent<HTMLButtonElement>,
            index: number
        ) => {
            if (disabled) return

            if (event.key === "ArrowLeft") {
                event.preventDefault()
                handleRate(Math.max(1, rating - 1))
            } else if (event.key === "ArrowRight") {
                event.preventDefault()
                handleRate(Math.min(count, rating + 1))
            } else if (event.key === " " || event.key === "Enter") {
                event.preventDefault()
                handleRate(index + 1)
            }
        }

        return (
            <div
                ref={ref}
                className={cn("flex items-center gap-1", className)}
                role="radiogroup"
                aria-label="Rating"
                {...props}
            >
                {Array.from({ length: count }).map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={cn(
                            "rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            "transition-colors duration-200"
                        )}
                        onMouseEnter={() => !disabled && setHoverRating(index + 1)}
                        onMouseLeave={() => !disabled && setHoverRating(0)}
                        onClick={() => handleRate(index + 1)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        disabled={disabled}
                        role="radio"
                        aria-checked={rating === index + 1}
                        aria-label={`${index + 1} of ${count} stars`}
                        tabIndex={index === 0 ? 0 : -1}
                    >
                        <Star
                            className={cn(
                                sizes[size],
                                "transition-all duration-200",
                                index < (hoverRating || rating)
                                    ? "fill-current text-yellow-400"
                                    : "text-gray-300 dark:text-gray-600",
                                disabled && "cursor-not-allowed opacity-50"
                            )}
                        />
                    </button>
                ))}
            </div>
        )
    }
)
Rating.displayName = "Rating"

export { Rating }
export type { RatingProps }