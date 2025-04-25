
"use client";

import { cn } from "@/lib/utils";
import React, {
    createContext,
    useState,
    useContext,
    useRef,
    useEffect,
} from "react";

// Define types for better type safety
interface MouseEnterContextType {
    isMouseEntered: boolean;
    setIsMouseEntered: React.Dispatch<React.SetStateAction<boolean>>;
    intensity: number;
    setIntensity: React.Dispatch<React.SetStateAction<number>>;
}

const MouseEnterContext = createContext<MouseEnterContextType | undefined>(
    undefined
);

// Enhanced Card Container with additional props and features
export interface CardContainerProps {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
    intensity?: number; // Control the intensity of the 3D effect
    glareEffect?: boolean; // Add glare effect option
    perspective?: number; // Customize perspective
    disabled?: boolean; // Option to disable the 3D effect
}

export const CardContainer = ({
    children,
    className,
    containerClassName,
    intensity = 25, // Default intensity value
    glareEffect = false,
    perspective = 1000,
    disabled = false,
}: CardContainerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);
    const [isMouseEntered, setIsMouseEntered] = useState(false);
    const [intensityState, setIntensityState] = useState(intensity);

    // Reset effect when disabled prop changes
    useEffect(() => {
        if (disabled && containerRef.current) {
            containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
        }
    }, [disabled]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || disabled) return;

        const { left, top, width, height } =
            containerRef.current.getBoundingClientRect();

        // Calculate rotation based on mouse position
        const x = (e.clientX - left - width / 2) / intensityState;
        const y = (e.clientY - top - height / 2) / intensityState;
        containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;

        // Handle glare effect if enabled
        if (glareEffect && glareRef.current) {
            // Calculate glare position and opacity
            const percentX = (e.clientX - left) / width * 100;
            const percentY = (e.clientY - top) / height * 100;

            glareRef.current.style.background = `radial-gradient(
        circle at ${percentX}% ${percentY}%, 
        rgba(255, 255, 255, 0.3) 0%, 
        rgba(255, 255, 255, 0) 80%
      )`;
            glareRef.current.style.opacity = isMouseEntered ? "1" : "0";
        }
    };

    const handleMouseEnter = () => {
        if (disabled) return;
        setIsMouseEntered(true);
    };

    const handleMouseLeave = () => {
        if (!containerRef.current || disabled) return;
        setIsMouseEntered(false);
        containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;

        // Reset glare effect
        if (glareEffect && glareRef.current) {
            glareRef.current.style.opacity = "0";
        }
    };

    // Add touch support for mobile devices
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!containerRef.current || disabled) return;

        const touch = e.touches[0];
        const { left, top, width, height } =
            containerRef.current.getBoundingClientRect();

        const x = (touch.clientX - left - width / 2) / intensityState;
        const y = (touch.clientY - top - height / 2) / intensityState;

        containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    };

    const handleTouchStart = () => {
        if (disabled) return;
        setIsMouseEntered(true);
    };

    const handleTouchEnd = () => {
        if (!containerRef.current || disabled) return;
        setIsMouseEntered(false);
        containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
    };

    return (
        <MouseEnterContext.Provider value={{
            isMouseEntered,
            setIsMouseEntered,
            intensity: intensityState,
            setIntensity: setIntensityState
        }}>
            <div
                className={cn(
                    "py-20 flex items-center justify-center",
                    containerClassName
                )}
                style={{
                    perspective: `${perspective}px`,
                }}
            >
                <div
                    ref={containerRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onTouchMove={handleTouchMove}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    className={cn(
                        "flex items-center justify-center relative transition-all duration-200",
                        {
                            "cursor-pointer": !disabled,
                            "cursor-default": disabled
                        },
                        className
                    )}
                    style={{
                        transformStyle: "preserve-3d",
                    }}
                >
                    {children}

                    {/* Glare effect overlay */}
                    {glareEffect && (
                        <div
                            ref={glareRef}
                            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                            style={{
                                opacity: 0,
                                zIndex: 10,
                                borderRadius: 'inherit',
                            }}
                        />
                    )}
                </div>
            </div>
        </MouseEnterContext.Provider>
    );
};

// Enhanced card body with more options
export interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
    width?: number | string;
    height?: number | string;
    background?: string;
    borderRadius?: number | string;
}

export const CardBody = ({
    children,
    className,
    width = 384, // 96 * 4 = 384px (w-96 equivalent)
    height = 384, // 96 * 4 = 384px (h-96 equivalent)
    background,
    borderRadius = "1rem",
}: CardBodyProps) => {
    return (
        <div
            className={cn(
                "[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] bg-white dark:bg-[rgba(9,9,9,0.1)] text-black dark:text-white",
                className
            )}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                background,
                borderRadius,
            }}
        >
            {children}
        </div>
    );
};

// Enhanced card item with spring animations and more options
export interface CardItemProps {
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    translateX?: number | string;
    translateY?: number | string;
    translateZ?: number | string;
    rotateX?: number | string;
    rotateY?: number | string;
    rotateZ?: number | string;
    scale?: number;
    transition?: {
        duration?: number;
        delay?: number;
        timing?: string;
    };
    [key: string]: any;
}

export const CardItem = ({
    as: Tag = "div",
    children,
    className,
    translateX = 0,
    translateY = 0,
    translateZ = 0,
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0,
    scale = 1,
    transition = {
        duration: 200,
        delay: 0,
        timing: "ease-out"
    },
    ...rest
}: CardItemProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const context = useMouseEnter();

    useEffect(() => {
        handleAnimations();
    }, [context.isMouseEntered]);

    const handleAnimations = () => {
        if (!ref.current) return;

        if (context.isMouseEntered) {
            ref.current.style.transform = `
        translateX(${typeof translateX === 'number' ? `${translateX}px` : translateX}) 
        translateY(${typeof translateY === 'number' ? `${translateY}px` : translateY}) 
        translateZ(${typeof translateZ === 'number' ? `${translateZ}px` : translateZ}) 
        rotateX(${typeof rotateX === 'number' ? `${rotateX}deg` : rotateX}) 
        rotateY(${typeof rotateY === 'number' ? `${rotateY}deg` : rotateY}) 
        rotateZ(${typeof rotateZ === 'number' ? `${rotateZ}deg` : rotateZ})
        scale(${scale})
      `;
        } else {
            ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)`;
        }
    };

    return (
        <Tag
            ref={ref}
            className={cn("w-fit", className)}
            style={{
                transition: `transform ${transition.duration}ms ${transition.timing} ${transition.delay}ms`,
            }}
            {...rest}
        >
            {children}
        </Tag>
    );
};

// Enhanced hook with better error messaging
export const useMouseEnter = () => {
    const context = useContext(MouseEnterContext);
    if (context === undefined) {
        throw new Error("useMouseEnter must be used within a CardContainer component");
    }
    return context;
};

//handelling images with card
export interface CardImageProps {
    src: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    translateZ?: number;
    fallbackSrc?: string;
    style?: React.CSSProperties;
}

export const CardImage = ({
    src,
    alt,
    width,
    height,
    className,
    translateZ = 0,
    objectFit = 'cover',
    fallbackSrc,
    style = {},
    ...rest
}: CardImageProps) => {
    const [imageSrc, setImageSrc] = useState(src);
    const { isMouseEntered } = useMouseEnter();

    // Update image source when prop changes
    useEffect(() => {
        setImageSrc(src);
    }, [src]);

    const handleError = () => {
        if (fallbackSrc) {
            setImageSrc(fallbackSrc);
        }
    };

    return (
        <div
            className={cn("relative w-full h-full overflow-hidden", className)}
            style={{
                transform: isMouseEntered
                    ? `translateZ(${translateZ}px)`
                    : 'translateZ(0px)',
                transition: 'transform 200ms ease-out',
                width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : 'auto',
                height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
            }}
        >
            <img
                src={imageSrc}
                alt={alt}
                onError={handleError}
                className="w-full h-full"
                style={{
                    objectFit,
                    ...style
                    
                }}
                {...rest}
            />
        </div>
    );
};

// Rename exports to be more specific
export {
  CardContainer as ThreeDCardContainer,
  CardBody as ThreeDCardBody,
  CardItem as ThreeDCardItem,
  CardImage as ThreeDCardImage,
  useMouseEnter as useThreeDCardMouseEnter
};