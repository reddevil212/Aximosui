// @ts-nocheck
"use client"

import * as React from "react"
import { Button } from "./button"
import { ChevronDown } from "lucide-react"

interface DropdownMenuProps {
    trigger?: React.ReactNode
    items: DropdownItem[]
    align?: "left" | "right"
    width?: number
    className?: string
    triggerClassName?: string
    menuClassName?: string
    itemClassName?: string
    dividerClassName?: string
    disabled?: boolean
    closeOnSelect?: boolean
    onOpenChange?: (open: boolean) => void
}

export interface DropdownItem {
    label: string
    icon?: React.ReactNode
    onClick?: () => void
    href?: string
    disabled?: boolean
    danger?: boolean
    divider?: boolean
    subItems?: DropdownItem[]
}

export function DropdownMenu({
    trigger,
    items,
    align = "left",
    width = 220,
    className = "",
    triggerClassName = "",
    menuClassName = "",
    itemClassName = "",
    dividerClassName = "",
    disabled = false,
    closeOnSelect = true,
    onOpenChange,
}: DropdownMenuProps) {
    const [open, setOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Helper function to join classes
    const cn = (...classes: string[]) => classes.filter(Boolean).join(" ")

    const handleOpen = () => {
        if (disabled) return
        const newOpen = !open
        setOpen(newOpen)
        onOpenChange?.(newOpen)
    }

    const handleItemClick = (item: DropdownItem) => {
        if (item.disabled) return

        item.onClick?.()

        if (closeOnSelect) {
            setOpen(false)
            onOpenChange?.(false)
        }
    }

    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false)
                onOpenChange?.(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [onOpenChange])

    return (
        <div ref={dropdownRef} className={cn("relative inline-block text-left", className)}>
            {/* Trigger */}
            <Button
                variant="default"
                onClick={handleOpen}
                disabled={disabled}
                className={cn(
                    "inline-flex justify-between items-center w-full rounded-md",
                    "px-4 py-2 text-sm font-medium text-black dark:text-white bg-white dark:bg-zinc-950 shadow-sm",
                    "hover:bg-gray-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-neutral-700",
                    disabled && "opacity-50 cursor-not-allowed",
                    triggerClassName
                )}
                aria-haspopup="true"
                aria-expanded={open}
            >
                {trigger || "Menu"}
                <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", open && "rotate-180")} />
            </Button>

            {/* Dropdown Menu */}
            {open && (
                <div
                    className={cn(
                        "absolute z-10 mt-2 rounded-md shadow-lg",
                        "bg-white dark:bg-zinc-950 text-black dark:text-white ring-1 ring-black ring-opacity-5 focus:outline-none",
                        align === "left" ? "origin-top-left left-0" : "origin-top-right right-0",
                        menuClassName
                    )}
                    style={{ width: `${width}px` }}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                >
                    <div className="py-1" role="none">
                        {items.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.divider ? (
                                    <div
                                        className={cn(
                                            "h-px my-1 bg-gray-200 dark:bg-neutral-800",
                                            dividerClassName
                                        )}
                                    />
                                ) : (
                                    <DropdownMenuItem
                                        item={item}
                                        onClick={() => handleItemClick(item)}
                                        itemClassName={itemClassName}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function DropdownMenuItem({
    item,
    onClick,
    itemClassName
}: {
    item: DropdownItem,
    onClick: () => void,
    itemClassName: string
}) {
    const cn = (...classes: string[]) => classes.filter(Boolean).join(" ")

    // We need to clone the icon and apply the text color to it
    const iconWithColor = item.icon
        ? React.cloneElement(item.icon as React.ReactElement, {
            className: cn(
                (item.icon as React.ReactElement).props.className || '',
                item.danger ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            )
        })
        : null;

    if (item.href && !item.disabled) {
        return (
            <a
                href={item.href}
                className={cn(
                    "flex items-center px-4 py-2 text-sm text-black dark:text-white",
                    "hover:bg-gray-100 dark:hover:bg-zinc-800",
                    item.disabled && "opacity-50 cursor-not-allowed",
                    item.danger && "text-red-500",
                    itemClassName
                )}
                role="menuitem"
                onClick={(e) => {
                    if (item.onClick) {
                        e.preventDefault()
                        onClick()
                    }
                }}
            >
                {iconWithColor && <span className="mr-2">{iconWithColor}</span>}
                {item.label}
            </a>
        )
    }

    return (
        <button
            type="button"
            className={cn(
                "flex w-full items-center px-4 py-2 text-sm text-black dark:text-white text-left",
                "hover:bg-gray-100 dark:hover:bg-zinc-800",
                item.disabled && "opacity-50 cursor-not-allowed",
                item.danger && "text-red-500",
                itemClassName
            )}
            role="menuitem"
            onClick={onClick}
            disabled={item.disabled}
        >
            {iconWithColor && <span className="mr-2">{iconWithColor}</span>}
            {item.label}
        </button>
    )
}