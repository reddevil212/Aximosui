// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const modalVariants = cva(
    "relative rounded-lg shadow-lg border overflow-hidden transition-colors",
    {
        variants: {
            theme: {
                dark: "bg-[#09090b] text-white border-gray-700",
                light: "bg-white text-black border-gray-200",
            },
            size: {
                xs: "max-w-xs w-full",
                sm: "max-w-sm w-full",
                md: "max-w-md w-full",
                lg: "max-w-lg w-full",
                xl: "max-w-xl w-full",
                "2xl": "max-w-2xl w-full",
                full: "max-w-full m-4 w-[calc(100%-2rem)]",
            },
            variant: {
                default: "border-gray-700",
                primary: "border-blue-500",
                destructive: "border-red-500",
                success: "border-green-500",
                warning: "border-yellow-500",
                info: "border-cyan-500",
                custom: "border-purple-500",
            },
            position: {
                center: "mx-auto my-auto",
                top: "mx-auto mt-16 mb-auto",
                bottom: "mx-auto mt-auto mb-16",
            },
            fullScreen: {
                true: "w-full h-full max-w-full m-0 rounded-none",
                false: "",
            },
            glass: {
                true: "backdrop-blur-md border-white/20",
                false: "",
            },
        },
        compoundVariants: [
            {
                glass: true,
                theme: "dark",
                className: "bg-[#09090b]/80",
            },
            {
                glass: true,
                theme: "light",
                className: "bg-white/80",
            },
        ],
        defaultVariants: {
            size: "md",
            variant: "default",
            position: "center",
            fullScreen: false,
            glass: false,
            theme: "dark",
        },
    }
);

const overlayVariants = cva(
    "fixed inset-0 z-50 flex overflow-y-auto items-center justify-center",
    {
        variants: {
            blurBackground: {
                true: "backdrop-blur",
                false: "",
            },
            overlay: {
                default: "bg-black/50",
                dark: "bg-black/80",
                light: "bg-white/30",
                none: "bg-transparent",
            },
        },
        defaultVariants: {
            blurBackground: false,
            overlay: "default",
        },
    }
);

const headerVariants = cva("px-6 py-4 border-b flex justify-between items-center", {
    variants: {
        variant: {
            default: "border-gray-700",
            primary: "border-blue-500 bg-blue-500/10",
            destructive: "border-red-500 bg-red-500/10",
            success: "border-green-500 bg-green-500/10",
            warning: "border-yellow-500 bg-yellow-500/10",
            info: "border-cyan-500 bg-cyan-500/10",
            custom: "border-purple-500 bg-gradient-to-r from-purple-500/20 to-pink-500/20",
        },
        theme: {
            dark: "text-white",
            light: "text-black border-gray-200",
        },
        sticky: {
            true: "sticky top-0 z-10",
            false: "",
        },
    },
    compoundVariants: [
        {
            variant: "default",
            theme: "light",
            className: "border-gray-200",
        },
    ],
    defaultVariants: {
        variant: "default",
        sticky: false,
        theme: "dark",
    },
});

const footerVariants = cva("px-6 py-4 border-t flex justify-end gap-2", {
    variants: {
        variant: {
            default: "border-gray-700",
            primary: "border-blue-500",
            destructive: "border-red-500",
            success: "border-green-500",
            warning: "border-yellow-500",
            info: "border-cyan-500",
            custom: "border-purple-500",
        },
        theme: {
            dark: "text-white",
            light: "text-black border-gray-200",
        },
        sticky: {
            true: "sticky bottom-0 z-10",
            false: "",
        },
        align: {
            start: "justify-start",
            center: "justify-center",
            end: "justify-end",
            between: "justify-between",
            around: "justify-around",
            evenly: "justify-evenly",
        },
    },
    compoundVariants: [
        {
            variant: "default",
            theme: "light",
            className: "border-gray-200",
        },
    ],
    defaultVariants: {
        variant: "default",
        sticky: false,
        theme: "dark",
        align: "end",
    },
});

// Animation presets
const animations = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    zoom: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    },
    slideUp: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
    },
    slideDown: {
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    },
    slideLeft: {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
    },
    slideRight: {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    },
    flip: {
        initial: { opacity: 0, rotateX: -15 },
        animate: { opacity: 1, rotateX: 0 },
        exit: { opacity: 0, rotateX: 15 },
    },
    swing: {
        initial: { opacity: 0, rotate: -5 },
        animate: { opacity: 1, rotate: 0 },
        exit: { opacity: 0, rotate: 5 },
    },
    bounce: {
        initial: { opacity: 0, y: -70, scale: 0.9 },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15
            }
        },
        exit: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
    },
    none: {
        initial: {},
        animate: {},
        exit: {},
    },
};

export type AnimationType = keyof typeof animations;

export interface ModalProps extends VariantProps<typeof modalVariants>, VariantProps<typeof overlayVariants>, VariantProps<typeof headerVariants> {
    isOpen: boolean;
    title?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    onClose: () => void;
    className?: string;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    preventScroll?: boolean;
    animation?: AnimationType;
    animationDuration?: number;
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
    headerActions?: React.ReactNode;
    stickyHeader?: boolean;
    stickyFooter?: boolean;
    noPadding?: boolean;
    usePortal?: boolean;
    transitionDelay?: number;
    id?: string;
    ariaDescription?: string;
    closeOnEsc?: boolean;
    onOpen?: () => void;
    onAnimationComplete?: () => void;
    footerAlign?: VariantProps<typeof footerVariants>["align"];
    draggable?: boolean;
    theme?: "dark" | "light";
    maxHeight?: string;
    resizable?: boolean;
    customTransition?: any;
    shadow?: "sm" | "md" | "lg" | "xl" | "2xl" | "none";
    customWidth?: string;
}

export const Modal = ({
    isOpen,
    title,
    children,
    footer,
    onClose,
    className,
    size = "md",
    variant = "default",
    position = "center",
    fullScreen = false,
    glass = false,
    overlay = "default",
    blurBackground = false,
    showCloseButton = true,
    closeOnOverlayClick = true,
    preventScroll = true,
    animation = "zoom",
    animationDuration = 0.3,
    headerComponent,
    footerComponent,
    headerActions,
    stickyHeader = false,
    stickyFooter = false,
    noPadding = false,
    usePortal = true,
    transitionDelay = 0,
    id,
    ariaDescription,
    closeOnEsc = true,
    onOpen,
    onAnimationComplete,
    footerAlign = "end",
    draggable = false,
    theme = "dark",
    maxHeight,
    resizable = false,
    customTransition,
    shadow = "lg",
    customWidth,
}: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const initialPosition = useRef({ x: 0, y: 0 });
    const [renderModal, setRenderModal] = useState(isOpen);
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (usePortal) {
            let container = document.getElementById('modal-portal');
            if (!container) {
                container = document.createElement('div');
                container.id = 'modal-portal';
                document.body.appendChild(container);
            }
            setPortalContainer(container);

            return () => {
                if (container && container.childNodes.length === 0) {
                    document.body.removeChild(container);
                }
            };
        }
        return undefined;
    }, [usePortal]);

    const handleEscKey = useCallback((event: KeyboardEvent) => {
        if (closeOnEsc && isOpen && event.key === "Escape") {
            onClose();
        }
    }, [closeOnEsc, isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscKey);
        }

        return () => {
            document.removeEventListener("keydown", handleEscKey);
        };
    }, [isOpen, handleEscKey]);

    useEffect(() => {
        if (preventScroll) {
            if (isOpen) {
                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
                document.body.style.overflow = "hidden";
                document.body.style.paddingRight = "var(--scrollbar-width)";
            } else {
                document.body.style.overflow = "";
                document.body.style.paddingRight = "";
            }
        }

        if (isOpen && onOpen) {
            onOpen();
        }

        return () => {
            if (preventScroll) {
                document.body.style.overflow = "";
                document.body.style.paddingRight = "";
            }
        };
    }, [isOpen, preventScroll, onOpen]);

    useEffect(() => {
        if (isOpen && modalRef.current) {
            const previouslyFocused = document.activeElement as HTMLElement;
            modalRef.current.focus();

            const focusableElements = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length > 0) {
                (focusableElements[0] as HTMLElement).focus();
            }

            return () => {
                if (previouslyFocused && previouslyFocused.focus) {
                    previouslyFocused.focus();
                }
            };
        }
        return undefined;
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        document.addEventListener("keydown", handleTabKey);
        return () => {
            document.removeEventListener("keydown", handleTabKey);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setRenderModal(true);
        }
    }, [isOpen]);

    const handleAnimationComplete = () => {
        if (!isOpen) {
            setRenderModal(false);
        }
        if (onAnimationComplete) {
            onAnimationComplete();
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!renderModal) return null;

    const modalId = id || `modal-${Math.random().toString(36).substring(2, 9)}`;
    const descriptionId = `${modalId}-description`;

    const selectedAnimation = animations[animation];
    const animationConfig = {
        ...selectedAnimation,
        transition: customTransition || {
            duration: animationDuration,
            delay: isOpen ? transitionDelay : 0,
        },
    };

    const shadowClasses = {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        "2xl": "shadow-2xl",
    };

    const renderModalContent = () => (
        <AnimatePresence mode="wait" onExitComplete={handleAnimationComplete}>
            {isOpen && (
                <motion.div
                    className={cn(overlayVariants({ blurBackground, overlay }))}
                    aria-labelledby={modalId}
                    aria-describedby={ariaDescription ? descriptionId : undefined}
                    aria-modal="true"
                    role="dialog"
                    onClick={handleOverlayClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: animationDuration / 2 }}
                >
                    <motion.div
                        ref={modalRef}
                        className={cn(
                            modalVariants({
                                size,
                                variant,
                                position,
                                fullScreen,
                                glass,
                                theme
                            }),
                            shadowClasses[shadow],
                            draggable && "cursor-move",
                            maxHeight && "overflow-y-auto",
                            resizable && "resize",
                            customWidth && `w-[${customWidth}]`,
                            className
                        )}
                        style={{
                            maxHeight: maxHeight,
                            ...(customWidth ? { width: customWidth } : {})
                        }}
                        {...animationConfig}
                        onClick={(e) => e.stopPropagation()}
                        drag={draggable}
                        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                        dragElastic={0.1}
                        dragMomentum={false}
                        tabIndex={-1}
                    >
                        {headerComponent || (title && (
                            <div
                                className={cn(
                                    headerVariants({
                                        variant,
                                        sticky: stickyHeader,
                                        theme
                                    }),
                                    draggable && "cursor-grab active:cursor-grabbing"
                                )}
                                id={modalId}
                                {...(draggable ? { onMouseDown: () => null } : {})}
                            >
                                <div className="flex items-center">
                                    {typeof title === "string" ? (
                                        <h3 className="text-lg font-medium">{title}</h3>
                                    ) : (
                                        title
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {headerActions}
                                    {showCloseButton && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={onClose}
                                            aria-label="Close"
                                            className={cn(
                                                "h-8 w-8 p-0 rounded-full group",
                                                theme === "light"
                                                    ? "hover:bg-gray-100 text-black"
                                                    : "hover:bg-gray-800 text-white"
                                            )}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="mx-auto transition-transform duration-200 group-hover:rotate-90"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className={cn(
                            noPadding ? "" : "p-6",
                            maxHeight && "overflow-y-auto",
                            "relative"
                        )}>
                            {ariaDescription && (
                                <div id={descriptionId} className="sr-only">
                                    {ariaDescription}
                                </div>
                            )}
                            {children}
                        </div>
                        {footerComponent || (footer && (
                            <div className={cn(
                                footerVariants({
                                    variant,
                                    sticky: stickyFooter,
                                    align: footerAlign,
                                    theme
                                })
                            )}>
                                {footer}
                            </div>
                        ))}
                        {resizable && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-30 hover:opacity-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <polyline points="16 16 22 16 22 10"></polyline>
                                    <polyline points="8 22 8 16 14 16"></polyline>
                                    <polyline points="22 8 16 8 16 2"></polyline>
                                    <polyline points="2 14 8 14 8 20"></polyline>
                                </svg>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    if (usePortal && portalContainer) {
        return createPortal(renderModalContent(), portalContainer);
    }

    return renderModalContent();
};

Modal.Header = function ModalHeader({
    children,
    className,
    variant = "default",
    sticky = false,
    theme = "dark",
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    variant?: string;
    sticky?: boolean;
    theme?: "dark" | "light";
}) {
    return (
        <div
            className={cn(headerVariants({
                variant: variant as any,
                sticky,
                theme: theme as any
            }), className)}
            {...props}
        >
            {children}
        </div>
    );
};

Modal.Body = function ModalBody({
    children,
    className,
    maxHeight,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    maxHeight?: string;
}) {
    return (
        <div
            className={cn(
                "p-6 relative",
                maxHeight && "overflow-y-auto",
                className
            )}
            style={{ maxHeight }}
            {...props}
        >
            {children}
        </div>
    );
};

Modal.Footer = function ModalFooter({
    children,
    className,
    variant = "default",
    sticky = false,
    align = "end",
    theme = "dark",
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    variant?: string;
    sticky?: boolean;
    align?: "start" | "center" | "end" | "between" | "around" | "evenly";
    theme?: "dark" | "light";
}) {
    return (
        <div
            className={cn(
                footerVariants({
                    variant: variant as any,
                    sticky,
                    align: align as any,
                    theme: theme as any
                }),
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

Modal.Alert = function ModalAlert({
    isOpen,
    onClose,
    title,
    children,
    confirmText = "OK",
    variant = "primary",
    theme = "dark",
    ...props
}: Omit<ModalProps, "footer"> & {
    confirmText?: string;
    theme?: "dark" | "light";
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            variant={variant}
            theme={theme}
            animation="zoom"
            footer={
                <Button
                    onClick={onClose}
                    variant={variant === "default" ? "default" : variant as any}
                    className={theme === "light" ? "bg-white text-black" : ""}
                >
                    {confirmText}
                </Button>
            }
            {...props}
        >
            <div className="text-center my-2">
                {children}
            </div>
        </Modal>
    );
};

Modal.Confirm = function ModalConfirm({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "warning",
    theme = "dark",
    size = "sm",
    ...props
}: Omit<ModalProps, "footer"> & {
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    theme?: "dark" | "light";
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            variant={variant}
            theme={theme}
            size={size}
            animation="zoom"
            footer={
                <>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className={cn(
                            theme === "light"
                                ? "hover:bg-gray-100 text-black"
                                : "hover:bg-gray-800 text-white"
                        )}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        variant={variant as any}
                        className={theme === "light" ? "bg-white text-black" : ""}
                    >
                        {confirmText}
                    </Button>
                </>
            }
            {...props}
        >
            <div className="my-2">
                {children}
            </div>
        </Modal>
    );
};

Modal.Drawer = function ModalDrawer({
    isOpen,
    onClose,
    title,
    children,
    position = "right",
    size = "xs",
    theme = "dark",
    ...props
}: Omit<ModalProps, "animation" | "position"> & {
    position?: "left" | "right" | "top" | "bottom";
    theme?: "dark" | "light";
}) {
    const animations = {
        left: "slideRight",
        right: "slideLeft",
        top: "slideDown",
        bottom: "slideUp"
    };

    const positionClasses = {
        left: "h-full max-w-sm w-full ml-0 mr-auto rounded-r-lg",
        right: "h-full max-w-sm w-full mr-0 ml-auto rounded-l-lg",
        top: "w-full h-min mt-0 mb-auto rounded-b-lg",
        bottom: "w-full h-min mb-0 mt-auto rounded-t-lg"
    };

    const drawerClasses = {
        base: "border transition-colors",
        theme: {
            light: "bg-white text-black border-gray-200",
            dark: "bg-[#09090b] text-white border-gray-700",
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            theme={theme}
            animation={animations[position] as AnimationType}
            className={cn(
                positionClasses[position],
                drawerClasses.base,
                drawerClasses.theme[theme]
            )}
            {...props}
        >
            {children}
        </Modal>
    );
};

Modal.Prompt = function ModalPrompt({
    isOpen,
    onClose,
    onConfirm,
    title,
    placeholder = "Enter your response",
    defaultValue = "",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary",
    theme = "dark",
    ...props
}: Omit<ModalProps, "footer" | "children"> & {
    onConfirm: (value: string) => void;
    placeholder?: string;
    defaultValue?: string;
    confirmText?: string;
    cancelText?: string;
    theme?: "dark" | "light";
}) {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        if (isOpen) {
            setValue(defaultValue);
        }
    }, [isOpen, defaultValue]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            variant={variant}
            theme={theme}
            size="sm"
            footer={
                <>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className={cn(
                            theme === "light"
                                ? "hover:bg-gray-100 text-black"
                                : "hover:bg-gray-800 text-white"
                        )}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm(value);
                            onClose();
                        }}
                        variant={variant as any}
                        className={theme === "light" ? "bg-white text-black" : ""}
                    >
                        {confirmText}
                    </Button>
                </>
            }
            {...props}
        >
            <div className="my-4">
                <TextInput
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    autoFocus
                    className={cn(
                        "w-full",
                        theme === "light"
                            ? "bg-white text-black border-gray-200"
                            : "bg-[#09090b] text-white border-gray-700"
                    )}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onConfirm(value);
                            onClose();
                        }
                    }}
                />
            </div>
        </Modal>
    );
};

Modal.Fullscreen = function ModalFullscreen({
    isOpen,
    onClose,
    title,
    children,
    ...props
}: ModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            fullScreen
            animation="fade"
            position="center"
            className="flex flex-col"
            {...props}
        >
            <div className="flex-grow overflow-auto">
                {children}
            </div>
        </Modal>
    );
};

export default Modal;