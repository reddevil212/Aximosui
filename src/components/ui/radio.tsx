"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

// Individual Radio Item Component
const Radio = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
    <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
            "aspect-square h-4 w-4 rounded-full border border-gray-300",
            "bg-white dark:bg-[#090909]",
            "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        {...props}
    >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            <Circle className="h-2.5 w-2.5 fill-current text-black dark:text-white" />
        </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
))
Radio.displayName = RadioGroupPrimitive.Item.displayName

// RadioGroup Component
const RadioGroup = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            className={cn("grid gap-2", className)}
            {...props}
            ref={ref}
        />
    )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

// RadioGroupItem with Label wrapper
interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<typeof Radio> {
    label: string
}

const RadioGroupItem = React.forwardRef<
    React.ElementRef<typeof Radio>,
    RadioGroupItemProps
>(({ label, className, ...props }, ref) => (
    <div className="flex items-center space-x-2">
        <Radio ref={ref} {...props} />
        <label
            htmlFor={props.id}
            className="text-sm font-medium leading-none text-black dark:text-white cursor-pointer"
        >
            {label}
        </label>
    </div>
))
RadioGroupItem.displayName = "RadioGroupItem"

export { Radio, RadioGroup, RadioGroupItem }