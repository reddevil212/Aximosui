"use client"

import * as React from "react"
import { motion, AnimatePresence, Variants } from "framer-motion" // Add Variants import
import { cn } from "@/lib/utils"

// Create context for managing hover states
const MasonryContext = React.createContext<{
    activeId: string | null;
    setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
}>({
    activeId: null,
    setActiveId: () => null,
})

interface AutoplayMasonryProps extends React.HTMLAttributes<HTMLDivElement> {
    items: React.ReactNode[]
    columns?: number
    gap?: number
    animated?: boolean
    scrollSpeed?: number
    repeatCount?: number
    height?: number | string
    columnClassName?: string
    blurAmount?: number
    scaleAmount?: number
    opacityAmount?: number
    transitionDuration?: number
    hoverScale?: number
    blurBackground?: boolean
}

export const AutoplayMasonry = React.forwardRef<HTMLDivElement, AutoplayMasonryProps>(
    ({
        items,
        columns = 1,
        gap = 4,
        animated = true,
        scrollSpeed = 50,
        repeatCount = -1,
        height = "600px",
        className,
        columnClassName,
        blurAmount = 4,
        scaleAmount = 0.97,
        opacityAmount = 0.5,
        transitionDuration = 0.3,
        hoverScale = 1.03,
        blurBackground = true,
        ...props
    }, ref) => {
        const containerRef = React.useRef<HTMLDivElement>(null);

        // Use callback ref pattern instead of direct assignment
        React.useEffect(() => {
            if (ref) {
                if (typeof ref === 'function') {
                    ref(containerRef.current);
                } else {
                    // Use type assertion to handle readonly property
                    (ref as React.MutableRefObject<HTMLDivElement | null>).current = containerRef.current;
                }
            }
        }, [ref]);

        const [scrollPosition, setScrollPosition] = React.useState(0)
        const [renderedItems, setRenderedItems] = React.useState<Array<Array<React.ReactNode>>>([])
        const [isHovered, setIsHovered] = React.useState(false)
        const [repeatCounter, setRepeatCounter] = React.useState(0)
        const [activeId, setActiveId] = React.useState<string | null>(null)

        // Distribute items into columns
        React.useEffect(() => {
            const cols: Array<Array<React.ReactNode>> = Array(columns)
                .fill(null)
                .map(() => []);
                
            items.forEach((item, index) => {
                const columnIndex = index % columns;
                cols[columnIndex].push(item);
            });
            
            setRenderedItems(cols);
        }, [items, columns])

        // Smooth scroll animation using requestAnimationFrame
        React.useEffect(() => {
            if (!containerRef.current || isHovered) return
            if (repeatCount !== -1 && repeatCounter >= repeatCount) return

            const container = containerRef.current
            const totalHeight = container.scrollHeight - container.clientHeight
            let animationFrameId: number
            let lastTimestamp: number

            const animate = (timestamp: number) => {
                if (!lastTimestamp) lastTimestamp = timestamp
                const deltaTime = timestamp - lastTimestamp

                setScrollPosition((prevPos) => {
                    const increment = (scrollSpeed / 1000) * deltaTime
                    const newPos = prevPos + increment

                    if (newPos >= totalHeight) {
                        setRepeatCounter(prev => prev + 1)
                        return 0
                    }

                    return newPos
                })

                lastTimestamp = timestamp
                animationFrameId = requestAnimationFrame(animate)
            }

            animationFrameId = requestAnimationFrame(animate)

            return () => {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId)
                }
            }
        }, [scrollSpeed, isHovered, repeatCount, repeatCounter])

        // Update scroll position with smooth behavior
        React.useEffect(() => {
            if (containerRef.current) {
                containerRef.current.scrollTop = scrollPosition
            }
        }, [scrollPosition])

        const backgroundStyles = isHovered && blurBackground && activeId !== null
            ? "bg-white/30 dark:bg-[#090909]/30 backdrop-blur-sm"
            : "bg-white dark:bg-[#090909]"

        const gridClasses = {
            1: "grid-cols-1",
            2: "grid-cols-2",
            3: "grid-cols-3",
            4: "grid-cols-4",
            5: "grid-cols-5",
            6: "grid-cols-6",
        }

        const gapClasses = {
            1: "gap-1",
            2: "gap-2",
            3: "gap-3",
            4: "gap-4",
            5: "gap-5",
            6: "gap-6",
            8: "gap-8",
        }

        return (
            <MasonryContext.Provider value={{ activeId, setActiveId }}>
                <div
                    ref={containerRef}
                    style={{ height }}
                    className={cn(
                        "overflow-hidden relative transition-all duration-300",
                        backgroundStyles,
                        className
                    )}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => {
                        setIsHovered(false)
                        setActiveId(null)
                    }}
                    {...props}
                >
                    <div
                        className={cn(
                            "grid w-full auto-rows-max transition-all duration-300",
                            gridClasses[columns as keyof typeof gridClasses] || "grid-cols-1",
                            gapClasses[gap as keyof typeof gapClasses] || "gap-4"
                        )}
                    >
                        {renderedItems.map((column, columnIndex) => (
                            <div
                                key={columnIndex}
                                className={cn("flex flex-col gap-4", columnClassName)}
                            >
                                <AnimatePresence>
                                    {column.map((item, itemIndex) => (
                                        <MasonryItem
                                            key={itemIndex}
                                            itemId={`${columnIndex}-${itemIndex}`}
                                            animated={animated}
                                            itemIndex={itemIndex}
                                            blurAmount={blurAmount}
                                            scaleAmount={scaleAmount}
                                            opacityAmount={opacityAmount}
                                            transitionDuration={transitionDuration}
                                            hoverScale={hoverScale}
                                        >
                                            {item}
                                        </MasonryItem>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </MasonryContext.Provider>
        )
    }
)

interface MasonryItemProps {
    children: React.ReactNode
    itemId: string
    animated: boolean
    itemIndex: number
    blurAmount: number
    scaleAmount: number
    opacityAmount: number
    transitionDuration: number
    hoverScale: number
}

// Fix variants type
const variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const MasonryItem: React.FC<MasonryItemProps> = ({
    children,
    itemId,
    animated,
    itemIndex,
    blurAmount,
    scaleAmount,
    opacityAmount,
    transitionDuration,
    hoverScale,
}) => {
    const { activeId, setActiveId } = React.useContext(MasonryContext)
    const isActive = activeId === itemId
    const isBlurred = activeId !== null && !isActive

    const transitionStyles = {
        transform: isActive
            ? `scale(${hoverScale})`
            : isBlurred
                ? `scale(${scaleAmount})`
                : "scale(1)",
        filter: isBlurred ? `blur(${blurAmount}px)` : "blur(0px)",
        opacity: isBlurred ? opacityAmount : 1,
        transition: `all ${transitionDuration}s ease-in-out`,
        zIndex: isActive ? 10 : 1,
    }

    return (
        <motion.div
            initial={animated ? "hidden" : false}
            animate={animated ? "visible" : false}
            exit={animated ? "hidden" : undefined}
            variants={variants}
            transition={{ duration: 0.2, delay: itemIndex * 0.05 }}
            style={transitionStyles}
            onMouseEnter={() => setActiveId(itemId)}
            onMouseLeave={() => setActiveId(null)}
        >
            {children}
        </motion.div>
    )
}

AutoplayMasonry.displayName = "AutoplayMasonry"

export { type AutoplayMasonryProps }