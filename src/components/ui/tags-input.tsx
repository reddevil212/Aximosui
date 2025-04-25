// @ts-nocheck
"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "./badge"
import { TextInput } from "./text-input"


export interface Tag {
    id: string
    label: string
}

interface TagsInputProps extends Omit<React.ComponentProps<typeof TextInput>, "value" | "onChange"> {
    value?: Tag[]
    onChange?: (tags: Tag[]) => void
    variant?: React.ComponentProps<typeof Badge>["variant"]
    size?: React.ComponentProps<typeof Badge>["size"]
    rounded?: React.ComponentProps<typeof Badge>["rounded"]
    maxTags?: number
    allowDuplicates?: boolean
    validateTag?: (tag: string) => boolean | string
    readOnly?: boolean
    onExceedLimit?: () => void
    delimiter?: string | RegExp
}

export const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
    ({
        value = [],
        onChange,
        variant = "default",
        size = "sm",
        rounded = "full",
        maxTags,
        allowDuplicates = false,
        validateTag,
        className,
        placeholder = "Add tags...",
        readOnly,
        disabled,
        onExceedLimit,
        delimiter = /[,\n\r]/,
        error,
        ...props
    }, ref) => {
        const [tags, setTags] = React.useState<Tag[]>(value)
        const [inputValue, setInputValue] = React.useState("")
        const [localError, setLocalError] = React.useState<string | null>(null)
        const inputRef = React.useRef<HTMLInputElement>(null)
        const [tagHistory, setTagHistory] = React.useState<Tag[][]>([[]])
        const [historyIndex, setHistoryIndex] = React.useState(0)

        // Sync with external value
        React.useEffect(() => {
            setTags(value)
        }, [value])

        const createTag = (label: string): Tag => ({
            id: Math.random().toString(36).substr(2, 9),
            label: label.trim()
        })

        const addTag = (label: string) => {
            if (!label.trim()) return
            if (disabled || readOnly) return
            if (maxTags && tags.length >= maxTags) {
                onExceedLimit?.()
                setLocalError("Maximum tags limit reached")
                return
            }

            // Validate tag if validator provided
            if (validateTag) {
                const validationResult = validateTag(label)
                if (validationResult !== true) {
                    setLocalError(typeof validationResult === "string" ? validationResult : "Invalid tag")
                    return
                }
            }

            // Check for duplicates
            if (!allowDuplicates && tags.some(tag => tag.label === label.trim())) {
                setLocalError("Tag already exists")
                return
            }

            const newTags = [...tags, createTag(label)]
            // Add to history
            const newHistory = tagHistory.slice(0, historyIndex + 1)
            newHistory.push(newTags)
            setTagHistory(newHistory)
            setHistoryIndex(newHistory.length - 1)

            setTags(newTags)
            onChange?.(newTags)
            setInputValue("")
            setLocalError(null)
        }

        const removeTag = (tagToRemove: Tag) => {
            if (disabled || readOnly) return
            const newTags = tags.filter(tag => tag.id !== tagToRemove.id)

            // Add to history
            const newHistory = tagHistory.slice(0, historyIndex + 1)
            newHistory.push(newTags)
            setTagHistory(newHistory)
            setHistoryIndex(newHistory.length - 1)

            setTags(newTags)
            onChange?.(newTags)
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (disabled || readOnly) return

            // Undo/Redo handling
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault()
                    if (e.shiftKey) {
                        // Redo
                        if (historyIndex < tagHistory.length - 1) {
                            setHistoryIndex(historyIndex + 1)
                            setTags(tagHistory[historyIndex + 1])
                            onChange?.(tagHistory[historyIndex + 1])
                        }
                    } else {
                        // Undo
                        if (historyIndex > 0) {
                            setHistoryIndex(historyIndex - 1)
                            setTags(tagHistory[historyIndex - 1])
                            onChange?.(tagHistory[historyIndex - 1])
                        }
                    }
                }
                // Select all
                else if (e.key === 'a') {
                    e.preventDefault()
                    inputRef.current?.select()
                }
                return
            }

            // Remove last tag on backspace if input is empty
            if (e.key === "Backspace" && !inputValue && tags.length > 0) {
                e.preventDefault()
                removeTag(tags[tags.length - 1])
            }

            // Add tag on Enter or delimiter
            if (e.key === "Enter" || delimiter.test(e.key)) {
                e.preventDefault()
                addTag(inputValue)
            }
        }

        const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
            if (disabled || readOnly) return
            e.preventDefault()
            const pastedText = e.clipboardData.getData("text")
            const pastedTags = pastedText
                .split(delimiter)
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0)

            const newTags = [
                ...tags,
                ...pastedTags
                    .filter(tag => allowDuplicates || !tags.some(t => t.label === tag))
                    .map(createTag)
            ].slice(0, maxTags ? maxTags : undefined)

            // Add to history
            const newHistory = tagHistory.slice(0, historyIndex + 1)
            newHistory.push(newTags)
            setTagHistory(newHistory)
            setHistoryIndex(newHistory.length - 1)

            setTags(newTags)
            onChange?.(newTags)
        }

        const renderTags = () => (
            <div className="flex flex-wrap gap-2 px-3 py-2">
                {tags.map((tag) => (
                    <Badge
                        key={tag.id}
                        variant={variant}
                        size={size}
                        rounded={rounded}
                        icon={
                            !readOnly && !disabled && (
                                <X
                                    className="h-3 w-3 cursor-pointer hover:text-grey-500"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeTag(tag)
                                    }}
                                />
                            )
                        }
                    >
                        {tag.label}
                    </Badge>
                ))}
            </div>
        )

        return (
            <div className="space-y-2">
                <TextInput
                    ref={ref}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder={placeholder}
                    disabled={disabled || readOnly || (maxTags && tags.length >= maxTags)}
                    error={localError || error}
                    className={className}
                    {...props}
                />
                {tags.length > 0 && renderTags()}
            </div>
        )
    }
)

TagsInput.displayName = "TagsInput"