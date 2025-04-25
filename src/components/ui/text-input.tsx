"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "relative flex bg-white dark:bg-zinc-950 text-black dark:text-white items-center rounded-md border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "h-10 border-input ",
        outlined: "h-14 border-input bg-transparent",
        labeled: "h-10 border-input ",
        outlinedLabeled: "h-14 border-input bg-transparent",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
      state: {
        default: "border-input",
        focused: "border-ring ring-1 ring-ring",
        error: "border-destructive",
        disabled: "cursor-not-allowed opacity-60",
      },
    },
    defaultVariants: {
      variant: "default",
      fullWidth: true,
      state: "default",
    }
  }
)

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
  Omit<VariantProps<typeof inputVariants>, "state"> {
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode
  /** Label for the input */
  label?: string
  /** Description text displayed below the input */
  description?: string
  /** Error message displayed below the input */
  error?: string
  /** Whether the right icon is clickable */
  iconClickable?: boolean
  /** Callback when the right icon is clicked */
  onRightIconClick?: () => void
  /** Whether to use a Radix UI Slot for the icons instead of a div */
  asChild?: boolean
  /** Interior label position for outlined variant */
  floatingLabelPosition?: "inside" | "outside"
  /** Whether the label is floating (animated) in outline variant */
  floatingLabel?: boolean
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({
    className,
    leftIcon,
    rightIcon,
    label,
    description,
    error,
    variant = "default",
    iconClickable = false,
    onRightIconClick,
    fullWidth = true,
    asChild = false,
    id,
    required,
    disabled,
    floatingLabelPosition = "inside",
    floatingLabel = true,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [isFilled, setIsFilled] = React.useState(false)
    const inputId = id || React.useId()

    const IconWrapper = asChild ? Slot : "div"

    // Determine if we're using a combination of outlined and labeled
    const isOutlined = variant === "outlined" || variant === "outlinedLabeled"
    const isLabeled = variant === "labeled" || variant === "outlinedLabeled"
    const useFloatingLabel = isOutlined && floatingLabel

    React.useEffect(() => {
      setIsFilled(Boolean(props.value || props.defaultValue))
    }, [props.value, props.defaultValue])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsFilled(e.target.value.length > 0)
      props.onChange?.(e)
    }

    // Determine the state for styling
    const getInputState = () => {
      if (disabled) return "disabled"
      if (error) return "error"
      if (isFocused) return "focused"
      return "default"
    }

    const renderInput = () => (
      <div
        className={cn(
          inputVariants({
            variant,
            fullWidth,
            state: getInputState(),
          }),
          "group",
          className
        )}
      >
        {leftIcon && (
          <IconWrapper
            className={cn(
              "absolute left-3 flex h-full items-center text-muted-foreground",
              isFocused && "text-foreground",
              iconClickable && !disabled
                ? "cursor-pointer hover:text-foreground"
                : "pointer-events-none"
            )}
          >
            {leftIcon}
          </IconWrapper>
        )}

        {useFloatingLabel && label && floatingLabelPosition === "inside" && (
          <span
            className={cn(
              "absolute px-1 text-muted-foreground transition-all duration-200",
              leftIcon ? "left-9" : "left-3",
              (isFocused || isFilled)
                ? "-top-2.5 text-xs bg-white dark:bg-zinc-950"
                : "top-4 text-sm"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </span>
        )}

        <input
          id={inputId}
          className={cn(
            "h-full w-full bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-100",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            isOutlined && label && floatingLabelPosition === "inside" && "pt-3",
            isOutlined && !isFilled && !isFocused && floatingLabelPosition === "inside" && "placeholder:text-transparent"
          )}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error
              ? `${inputId}-error`
              : description
                ? `${inputId}-description`
                : undefined
          }
          disabled={disabled}
          required={required}
          {...props}
        />

        {rightIcon && (
          <IconWrapper
            className={cn(
              "absolute right-3 flex h-full items-center text-muted-foreground",
              isFocused && "text-foreground",
              iconClickable && !disabled
                ? "cursor-pointer hover:text-foreground"
                : "pointer-events-none"
            )}
            onClick={iconClickable && !disabled ? onRightIconClick : undefined}
          >
            {rightIcon}
          </IconWrapper>
        )}
      </div>
    )

    const renderHelperText = () => (
      <>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        {!error && description && (
          <p
            id={`${inputId}-description`}
            className="mt-1.5 text-sm text-muted-foreground"
          >
            {description}
          </p>
        )}
      </>
    )

    // Render with outside label if needed
    const shouldRenderOutsideLabel =
      (isLabeled && !isOutlined) ||
      (isOutlined && floatingLabelPosition === "outside") ||
      (variant === "default" && label);

    return (
      <div className={cn("space-y-1.5", fullWidth ? "w-full" : "w-auto")}>
        {shouldRenderOutsideLabel && label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium",
              disabled ? "text-muted-foreground cursor-not-allowed" : "text-foreground"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </label>
        )}
        {renderInput()}
        {renderHelperText()}
      </div>
    )
  }
)

TextInput.displayName = "TextInput"

export { TextInput }