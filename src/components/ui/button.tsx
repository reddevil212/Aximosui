import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center bg-[#090909] dark:bg-white dark:text-black text-white hover:bg-[#090909]/90 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-[#090909] dark:bg-white dark:text-black text-white hover:bg-[#090909]/90",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90",
        destructive:
          "bg-red-600 text-destructive-foreground hover:bg-red-600/90 dark:bg-red-600 dark:text-white dark:hover:bg-red-700",
        outline:
          "border dark:bg-transparent dark:text-white border-black-2 border-input bg-transparent text-black hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-grey-500 text-secondary-foreground hover:bg-secondary/80 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
        link:
          "text-primary border-2 border-input underline-offset-4 hover:underline dark:text-primary-foreground",
        icon:
          "inline-flex items-center justify-center w-10 h-10 p-0 hover:bg-accent dark:hover:bg-neutral-800",
        "icon-outline":
          "inline-flex items-center justify-center w-10 h-10 p-0 border border-input hover:bg-accent dark:border-neutral-700 dark:hover:bg-neutral-800",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 px-2 text-xs rounded",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10 p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const ButtonContent = ({
  isLoading,
  leftIcon,
  children,
  rightIcon,
}: Pick<ButtonProps, "isLoading" | "leftIcon" | "children" | "rightIcon">) => {
  if (isLoading) {
    return (
      <>
        <Loader2 className="h-4 w-4 animate-spin" />
        {children}
      </>
    );
  }

  return (
    <>
      {leftIcon}
      {children}
      {rightIcon}
    </>
  );
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, fullWidth }), className)}
          ref={ref}
          disabled={isLoading || disabled}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          isLoading && "cursor-wait opacity-80",
          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        <ButtonContent
          isLoading={isLoading}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
        >
          {children}
        </ButtonContent>
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };