// @ts-nocheck
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
        blur?: boolean
    }
>(({ className, blur = false, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            blur && "backdrop-blur-sm",
            className
        )}
        {...props}
    />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const dialogContentVariants = cva(
    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
    {
        variants: {
            size: {
                default: "max-w-lg",
                sm: "max-w-sm",
                md: "max-w-md",
                lg: "max-w-lg",
                xl: "max-w-xl",
                "2xl": "max-w-2xl",
                "3xl": "max-w-3xl",
                "4xl": "max-w-4xl",
                "5xl": "max-w-5xl",
                full: "max-w-full sm:max-w-[95vw]",
            },
            position: {
                default: "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
                center: "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
                top: "left-[50%] top-[5%] translate-x-[-50%] translate-y-0",
                bottom: "left-[50%] bottom-[5%] translate-x-[-50%] translate-y-0",
                left: "left-[5%] top-[50%] translate-x-0 translate-y-[-50%]",
                right: "right-[5%] top-[50%] translate-x-0 translate-y-[-50%]",
            },
            variant: {
                default: "border bg-white text-black dark:bg-[#090909b] dark:text-white",
                destructive: "border-grey-100 bg-red-650 text-destructive-foreground",
                success: "border-green-500 bg-green-500 text-white",
                warning: "border-yellow-500 bg-yellow-500 text-white",
                info: "border-blue-500 bg-blue-500 text-white",
            },
        },
        defaultVariants: {
            size: "default",
            position: "default",
            variant: "default",
        },
    }
)


interface DialogContentProps
    extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
    showCloseButton?: boolean
    closeButtonClassName?: string
    overlayClassName?: string
    blur?: boolean
    hideOverlay?: boolean
}

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    DialogContentProps
>(({
    className,
    children,
    showCloseButton = true,
    closeButtonClassName,
    overlayClassName,
    blur = false,
    hideOverlay = false,
    size,
    position,
    variant,
    ...props
}, ref) => (
    <DialogPortal>
        {!hideOverlay && <DialogOverlay className={overlayClassName} blur={blur} />}
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                dialogContentVariants({ size, position, variant }),
                className
            )}
            {...props}
        >
            {children}
            {showCloseButton && (
                <DialogPrimitive.Close
                    className={cn(
                        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                        closeButtonClassName
                    )}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            )}
        </DialogPrimitive.Content>
    </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-1.5 text-center sm:text-left",
            className
        )}
        {...props}
    />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
            className
        )}
        {...props}
    />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// Additional custom components for enhanced dialog functionality

interface DialogContentWithActionProps extends DialogContentProps {
    title?: React.ReactNode
    description?: React.ReactNode
    footer?: React.ReactNode
}

const DialogContentWithAction = React.forwardRef<
    React.ElementRef<typeof DialogContent>,
    DialogContentWithActionProps
>(({
    title,
    description,
    footer,
    children,
    ...props
}, ref) => (
    <DialogContent ref={ref} {...props}>
        {title && (
            <DialogHeader>
                {typeof title === 'string' ? <DialogTitle>{title}</DialogTitle> : title}
                {typeof description === 'string' ? (
                    <DialogDescription>{description}</DialogDescription>
                ) : (
                    description
                )}
            </DialogHeader>
        )}
        <div className="py-2">{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
    </DialogContent>
))
DialogContentWithAction.displayName = "DialogContentWithAction"

// Confirmation Dialog
interface ConfirmationDialogProps extends DialogContentProps {
    title?: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm?: () => void
    onCancel?: () => void
    confirmButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
    cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
    isDestructive?: boolean
}

const ConfirmationDialog = ({
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    confirmButtonProps,
    cancelButtonProps,
    isDestructive = false,
    open,
    onOpenChange,
    ...props
}: ConfirmationDialogProps & { open: boolean; onOpenChange: (open: boolean) => void }) => {
    const handleConfirm = () => {
        onConfirm?.();
        onOpenChange?.(false);
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange?.(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent variant={isDestructive ? "destructive" : "default"} {...props}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <button
                        onClick={handleCancel}
                        className={cn(
                            "inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                            cancelButtonProps?.className
                        )}
                        {...cancelButtonProps}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={cn(
                            "inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                            isDestructive
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                : "bg-primary text-primary-foreground hover:bg-primary/90",
                            confirmButtonProps?.className
                        )}
                        {...confirmButtonProps}
                    >
                        {confirmLabel}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Form Dialog
interface FormDialogProps extends DialogContentProps {
    title?: string
    description?: string
    submitLabel?: string
    cancelLabel?: string
    onSubmit?: (e: React.FormEvent) => void
    onCancel?: () => void
    form?: React.ReactNode
    formId?: string
}

const FormDialog = ({
    title,
    description,
    submitLabel = "Submit",
    cancelLabel = "Cancel",
    onSubmit,
    onCancel,
    form,
    formId,
    children,
    open,
    onOpenChange,
    ...props
}: FormDialogProps & { open: boolean; onOpenChange: (open: boolean) => void }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(e);
        onOpenChange?.(false);
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange?.(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent {...props}>
                <DialogHeader>
                    {title && <DialogTitle>{title}</DialogTitle>}
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <form id={formId} onSubmit={handleSubmit}>
                    {form || children}
                    <DialogFooter className="mt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            type="submit"
                            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            {submitLabel}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// Alert Dialog
interface AlertDialogProps extends DialogContentProps {
    title?: string
    description?: string
    actionLabel?: string
    onAction?: () => void
    actionButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
    variant?: "default" | "destructive" | "success" | "warning" | "info"
}

const AlertDialog = ({
    title,
    description,
    actionLabel = "OK",
    onAction,
    actionButtonProps,
    variant = "default",
    open,
    onOpenChange,
    ...props
}: AlertDialogProps & { open: boolean; onOpenChange: (open: boolean) => void }) => {
    const handleAction = () => {
        onAction?.();
        onOpenChange?.(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent variant={variant} {...props}>
                <DialogHeader>
                    {title && <DialogTitle>{title}</DialogTitle>}
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <DialogFooter>
                    <button
                        onClick={handleAction}
                        className={cn(
                            "inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                            variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
                            variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                            variant === "success" && "bg-green-500 text-white hover:bg-green-600",
                            variant === "warning" && "bg-yellow-500 text-white hover:bg-yellow-600",
                            variant === "info" && "bg-blue-500 text-white hover:bg-blue-600",
                            actionButtonProps?.className
                        )}
                        {...actionButtonProps}
                    >
                        {actionLabel}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Side Sheet Dialog Component
const SheetDialog = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    DialogContentProps & {
        side?: "right" | "left" | "top" | "bottom"
        width?: string
        height?: string
    }
>(({
    className,
    children,
    side = "right",
    width = "sm:max-w-md",
    height = "h-full",
    ...props
}, ref) => {
    const animationClasses = {
        right: "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right right-0 top-0",
        left: "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left left-0 top-0",
        top: "data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top top-0 left-0 right-0",
        bottom: "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom bottom-0 left-0 right-0",
    }

    const sizeClasses = {
        right: `${width} ${height}`,
        left: `${width} ${height}`,
        top: `w-full ${side === "top" ? "max-h-[40vh]" : ""}`,
        bottom: `w-full ${side === "bottom" ? "max-h-[40vh]" : ""}`,
    }

    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
                    animationClasses[side],
                    sizeClasses[side],
                    "rounded-lg",
                    className
                )}
                {...props}
            >
                {children}
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPortal>
    )
})
SheetDialog.displayName = "SheetDialog"

export {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogContentWithAction,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogPortal,
    DialogOverlay,
    ConfirmationDialog,
    FormDialog,
    AlertDialog,
    SheetDialog,
}