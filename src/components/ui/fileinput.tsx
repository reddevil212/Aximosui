// @ts-nocheck
import * as React from "react"
import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string
    description?: string
    labeled?: boolean
    buttonText?: string
    error?: string
    multiple?: boolean
    accept?: string
    maxSize?: number
    onFileTooLarge?: (file: File) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({
        className,
        label,
        description,
        labeled = false,
        buttonText = "Choose file",
        error,
        multiple,
        accept,
        maxSize,
        onFileTooLarge,
        disabled,
        required,
        ...props
    }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false)
        const [isDragOver, setIsDragOver] = React.useState(false)
        const [fileName, setFileName] = React.useState<string>("")
        const fileInputRef = React.useRef<HTMLInputElement>(null)

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true)
            props.onFocus?.(e)
        }

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false)
            props.onBlur?.(e)
        }

        const validateFiles = (files: FileList | null) => {
            if (!files || files.length === 0) return true

            if (maxSize) {
                for (let i = 0; i < files.length; i++) {
                    if (files[i].size > maxSize) {
                        onFileTooLarge?.(files[i])
                        return false
                    }
                }
            }
            return true
        }

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files
            if (!validateFiles(files)) {
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
                setFileName("")
                return
            }

            if (files && files.length > 0) {
                if (files.length === 1) {
                    setFileName(files[0].name)
                } else {
                    setFileName(`${files.length} files selected`)
                }
            } else {
                setFileName("")
            }

            props.onChange?.(e)
        }

        const handleClick = () => {
            if (!disabled) {
                fileInputRef.current?.click()
            }
        }

        const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
            if (!disabled) {
                setIsDragOver(true)
            }
        }

        const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragOver(false)
        }

        const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragOver(false)

            if (disabled) return

            const files = e.dataTransfer.files
            if (!validateFiles(files)) return

            if (fileInputRef.current) {
                fileInputRef.current.files = files
                const event = new Event('change', { bubbles: true })
                fileInputRef.current.dispatchEvent(event)
            }

            if (files.length > 0) {
                if (files.length === 1) {
                    setFileName(files[0].name)
                } else {
                    setFileName(`${files.length} files selected`)
                }

                if (props.onChange && fileInputRef.current) {
                    const input = fileInputRef.current
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype,
                        "files"
                    )?.set
                    if (nativeInputValueSetter) {
                        nativeInputValueSetter.call(input, files)
                        const event = new Event('change', { bubbles: true })
                        input.dispatchEvent(event)
                    }
                }
            }
        }

        const inputElement = (
            <div
                className={cn(
                    "relative rounded-md transition-all duration-200",
                    className
                )}
            >
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        "flex min-h-10 w-full overflow-hidden rounded-md border bg-white text-black dark:bg-[#090909] dark:text-white focus-within:ring-1 focus-within:ring-ring",
                        disabled && "cursor-not-allowed opacity-50",
                        error ? "border-destructive" : "border-input",
                        isDragOver && "border-primary ring-1 ring-primary",
                        isFocused && "ring-1 ring-ring"
                    )}
                >
                    <input
                        type="file"
                        className="hidden"
                        ref={(el) => {
                            if (typeof ref === 'function') {
                                ref(el)
                            } else if (ref) {
                                ref.current = el
                            }
                            fileInputRef.current = el
                        }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        multiple={multiple}
                        accept={accept}
                        disabled={disabled}
                        required={required}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={handleClick}
                        disabled={disabled}
                        className={cn(
                            "flex h-full min-w-[120px] items-center gap-2 border-r border-input bg-white text-black dark:bg-[#090909] dark:text-white px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-[#1a1a1a] disabled:cursor-not-allowed",
                            isFocused && "bg-gray-100 dark:bg-[#1a1a1a]"
                        )}
                    >
                        <Upload className="h-4 w-4" />
                        {buttonText}
                    </button>
                    <div className="flex flex-1 items-center truncate px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                        {fileName || "No file selected"}
                    </div>
                </div>
                {error && (
                    <p className="mt-1 text-sm text-destructive">{error}</p>
                )}
            </div>
        )

        if (labeled) {
            return (
                <div className="space-y-2">
                    {label && (
                        <div className="flex items-baseline justify-between">
                            <label className="text-sm font-medium leading-none text-black dark:text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {label}
                                {required && <span className="ml-1 text-destructive">*</span>}
                            </label>
                            {description && (
                                <span className="text-xs text-gray-600 dark:text-gray-400">{description}</span>
                            )}
                        </div>
                    )}
                    {inputElement}
                </div>
            )
        }

        return inputElement
    }
)

Input.displayName = "FileInput"

export { Input }