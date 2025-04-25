"use client"

import * as React from "react"
import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Column<T> {
    field: keyof T;
    header: string;
    width?: number;
    sortable?: boolean;
    filterable?: boolean;
    renderCell?: (row: T) => React.ReactNode;
    renderFilter?: (column: Column<T>, onFilter: (value: any) => void) => React.ReactNode;
}

export interface DataGridProps<T> {
    columns: Column<T>[];
    data: T[];
    rowKey: keyof T;
    pageSize?: number;
    selection?: 'single' | 'multiple' | 'none';
    onSelectionChange?: (selectedRows: T[]) => void;
    onRowClick?: (row: T) => void;
    className?: string;
    loading?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    stickyHeader?: boolean;
    emptyMessage?: string;
    headerClassName?: string;
    rowClassName?: string;
    cellClassName?: string;
}

export interface SortConfig {
    field: string;
    direction: 'asc' | 'desc';
}

export interface FilterConfig {
    [key: string]: any;
}

// Rename to DataGridPaginationProps
export interface DataGridPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    totalItems: number;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
}

const Pagination: React.FC<DataGridPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    pageSize,
    totalItems,
    onPageSizeChange,
    pageSizeOptions = [10, 25, 50, 100],
}) => {
    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 text-black dark:text-white">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <span>Rows per page:</span>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                    className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded px-2 py-1 text-black dark:text-white"
                >
                    {pageSizeOptions.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
                <span>
                    {(currentPage - 1) * pageSize + 1}-
                    {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
                </span>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                        "p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-black dark:text-white",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={cn(
                            "px-3 py-1 rounded transition-colors",
                            currentPage === page
                                ? "bg-gray-200 dark:bg-zinc-700 text-black dark:text-white"
                                : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-black dark:text-white"
                        )}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={cn(
                        "p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-black dark:text-white",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export function DataGrid<T extends object>({
    columns,
    data,
    rowKey,
    pageSize = 10,
    selection = 'none',
    onSelectionChange,
    onRowClick,
    className,
    loading = false,
    sortable = true,
    filterable = true,
    stickyHeader = true,
    emptyMessage = "No data available",
    headerClassName,
    rowClassName,
    cellClassName,
}: DataGridProps<T>) {
    const [currentPage, setCurrentPage] = useState(1)
    const [currentPageSize, setCurrentPageSize] = useState(pageSize)
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
    const [filterConfig, setFilterConfig] = useState<FilterConfig>({})
    const [selectedRows, setSelectedRows] = useState<T[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    const handleSort = useCallback((field: keyof T) => {
        setSortConfig((current) => {
            if (current?.field === field) {
                if (current.direction === 'asc') {
                    return { field: field as string, direction: 'desc' }
                }
                return null
            }
            return { field: field as string, direction: 'asc' }
        })
    }, [])

    const handleFilter = useCallback((field: keyof T, value: any) => {
        setFilterConfig((current) => ({
            ...current,
            [field]: value,
        }))
        setCurrentPage(1)
    }, [])

    const handleSelectRow = useCallback((row: T) => {
        if (selection === 'none') return

        setSelectedRows((current) => {
            if (selection === 'single') {
                const newSelection = current.some((r) => r[rowKey] === row[rowKey])
                    ? []
                    : [row]
                onSelectionChange?.(newSelection)
                return newSelection
            }

            const newSelection = current.some((r) => r[rowKey] === row[rowKey])
                ? current.filter((r) => r[rowKey] !== row[rowKey])
                : [...current, row]
            onSelectionChange?.(newSelection)
            return newSelection
        })
    }, [selection, rowKey, onSelectionChange])

    const filteredAndSortedData = useMemo(() => {
        let processed = [...data]

        // Apply filters
        Object.entries(filterConfig).forEach(([field, value]) => {
            if (value) {
                processed = processed.filter((item) =>
                    String(item[field as keyof T])
                        .toLowerCase()
                        .includes(String(value).toLowerCase())
                )
            }
        })

        // Apply search
        if (searchTerm) {
            processed = processed.filter((item) =>
                Object.values(item).some((val) =>
                    String(val).toLowerCase().includes(searchTerm.toLowerCase())
                )
            )
        }

        // Apply sort
        if (sortConfig) {
            processed.sort((a, b) => {
                const aVal = a[sortConfig.field as keyof T]
                const bVal = b[sortConfig.field as keyof T]

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }

        return processed
    }, [data, filterConfig, sortConfig, searchTerm])

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * currentPageSize
        return filteredAndSortedData.slice(start, start + currentPageSize)
    }, [filteredAndSortedData, currentPage, currentPageSize])

    const totalPages = Math.ceil(filteredAndSortedData.length / currentPageSize)

    return (
        <div className={cn(
            "rounded-sm border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-black dark:text-white",
            className
        )}>
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={cn(
                            "pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-900 rounded-sm",
                            "border border-gray-300 dark:border-zinc-700 focus:border-gray-400 dark:focus:border-zinc-600",
                            "text-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                            "focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600"
                        )}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto">
                <table className="w-full">
                    <thead className={cn(
                        "bg-gray-50 dark:bg-zinc-900",
                        stickyHeader && "sticky top-0",
                        headerClassName
                    )}>
                        <tr>
                            {selection !== 'none' && (
                                <th className="w-10 p-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length === data.length}
                                        onChange={() => {
                                            const newSelection = selectedRows.length === data.length ? [] : [...data]
                                            setSelectedRows(newSelection)
                                            onSelectionChange?.(newSelection)
                                        }}
                                        className="rounded border-gray-300 dark:border-zinc-700 text-sm"
                                    />
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={column.field as string}
                                    className={cn(
                                        "p-4 text-left font-medium text-sm text-black dark:text-white",
                                        "border-b border-gray-200 dark:border-zinc-800"
                                    )}
                                    style={{ width: column.width }}
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>{column.header}</span>
                                        {sortable && column.sortable !== false && (
                                            <button
                                                onClick={() => handleSort(column.field)}
                                                className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded"
                                            >
                                                {sortConfig?.field === column.field ? (
                                                    sortConfig.direction === 'asc' ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )
                                                ) : (
                                                    <ChevronsUpDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    {filterable && column.filterable !== false && (
                                        <div className="mt-2">
                                            {column.renderFilter ? (
                                                column.renderFilter(column, (value) => handleFilter(column.field, value))
                                            ) : (
                                                <input
                                                    type="text"
                                                    placeholder="Filter..."
                                                    onChange={(e) => handleFilter(column.field, e.target.value)}
                                                    className={cn(
                                                        "w-full px-2 py-1 text-sm bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                                                        "rounded border border-gray-300 dark:border-zinc-700",
                                                        "focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-zinc-600"
                                                    )}
                                                />
                                            )}
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                        <AnimatePresence>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + (selection !== 'none' ? 1 : 0)}
                                        className="p-4 text-center text-black dark:text-white"
                                    >
                                        <div className="flex items-center justify-center space-x-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + (selection !== 'none' ? 1 : 0)}
                                        className="p-4 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row) => (
                                    <motion.tr
                                        key={String(row[rowKey])}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={cn(
                                            "hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-black dark:text-white",
                                            rowClassName
                                        )}
                                        onClick={() => {
                                            handleSelectRow(row)
                                            onRowClick?.(row)
                                        }}
                                    >
                                        {selection !== 'none' && (
                                            <td className="w-10 p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.some((r) => r[rowKey] === row[rowKey])}
                                                    onChange={() => handleSelectRow(row)}
                                                    className="rounded border-gray-300 dark:border-zinc-700"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </td>
                                        )}
                                        {columns.map((column) => (
                                            <td
                                                key={column.field as string}
                                                className={cn("p-4", cellClassName)}
                                            >
                                                {column.renderCell ? column.renderCell(row) : String(row[column.field])}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={currentPageSize}
                totalItems={filteredAndSortedData.length}
                onPageSizeChange={setCurrentPageSize}
            />
        </div>
    )
}