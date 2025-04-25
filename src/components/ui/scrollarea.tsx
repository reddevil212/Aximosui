import React, { forwardRef, HTMLAttributes, useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const scrollAreaVariants = cva(
    'relative overflow-hidden bg-white dark:bg-zinc-950 text-black dark:text-white',
    {
        variants: {
            variant: {
                default: 'rounded-md border border-gray-200 dark:border-zinc-800',
                transparent: 'border-none',
                subtle: 'rounded-md border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900',
            },
            size: {
                default: '',
                sm: 'p-1',
                md: 'p-2',
                lg: 'p-4',
            },
            scrollbars: {
                visible: '',
                auto: 'scrollbar-auto',
                hidden: 'scrollbar-hide',
                custom: 'scrollbar-custom',
            },
            scrollDirection: {
                both: 'overflow-auto',
                vertical: 'overflow-y-auto overflow-x-hidden',
                horizontal: 'overflow-x-auto overflow-y-hidden',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            scrollbars: 'visible',
            scrollDirection: 'both',
        },
    }
);

export interface ScrollAreaProps extends
    HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scrollAreaVariants> {
    viewportRef?: React.RefObject<HTMLDivElement>;
    maxHeight?: string | number;
    maxWidth?: string | number;
    thumbColor?: string;
    trackColor?: string;
    scrollHideDelay?: number;
}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
    ({
        children,
        className,
        variant,
        size,
        scrollbars,
        scrollDirection,
        maxHeight,
        maxWidth,
        thumbColor,
        trackColor,
        scrollHideDelay = 1000,
        viewportRef: externalViewportRef,
        ...props
    }, ref) => {
        const internalViewportRef = useRef<HTMLDivElement>(null);
        const viewportRef = externalViewportRef || internalViewportRef;
        const [showScrollbars, setShowScrollbars] = useState(false);
        const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>();

        // Default scroll colors based on theme
        const defaultThumbColor = 'rgba(0, 0, 0, 0.3)';
        const defaultThumbColorDark = 'rgba(255, 255, 255, 0.3)';
        const defaultTrackColor = 'rgba(0, 0, 0, 0.1)';
        const defaultTrackColorDark = 'rgba(255, 255, 255, 0.1)';

        // Dynamic scrollbar styles with theme support
        const scrollbarStyles = `
      .scrollbar-custom::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      .scrollbar-custom::-webkit-scrollbar-track {
        background: ${trackColor || 'var(--track-color, ' + defaultTrackColor + ')'};
        border-radius: 4px;
      }
      
      .scrollbar-custom::-webkit-scrollbar-thumb {
        background: ${thumbColor || 'var(--thumb-color, ' + defaultThumbColor + ')'};
        border-radius: 4px;
      }
      
      .scrollbar-custom::-webkit-scrollbar-thumb:hover {
        background: ${thumbColor ? thumbColor + 'cc' : 'var(--thumb-hover-color, rgba(0, 0, 0, 0.5))'};
      }
      
      .dark .scrollbar-custom::-webkit-scrollbar-track {
        background: ${trackColor || 'var(--track-color-dark, ' + defaultTrackColorDark + ')'};
      }
      
      .dark .scrollbar-custom::-webkit-scrollbar-thumb {
        background: ${thumbColor || 'var(--thumb-color-dark, ' + defaultThumbColorDark + ')'};
      }
      
      .dark .scrollbar-custom::-webkit-scrollbar-thumb:hover {
        background: ${thumbColor ? thumbColor + 'cc' : 'var(--thumb-hover-color-dark, rgba(255, 255, 255, 0.5))'};
      }
      
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      
      .scrollbar-auto::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        opacity: 0;
        transition: opacity 0.3s;
      }
      
      .scrollbar-auto.show-scrollbar::-webkit-scrollbar {
        opacity: 1;
      }
    `;

        // Handle scroll events to show/hide scrollbars
        useEffect(() => {
            if (scrollbars !== 'auto' || !viewportRef.current) return;

            const handleScroll = () => {
                setShowScrollbars(true);

                if (scrollTimerRef.current) {
                    clearTimeout(scrollTimerRef.current);
                }

                scrollTimerRef.current = setTimeout(() => {
                    setShowScrollbars(false);
                }, scrollHideDelay);
            };

            const viewport = viewportRef.current;
            viewport.addEventListener('scroll', handleScroll);

            return () => {
                viewport.removeEventListener('scroll', handleScroll);
                if (scrollTimerRef.current) {
                    clearTimeout(scrollTimerRef.current);
                }
            };
        }, [scrollbars, scrollHideDelay, viewportRef]);

        const style: React.CSSProperties = {
            maxHeight: maxHeight || 'auto',
            maxWidth: maxWidth || 'auto',
        };

        return (
            <>
                <style>{scrollbarStyles}</style>
                <div
                    ref={ref}
                    className={cn(scrollAreaVariants({ variant, size, scrollbars, scrollDirection }),
                        scrollbars === 'auto' && showScrollbars ? 'show-scrollbar' : '',
                        className
                    )}
                    style={style}
                    {...props}
                >
                    <div ref={viewportRef} className="h-full w-full">
                        {children}
                    </div>
                </div>
            </>
        );
    }
);

ScrollArea.displayName = 'ScrollArea';

export { ScrollArea, scrollAreaVariants };