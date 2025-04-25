// @ts-nocheck
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sliderVariants = cva(
    "relative flex w-full touch-none select-none items-center",
    {
        variants: {
            size: {
                default: "h-5",
                sm: "h-4",
                lg: "h-6",
            },
            variant: {
                default: "",
                accent: "",
                success: "",
                warning: "",
                danger: "",
            },
        },
        defaultVariants: {
            size: "default",
            variant: "default",
        },
    }
);

const trackVariants = cva(
    "relative h-2 w-full grow overflow-hidden rounded-full shadow-inner",
    {
        variants: {
            variant: {
                default: "bg-neutral-800/80 dark:bg-neutral-700/50",
                accent: "bg-neutral-800/80 dark:bg-neutral-700/50",
                success: "bg-green-900/40 dark:bg-green-800/30",
                warning: "bg-yellow-900/40 dark:bg-yellow-800/30",
                danger: "bg-red-900/40 dark:bg-red-800/30",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const rangeVariants = cva(
    "absolute h-full bg-gradient-to-r",
    {
        variants: {
            variant: {
                default: "from-white to-white/90",
                accent: "from-blue-500 to-blue-400",
                success: "from-green-500 to-green-400",
                warning: "from-yellow-500 to-yellow-400",
                danger: "from-red-500 to-red-400",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const thumbVariants = cva(
    "block h-5 w-5 rounded-full border-2 shadow-md transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 active:scale-95",
    {
        variants: {
            size: {
                default: "h-5 w-5",
                sm: "h-4 w-4",
                lg: "h-6 w-6",
            },
            variant: {
                default: "border-white bg-white",
                accent: "border-blue-400 bg-gradient-to-b from-blue-400 to-blue-500",
                success: "border-green-400 bg-gradient-to-b from-green-400 to-green-500",
                warning: "border-yellow-400 bg-gradient-to-b from-yellow-400 to-yellow-500",
                danger: "border-red-400 bg-gradient-to-b from-red-400 to-red-500",
            },
        },
        defaultVariants: {
            size: "default",
            variant: "default",
        },
    }
);

export interface SliderProps
    extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    VariantProps<typeof sliderVariants> {
    showValue?: boolean;
    valueComponent?: React.ReactNode;
    formatValue?: (value: number[]) => string;
    showTooltip?: boolean;
    showMarks?: boolean;
    marks?: { value: number; label?: string }[];
}

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    SliderProps
>(
    (
        {
            className,
            variant,
            size,
            showValue = false,
            valueComponent,
            formatValue,
            showTooltip = false,
            showMarks = false,
            marks = [],
            min = 0,
            max = 100,
            step = 1,
            value,
            defaultValue,
            ...props
        },
        ref
    ) => {
        const [sliderValue, setSliderValue] = React.useState<number[]>(
            value || defaultValue || [min]
        );
        const [showValueTooltip, setShowValueTooltip] = React.useState(false);

        // Keep internal state in sync with controlled value
        React.useEffect(() => {
            if (value !== undefined) {
                setSliderValue(value);
            }
        }, [value]);

        const onValueChange = (newValue: number[]) => {
            setSliderValue(newValue);
            if (props.onValueChange) {
                props.onValueChange(newValue);
            }
        };

        const formatDisplayValue = React.useCallback(() => {
            if (formatValue) {
                return formatValue(sliderValue);
            }
            return sliderValue.length === 1
                ? sliderValue[0]
                : `${sliderValue[0]} - ${sliderValue[sliderValue.length - 1]}`;
        }, [sliderValue, formatValue]);

        const handleShowTooltip = () => setShowValueTooltip(true);
        const handleHideTooltip = () => setShowValueTooltip(false);

        // Calculate percentage for tooltip positioning
        const getThumbPercent = (index: number) => {
            if (min === max) return 0;
            return ((sliderValue[index] - min) / (max - min)) * 100;
        };

        const renderMarks = () => {
            if (!showMarks || marks.length === 0) return null;

            return (
                <div className="absolute top-1/2 left-0 right-0 -z-10 -translate-y-1/2">
                    {marks.map((mark) => {
                        const percent = ((mark.value - min) / (max - min)) * 100;
                        return (
                            <div
                                key={mark.value}
                                className="absolute"
                                style={{ left: `${percent}%` }}
                            >
                                <div className="h-2 w-0.5 bg-neutral-600" />
                                {mark.label && (
                                    <div className="mt-3 text-xs text-neutral-400">
                                        {mark.label}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        };

        return (
            <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                    {showValue && (
                        <div className="text-sm font-medium text-white">
                            {valueComponent || formatDisplayValue()}
                        </div>
                    )}
                </div>
                <SliderPrimitive.Root
                    ref={ref}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    defaultValue={defaultValue}
                    onValueChange={onValueChange}
                    className={cn(sliderVariants({ size, variant }), className)}
                    {...props}
                >
                    <SliderPrimitive.Track
                        className={cn(trackVariants({ variant }))}
                    >
                        <SliderPrimitive.Range className={cn(rangeVariants({ variant }))} />
                    </SliderPrimitive.Track>

                    {renderMarks()}

                    {sliderValue.map((_, index) => (
                        <SliderPrimitive.Thumb
                            key={index}
                            className={cn(thumbVariants({ size, variant }))}
                            onMouseEnter={handleShowTooltip}
                            onMouseLeave={handleHideTooltip}
                            onFocus={handleShowTooltip}
                            onBlur={handleHideTooltip}
                            onPointerDown={handleShowTooltip}
                            onPointerUp={handleHideTooltip}
                        >
                            {showTooltip && showValueTooltip && (
                                <div
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-xs text-white border border-neutral-800 shadow-lg"
                                >
                                    <div className="absolute -bottom-1 left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 bg-neutral-900 border-r border-b border-neutral-800"></div>
                                    {sliderValue[index]}
                                </div>
                            )}
                        </SliderPrimitive.Thumb>
                    ))}
                </SliderPrimitive.Root>

                {/* Render timestamp and user info in a subtle way */}
                
            </div>
        );
    }
);

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };