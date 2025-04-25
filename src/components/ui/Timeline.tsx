// @ts-nocheck
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import React, { useEffect, useRef, useState, WheelEvent } from "react";

// Define Timeline Item Interface
interface TimelineEntry {
    title: string;
    content: React.ReactNode;
    date?: string;
    icon?: React.ReactNode;
    status?: 'completed' | 'current' | 'upcoming';
    user?: string;
}

// Define Timeline Props Interface
interface TimelineProps extends VariantProps<typeof timelineVariants> {
    data: TimelineEntry[];
    className?: string;
    animation?: AnimationType;
    animated?: boolean;
    itemClassName?: string;
    dotClassName?: string;
    lineClassName?: string;
    contentClassName?: string;
}

// Utility function for class names
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

// Timeline Variants Definition
const timelineVariants = cva(
    'relative space-y-8 transition-all duration-300',
    {
        variants: {
            variant: {
                default: 'dark:bg-neutral-950 bg-white',
                modern: 'dark:bg-[#111111] bg-gray-50 shadow-xl',
                minimal: 'dark:bg-transparent bg-transparent',
                curved: 'min-h-[400px] relative',
            },
            lineStyle: {
                default: '[--line-color:theme(colors.neutral.200)] dark:[--line-color:theme(colors.neutral.800)]',
                gradient: '[--line-color:linear-gradient(to_bottom,#3B82F6,#8B5CF6)]',
                animated: 'from-purple-500 via-blue-500 to-transparent',
            },
            size: {
                default: '[--dot-size:1rem] [--icon-size:2rem] text-base',
                small: '[--dot-size:0.75rem] [--icon-size:1.5rem] text-sm',
                large: '[--dot-size:1.25rem] [--icon-size:2.5rem] text-lg',
            },
            orientation: {
                vertical: 'space-y-8',
                horizontal: 'flex space-x-8 overflow-x-auto pb-4',
            }
        },
        defaultVariants: {
            variant: 'default',
            lineStyle: 'animated',
            size: 'default',
            orientation: 'vertical'
        }
    }
);

// Animation Presets
const animations = {
    fadeSlideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 },
    },
} as const;

type AnimationType = keyof typeof animations;

// Handle wheel event for horizontal scrolling
const handleWheel = (e: WheelEvent<HTMLDivElement>, containerRef: React.RefObject<HTMLDivElement>) => {
    if (containerRef.current) {
        e.preventDefault();
        containerRef.current.scrollLeft += e.deltaY;
    }
};

// Curved Timeline Component
const CurvedTimeline: React.FC<{
    data: TimelineEntry[];
    className?: string;
}> = ({ data, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const scrollLeft = containerRef.current.scrollLeft;
            const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
            setScrollProgress(maxScroll ? scrollLeft / maxScroll : 0);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            handleScroll();
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    const path = "M0,100 C150,100 150,50 300,50 C450,50 450,150 600,150 C750,150 750,50 900,50";

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative overflow-x-auto pb-20",
                "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700",
                className
            )}
        >
            <div className="relative min-w-[1000px] h-[400px]">
                <svg
                    className="absolute left-0 top-0 w-full h-full"
                    viewBox="0 0 1000 200"
                    preserveAspectRatio="none"
                >
                    {/* Background path */}
                    <path
                        d={path}
                        fill="none"
                        stroke="var(--line-color, #374151)"
                        strokeWidth="2"
                        className="opacity-20"
                    />
                    {/* Animated gradient path */}
                    <path
                        ref={pathRef}
                        d={path}
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeDasharray={pathLength}
                        strokeDashoffset={pathLength - (pathLength * scrollProgress)}
                        className="transition-all duration-200"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Timeline entries */}
                {data.map((item, index) => {
                    const xPos = (index * 900) / (data.length - 1);
                    const yPos = index % 2 === 0 ? 0 : 100;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: scrollProgress > (index / (data.length - 1)) ? 1 : 0.5,
                                y: 0
                            }}
                            className="absolute transform -translate-x-1/2"
                            style={{
                                left: `${xPos}px`,
                                top: `${yPos}px`
                            }}
                        >
                            <div className={cn(
                                "w-64 rounded-xl p-4",
                                "bg-white dark:bg-zinc-950",
                                "shadow-lg dark:shadow-blue-500/5",
                                "border dark:border-gray-800",
                                "transition-all duration-300 hover:scale-105"
                            )}>
                                <div className="flex items-center gap-2">
                                    {item.icon && (
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                            {item.icon}
                                        </div>
                                    )}
                                    <h3 className="font-semibold text-black dark:text-white">
                                        {item.title}
                                    </h3>
                                </div>
                                {item.date && (
                                    <time className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">
                                        {item.date}
                                    </time>
                                )}
                                <div className="mt-2 text-gray-600 dark:text-gray-300">
                                    {item.content}
                                </div>
                                {item.user && (
                                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        By {item.user}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// Main Timeline Component
export const Timeline: React.FC<TimelineProps> = ({
    data,
    className,
    variant,
    lineStyle,
    size,
    orientation = 'vertical',
    animation = 'fadeSlideUp',
    animated = true,
    itemClassName,
    dotClassName,
    lineClassName,
    contentClassName,
}) => {
    if (variant === 'curved') {
        return <CurvedTimeline data={data} className={className} />;
    }

    const ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setHeight(rect.height);
        }
    }, [ref]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 10%", "end 50%"],
    });

    const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <div
            className={cn(
                "w-full text-black dark:text-white bg-white dark:bg-zinc-950 font-sans md:px-10",
                className
            )}
            ref={containerRef}
            onWheel={(e) => orientation === 'horizontal' && handleWheel(e, containerRef)}
        >
            <div
                ref={ref}
                className={cn(
                    "relative max-w-7xl mx-auto",
                    orientation === 'horizontal'
                        ? "flex overflow-x-auto scrollbar-hide pb-10"
                        : "pb-20"
                )}
            >
                {data.map((item, index) => (
                    <motion.div
                        key={index}
                        {...(animated ? animations[animation] : {})}
                        transition={{ delay: index * 0.2 }}
                        className={cn(
                            orientation === 'horizontal'
                                ? "flex-shrink-0 mx-4 first:ml-0 last:mr-0 w-80"
                                : "flex justify-start pt-10 md:pt-40 md:gap-10",
                            itemClassName
                        )}
                    >
                        <div className={cn(
                            "flex items-start",
                            orientation === 'horizontal'
                                ? "flex-col"
                                : "sticky flex-col md:flex-row"
                        )}>
                            <div className={cn(
                                "relative flex items-center",
                                orientation === 'horizontal'
                                    ? "mb-4"
                                    : "sticky top-40 self-start z-40"
                            )}>
                                <div className={cn(
                                    "h-10 w-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center",
                                    dotClassName
                                )}>
                                    {item.icon ? (
                                        <div className="h-6 w-6 flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700",
                                            {
                                                'bg-blue-500': item.status === 'current',
                                                'bg-green-500': item.status === 'completed',
                                                'bg-neutral-300': item.status === 'upcoming',
                                            }
                                        )} />
                                    )}
                                </div>
                                <h3 className={cn(
                                    "text-xl font-bold",
                                    orientation === 'horizontal' ? "ml-4" : "hidden md:block md:pl-20 md:text-5xl"
                                )}>
                                    {item.title}
                                </h3>
                            </div>

                            <div className={cn(
                                "relative w-full",
                                orientation === 'horizontal' ? "pl-4" : "pl-20 pr-4 md:pl-4",
                                contentClassName
                            )}>
                                {orientation !== 'horizontal' && (
                                    <h3 className="md:hidden block text-2xl text-left font-bold mb-4">
                                        {item.title}
                                    </h3>
                                )}
                                {(item.date || item.user) && (
                                    <div className="flex items-center gap-2 mb-4">
                                        {item.date && (
                                            <time className="text-sm text-neutral-400 dark:text-neutral-500">
                                                {item.date}
                                            </time>
                                        )}
                                        {item.user && (
                                            <span className="text-sm text-neutral-400 dark:text-neutral-500">
                                                • By {item.user}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <div className="prose dark:prose-invert">
                                    {item.content}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {orientation !== 'horizontal' && (
                    <div
                        style={{
                            height: height + "px",
                        }}
                        className={cn(
                            "absolute md:left-8 left-8 top-0 overflow-hidden w-[2px]",
                            "bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))]",
                            "from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]",
                            "[mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]",
                            lineClassName
                        )}
                    >
                        <motion.div
                            style={{
                                height: heightTransform,
                                opacity: opacityTransform,
                            }}
                            className={cn(
                                "absolute inset-x-0 top-0 w-[2px]",
                                "bg-gradient-to-t",
                                lineStyle === "gradient" ? "from-blue-500 via-purple-500" : "from-purple-500 via-blue-500",
                                "to-transparent from-[0%] via-[10%] rounded-full"
                            )}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};