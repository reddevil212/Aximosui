"use client"

import * as React from "react";
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from "@/lib/utils";

// Base Card Component
interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  className?: string;
  children?: React.ReactNode;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  animate?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  className,
  children,
  aspectRatio = 'auto',
  animate = false,
  ...props
}, ref) => {
  const aspectRatioClasses = {
    auto: "aspect-auto",
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]"
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-lg",
        "bg-white dark:bg-zinc-950 dark:text-white text-black",
        "shadow-lg dark:shadow-none",
        aspectRatioClasses[aspectRatio],
        className
      )}
      whileHover={animate ? {
        scale: 1.02,
        transition: { duration: 0.2 }
      } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
});
Card.displayName = "Card";

// Card Content Component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({
  className,
  children,
  overlay = false,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative",
        overlay ? "absolute inset-0" : "p-4 bg-transparent",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
CardContent.displayName = "CardContent";

// Card Item Component
interface CardItemProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  className?: string;
  children?: React.ReactNode;
  as?: React.ElementType;
}

const CardItem = React.forwardRef<HTMLDivElement, CardItemProps>(({
  className,
  children,
  as: Component = "div",
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});
CardItem.displayName = "CardItem";

export { Card, CardContent, CardItem };