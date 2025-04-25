// @ts-nocheck
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"


interface FocusCardContextProps {
    activeId: string | null
    setActiveId: React.Dispatch<React.SetStateAction<string | null>>
    registerCard: (id: string) => void
    unregisterCard: (id: string) => void
    containerRef: React.RefObject<HTMLDivElement>
    config: {
        blurAmount: number
        scaleAmount: number
        opacityAmount: number
        transitionDuration: number
        hoverScale: number
        groupHoverEffect: boolean
        blurBackground: boolean
    }
}

const FocusCardContext = React.createContext<FocusCardContextProps | undefined>(undefined)

function useFocusCardContext() {
    const context = React.useContext(FocusCardContext)
    if (!context) {
        throw new Error("useFocusCardContext must be used within a FocusCardProvider")
    }
    return context
}


interface FocusCardProviderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    blurAmount?: number
    scaleAmount?: number
    opacityAmount?: number
    transitionDuration?: number
    hoverScale?: number
    groupHoverEffect?: boolean
    blurBackground?: boolean
    className?: string
    variant?: "default" | "grid" | "masonry" | "carousel"
    gap?: "none" | "sm" | "md" | "lg" | "xl"
    onCardFocus?: (id: string | null) => void
}

export function FocusCardProvider({
    children,
    blurAmount = 4,
    scaleAmount = 0.97,
    opacityAmount = 0.5,
    transitionDuration = 0.3,
    hoverScale = 1.03,
    groupHoverEffect = true,
    blurBackground = false,
    className,
    variant = "default",
    gap = "md",
    onCardFocus,
    ...props
}: FocusCardProviderProps) {
    const [activeId, setActiveId] = React.useState<string | null>(null)
    const [cardIds, setCardIds] = React.useState<Set<string>>(new Set())
    const containerRef = React.useRef<HTMLDivElement>(null)

    const registerCard = React.useCallback((id: string) => {
        setCardIds(prev => new Set(prev).add(id))
    }, [])

    const unregisterCard = React.useCallback((id: string) => {
        setCardIds(prev => {
            const newSet = new Set(prev)
            newSet.delete(id)
            return newSet
        })
    }, [])

    React.useEffect(() => {
        if (onCardFocus) {
            onCardFocus(activeId)
        }
    }, [activeId, onCardFocus])

    const config = React.useMemo(() => ({
        blurAmount,
        scaleAmount,
        opacityAmount,
        transitionDuration,
        hoverScale,
        groupHoverEffect,
        blurBackground,
    }), [blurAmount, scaleAmount, opacityAmount, transitionDuration, hoverScale, groupHoverEffect, blurBackground])


    const containerVariants = cva(
        "relative w-full transition-colors bg-white text-black dark:bg-[#090909] dark:text-white",
        {
            variants: {
                variant: {
                    default: "flex flex-col",
                    grid: "grid",
                    masonry: "columns",
                    carousel: "flex overflow-x-auto snap-x snap-mandatory",
                },
                gap: {
                    none: "gap-0",
                    sm: "gap-2",
                    md: "gap-4",
                    lg: "gap-6",
                    xl: "gap-8",
                }
            },
            defaultVariants: {
                variant: "default",
                gap: "md",
            },
        }
    )


    const gridConfigStyles = React.useMemo(() => {
        if (variant === 'grid') {
            return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }
        if (variant === 'masonry') {
            return "sm:columns-2 md:columns-3 lg:columns-4 space-y-4"
        }
        if (variant === 'carousel') {
            return "snap-x snap-mandatory"
        }
        return ""
    }, [variant])


    const backgroundStyles = blurBackground && activeId !== null
        ? "bg-white/30 dark:bg-[#090909]/30 backdrop-blur-sm"
        : "bg-white dark:bg-[#090909]"

    return (
        <FocusCardContext.Provider value={{
            activeId,
            setActiveId,
            registerCard,
            unregisterCard,
            containerRef,
            config
        }}>
            <div
                ref={containerRef}
                className={cn(
                    containerVariants({ variant, gap }),
                    gridConfigStyles,
                    backgroundStyles,
                    "transition-all duration-300",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </FocusCardContext.Provider>
    )
}


const cardVariants = cva(
    "relative rounded-lg overflow-hidden focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
    {
        variants: {
            variant: {
                default: "bg-white dark:bg-[#090909] text-black dark:text-white border shadow-sm",
                elevated: "bg-white dark:bg-[#090909] text-black dark:text-white shadow-md",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                outline: "border bg-transparent text-black dark:text-white",
                feature: "bg-gradient-to-br from-white dark:from-[#090909] to-background border-t border-l border-border/50 shadow-md text-black dark:text-white",
                glass: "bg-white/10 dark:bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 text-black dark:text-white",
            },
            size: {
                sm: "p-3",
                md: "p-5",
                lg: "p-7",
            },
            radius: {
                none: "rounded-none",
                sm: "rounded-sm",
                md: "rounded-md",
                lg: "rounded-lg",
                xl: "rounded-xl",
                full: "rounded-3xl",
            },
            interactive: {
                true: "cursor-pointer transition-all hover:shadow-lg",
                false: "",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
            radius: "lg",
            interactive: true,
        },
    }
)


export interface CardProps extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
    aspectRatio?: "auto" | "square" | "video" | "portrait" | "ultra-wide"
    disabled?: boolean
    focusable?: boolean
    reserveSpaceForMedia?: boolean
    forceActive?: boolean
    id?: string
    noHoverEffect?: boolean
    contentClassName?: string
    preserveBlurOnContent?: boolean
    cardRef?: React.Ref<HTMLDivElement>
}

export function FocusCard({
    children,
    className,
    variant,
    size,
    radius,
    interactive,
    aspectRatio,
    disabled = false,
    focusable = true,
    reserveSpaceForMedia = false,
    forceActive = false,
    id = React.useId(),
    noHoverEffect = false,
    contentClassName,
    preserveBlurOnContent = false,
    cardRef,
    ...props
}: CardProps) {
    const {
        activeId,
        setActiveId,
        registerCard,
        unregisterCard,
        config: {
            blurAmount,
            scaleAmount,
            opacityAmount,
            transitionDuration,
            hoverScale,
            groupHoverEffect
        }
    } = useFocusCardContext()

    React.useEffect(() => {
        registerCard(id)
        return () => unregisterCard(id)
    }, [id, registerCard, unregisterCard])

    React.useEffect(() => {
        if (forceActive && !disabled) {
            setActiveId(id)
        } else if (forceActive && activeId === id) {
            setActiveId(null)
        }
    }, [forceActive, id, setActiveId, activeId, disabled])

    const isActive = activeId === id
    const isCardBlurred = activeId !== null && !isActive && !disabled && groupHoverEffect

    const handleMouseEnter = React.useCallback(() => {
        if (!disabled && focusable) {
            setActiveId(id)
        }
    }, [disabled, focusable, id, setActiveId])

    const handleMouseLeave = React.useCallback(() => {
        if (!disabled && focusable && !forceActive) {
            setActiveId(null)
        }
    }, [disabled, focusable, forceActive, setActiveId])

    // Handle aspect ratios
    const aspectRatioClass = React.useMemo(() => {
        switch (aspectRatio) {
            case "square": return "aspect-square"
            case "video": return "aspect-video"
            case "portrait": return "aspect-[3/4]"
            case "ultra-wide": return "aspect-[21/9]"
            default: return ""
        }
    }, [aspectRatio])

    // Calculate transition styles
    const transitionStyles = {
        transform: isActive && !noHoverEffect
            ? `scale(${hoverScale})`
            : isCardBlurred
                ? `scale(${scaleAmount})`
                : "scale(1)",
        filter: isCardBlurred
            ? `blur(${blurAmount}px)`
            : "blur(0px)",
        opacity: isCardBlurred
            ? opacityAmount
            : 1,
        transition: `all ${transitionDuration}s ease-in-out`,
        zIndex: isActive ? 10 : 1,
    }

    // Apply disabled styles
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : ""

    // For carousel layout
    const carouselClasses = props.style?.gridColumn === undefined && props.className?.includes('carousel')
        ? "snap-center flex-shrink-0"
        : ""

    return (
        <motion.div
            ref={cardRef}
            className={cn(
                cardVariants({ variant, size, radius, interactive }),
                aspectRatioClass,
                disabledClasses,
                carouselClasses,
                className
            )}
            style={{
                ...props.style,
                ...transitionStyles
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            layout
            {...props}
        >
            <div
                className={cn(
                    "relative h-full bg-white dark:bg-[#090909] text-black dark:text-white",
                    preserveBlurOnContent ? "" : "transition-all duration-300",
                    contentClassName
                )}
                style={preserveBlurOnContent ? {} : {
                    filter: isCardBlurred ? `blur(${blurAmount * 0.7}px)` : "blur(0px)"
                }}
            >
                {children}
            </div>
        </motion.div>
    )
}


export interface CardMediaProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    aspectRatio?: "square" | "video" | "portrait" | "ultra-wide"
    fill?: boolean
    thumbnail?: boolean
    overlay?: boolean | React.ReactNode
    overlayClassName?: string
    wrapperClassName?: string
    alt: string
}

export function FocusCardMedia({
    src,
    alt,
    aspectRatio = "video",
    className,
    fill = false,
    thumbnail = false,
    overlay = false,
    overlayClassName,
    wrapperClassName,
    ...props
}: CardMediaProps) {
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [isError, setIsError] = React.useState(false)

    const aspectRatioClasses = {
        square: "aspect-square",
        video: "aspect-video",
        portrait: "aspect-[3/4]",
        "ultra-wide": "aspect-[21/9]",
    }

    // Motion variants for image loading
    const imageVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    }

    // Handle thumbnail placeholder
    const thumbnailClasses = thumbnail
        ? "object-cover w-full h-full"
        : ""

    // Handle image loading and errors
    const handleLoad = () => setIsLoaded(true)
    const handleError = () => setIsError(true)

    return (
        <div className={cn(
            "relative overflow-hidden",
            !fill && aspectRatioClasses[aspectRatio],
            fill ? "absolute inset-0" : "",
            wrapperClassName
        )}>
            <AnimatePresence>
                {!isLoaded && !isError && (
                    <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-muted-foreground/30"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                    </div>
                )}
            </AnimatePresence>

            {!isError && (
                <motion.img
                    src={src}
                    alt={alt}
                    className={cn(
                        "object-cover w-full h-full",
                        thumbnailClasses,
                        className
                    )}
                    onLoad={handleLoad}
                    onError={handleError}
                    initial="hidden"
                    animate={isLoaded ? "visible" : "hidden"}
                    variants={imageVariants}
                    transition={{ duration: 0.3 }}
                    {...props}
                />
            )}

            {isError && (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <svg
                        className="w-10 h-10 text-muted-foreground/50"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                </div>
            )}

            {overlay && (
                <div
                    className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent",
                        typeof overlay === 'boolean' ? "" : "flex items-end p-4",
                        overlayClassName
                    )}
                >
                    {overlay !== true && overlay}
                </div>
            )}
        </div>
    )
}

/* ----------------- Card Header Component ----------------- */
export function FocusCardHeader({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex flex-col space-y-1.5 bg-white dark:bg-[#090909] text-black dark:text-white", className)}
            {...props}
        >
            {children}
        </div>
    )
}


export function FocusCardTitle({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn("font-semibold leading-tight tracking-tight text-black dark:text-white", className)}
            {...props}
        >
            {children}
        </h3>
    )
}


export function FocusCardDescription({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn("text-sm text-muted-foreground dark:text-white/70", className)}
            {...props}
        >
            {children}
        </p>
    )
}


export function FocusCardContent({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("p-0 bg-white dark:bg-[#090909] text-black dark:text-white", className)} {...props}>
            {children}
        </div>
    )
}


export function FocusCardFooter({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex items-center pt-1.5 bg-white dark:bg-[#090909] text-black dark:text-white", className)}
            {...props}
        >
            {children}
        </div>
    )
}


export interface FocusCardBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "secondary" | "outline" | "destructive" | "success"
}

export function FocusCardBadge({
    className,
    variant = "default",
    children,
    ...props
}: FocusCardBadgeProps) {
    const badgeVariants = {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-input bg-white dark:bg-[#090909] text-black dark:text-white",
        destructive: "bg-destructive text-destructive-foreground",
        success: "bg-green-500 text-white",
    }

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                badgeVariants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    )
}


export function FocusCardActions({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex items-center justify-end gap-2 pt-1.5 bg-white dark:bg-[#090909] text-black dark:text-white",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}


export {
    FocusCardContext,
    useFocusCardContext
}