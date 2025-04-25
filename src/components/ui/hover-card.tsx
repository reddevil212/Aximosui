// @ts-nocheck
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface HoverCardProps {
    trigger: React.ReactNode
    content: React.ReactNode
    openDelay?: number
    closeDelay?: number
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    width?: number
    className?: string
    contentClassName?: string
    arrowClassName?: string
    arrow?: boolean
    disabled?: boolean
    interactive?: boolean
    sideOffset?: number
    alignOffset?: number
}

export function HoverCard({
    trigger,
    content,
    openDelay = 300,
    closeDelay = 200,
    side = "bottom",
    align = "center",
    width = 320,
    className = "",
    contentClassName = "",
    arrowClassName = "",
    arrow = true,
    disabled = false,
    interactive = true,
    sideOffset = 8,
    alignOffset = 0,
}: HoverCardProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [position, setPosition] = React.useState({ top: 0, left: 0 })
    const triggerRef = React.useRef<HTMLDivElement>(null)
    const cardRef = React.useRef<HTMLDivElement>(null)

    let openTimeout: ReturnType<typeof setTimeout>
    let closeTimeout: ReturnType<typeof setTimeout>

    // Helper function to join classes
    const cn = (...classes: string[]) => classes.filter(Boolean).join(" ")

    const updatePosition = React.useCallback(() => {
        if (!triggerRef.current || !cardRef.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const cardRect = cardRef.current.getBoundingClientRect()

        let top = 0
        let left = 0

        // Calculate based on side
        switch (side) {
            case "top":
                top = triggerRect.top - cardRect.height - sideOffset
                break
            case "right":
                left = triggerRect.right + sideOffset
                break
            case "bottom":
                top = triggerRect.bottom + sideOffset
                break
            case "left":
                left = triggerRect.left - cardRect.width - sideOffset
                break
        }

        // Adjust for vertical alignment (for left/right sides)
        if (side === "left" || side === "right") {
            switch (align) {
                case "start":
                    top = triggerRect.top + alignOffset
                    break
                case "center":
                    top = triggerRect.top + (triggerRect.height / 2) - (cardRect.height / 2) + alignOffset
                    break
                case "end":
                    top = triggerRect.bottom - cardRect.height + alignOffset
                    break
            }
        }

        // Adjust for horizontal alignment (for top/bottom sides)
        if (side === "top" || side === "bottom") {
            switch (align) {
                case "start":
                    left = triggerRect.left + alignOffset
                    break
                case "center":
                    left = triggerRect.left + (triggerRect.width / 2) - (cardRect.width / 2) + alignOffset
                    break
                case "end":
                    left = triggerRect.right - cardRect.width + alignOffset
                    break
            }
        }

        // Apply viewport constraints
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        // Keep the card within the viewport
        if (left < 10) left = 10
        if (left + cardRect.width > viewportWidth - 10) {
            left = viewportWidth - cardRect.width - 10
        }

        if (top < 10) top = 10
        if (top + cardRect.height > viewportHeight - 10) {
            top = viewportHeight - cardRect.height - 10
        }

        // Apply scroll offsets
        top += window.scrollY
        left += window.scrollX

        setPosition({ top, left })
    }, [side, align, sideOffset, alignOffset])

    const handleMouseEnter = () => {
        if (disabled) return

        clearTimeout(closeTimeout)
        openTimeout = setTimeout(() => {
            setIsOpen(true)
            // Need to wait for the card to render before calculating position
            setTimeout(updatePosition, 0)
        }, openDelay)
    }

    const handleMouseLeave = () => {
        if (disabled) return

        clearTimeout(openTimeout)
        closeTimeout = setTimeout(() => {
            setIsOpen(false)
        }, closeDelay)
    }

    const handleCardMouseEnter = () => {
        if (!interactive) return
        clearTimeout(closeTimeout)
    }

    const handleCardMouseLeave = () => {
        if (!interactive) return
        handleMouseLeave()
    }

    // Clean up timeouts
    React.useEffect(() => {
        return () => {
            clearTimeout(openTimeout)
            clearTimeout(closeTimeout)
        }
    }, [])

    // Update position on window resize
    React.useEffect(() => {
        if (!isOpen) return

        const handleResize = () => {
            updatePosition()
        }

        window.addEventListener("resize", handleResize)
        window.addEventListener("scroll", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("scroll", handleResize)
        }
    }, [isOpen, updatePosition])

    // Calculate arrow position
    const getArrowStyles = (): React.CSSProperties => {
        const base: React.CSSProperties = {
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: 'white',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            transform: 'rotate(45deg)',
        }

        if (side === 'top') {
            return {
                ...base,
                bottom: '-5px',
                left: align === 'start' ? '15px' : align === 'end' ? 'auto' : '50%',
                right: align === 'end' ? '15px' : 'auto',
                marginLeft: align === 'center' ? '-5px' : '0',
                borderTop: 'none',
                borderLeft: 'none',
            }
        } else if (side === 'bottom') {
            return {
                ...base,
                top: '-5px',
                left: align === 'start' ? '15px' : align === 'end' ? 'auto' : '50%',
                right: align === 'end' ? '15px' : 'auto',
                marginLeft: align === 'center' ? '-5px' : '0',
                borderBottom: 'none',
                borderRight: 'none',
            }
        } else if (side === 'left') {
            return {
                ...base,
                right: '-5px',
                top: align === 'start' ? '15px' : align === 'end' ? 'auto' : '50%',
                bottom: align === 'end' ? '15px' : 'auto',
                marginTop: align === 'center' ? '-5px' : '0',
                borderLeft: 'none',
                borderBottom: 'none',
            }
        } else if (side === 'right') {
            return {
                ...base,
                left: '-5px',
                top: align === 'start' ? '15px' : align === 'end' ? 'auto' : '50%',
                bottom: align === 'end' ? '15px' : 'auto',
                marginTop: align === 'center' ? '-5px' : '0',
                borderRight: 'none',
                borderTop: 'none',
            }
        }

        return base
    }

    // LEFT-RIGHT TILT SHAKE EFFECT ANIMATION
    const shakeAnimation = {
        rotate: [0, -2, 3, -3, 2, -1, 1, 0],
        x: [0, -2, 3, -3, 2, -1, 1, 0],
        transition: {
            duration: 0.5,
            ease: "easeOut",
            times: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 1],
        }
    }

    // Animation variants based on different sides
    const getAnimationVariants = () => {
        // Base scale and opacity animations that apply to all directions
        const baseVariants = {
            initial: {
                opacity: 0,
                scale: 0.95,
                filter: "blur(8px)",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
            },
            animate: {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                transition: {
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                    opacity: { duration: 0.2 }
                }
            },
            exit: {
                opacity: 0,
                scale: 0.95,
                filter: "blur(4px)",
                boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                transition: {
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                    opacity: { duration: 0.15 }
                }
            }
        }

        // Direction-specific transformations
        switch (side) {
            case "top":
                return {
                    ...baseVariants,
                    initial: {
                        ...baseVariants.initial,
                        y: 10
                    },
                    animate: {
                        ...baseVariants.animate,
                        y: 0
                    },
                    exit: {
                        ...baseVariants.exit,
                        y: 10
                    }
                }
            case "right":
                return {
                    ...baseVariants,
                    initial: {
                        ...baseVariants.initial,
                        x: -10
                    },
                    animate: {
                        ...baseVariants.animate,
                        x: 0
                    },
                    exit: {
                        ...baseVariants.exit,
                        x: -10
                    }
                }
            case "bottom":
                return {
                    ...baseVariants,
                    initial: {
                        ...baseVariants.initial,
                        y: -10
                    },
                    animate: {
                        ...baseVariants.animate,
                        y: 0
                    },
                    exit: {
                        ...baseVariants.exit,
                        y: -10
                    }
                }
            case "left":
                return {
                    ...baseVariants,
                    initial: {
                        ...baseVariants.initial,
                        x: 10
                    },
                    animate: {
                        ...baseVariants.animate,
                        x: 0
                    },
                    exit: {
                        ...baseVariants.exit,
                        x: 10
                    }
                }
            default:
                return baseVariants
        }
    }

    // Arrow animation variants
    const arrowVariants = {
        initial: {
            opacity: 0,
            scale: 0.5
        },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                delay: 0.1,
                duration: 0.2
            }
        },
        exit: {
            opacity: 0,
            scale: 0.5,
            transition: {
                duration: 0.1
            }
        }
    }

    return (
        <div className={cn("inline-block", className)}>
            <motion.div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                {trigger}
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={cardRef}
                        className={cn(
                            "fixed z-50 bg-white border border-neutral-200 rounded-md",
                            "dark:bg-black dark:border-neutral-800",
                            interactive ? "pointer-events-auto" : "pointer-events-none",
                            contentClassName
                        )}
                        style={{
                            width: `${width}px`,
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                            transformOrigin: "center center",
                        }}
                        onMouseEnter={handleCardMouseEnter}
                        onMouseLeave={handleCardMouseLeave}
                        role="tooltip"
                        variants={getAnimationVariants()}
                        initial="initial"
                        animate={["animate", shakeAnimation]} // Apply both the standard and shake animations
                        exit="exit"
                        layout
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: {
                                    delay: 0.1,
                                    duration: 0.2
                                }
                            }}
                            exit={{ opacity: 0, y: 5 }}
                        >
                            {content}
                        </motion.div>
                        {arrow && (
                            <motion.div
                                className={cn("", arrowClassName)}
                                style={getArrowStyles()}
                                variants={arrowVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}