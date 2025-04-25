// @ts-nocheck


"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion} from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import AutoPlay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CarouselPlugin {
    name?: string;
    options?: any;
}

interface CarouselOptions {
    align?: 'start' | 'center' | 'end';
    axis?: 'x' | 'y';
    dragFree?: boolean;
    containScroll?: 'trimSnaps' | 'keepSnaps' | '';
    slides?: {
        perView?: number;
        spacing?: number;
    };
}

interface CarouselProps {
    children: React.ReactNode;
    options?: CarouselOptions;
    plugins?: CarouselPlugin[];
    showDots?: boolean;
    showArrows?: boolean;
    autoplay?: boolean;
    autoplayDelay?: number;
    className?: string;
    slideClassName?: string;
    orientation?: 'horizontal' | 'vertical';
    loop?: boolean;
}

export const Carousel = ({
    children,
    options = {},
    plugins = [],
    showDots = true,
    showArrows = true,
    autoplay = false,
    autoplayDelay = 4000,
    className,
    slideClassName,
    orientation = "horizontal",
    loop = true,
}: CarouselProps) => {
    const autoplayPlugin = autoplay
        ? [AutoPlay({ delay: autoplayDelay, stopOnInteraction: true })]
        : [];

    const [emblaRef, embla] = useEmblaCarousel(
        {
            ...options,
            axis: orientation === "horizontal" ? "x" : "y",
            loop,
        },
        [
            ...autoplayPlugin,
            ...plugins,
        ]
    )

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

    const scrollPrev = useCallback(() => {
        if (embla) embla.scrollPrev()
    }, [embla])

    const scrollNext = useCallback(() => {
        if (embla) embla.scrollNext()
    }, [embla])

    const scrollTo = useCallback(
        (index: number) => {
            if (embla) embla.scrollTo(index)
        },
        [embla]
    )

    const onSelect = useCallback(() => {
        if (!embla) return
        setSelectedIndex(embla.selectedScrollSnap())
    }, [embla])

    useEffect(() => {
        if (!embla) return

        setScrollSnaps(embla.scrollSnapList())
        embla.on("select", onSelect)
        onSelect() // Initialize the selected index on mount

        return () => {
            embla.off("select", onSelect)
        }
    }, [embla, onSelect])

    // Fixed ArrowButton component
    const ArrowButton = React.memo(({
        direction,
        onClick,
    }: {
        direction: "prev" | "next"
        onClick: () => void
    }) => {
        const isVertical = orientation === "vertical"
        const Icon = isVertical
            ? direction === "prev"
                ? ChevronUp
                : ChevronDown
            : direction === "prev"
                ? ChevronLeft
                : ChevronRight

        return (
            <div
                className={cn(
                    "absolute z-10",
                    isVertical
                        ? direction === "prev"
                            ? "top-2 left-1/2 -translate-x-1/2"
                            : "bottom-2 left-1/2 -translate-x-1/2"
                        : direction === "prev"
                            ? "left-2 top-1/2 -translate-y-1/2"
                            : "right-2 top-1/2 -translate-y-1/2"
                )}
            >
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClick}
                    className={cn(
                        "flex items-center justify-center",
                        "w-10 h-10 rounded-full bg-black/50 text-white",
                        "backdrop-blur-sm transition-opacity",
                        "hover:bg-black/70",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/50",
                    )}
                    aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
                >
                    <Icon className="w-6 h-6" />
                </motion.button>
            </div>
        )
    })

    ArrowButton.displayName = "ArrowButton"

    return (
        <div className={cn("relative", className)}>
            <div
                ref={emblaRef}
                className={cn(
                    "overflow-hidden",
                    orientation === "vertical" ? "h-[400px]" : ""
                )}
                aria-roledescription="carousel"
            >
                <div
                    className={cn(
                        "flex",
                        orientation === "vertical" ? "flex-col" : "",
                        orientation === "horizontal" ? "-ml-4" : "-mt-4"
                    )}
                >
                    {React.Children.map(children, (child, index) => (
                        <div
                            className={cn(
                                "flex-[0_0_100%]",
                                orientation === "horizontal" ? "pl-4" : "pt-4",
                                slideClassName
                            )}
                            key={index}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`Slide ${index + 1} of ${React.Children.count(children)}`}
                        >
                            {child}
                        </div>
                    ))}
                </div>
            </div>

            {showArrows && (
                <>
                    <ArrowButton direction="prev" onClick={scrollPrev} />
                    <ArrowButton direction="next" onClick={scrollNext} />
                </>
            )}

            {showDots && scrollSnaps.length > 1 && (
                <div
                    className={cn(
                        "flex gap-2",
                        orientation === "vertical"
                            ? "flex-col absolute right-2 top-1/2 -translate-y-1/2"
                            : "justify-center mt-4"
                    )}
                    role="tablist"
                    aria-label="Carousel navigation"
                >
                    {scrollSnaps.map((_, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scrollTo(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-colors",
                                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/50",
                                selectedIndex === index
                                    ? "bg-black dark:bg-white"
                                    : "bg-neutral-300 dark:bg-neutral-600"
                            )}
                            role="tab"
                            aria-selected={selectedIndex === index}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}