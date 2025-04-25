# Aximos UI

A modern, accessible, and beautiful UI component library built with React and Tailwind CSS. Aximos UI provides a comprehensive suite of customizable components for building modern web applications.

## ✨ Features

- 🎨 Modern design system with customizable themes
- 🌙 Dark mode support out of the box
- ♿️ Accessible components following WAI-ARIA guidelines
- 📱 Responsive and mobile-first design
- 🎭 Multiple variants and sizes for all components
- 🔄 Smooth animations powered by Framer Motion
- 📦 TypeScript support with full type definitions
- 🛠️ Easy to customize with Tailwind CSS
- 📚 Comprehensive documentation with Storybook

## 🚀 Installation

```bash
# Using npm
npm install aximosui

# Using yarn
yarn add aximosui

# Using pnpm
pnpm add aximosui
```

## 🔧 Setup

1. Add Tailwind CSS configuration:

```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    'node_modules/aximosui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
```

2. Import the styles in your global CSS:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --primary: 221.2 83.2% 53.3%;
    --secondary: 210 40% 96.1%;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
  }
}
```

## 📦 Usage

```tsx
import { Button, Card, Input } from 'aximosui'

export default function App() {
  return (
    <Card>
      <h2>Welcome to Aximos UI</h2>
      <Input placeholder="Enter your name" />
      <Button variant="primary" size="lg">
        Get Started
      </Button>
    </Card>
  )
}
```

## 🧩 Components

Aximos UI includes a wide range of components:


### Forms
- Button
- Input
- Select
- Checkbox
- Radio
- Switch
- Slider
- Form

### Data Display
- Table
- Card
- List
- Badge
- Avatar
- Timeline

### Feedback
- Alert
- Toast
- Progress
- Spinner
- Skeleton

### Navigation
- Menu
- Tabs
- Breadcrumb
- Pagination
- Drawer

### Overlay
- Modal
- Popover
- Tooltip
- Dropdown

## 🛠️ Development

1. Clone the repository:
```bash
git clone https://github.com/reddevil212/aximosui.git
cd aximosui
```

2. Install dependencies:
```bash
npm install
```

3. Start development environment:
```bash
npm run dev
```

4. Build the library:
```bash
npm run build
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:coverage
```

## 📖 Documentation

Our documentation is built with Storybook. To view it locally:

```bash
npm run storybook
```

Visit our online documentation for detailed guides and examples.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request



## 📄 License

MIT © [Aximos UI](https://github.com/reddevil212/aximosui)

## 🙏 Acknowledgments

Built with:
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Storybook](https://storybook.js.org/)
- [Framer Motion](https://www.framer.com/motion/)