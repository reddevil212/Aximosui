// @ts-nocheck
"use client"


import * as React from "react"
import { Search as SearchIcon, X, Loader2 } from "lucide-react"
import { TextInput } from "./text-input"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    
    CommandItem,
    CommandList,
} from "./command"

export interface SearchSuggestion {
    id: string
    label: string
    description?: string
    category?: string
    icon?: React.ReactNode
    highlight?: boolean
}

export interface SearchProps extends Omit<React.ComponentProps<typeof TextInput>, "onChange"> {
    suggestions?: SearchSuggestion[]
    onSelect?: (suggestion: SearchSuggestion) => void
    onChange?: (value: string) => void
    debounceMs?: number
    loading?: boolean
    maxSuggestions?: number
    showClear?: boolean
    emptyMessage?: string
}

export const Search = React.forwardRef<HTMLInputElement, SearchProps>(
    ({
        suggestions = [],
        onSelect,
        onChange,
        debounceMs = 300,
        loading = false,
        maxSuggestions = 10,
        className,
        showClear = true,
        emptyMessage = "No results found.",
        ...props
    }, ref) => {
        const [open, setOpen] = React.useState(false)
        const [inputValue, setInputValue] = React.useState<string>("")
        const [debouncedValue, setDebouncedValue] = React.useState<string>("")
        const commandRef = React.useRef<HTMLDivElement>(null)

        const showSuggestions = open && suggestions.length > 0
        const filteredSuggestions = suggestions.slice(0, maxSuggestions)

        // Group suggestions by category
        const groupedSuggestions = React.useMemo(() => {
            return filteredSuggestions.reduce((acc, suggestion) => {
                const category = suggestion.category || "default"
                if (!acc[category]) {
                    acc[category] = []
                }
                acc[category].push(suggestion)
                return acc
            }, {} as Record<string, SearchSuggestion[]>)
        }, [filteredSuggestions])

        // Handle click outside
        React.useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
                    setOpen(false)
                }
            }

            document.addEventListener("mousedown", handleClickOutside)
            return () => document.removeEventListener("mousedown", handleClickOutside)
        }, [])

        // Debounce search input
        React.useEffect(() => {
            const timer = setTimeout(() => {
                setDebouncedValue(inputValue)
                onChange?.(inputValue)
            }, debounceMs)

            return () => clearTimeout(timer)
        }, [inputValue, debounceMs, onChange])

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value)
            setOpen(true)
        }

        const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
            setInputValue(suggestion.label)
            setOpen(false)
            onSelect?.(suggestion)
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Escape") {
                setOpen(false)
            }
        }

        const handleClear = () => {
            setInputValue("")
            setOpen(false)
            onChange?.("")
        }

        return (
            <div className="relative" ref={commandRef}>
                <TextInput
                    ref={ref}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setOpen(true)}
                    leftIcon={
                        loading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-500 dark:text-gray-400" />
                        ) : (
                            <SearchIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        )
                    }
                    rightIcon={
                        showClear && inputValue ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="cursor-pointer rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <X
                                    className="h-4 w-4 text-gray-500 dark:text-gray-400"
                                    onClick={handleClear}
                                />
                            </motion.div>
                        ) : undefined
                    }
                    iconClickable={showClear && !!inputValue}
                    className={cn(
                        "w-full transition-shadow duration-200",
                        "bg-white dark:bg-[#09090b]",
                        "text-black dark:text-white",
                        "border-gray-200 dark:border-gray-800",
                        "focus-within:border-gray-400 dark:focus-within:border-gray-600",
                        "focus-within:ring-2 focus-within:ring-gray-200 dark:focus-within:ring-gray-800",
                        className
                    )}
                    {...props}
                />

                <AnimatePresence>
                    {showSuggestions && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full z-50 mt-1 w-full"
                        >
                            <Command
                                className={cn(
                                    "rounded-lg border shadow-lg",
                                    "bg-white dark:bg-[#09090b]",
                                    "border-gray-200 dark:border-gray-800"
                                )}
                            >
                                <CommandList>
                                    {loading ? (
                                        <CommandEmpty className="py-6 text-gray-500 dark:text-gray-400">
                                            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                                            <span className="mt-2 block text-center">Searching...</span>
                                        </CommandEmpty>
                                    ) : suggestions.length === 0 ? (
                                        <CommandEmpty className="py-6 text-gray-500 dark:text-gray-400">
                                            {emptyMessage}
                                        </CommandEmpty>
                                    ) : (
                                        Object.entries(groupedSuggestions).map(([category, items]) => (
                                            <CommandGroup
                                                key={category}
                                                heading={
                                                    category !== "default" ? (
                                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                            {category}
                                                        </span>
                                                    ) : undefined
                                                }
                                            >
                                                {items.map((suggestion) => (
                                                    <CommandItem
                                                        key={suggestion.id}
                                                        onSelect={() => handleSuggestionSelect(suggestion)}
                                                        className={cn(
                                                            "flex items-center gap-3 px-4 py-2",
                                                            "cursor-pointer",
                                                            "hover:bg-gray-50 dark:hover:bg-gray-800",
                                                            suggestion.highlight && "bg-gray-50 dark:bg-gray-800"
                                                        )}
                                                    >
                                                        {suggestion.icon && (
                                                            <span className="flex h-6 w-6 items-center justify-center">
                                                                {suggestion.icon}
                                                            </span>
                                                        )}
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {suggestion.label}
                                                            </span>
                                                            {suggestion.description && (
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {suggestion.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        ))
                                    )}
                                </CommandList>
                            </Command>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }
)

Search.displayName = "Search"