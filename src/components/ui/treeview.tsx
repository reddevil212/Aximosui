"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Folder, File, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TreeItem {
    id: string;
    label: string;
    children?: TreeItem[];
    isExpanded?: boolean;
    isSelected?: boolean;
    icon?: React.ReactNode;
    data?: any;
}

export interface TreeViewProps {
    items: TreeItem[];
    onSelect?: (item: TreeItem) => void;
    onToggle?: (item: TreeItem) => void;
    onDrop?: (draggedItem: TreeItem, targetItem: TreeItem) => void;
    renderItem?: (item: TreeItem) => React.ReactNode;
    showCheckbox?: boolean;
    showIcons?: boolean;
    multiSelect?: boolean;
    dragAndDrop?: boolean;
    className?: string;
}

export interface TreeNodeProps extends TreeItem {
    level: number;
    onSelect: (item: TreeItem) => void;
    onToggle: (item: TreeItem) => void;
    onDrop: (draggedItem: TreeItem, targetItem: TreeItem) => void;
    renderItem?: (item: TreeItem) => React.ReactNode;
    showCheckbox?: boolean;
    showIcons?: boolean;
    multiSelect?: boolean;
    dragAndDrop?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
    id,
    label,
    children,
    level,
    isExpanded = false,
    isSelected = false,
    icon,
    onSelect,
    onToggle,
    onDrop,
    renderItem,
    showCheckbox,
    showIcons,
    multiSelect,
    dragAndDrop,
    data,
}) => {
    const [isDragging, setIsDragging] = useState(false)
    const [isHovering, setIsHovering] = useState(false)

    const handleDragStart = (e: React.DragEvent) => {
        if (!dragAndDrop) return
        e.stopPropagation()
        setIsDragging(true)
        e.dataTransfer.setData("application/json", JSON.stringify({ id, label, data }))
    }

    const handleDragEnd = () => {
        setIsDragging(false)
    }

    const handleDragOver = (e: React.DragEvent) => {
        if (!dragAndDrop) return
        e.preventDefault()
        e.stopPropagation()
        setIsHovering(true)
    }

    const handleDragLeave = () => {
        setIsHovering(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        if (!dragAndDrop) return
        e.preventDefault()
        e.stopPropagation()
        setIsHovering(false)

        const draggedItem = JSON.parse(e.dataTransfer.getData("application/json"))
        if (draggedItem.id !== id) {
            onDrop({ id: draggedItem.id, label: draggedItem.label, data: draggedItem.data }, { id, label, data })
        }
    }

    const hasChildren = children && children.length > 0

    return (
        <div className="select-none">
            <motion.div
                className={cn(
                    "flex items-center p-3 rounded-md transition-colors relative group",
                    isSelected ? "bg-gray-100 dark:bg-zinc-800 text-black dark:text-white" : "text-black dark:text-white",
                    !isSelected && "hover:bg-gray-50 dark:hover:bg-zinc-900",
                    isDragging && "opacity-50",
                    isHovering && "ring-2 ring-gray-300 dark:ring-zinc-700"
                )}
                draggable={dragAndDrop}
                onPointerDown={(e) => {
                    if (dragAndDrop) {
                        handleDragStart(e as unknown as React.DragEvent);
                    }
                }}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ paddingLeft: `${level * 24}px` }}
            >
                {dragAndDrop && (
                    <div className="mr-3 cursor-move opacity-0 group-hover:opacity-100 text-gray-500 dark:text-gray-400">
                        <GripVertical size={18} />
                    </div>
                )}

                {hasChildren && (
                    <motion.button
                        initial={false}
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        onClick={() => onToggle({ id, label, children, isExpanded, isSelected, icon, data })}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-gray-700 dark:text-gray-300"
                    >
                        <ChevronRight size={18} />
                    </motion.button>
                )}

                {!hasChildren && <div className="w-8" />}

                {showCheckbox && (
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelect({ id, label, children, isExpanded, isSelected, icon, data })}
                        className="mr-3"
                    />
                )}

                {showIcons && (
                    <div className="mr-3 text-gray-700 dark:text-gray-300">
                        {icon || (hasChildren ? <Folder size={18} /> : <File size={18} />)}
                    </div>
                )}

                {renderItem ? (
                    renderItem({ id, label, children, isExpanded, isSelected, icon, data })
                ) : (
                    <span
                        onClick={() => onSelect({ id, label, children, isExpanded, isSelected, icon, data })}
                        className="cursor-pointer"
                    >
                        {label}
                    </span>
                )}
            </motion.div>

            <AnimatePresence>
                {isExpanded && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {children.map((child) => (
                            <TreeNode
                                key={child.id}
                                {...child}
                                level={level + 1}
                                onSelect={onSelect}
                                onToggle={onToggle}
                                onDrop={onDrop}
                                renderItem={renderItem}
                                showCheckbox={showCheckbox}
                                showIcons={showIcons}
                                multiSelect={multiSelect}
                                dragAndDrop={dragAndDrop}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export const TreeView: React.FC<TreeViewProps> = ({
    items,
    onSelect,
    onToggle,
    onDrop,
    renderItem,
    showCheckbox = false,
    showIcons = true,
    multiSelect = false,
    dragAndDrop = false,
    className,
}) => {
    const handleSelect = useCallback((item: TreeItem) => {
        if (onSelect) {
            onSelect(item)
        }
    }, [onSelect])

    const handleToggle = useCallback((item: TreeItem) => {
        if (onToggle) {
            onToggle(item)
        }
    }, [onToggle])

    const handleDrop = useCallback((draggedItem: TreeItem, targetItem: TreeItem) => {
        if (onDrop) {
            onDrop(draggedItem, targetItem)
        }
    }, [onDrop])

    return (
        <div className={cn("space-y-2 rounded-sm bg-white dark:bg-zinc-950 text-black dark:text-white", className)}>
            {items.map((item) => (
                <TreeNode
                    key={item.id}
                    {...item}
                    level={0}
                    onSelect={handleSelect}
                    onToggle={handleToggle}
                    onDrop={handleDrop}
                    renderItem={renderItem}
                    showCheckbox={showCheckbox}
                    showIcons={showIcons}
                    multiSelect={multiSelect}
                    dragAndDrop={dragAndDrop}
                />
            ))}
        </div>
    )
}