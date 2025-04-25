

import * as React from "react"
import { cn } from "@/lib/utils"

export interface OTPInputProps {
  length?: number
  onComplete?: (value: string) => void
  onChange?: (value: string) => void
  value?: string
  disabled?: boolean
  variant?: "underline" | "box" | "modern" | "circle" | "dots"
  size?: "sm" | "md" | "lg"
  gap?: "sm" | "md" | "lg"
  mask?: boolean
  error?: boolean
  errorText?: string
  label?: string
  maxTime?: number
  autoFocus?: boolean
  className?: string
}

const getGapSize = (size: "sm" | "md" | "lg") => {
  switch (size) {
    case "sm":
      return "gap-2"
    case "lg":
      return "gap-6"
    default:
      return "gap-4"
  }
}

const getInputSize = (size: "sm" | "md" | "lg") => {
  switch (size) {
    case "sm":
      return "w-8 h-10"
    case "lg":
      return "w-14 h-16"
    default:
      return "w-12 h-14"
  }
}

const getDotSize = (size: "sm" | "md" | "lg") => {
  switch (size) {
    case "sm":
      return "w-3 h-3"
    case "lg":
      return "w-5 h-5"
    default:
      return "w-4 h-4"
  }
}

const getVariantStyles = (variant: "underline" | "box" | "modern" | "circle" | "dots") => {
  switch (variant) {
    case "underline":
      return "border-t-0 border-l-0 border-r-0 border-b-2 rounded-none bg-transparent"
    case "modern":
      return "border-2 shadow-sm bg-white dark:bg-[#09090b] rounded-md"
    case "circle":
      return "border-2 rounded-full bg-white dark:bg-[#09090b]"
    case "dots":
      return "border-0 bg-transparent"
    default:
      return "border-2 bg-white dark:bg-[#09090b]"
  }
}

export const OTPInputComponent = React.forwardRef<HTMLDivElement, OTPInputProps>(
  ({
    length = 6,
    onComplete,
    onChange,
    value,
    disabled = false,
    variant = "box",
    size = "md",
    gap = "md",
    mask = false,
    error = false,
    errorText,
    label,
    maxTime,
    autoFocus = false,
    className,
    ...props
  }, ref) => {
    const [otp, setOtp] = React.useState<string[]>(
      Array.from({ length }, (_, i) => value?.[i] || "")
    )
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
    const [activeIndex, setActiveIndex] = React.useState<number>(-1)
    const [timeLeft, setTimeLeft] = React.useState<number | null>(maxTime || null)

    const getOtpValue = () => otp.join("")

    React.useEffect(() => {
      if (value !== undefined) {
        setOtp(Array.from({ length }, (_, i) => value[i] || ""))
      }
    }, [value, length])

    React.useEffect(() => {
      const otpValue = getOtpValue()
      if (otpValue.length === length && !otpValue.includes("")) {
        onComplete?.(otpValue)
      }
      onChange?.(otpValue)
    }, [otp, length, onComplete, onChange])

    React.useEffect(() => {
      if (timeLeft && timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev && prev > 0) {
              return prev - 1
            }
            return null
          })
        }, 1000)

        return () => clearInterval(timer)
      } else if (timeLeft === 0) {
        setOtp(Array.from({ length }, () => ""))
        setTimeLeft(null)
      }
    }, [timeLeft, length])

    React.useEffect(() => {
      if (autoFocus && inputRefs.current[0]) {
        inputRefs.current[0].focus()
      }
    }, [autoFocus])

    const handleChange = (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return

      const newOtp = [...otp]
      newOtp[index] = value.slice(-1)
      setOtp(newOtp)

      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
        setActiveIndex(index + 1)
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (!otp[index]) {
          if (index > 0) {
            inputRefs.current[index - 1]?.focus()
            setActiveIndex(index - 1)

            const newOtp = [...otp]
            newOtp[index - 1] = ""
            setOtp(newOtp)
          }
        } else {
          const newOtp = [...otp]
          newOtp[index] = ""
          setOtp(newOtp)
        }
      }
      else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus()
        setActiveIndex(index - 1)
      }
      else if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
        setActiveIndex(index + 1)
      }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pastedData = e.clipboardData.getData("text/plain").replace(/[^\d]/g, "").slice(0, length)

      if (pastedData) {
        const newOtp = Array.from({ length }, (_, i) => pastedData[i] || otp[i] || "")
        setOtp(newOtp)

        const focusIndex = Math.min(pastedData.length, length - 1)
        inputRefs.current[focusIndex]?.focus()
        setActiveIndex(focusIndex)
      }
    }

    const handleFocus = (index: number) => {
      setActiveIndex(index)
    }

    const handleBlur = () => {
      setActiveIndex(-1)
    }

    const handleContainerClick = (index: number) => {
      if (!disabled) {
        inputRefs.current[index]?.focus()
      }
    }

    return (
      <div
        ref={ref}
        className={cn("w-full space-y-2", className)}
        {...props}
      >
        {label && (
          <label className="block text-sm font-medium text-black dark:text-white">
            {label}
          </label>
        )}

        <div className={cn("flex justify-center", getGapSize(gap))}>
          {Array.from({ length }, (_, i) => (
            <div
              key={i}
              onClick={() => handleContainerClick(i)}
              className={cn(
                getInputSize(size),
                getVariantStyles(variant),
                "relative flex items-center justify-center transition-all duration-200",
                variant !== "dots" && "border-black dark:border-white",
                variant !== "dots" && activeIndex === i && "border-black ring-2 ring-black dark:border-white dark:ring-white",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error ? "border-red-500 dark:border-red-400 focus-within:ring-red-500 dark:focus-within:ring-red-400" : "",
                variant === "dots" ? "cursor-pointer" : ""
              )}
            >
              {variant === "dots" ? (
                <>
                  <input
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={otp[i] || ""}
                    disabled={disabled}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    onFocus={() => handleFocus(i)}
                    onBlur={handleBlur}
                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                    aria-label={`Digit ${i + 1} of ${length}`}
                  />
                  <div
                    className={cn(
                      "rounded-full transition-all duration-200",
                      getDotSize(size),
                      otp[i]
                        ? "bg-black dark:bg-white"
                        : activeIndex === i
                          ? "bg-gray-500 dark:bg-gray-400"
                          : "bg-gray-300 dark:bg-gray-600"
                    )}
                  />
                </>
              ) : (
                <input
                  ref={el => inputRefs.current[i] = el}
                  type={mask ? "password" : "text"}
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={otp[i] || ""}
                  disabled={disabled}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  onFocus={() => handleFocus(i)}
                  onBlur={handleBlur}
                  className={cn(
                    "h-full w-full bg-transparent text-center text-xl font-semibold outline-none",
                    "text-black dark:text-white",
                    mask && otp[i] ? "text-[0] after:content-['•'] after:text-xl after:text-black dark:after:text-white" : ""
                  )}
                  aria-label={`Digit ${i + 1} of ${length}`}
                />
              )}
            </div>
          ))}
        </div>

        {maxTime && timeLeft !== null && (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Time remaining: {timeLeft}s
          </div>
        )}

        {error && errorText && (
          <div className="text-sm text-red-500 dark:text-red-400">
            {errorText}
          </div>
        )}
      </div>
    )
  }
)

OTPInputComponent.displayName = "OTPInput"

export { OTPInputComponent as OTPInput }