// @ts-nocheck

"use client"

import * as React from "react"
import { Drawer as VaulDrawer } from "vaul"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DrawerProps {
  children: React.ReactNode
  trigger?: React.ReactNode
  title?: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  direction?: "top" | "bottom" | "left" | "right"
  shouldScaleBackground?: boolean
  modal?: boolean
  overlayClassName?: string
  contentClassName?: string
  className?: string
  closeButton?: boolean
  closeButtonClassName?: string
  nested?: boolean
  dismissible?: boolean
  snapPoints?: number[]
  activeSnapPoint?: number
  setActiveSnapPoint?: (snapPoint: number) => void
  fadeFromIndex?: number
}

interface DrawerHeaderProps {
  title?: string
  description?: string
  className?: string
}

interface DrawerFooterProps {
  children: React.ReactNode
  className?: string
  divider?: boolean
}

interface DrawerContentProps {
  children: React.ReactNode
  className?: string
}

export function Drawer({
  children,
  trigger,
  title,
  description,
  open,
  onOpenChange,
  direction = "bottom",
  shouldScaleBackground = true,
  modal = true,
  overlayClassName,
  contentClassName,
  className,
  closeButton = true,
  closeButtonClassName,
  nested = false,
  dismissible = true,
  snapPoints,
  activeSnapPoint,
  setActiveSnapPoint,
  fadeFromIndex,
  ...props
}: DrawerProps) {
  const hasCustomTrigger = !!trigger

  return (
    <VaulDrawer.Root
      open={open}
      onOpenChange={onOpenChange}
      direction={direction}
      shouldScaleBackground={shouldScaleBackground}
      modal={modal}
      nested={nested}
      dismissible={dismissible}
      snapPoints={snapPoints}
      activeSnapPoint={activeSnapPoint}
      setActiveSnapPoint={setActiveSnapPoint}
      fadeFromIndex={fadeFromIndex}
      {...props}
    >
      {hasCustomTrigger && (
        <VaulDrawer.Trigger asChild>
          {trigger}
        </VaulDrawer.Trigger>
      )}
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            overlayClassName
          )}
        />
        <VaulDrawer.Content
          className={cn(
            "fixed z-50 bg-white dark:bg-zinc-950 text-black dark:text-white",
            "flex flex-col shadow-xl outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            direction === "bottom" && [
              "inset-x-0 bottom-0 border-t border-gray-200 dark:border-zinc-800",
              "rounded-t-[10px]",
              "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
            ],
            direction === "top" && [
              "inset-x-0 top-0 border-b border-gray-200 dark:border-zinc-800",
              "rounded-b-[10px]",
              "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top"
            ],
            direction === "left" && [
              "inset-y-0 left-0 h-full w-3/4 border-r border-gray-200 dark:border-zinc-800",
              "sm:max-w-sm",
              "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
            ],
            direction === "right" && [
              "inset-y-0 right-0 h-full w-3/4 border-l border-gray-200 dark:border-zinc-800",
              "sm:max-w-sm",
              "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
            ],
            contentClassName
          )}
        >
          {closeButton && (
            <button
              onClick={() => onOpenChange?.(false)}
              className={cn(
                "absolute right-4 top-4 p-1 rounded-full",
                "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800",
                "focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-zinc-600",
                closeButtonClassName
              )}
              aria-label="Close drawer"
            >
              <X size={18} />
            </button>
          )}

          {(title || description) && (
            <DrawerHeader title={title} description={description} />
          )}

          <div className={cn("flex flex-col", className)}>
            {children}
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  )
}

export function DrawerHeader({
  title,
  description,
  className
}: DrawerHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col text-center px-4 pt-6 pb-2",
        "sm:text-left",
        className
      )}
    >
      {title && (
        <VaulDrawer.Title className="text-lg font-semibold text-black dark:text-white">
          {title}
        </VaulDrawer.Title>
      )}
      {description && (
        <VaulDrawer.Description className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {description}
        </VaulDrawer.Description>
      )}
    </div>
  )
}

export function DrawerFooter({
  children,
  className,
  divider = true,
}: DrawerFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 mt-auto text-black dark:text-white",
        divider && "border-t border-gray-200 dark:border-zinc-800",
        className
      )}
    >
      {children}
    </div>
  )
}

export function DrawerContent({
  children,
  className,
}: DrawerContentProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-auto p-4 text-black dark:text-white",
        className
      )}
    >
      {children}
    </div>
  )
}

// Export nested components for easier access
Drawer.Header = DrawerHeader
Drawer.Footer = DrawerFooter
Drawer.Content = DrawerContent