import * as React from "react"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion" // Assuming framer-motion is installed

// Types for sorting functionality
export type SortDirection = "asc" | "desc" | null
export interface SortableColumnProps {
    column: string
    direction: SortDirection
    onSort?: (column: string, direction: SortDirection) => void
}

// Enhanced Table component with visual improvements
const Table = React.forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement> & {
        zebra?: boolean
        bordered?: boolean
        hoverable?: boolean
        compact?: boolean
        stickyHeader?: boolean
        variant?: "default" | "modern" | "minimal" | "glass"
        animate?: boolean
    }
>(({
    className,
    zebra,
    bordered,
    hoverable = true,
    compact,
    stickyHeader,
    variant = "default",
    animate = true,
    ...props
}, ref) => {
    // Determine styles based on variant
    const variantStyles = {
        default: "",
        modern: "rounded-xl overflow-hidden shadow-lg border-0",
        minimal: "border-0 [&_th]:border-b-2 [&_td]:border-0 [&_tr]:border-0",
        glass: "backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-white/20 dark:border-gray-800/50 shadow-xl"
    }

    return (
        <div className={cn(
            "relative w-full overflow-auto rounded-md transition-all duration-200",
            "dark:bg-[#090909] dark:text-white text-black bg-white",
            bordered && variant !== "glass" && variant !== "minimal" && "border dark:border-gray-800 border-gray-200",
            variantStyles[variant],
            className
        )}>
            <table
                ref={ref}
                className={cn(
                    "w-full caption-bottom text-sm",
                    compact ? "table-fixed" : "table-auto",
                    zebra && "[&_tbody_tr:nth-child(even)]:bg-gray-50/70 [&_tbody_tr:nth-child(even)]:dark:bg-gray-900/30",
                    bordered && variant !== "minimal" && "[&_th]:border [&_td]:border dark:[&_th]:border-gray-800 dark:[&_td]:border-gray-800 [&_th]:border-gray-200 [&_td]:border-gray-200",
                    "dark:bg-[#090909] dark:text-white text-black bg-white",
                    variant === "glass" && "bg-transparent dark:bg-transparent"
                )}
                {...props}
            />
        </div>
    )
})
Table.displayName = "Table"

// Enhanced header with sticky option and better styling
const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement> & {
        sticky?: boolean
        variant?: "default" | "modern" | "minimal" | "glass"
    }
>(({ className, sticky, variant = "default", ...props }, ref) => {
    const variantStyles = {
        default: "",
        modern: "bg-gray-50 dark:bg-gray-900/50",
        minimal: "border-b-2 dark:border-gray-800 border-gray-300",
        glass: "backdrop-blur-sm bg-white/40 dark:bg-black/40"
    }

    return (
        <thead
            ref={ref}
            className={cn(
                "[&_tr]:border-b dark:border-gray-800 border-gray-200",
                "dark:bg-[#090909] dark:text-white text-black bg-white",
                variant === "glass" && "bg-transparent dark:bg-transparent",
                variantStyles[variant],
                sticky && "sticky top-0 z-10 backdrop-blur-sm",
                className
            )}
            {...props}
        />
    )
})
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement> & {
        loading?: boolean
        emptyMessage?: string
        animate?: boolean
        variant?: "default" | "modern" | "minimal" | "glass"
    }
>(({ className, loading, emptyMessage, children, animate = true, variant = "default", ...props }, ref) => {
    const isEmpty = React.Children.count(children) === 0

    return (
        <tbody
            ref={ref}
            className={cn(
                "[&_tr:last-child]:border-0 dark:bg-[#090909] dark:text-white text-black bg-white",
                variant === "glass" && "bg-transparent dark:bg-transparent",
                className
            )}
            {...props}
        >
            {loading ? (
                <tr>
                    <td colSpan={100} className="h-24 text-center">
                        <div className="flex items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            <span className="ml-2 text-primary font-medium">Loading...</span>
                        </div>
                    </td>
                </tr>
            ) : isEmpty && emptyMessage ? (
                <tr>
                    <td colSpan={100} className="py-10 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-muted-foreground font-medium">{emptyMessage}</p>
                        </div>
                    </td>
                </tr>
            ) : animate ? (
                <AnimatePresence>
                    {React.Children.map(children, (child, index) => (
                        <motion.tr
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            key={index}
                        >
                            {React.isValidElement(child) ?
                                React.Children.map(child.props.children, (tdChild) => tdChild) :
                                null}
                        </motion.tr>
                    ))}
                </AnimatePresence>
            ) : (
                children
            )}
        </tbody>
    )
})
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement> & {
        variant?: "default" | "modern" | "minimal" | "glass"
    }
>(({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
        default: "bg-gray-50 dark:bg-gray-900/50",
        modern: "bg-gray-50 dark:bg-gray-900/50 rounded-b-xl",
        minimal: "border-t-2 dark:border-gray-800 border-gray-300 bg-transparent",
        glass: "backdrop-blur-sm bg-white/40 dark:bg-black/40"
    }

    return (
        <tfoot
            ref={ref}
            className={cn(
                "border-t font-medium [&>tr]:last:border-b-0",
                variantStyles[variant],
                "dark:text-white text-black",
                variant === "glass" && "bg-transparent",
                className
            )}
            {...props}
        />
    )
})
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement> & {
        selected?: boolean
        highlight?: boolean
        variant?: "default" | "modern" | "minimal" | "glass"
    }
>(({ className, selected, highlight, variant = "default", ...props }, ref) => {
    const selectStyle = selected ? "bg-primary/10 dark:bg-primary/20" : ""
    const highlightStyle = highlight ? "bg-yellow-50 dark:bg-yellow-900/20" : ""

    // Modern variant hover effect
    const hoverStyles = {
        default: "hover:bg-gray-50 dark:hover:bg-gray-900/50",
        modern: "hover:bg-gray-50 dark:hover:bg-gray-900/50",
        minimal: "hover:bg-gray-50 dark:hover:bg-gray-900/30",
        glass: "hover:bg-white/20 dark:hover:bg-gray-800/20"
    }

    return (
        <tr
            ref={ref}
            className={cn(
                "border-b transition-colors dark:border-gray-800 border-gray-200",
                hoverStyles[variant],
                selectStyle,
                highlightStyle,
                "dark:bg-[#090909] dark:text-white text-black bg-white",
                variant === "glass" && "bg-transparent dark:bg-transparent",
                selected && "ring-1 ring-inset ring-primary/20",
                className
            )}
            {...props}
        />
    )
})
TableRow.displayName = "TableRow"

// Enhanced TableHead with sorting capabilities and better visuals
const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement> & SortableColumnProps & {
        variant?: "default" | "modern" | "minimal" | "glass"
    }
>(({ className, column, direction, onSort, children, variant = "default", ...props }, ref) => {
    const isSortable = !!onSort && !!column

    const handleSort = () => {
        if (isSortable) {
            const newDirection: SortDirection =
                direction === null ? "asc" : direction === "asc" ? "desc" : null
            onSort(column, newDirection)
        }
    }

    // Styles based on variant
    const headingStyles = {
        default: "font-medium text-muted-foreground",
        modern: "font-semibold text-gray-700 dark:text-gray-300",
        minimal: "font-semibold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider",
        glass: "font-medium text-gray-700 dark:text-gray-300"
    }

    return (
        <th
            ref={ref}
            className={cn(
                "h-12 px-4 text-left align-middle transition-colors",
                headingStyles[variant],
                "dark:bg-[#090909] dark:text-white text-black bg-white",
                variant === "glass" && "bg-transparent dark:bg-transparent",
                isSortable && "cursor-pointer select-none",
                isSortable && "hover:bg-gray-50/80 dark:hover:bg-gray-800/30",
                direction && "bg-gray-50/50 dark:bg-gray-800/20", // Subtle highlight when sorted
                className
            )}
            onClick={isSortable ? handleSort : undefined}
            {...props}
        >
            <div className="flex items-center space-x-1">
                <span>{children}</span>
                {isSortable && (
                    <motion.span
                        className="flex items-center ml-1.5"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: direction ? 1 : 0.5 }}
                        transition={{ duration: 0.2 }}
                    >
                        {direction === "asc" ? (
                            <ChevronUp className="h-4 w-4 text-primary" />
                        ) : direction === "desc" ? (
                            <ChevronDown className="h-4 w-4 text-primary" />
                        ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                        )}
                    </motion.span>
                )}
            </div>
        </th>
    )
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement> & {
        truncate?: boolean
        highlight?: boolean
        badge?: boolean
        variant?: "default" | "modern" | "minimal" | "glass"
    }
>(({ className, truncate, highlight, badge, variant = "default", ...props }, ref) => {
    return (
        <td
            ref={ref}
            className={cn(
                "p-4 align-middle transition-colors",
                truncate && "max-w-[12rem] truncate",
                highlight && "bg-yellow-50/50 dark:bg-yellow-900/20",
                badge && "font-medium",
                "dark:bg-[#090909] dark:text-white text-black bg-white",
                variant === "glass" && "bg-transparent dark:bg-transparent",
                className
            )}
            {...props}
        />
    )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement> & {
        variant?: "default" | "modern" | "minimal" | "glass"
    }
>(({ className, variant = "default", ...props }, ref) => {
    const captionStyles = {
        default: "text-sm text-muted-foreground mt-4",
        modern: "text-sm font-medium text-muted-foreground mt-4",
        minimal: "text-xs uppercase tracking-wider text-muted-foreground mt-4 font-medium",
        glass: "text-sm italic text-muted-foreground mt-4"
    }

    return (
        <caption
            ref={ref}
            className={cn(
                captionStyles[variant],
                "dark:bg-[#090909] dark:text-white text-black bg-white",
                variant === "glass" && "bg-transparent dark:bg-transparent",
                className
            )}
            {...props}
        />
    )
})
TableCaption.displayName = "TableCaption"

// Enhanced Pagination component with better styling
interface TablePaginationProps extends React.HTMLAttributes<HTMLDivElement> {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    variant?: "default" | "modern" | "minimal" | "glass"
    showPageCount?: boolean
    showInput?: boolean
    compact?: boolean
}

const TablePagination = React.forwardRef<
    HTMLDivElement,
    TablePaginationProps
>(({
    className,
    currentPage,
    totalPages,
    onPageChange,
    variant = "default",
    showPageCount = true,
    showInput = false,
    compact = false,
    ...props
}, ref) => {
    const [pageInput, setPageInput] = React.useState(currentPage.toString())

    React.useEffect(() => {
        setPageInput(currentPage.toString())
    }, [currentPage])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPageInput(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newPage = parseInt(pageInput)
        if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage)
        } else {
            setPageInput(currentPage.toString())
        }
    }

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = compact ? 3 : 5

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            // Calculate range around current page
            let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
            let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3)

            // Adjust start if we're near the end
            if (endPage === totalPages - 1) {
                startPage = Math.max(2, endPage - (maxVisiblePages - 3))
            }

            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pages.push('ellipsis-start')
            }

            // Add pages in range
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i)
            }

            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pages.push('ellipsis-end')
            }

            // Always show last page
            pages.push(totalPages)
        }

        return pages
    }

    const paginationVariants = {
        default: "bg-white dark:bg-[#090909] border-t dark:border-gray-800 border-gray-200",
        modern: "bg-white dark:bg-[#090909] rounded-lg shadow-sm border dark:border-gray-800 border-gray-200 mt-4",
        minimal: "bg-transparent",
        glass: "backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-white/20 dark:border-gray-800/50 rounded-lg mt-4"
    }

    const pageButtonVariants = {
        default: "px-3 py-1.5 rounded border dark:border-gray-800 border-gray-200 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
        modern: "w-9 h-9 flex items-center justify-center rounded-full text-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-800 font-medium",
        minimal: "px-3 py-1.5 rounded-full text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
        glass: "px-3 py-1.5 rounded border border-white/20 dark:border-gray-800/50 text-sm transition-all hover:bg-white/20 dark:hover:bg-gray-800/30 backdrop-blur-sm"
    }

    const activePageVariants = {
        default: "bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground",
        modern: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        minimal: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        glass: "bg-primary/90 text-primary-foreground border-primary/50 hover:bg-primary/90 hover:text-primary-foreground"
    }

    return (
        <div
            ref={ref}
            className={cn(
                "flex items-center justify-between py-4 px-4",
                paginationVariants[variant],
                className
            )}
            {...props}
        >
            {showPageCount && (
                <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </div>
            )}

            {showInput && (
                <form onSubmit={handleSubmit} className="hidden md:flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Go to page:</span>
                    <input
                        value={pageInput}
                        onChange={handleInputChange}
                        className="w-14 rounded-md border border-gray-300 dark:border-gray-700 px-2 py-1 text-sm"
                        type="text"
                    />
                    <button
                        type="submit"
                        className={cn(pageButtonVariants[variant], "bg-gray-100 dark:bg-gray-800")}
                    >
                        Go
                    </button>
                </form>
            )}

            <div className="flex space-x-1">
                <button
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className={cn(
                        pageButtonVariants[variant],
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    aria-label="Previous page"
                >
                    <ChevronUp className="h-4 w-4 rotate-90" />
                </button>

                {!compact && (
                    <div className="hidden md:flex space-x-1">
                        {getPageNumbers().map((page, i) => (
                            typeof page === 'number' ? (
                                <button
                                    key={i}
                                    onClick={() => onPageChange(page)}
                                    className={cn(
                                        pageButtonVariants[variant],
                                        currentPage === page && activePageVariants[variant]
                                    )}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span
                                    key={i}
                                    className="flex items-center justify-center w-9 h-9 text-muted-foreground"
                                >
                                    ...
                                </span>
                            )
                        ))}
                    </div>
                )}

                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className={cn(
                        pageButtonVariants[variant],
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    aria-label="Next page"
                >
                    <ChevronDown className="h-4 w-4 rotate-90" />
                </button>
            </div>
        </div>
    )
})
TablePagination.displayName = "TablePagination"

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
    TablePagination,
}