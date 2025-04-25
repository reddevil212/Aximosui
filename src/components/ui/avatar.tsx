"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarShape = 'circle' | 'square' | 'rounded';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';
export type AvatarVariant = 'default' | 'primary' | 'gradient' | 'outline';

export interface AvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: AvatarSize;
    shape?: AvatarShape;
    status?: AvatarStatus;
    variant?: AvatarVariant;
    bordered?: boolean;
    className?: string;
    fallbackClassName?: string;
    statusClassName?: string;
    interactive?: boolean;
    onClick?: () => void;
    showBadge?: boolean;
    badgeContent?: React.ReactNode;
    loading?: boolean;
}

const sizeConfig = {
    xs: "h-6 w-6 text-[0.65rem]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
    "2xl": "h-20 w-20 text-xl",
}

const shapeConfig = {
    circle: "rounded-full",
    square: "rounded-none",
    rounded: "rounded-xl",
}

const statusSizeConfig = {
    xs: "h-2.5 w-2.5 ring-1",
    sm: "h-3 w-3 ring-1",
    md: "h-3.5 w-3.5 ring-1.5",
    lg: "h-4 w-4 ring-2",
    xl: "h-5 w-5 ring-2",
    "2xl": "h-6 w-6 ring-2.5",
}

const statusConfig = {
    online: "bg-emerald-500 shadow-glow-green",
    offline: "bg-neutral-400 dark:bg-neutral-600",
    away: "bg-amber-400 shadow-glow-amber",
    busy: "bg-rose-500 shadow-glow-red",
}

const statusPositionConfig = {
    circle: "-bottom-0.5 -right-0.5",
    square: "bottom-0 right-0 translate-x-1/4 translate-y-1/4",
    rounded: "bottom-0 right-0 translate-x-1/4 translate-y-1/4",
}

const variantConfig = {
    default: "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200",
    primary: "bg-blue-600 text-white dark:bg-blue-700",
    gradient: "bg-gradient-to-br from-violet-600 to-blue-600 text-white",
    outline: "bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white",
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

const shimmerAnimation = "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent"

const avatarVariants = {
    initial: {
        scale: 0.8,
        opacity: 0,
        rotateY: -30,
        filter: "blur(8px)"
    },
    animate: {
        scale: 1,
        opacity: 1,
        rotateY: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            type: "spring",
            stiffness: 200,
            damping: 15,
            mass: 1.2
        }
    },
    exit: {
        scale: 0.8,
        opacity: 0,
        rotateY: 30,
        filter: "blur(8px)",
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    },
    hover: {
        scale: 1.08,
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        y: -4,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 10,
            mass: 0.8
        }
    },
    tap: {
        scale: 0.95,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 15
        }
    }
}

const imageVariants = {
    hidden: { opacity: 0, scale: 1.2, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
}

const loadingVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: "easeIn"
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    }
}

const statusVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 15
        }
    }
}

const badgeVariants = {
    initial: { scale: 0, opacity: 0, y: -10, x: 5 },
    animate: {
        scale: 1,
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 20,
            delay: 0.1
        }
    }
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({
    src,
    alt = "",
    fallback,
    size = "md",
    shape = "circle",
    status,
    variant = "default",
    bordered = false,
    className,
    fallbackClassName,
    statusClassName,
    interactive = false,
    onClick,
    showBadge = false,
    badgeContent,
    loading = false,
    ...props
}, ref) => {
    const [imageError, setImageError] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        setImageError(false)
        setIsLoaded(false)
    }, [src])

    const handleImageError = () => {
        setImageError(true)
        setIsLoaded(true)
    }

    const handleImageLoad = () => {
        setIsLoaded(true)
    }

    const renderFallback = () => {
        if (!fallback) return null
        return getInitials(fallback)
    }

    const handleHoverStart = () => {
        if (interactive) {
            setIsHovered(true)
        }
    }

    const handleHoverEnd = () => {
        if (interactive) {
            setIsHovered(false)
        }
    }

    return (
        <motion.div
            ref={ref}
            className={cn(
                "relative inline-flex items-center justify-center shrink-0",
                "overflow-hidden select-none",
                sizeConfig[size],
                shapeConfig[shape],
                variantConfig[variant],
                bordered && "ring-2 ring-white/80 dark:ring-neutral-800/90 shadow-sm",
                interactive && "cursor-pointer transition-transform",
                className
            )}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={avatarVariants}
            whileHover={interactive ? "hover" : undefined}
            whileTap={interactive ? "tap" : undefined}
            onClick={interactive ? onClick : undefined}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            style={{
                transformStyle: "preserve-3d",
                perspective: "600px"
            }}
            {...props}
        >
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        variants={loadingVariants}
                        className={cn(
                            "absolute inset-0 bg-neutral-200 dark:bg-neutral-800",
                            "overflow-hidden relative",
                            shimmerAnimation
                        )}
                    />
                ) : !imageError && src ? (
                    <motion.img
                        key="image"
                        src={src}
                        alt={alt}
                        className={cn(
                            "h-full w-full object-cover",
                            !isLoaded && "invisible"
                        )}
                        variants={imageVariants}
                        initial="hidden"
                        animate={isLoaded ? "visible" : "hidden"}
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        style={{
                            filter: isHovered ? "brightness(1.1) contrast(1.05)" : "none",
                            transition: "filter 0.3s ease"
                        }}
                    />
                ) : (
                    <motion.div
                        key="fallback"
                        variants={avatarVariants}
                        className={cn(
                            "flex items-center justify-center w-full h-full font-medium",
                            fallbackClassName
                        )}
                    >
                        {renderFallback()}
                    </motion.div>
                )}
            </AnimatePresence>

            {status && (
                <motion.span
                    variants={statusVariants}
                    initial="initial"
                    animate="animate"
                    className={cn(
                        "absolute block rounded-full",
                        "ring-white dark:ring-neutral-900",
                        statusConfig[status],
                        statusSizeConfig[size],
                        statusPositionConfig[shape],
                        "transition-all duration-300",
                        statusClassName
                    )}
                >
                    {status === 'online' && (
                        <motion.span
                            className="absolute size-8 inset-0 rounded-full bg-emerald-400 opacity-75"
                            animate={{
                                scale: [1, 1.6, 1],
                                opacity: [0.8, 0.2, 0.8]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    )}

                    {status === 'busy' && (
                        <motion.span
                            className="absolute size-8 inset-0 rounded-full bg-rose-400 opacity-75"
                            animate={{
                                scale: [1, 1.8, 1],
                                opacity: [0.8, 0, 0.8]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    )}

                    {status === 'away' && (
                        <motion.span
                            className="absolute size-8 inset-0 rounded-full bg-amber-300 opacity-75"
                            animate={{
                                scale: [1, 1.4, 1],
                                opacity: [0.8, 0.3, 0.8]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    )}
                </motion.span>
            )}

            {showBadge && (
                <motion.div
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    className={cn(
                        "absolute -top-1 -right-1 flex items-center justify-center",
                        "min-w-[1.25rem] h-5 rounded-full",
                        "bg-rose-500 text-white text-xs font-medium px-1.5",
                        "ring-1.5 ring-white dark:ring-neutral-900",
                        "shadow-sm"
                    )}
                    style={{
                        boxShadow: "0 4px 8px rgba(225, 29, 72, 0.3)"
                    }}
                >
                    {badgeContent}
                </motion.div>
            )}

            {isHovered && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </motion.div>
    )
})

Avatar.displayName = "Avatar"

interface AvatarGroupProps {
    children: React.ReactNode;
    max?: number;
    spacing?: 'tight' | 'normal' | 'loose';
    className?: string;
    direction?: 'row' | 'row-reverse';
}

const groupContainerVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
}

const groupItemVariants = {
    initial: {
        opacity: 0,
        scale: 0.6,
        y: 20,
        rotateZ: -5
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateZ: 0,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
            mass: 0.8
        }
    },
    hover: {
        y: -8,
        scale: 1.05,
        rotateZ: 0,
        zIndex: 100,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 14,
            mass: 0.6
        }
    }
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
    children,
    max,
    spacing = 'normal',
    className,
    direction = 'row',
}) => {
    const childrenArray = React.Children.toArray(children)
    const totalAvatars = childrenArray.length
    const displayAvatars = max ? childrenArray.slice(0, max) : childrenArray

    const spacingConfig = {
        tight: '-space-x-3',
        normal: '-space-x-4',
        loose: '-space-x-2',
    }

    return (
        <motion.div
            className={cn(
                "flex items-center",
                direction === 'row' ? spacingConfig[spacing] : `flex-row-reverse ${spacingConfig[spacing].replace('-space-x', 'space-x')}`,
                className
            )}
            variants={groupContainerVariants}
            initial="initial"
            animate="animate"
        >
            {displayAvatars.map((child, index) => (
                <motion.div
                    key={index}
                    className="relative"
                    variants={groupItemVariants}
                    whileHover="hover"
                    custom={index}
                    style={{
                        zIndex: direction === 'row' ? totalAvatars - index : index,
                        transformStyle: "preserve-3d"
                    }}
                >
                    {child}
                </motion.div>
            ))}
            {max && totalAvatars > max && (
                <motion.div
                    variants={groupItemVariants}
                    whileHover="hover"
                    custom={max}
                    style={{
                        zIndex: direction === 'row' ? 0 : totalAvatars,
                        transformStyle: "preserve-3d"
                    }}
                >
                    <Avatar
                        fallback={`+${totalAvatars - max}`}
                        variant="default"
                        className="shadow-lg hover:shadow-xl transition-all transform-gpu backdrop-blur-sm !bg-neutral-100/90 !text-neutral-700 dark:!bg-neutral-800/90 dark:!text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                    />
                </motion.div>
            )}
        </motion.div>
    )
}