// @ts-nocheck
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { debounce } from "lodash"
import { cn } from "@/lib/utils"


interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
    items: React.ReactNode[]
    columns?: {
        default: number
        sm?: number
        md?: number
        lg?: number
        xl?: number
    }
    gap?: number
    animated?: boolean
    columnClassName?: string
}

export const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
    ({
        items,
        columns = {
            default: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 5,
        },
        gap = 4,
        animated = true,
        className,
        columnClassName,
        ...props
    }, ref) => {
        const [columnCount, setColumnCount] = React.useState(columns.default)
        const [renderedItems, setRenderedItems] = React.useState<React.ReactNode[][]>([])
        const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

        // Update column count based on window width
        const updateColumns = React.useCallback(() => {
            const width = window.innerWidth
            if (width >= 1280 && columns.xl) setColumnCount(columns.xl)
            else if (width >= 1024 && columns.lg) setColumnCount(columns.lg)
            else if (width >= 768 && columns.md) setColumnCount(columns.md)
            else if (width >= 640 && columns.sm) setColumnCount(columns.sm)
            else setColumnCount(columns.default)
        }, [columns])

        const debouncedUpdateColumns = React.useCallback(
            debounce(updateColumns, 100),
            [updateColumns]
        )

        React.useEffect(() => {
            updateColumns()
            window.addEventListener("resize", debouncedUpdateColumns)

            // Add smooth scroll behavior to the document
            document.documentElement.style.scrollBehavior = "smooth"

            return () => {
                window.removeEventListener("resize", debouncedUpdateColumns)
                debouncedUpdateColumns.cancel()
                document.documentElement.style.scrollBehavior = ""
            }
        }, [debouncedUpdateColumns, updateColumns])

        React.useEffect(() => {
            const columns = new Array(columnCount).fill([]).map(() => [])

            items.forEach((item, index) => {
                const columnIndex = index % columnCount
                columns[columnIndex] = [...columns[columnIndex], {
                    item,
                    index
                }]
            })

            setRenderedItems(columns)
        }, [items, columnCount])

        return (
            <div
                ref={ref}
                className={cn(
                    "grid w-full auto-rows-max perspective-1000",
                    {
                        "grid-cols-1": columns.default === 1,
                        "grid-cols-2": columns.default === 2,
                        "sm:grid-cols-2": columns.sm === 2,
                        "sm:grid-cols-3": columns.sm === 3,
                        "md:grid-cols-3": columns.md === 3,
                        "md:grid-cols-4": columns.md === 4,
                        "lg:grid-cols-4": columns.lg === 4,
                        "lg:grid-cols-5": columns.lg === 5,
                        "xl:grid-cols-5": columns.xl === 5,
                        "xl:grid-cols-6": columns.xl === 6,
                    },
                    `gap-${gap}`,
                    className
                )}
                style={{ perspective: "1000px" }}
                {...props}
            >
                {renderedItems.map((column, columnIndex) => (
                    <div
                        key={columnIndex}
                        className={cn(
                            "flex flex-col gap-4 transition-all duration-300",
                            columnClassName
                        )}
                    >
                        <AnimatePresence>
                            {column.map(({ item, index }) => (
                                <motion.div
                                    key={index}
                                    initial={animated ? { opacity: 0, y: 20 } : false}
                                    animate={animated ? {
                                        opacity: 1,
                                        y: 0,
                                        scale: hoveredIndex === index ? 1.02 : 1,
                                        z: hoveredIndex === index ? 50 : 0,
                                        filter: hoveredIndex !== null && hoveredIndex !== index ? "blur(2px)" : "blur(0px)",
                                    } : false}
                                    exit={animated ? { opacity: 0, y: 20 } : false}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.05,
                                        ease: [0.23, 1, 0.32, 1] // Cubic bezier for smooth animation
                                    }}
                                    onHoverStart={() => setHoveredIndex(index)}
                                    onHoverEnd={() => setHoveredIndex(null)}
                                    className="transform-gpu" // Enable GPU acceleration
                                    style={{
                                        transformStyle: "preserve-3d",
                                    }}
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        )
    }
)

Masonry.displayName = "Masonry"