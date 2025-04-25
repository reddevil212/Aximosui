"use client"

import * as React from "react"
import { ChevronRight, Home, MoreHorizontal } from "lucide-react"

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
    segments: BreadcrumbSegment[]
    separator?: React.ReactNode
    homeIcon?: boolean
    maxItems?: number
    className?: string
    itemClassName?: string
    separatorClassName?: string
    activeItemClassName?: string
    dropdownClassName?: string
    collapsed?: boolean
}

export interface BreadcrumbSegment {
    name: string;
    href: string;
    icon?: React.ReactElement;
    onClick?: () => void;
}

export function Breadcrumb({
    segments,
    separator = <ChevronRight className="h-4 w-4" />,
    homeIcon = true,
    maxItems = 0,
    className = "",
    itemClassName = "",
    separatorClassName = "",
    activeItemClassName = "",
    dropdownClassName = "",
    collapsed = false,
    ...props
}: BreadcrumbProps) {
    const [dropdownOpen, setDropdownOpen] = React.useState(false)

    const cn = (...classes: string[]) => classes.filter(Boolean).join(" ")

    const showDropdown = maxItems > 0 && segments.length > maxItems

    const visibleSegments = React.useMemo(() => {
        if (!showDropdown) return segments

        const firstSegment = segments[0]
        const lastSegments = segments.slice(-Math.floor(maxItems / 2))

        const firstSegments = maxItems >= 3
            ? segments.slice(0, Math.ceil(maxItems / 2) - 1)
            : [firstSegment]

        return [
            ...firstSegments,
            { name: "...", href: "", icon: <MoreHorizontal className="h-4 w-4" />, onClick: undefined },
            ...lastSegments
        ]
    }, [segments, showDropdown, maxItems])

    const collapsedSegments = React.useMemo(() => {
        if (!collapsed) return visibleSegments

        return segments.length > 1
            ? [segments[0], segments[segments.length - 1]]
            : segments
    }, [collapsed, segments, visibleSegments])

    const renderSegments = collapsedSegments

    const hiddenSegments = showDropdown
        ? segments.slice(Math.ceil(maxItems / 2) - 1, segments.length - Math.floor(maxItems / 2))
        : []

    return (
        <nav
            className={cn(
                "flex items-center text-sm",
                className
            )}
            aria-label="Breadcrumb"
            {...props}
        >
            <ol className="flex items-center space-x-2">
                {renderSegments.map((segment, index) => {
                    const isLast = index === renderSegments.length - 1
                    const isDropdown = segment.name === "..." && showDropdown
                    const showHome = index === 0 && homeIcon && !segment.icon

                    return (
                        <li key={index} className="flex items-center">
                            {index > 0 && (
                                <span
                                    className={cn(
                                        "mx-2 text-neutral-400 dark:text-neutral-500",
                                        separatorClassName
                                    )}
                                    aria-hidden="true"
                                >
                                    {separator}
                                </span>
                            )}

                            {isDropdown ? (
                                <div className="relative">
                                    <button
                                        className={cn(
                                            "flex items-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
                                            itemClassName
                                        )}
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        aria-expanded={dropdownOpen}
                                        aria-haspopup="true"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>

                                    {dropdownOpen && (
                                        <div
                                            className={cn(
                                                "absolute z-10 mt-2 w-56 rounded-md bg-white dark:bg-neutral-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
                                                dropdownClassName
                                            )}
                                        >
                                            <ul
                                                className="py-1 max-h-60 overflow-auto"
                                                role="menu"
                                                aria-orientation="vertical"
                                                aria-labelledby="options-menu"
                                            >
                                                {hiddenSegments.map((hiddenSegment, hiddenIndex) => (
                                                    <li key={hiddenIndex} role="menuitem">
                                                        {hiddenSegment.href ? (
                                                            <a
                                                                href={hiddenSegment.href}
                                                                onClick={hiddenSegment.onClick}
                                                                className={cn(
                                                                    "block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                                                                    "dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
                                                                    itemClassName
                                                                )}
                                                            >
                                                                <div className="flex items-center">
                                                                    {hiddenSegment.icon && (
                                                                        <span className="mr-2">{hiddenSegment.icon}</span>
                                                                    )}
                                                                    {hiddenSegment.name}
                                                                </div>
                                                            </a>
                                                        ) : (
                                                            <span
                                                                className={cn(
                                                                    "block px-4 py-2 text-sm text-neutral-500",
                                                                    "dark:text-neutral-400",
                                                                    itemClassName
                                                                )}
                                                            >
                                                                <div className="flex items-center">
                                                                    {hiddenSegment.icon && (
                                                                        <span className="mr-2">{hiddenSegment.icon}</span>
                                                                    )}
                                                                    {hiddenSegment.name}
                                                                </div>
                                                            </span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {segment.href && !isLast ? (
                                        <a
                                            href={segment.href}
                                            onClick={segment.onClick}
                                            className={cn(
                                                "flex items-center text-neutral-500 hover:text-neutral-900",
                                                "dark:text-neutral-400 dark:hover:text-neutral-100",
                                                itemClassName
                                            )}
                                        >
                                            {showHome && <Home className="h-4 w-4" />}
                                            {segment.icon && <span className="mr-1">{segment.icon}</span>}
                                            {!showHome || segment.name !== "Home" ? <span>{segment.name}</span> : null}
                                        </a>
                                    ) : (
                                        <span
                                            className={cn(
                                                "flex items-center",
                                                isLast
                                                    ? cn("font-medium text-neutral-900 dark:text-neutral-100", activeItemClassName)
                                                    : "text-neutral-500 dark:text-neutral-400",
                                                itemClassName
                                            )}
                                            aria-current={isLast ? "page" : undefined}
                                        >
                                            {showHome && <Home className="h-4 w-4" />}
                                            {segment.icon && <span className="mr-1">{segment.icon}</span>}
                                            {!showHome || segment.name !== "Home" ? <span>{segment.name}</span> : null}
                                        </span>
                                    )}
                                </>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}

Breadcrumb.displayName = "Breadcrumb"