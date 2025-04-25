import * as React from "react";
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from "@/lib/utils";
import { XCircle, AlertCircle } from 'lucide-react'; // Assuming Lucide icons

interface AlertProps {
    variant?: 'default' | 'destructive';
    title?: string;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    onClose?: () => void;
    className?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps & Omit<HTMLMotionProps<"div">, "animate" | "variants">>((
    {
        variant = 'default',
        title,
        description,
        icon,
        onClose,
        className,
        ...props
    }, ref) => {
    const defaultIcon = variant === 'destructive'
        ? <XCircle className="h-5 w-5" />
        : <AlertCircle className="h-5 w-5" />;

    return (
        <motion.div
            ref={ref}
            className={cn(
                "relative rounded-lg p-4 border transition-all",
                variant === 'default'
                    ? "bg-[#09090b] text-white border-[#09090b]" // Updated default variant colors
                    : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200",
                className
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            {...props}
        >
            <div className="flex">
                <div className="flex-shrink-0">
                    {icon || defaultIcon}
                </div>
                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className="text-sm font-medium">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <div className="text-sm mt-1">
                            {description}
                        </div>
                    )}
                </div>
                {onClose && (
                    <button
                        type="button"
                        className={cn(
                            "ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8",
                            variant === 'default'
                                ? "text-white hover:bg-white/10 focus:ring-white/30 dark:text-white dark:hover:bg-white/10 dark:focus:ring-white/40"
                                : "text-red-500 hover:bg-red-100 focus:ring-red-400 dark:text-red-400 dark:hover:bg-red-800 dark:focus:ring-red-600",
                            "focus:outline-none focus:ring-2 focus:ring-offset-0"
                        )}
                        onClick={onClose}
                    >
                        <span className="sr-only">Close</span>
                        <XCircle className="h-4 w-4" />
                    </button>
                )}
            </div>
        </motion.div>
    );
});
Alert.displayName = "Alert";

// Alert Title Component
type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(({
    className,
    ...props
}, ref) => {
    return (
        <h3
            ref={ref}
            className={cn("text-sm font-medium", className)}
            {...props}
        />
    );
});
AlertTitle.displayName = "AlertTitle";

// Alert Description Component
type AlertDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(({
    className,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn("text-sm mt-1", className)}
            {...props}
        />
    );
});
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
