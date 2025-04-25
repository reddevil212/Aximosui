"use client"



import * as React from "react"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Total number of items */
    total: number
    /** Number of items per page */
    pageSize: number
    /** Current page number (1-based) */
    currentPage: number
    /** Callback when page changes */
    onPageChange: (page: number) => void
    /** Number of pages to show on each side of current page */
    siblings?: number
    /** Show first/last page buttons */
    showFirstLast?: boolean
    /** Show total items count */
    showCount?: boolean
    /** Show page size selector */
    showPageSize?: boolean
    /** Available page sizes */
    pageSizeOptions?: number[]
    /** Callback when page size changes */
    onPageSizeChange?: (pageSize: number) => void
    /** Disable pagination */
    disabled?: boolean
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
    ({
        total,
        pageSize,
        currentPage,
        onPageChange,
        siblings = 1,
        showFirstLast = true,
        showCount = true,
        showPageSize = false,
        pageSizeOptions = [10, 20, 30, 40, 50],
        onPageSizeChange,
        disabled = false,
        className,
        ...props
    }, ref) => {
        const totalPages = Math.ceil(total / pageSize)

        const getPageNumbers = () => {
            const totalNumbers = siblings * 2 + 3
            const totalBlocks = totalNumbers + 2

            if (totalPages > totalBlocks) {
                const startPage = Math.max(2, currentPage - siblings)
                const endPage = Math.min(totalPages - 1, currentPage + siblings)
                const pages: (number | string)[] = []

                pages.push(1)

                if (startPage > 2) {
                    pages.push("...")
                }

                for (let i = startPage; i <= endPage; i++) {
                    pages.push(i)
                }

                if (endPage < totalPages - 1) {
                    pages.push("...")
                }

                pages.push(totalPages)

                return pages
            }

            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        const pages = getPageNumbers()

        const PageSizeSelector = () => (
            <select
                className={cn(
                    "h-8 rounded-md border px-2 text-sm transition-colors",
                    "bg-white text-black dark:bg-[#09090b] dark:text-white",
                    "border-gray-200 dark:border-gray-700",
                    "focus:outline-none focus:ring-2",
                    "focus:ring-black dark:focus:ring-white",
                    "focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#09090b]",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                )}
                value={pageSize}
                onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                disabled={disabled}
            >
                {pageSizeOptions.map((size) => (
                    <option
                        key={size}
                        value={size}
                        className="bg-white text-black dark:bg-[#09090b] dark:text-white"
                    >
                        {size} per page
                    </option>
                ))}
            </select>
        )

        const PageButton = ({
            page,
            children,
            disabled: buttonDisabled = false,
            "aria-label": ariaLabel,
        }: {
            page?: number
            children: React.ReactNode
            disabled?: boolean
            "aria-label"?: string
        }) => (
            <button
                className={cn(
                    "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2",
                    "text-sm font-medium transition-colors",
                    "focus:outline-none focus:ring-2",
                    "focus:ring-black dark:focus:ring-white",
                    "focus:ring-offset-2",
                    "focus:ring-offset-white dark:focus:ring-offset-[#09090b]",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    page === currentPage
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
                disabled={disabled || buttonDisabled}
                onClick={() => page && onPageChange(page)}
                aria-label={ariaLabel}
                aria-current={page === currentPage ? "page" : undefined}
            >
                {children}
            </button>
        )

        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
                    className
                )}
                {...props}
            >
                <div className="flex items-center gap-2">
                    {showFirstLast && (
                        <PageButton
                            page={1}
                            disabled={currentPage === 1}
                            aria-label="Go to first page"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </PageButton>
                    )}

                    <PageButton
                        page={currentPage - 1}
                        disabled={currentPage === 1}
                        aria-label="Go to previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </PageButton>

                    {pages.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === "..." ? (
                                <span className="flex h-8 min-w-8 items-center justify-center text-black dark:text-white">
                                    <MoreHorizontal className="h-4 w-4" />
                                </span>
                            ) : (
                                <PageButton page={page as number}>
                                    {page}
                                </PageButton>
                            )}
                        </React.Fragment>
                    ))}

                    <PageButton
                        page={currentPage + 1}
                        disabled={currentPage === totalPages}
                        aria-label="Go to next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </PageButton>

                    {showFirstLast && (
                        <PageButton
                            page={totalPages}
                            disabled={currentPage === totalPages}
                            aria-label="Go to last page"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </PageButton>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {showPageSize && <PageSizeSelector />}

                    {showCount && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {total} items
                        </p>
                    )}
                </div>
            </div>
        )
    }
)

Pagination.displayName = "Pagination"

export { Pagination }
export type { PaginationProps }