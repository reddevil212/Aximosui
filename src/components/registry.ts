export interface ComponentConfig {
    name: string;
    dependencies: string[];
    files: string[];
    styles?: string[];
    utils?: string[];
    version?: string;
}

export interface ComponentRegistry {
    [key: string]: ComponentConfig;
}


export const componentRegistry: ComponentRegistry = {
    accordion: {
        name: 'Accordion',
        dependencies: ['@radix-ui/react-accordion', 'lucide-react'],
        files: ['accordion.tsx'],
        utils: ['utils']
    },
    alert: {
        name: 'Alert',
        dependencies: ['framer-motion', 'lucide-react'],
        files: ['alert.tsx'],
        utils: ['utils']
    },
    AutoplayMasonry: {
        name: 'AutoplayMasonry',
        dependencies: ['framer-motion'],
        files: ['autoplay-masonry.tsx'],
        utils: ['utils']
    },

    avatar: {
        name: 'Avatar',
        dependencies: ['framer-motion'],
        files: ['avatar.tsx'],
        utils: ['utils']
    },
    badge: {
        name: 'Badge',
        dependencies: ['framer-motion'],
        files: ['badge.tsx'],
        utils: ['utils']
    },
    breadcrumb: {
        name: 'Breadcrumb',
        dependencies: ['lucide-react'],
        files: ['breadcrumb.tsx'],
        utils: ['utils']
    },
    button: {
        name: 'Button',
        dependencies: [
            '@radix-ui/react-slot', 
            'class-variance-authority',
            'lucide-react'
        ],
        files: ['button.tsx'],
        utils: ['utils']
    },
    calendar: {
        name: 'Calendar',
        dependencies: ['date-fns', 'framer-motion', 'lucide-react'],
        files: ['calendar.tsx', 'tooltip.tsx'],
        utils: ['utils']
    },
    card: {
        name: 'Card',
        dependencies: ['framer-motion'],
        files: ['card.tsx'],
        utils: ['utils']
    },
    carousel: {
        name: 'Carousel',
        dependencies: ['framer-motion', 'embla-carousel-react', 'embla-carousel-autoplay', 'lucide-react'],
        files: ['carousel.tsx'],
        utils: ['utils']
    },
    checkbox: {
        name: 'Checkbox',
        dependencies: ['@radix-ui/react-checkbox', 'lucide-react'],
        files: ['checkbox.tsx'],
        utils: ['utils']
    },
    ccollapsible: {
        name: 'Collapsible',
        dependencies: ['@radix-ui/react-collapsible', 'class-variance-authority'],
        files: ['collapsible.tsx'],
        utils: ['utils']
    },
    coloredtext: {
        name: 'ColoredText',
        dependencies: ['framer-motion'],
        files: ['coloredtext.tsx'],
        utils: ['utils']
    },
    command: {
        name: 'Command',
        dependencies: ['lucide-react', 'class-variance-authority', 'cmdk', '@radix-ui/react-dialog'],
        files: ['command.tsx', 'dialog.tsx'],
        utils: ['utils']
    },
    datagrid: {
        name: 'DataGrid',
        dependencies: ['framer-motion'],
        files: ['datagrid.tsx'],
        utils: ['utils']
    },
    dialog: {
        name: 'Dialog',
        dependencies: ['@radix-ui/react-dialog', 'class-variance-authority', 'lucide-react', '@radix-ui/react-dialog'],
        files: ['dialog.tsx'],
        utils: ['utils']
    },
    drawer: {
        name: 'Drawer',
        dependencies: ['vaul', 'lucide-react'],
        files: ['drawer.tsx'],
        utils: ['utils']
    },
    dropdown: {
        name: 'Dropdown',
        dependencies: ['lucide-react'],
        files: ['dropdown.tsx', 'button.tsx'],
        utils: ['utils']
    },
    fileinput: {
        name: 'FileInput',
        dependencies: ['lucide-react'],
        files: ['fileinput.tsx'],
        utils: ['utils']
    },
    FloatingPanel: {
        name: 'FloatingPanel',
        dependencies: ['@radix-ui/react-popover', 'framer-motion'],
        files: ['floating-panel.tsx'],
        utils: ['utils']
    },
    focuscard: {
        name: 'FocusCard',
        dependencies: ['class- variance - authority', 'framer-motion'],
        files: ['focus-card.tsx'],
        utils: ['utils']
    },
    hovercard: {
        name: 'HoverCard',
        dependencies: ['framer-motion'],
        files: ['hover-card.tsx'],
        utils: ['utils']
    },
    masonry: {
        name: 'Masonry',
        dependencies: ['framer-motion', 'lodash'],
        files: ['masonry.tsx'],
        utils: ['utils']
    },
    modal: {
        name: 'Modal',
        dependencies: ['framer-motion', 'class-variance-authority', 'react-dom'],
        files: ['modal.tsx', 'button.tsx', 'text-input.tsx'],
        utils: ['utils']
    },
    'navigation-menu': {
        name: 'NavigationMenu',
        dependencies: ['@radix-ui/react-navigation-menu', 'lucide-react', 'class-variance-authority'],
        files: ['navigation-menu.tsx'],
        utils: ['utils']
    },
    otpinput: {
        name: 'OTPInput',
        dependencies: [],
        files: ['otp-input.tsx'],
        utils: ['utils']
    },
    pagination: {
        name: 'Pagination',
        dependencies: ['lucide-react'],
        files: ['pagination.tsx'],
        utils: ['utils']
    },
    popover: {
        name: 'Popover',
        dependencies: ['@radix-ui/react-popover'],
        files: ['popover.tsx'],
        utils: ['utils']
    },
    progress: {
        name: 'Progress',
        dependencies: ['@radix-ui/react-progress'],
        files: ['progress.tsx'],
        utils: ['utils']
    },
    radio: {
        name: 'Radio',
        dependencies: ['@radix-ui/react-radio-group', 'lucide-react'],
        files: ['radio.tsx'],
        utils: ['utils']
    },
    rating: {
        name: 'Rating',
        dependencies: ['lucide-react'],
        files: ['rating.tsx'],
        utils: ['utils']
    },
    resizable: {
        name: 'Resizable',
        dependencies: ['react-resizable-panels', 'framer-motion'],
        files: ['resizable.tsx'],
        utils: ['utils']
    },
   
    scrollarea: {
        name: 'ScrollArea',
        dependencies: ['class-variance-authority'],
        files: ['scrollarea.tsx'],
        utils: ['utils']
    },
    search: {
        name: 'Search',
        dependencies: ['framer-motion', 'lucide-react'],
        files: ['search.tsx', 'text-input.tsx'],
        utils: ['utils']
    },
    select: {
        name: 'Select',
        dependencies: ['@radix-ui/react-select', 'lucide-react', 'class-variance-authority'],
        files: ['select.tsx'],
        utils: ['utils']
    },
    separator: {
        name: 'Separator',
        dependencies: ['@radix-ui/react-separator', 'class-variance-authority'],
        files: ['separator.tsx'],
        utils: ['utils']
    },
    sheet: {
        name: 'Sheet',
        dependencies: [
            '@radix-ui/react-dialog',
            'class-variance-authority',
            'lucide-react'
        ],
        files: ['sheet.tsx'],
        utils: ['utils']
    },
    skeleton: {
        name: 'Skeleton',
        dependencies: [
            'framer-motion'
        ],
        files: ['skeleton.tsx'],
        utils: ['utils']
    },
    slider: {
        name: 'Slider',
        dependencies: [
            '@radix-ui/react-slider',
            'class-variance-authority'
        ],
        files: ['slider.tsx'],
        utils: ['utils']
    },
    toaster: {
        name: 'Toaster',
        dependencies: [
            'next-themes',
            'sonner'
        ],
        files: ['toaster.tsx'],
        utils: ['utils']
    },
    switch: {
        name: 'Switch',
        dependencies: [
            'react',
            '@radix-ui/react-switch',
            'class-variance-authority'
            
        ],
        files: ['switch.tsx'],
        utils: ['utils']
    },

    table: {
        name: 'Table',
        dependencies: ['framer-motion', 'lucide-react'],
        files: ['table.tsx'],
        utils: ['utils']
    },
    TagsInput: {
        name: 'TagsInput',
        dependencies: ['framer-motion', 'lucide-react'],
        files: ['tags-input.tsx', 'text-input.tsx', 'badge.tsx'],
        utils: ['utils']
    },
    tabs: {
        name: 'Tabs',
        dependencies: ['@radix-ui/react-tabs', 'framer-motion', 'lucide-react'],
        files: ['tabs.tsx'],
        utils: ['utils']
    },
    textinput: {
        name: 'TextInput',
        dependencies: ['@radix-ui/react-slot', 'class-variance-authority'],
        files: ['text-input.tsx'],
        utils: ['utils']
    },
    textarea: {
        name: 'TextArea',
        dependencies: ['class-variance-authority'],
        files: ['textarea.tsx'],
        utils: ['utils']
    },
    timeline: {
        name: 'Timeline',
        dependencies: ['framer-motion', 'class-variance-authority'],
        files: ['Timeline.tsx'],
        utils: ['utils']
    },
    tooltip: {
        name: 'Tooltip',
        dependencies: ['@radix-ui/react-tooltip', 'framer-motion'],
        files: ['tooltip.tsx'],
        utils: ['utils']
    },
    treeview: {
        name: 'TreeView',
        dependencies: ['lucide-react', 'framer-motion'],
        files: ['treeview.tsx'],
        utils: ['utils']
    },
    ThreeDcard: {
        name: 'ThreeDcard',
        dependencies: ['framer-motion'],
        files: ['ThreeDcard.tsx'],
        utils: ['utils']
    }
};

export type ComponentKey = keyof typeof componentRegistry;