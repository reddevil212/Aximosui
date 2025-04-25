# UI Library

A modern, accessible, and beautiful UI component library built with React and Tailwind CSS.

## Features

- 🎨 Modern design system with customizable themes
- 🌙 Dark mode support out of the box
- ♿️ Accessible components following WAI-ARIA guidelines
- 📱 Responsive and mobile-first
- 🎭 Multiple variants and sizes for components
- 🔄 Smooth animations and transitions
- 📚 Comprehensive documentation with Storybook

## Installation

```bash
npm install ui-lib
# or
yarn add ui-lib
# or
pnpm add ui-lib
```

## Usage

1. First, add the Tailwind CSS configuration to your project:

```js
// tailwind.config.js
module.exports = {
  content: [
    // ...
    "node_modules/ui-lib/dist/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

2. Import and use components:

```tsx
import { Button } from 'ui-lib'

export default function App() {
  return (
    <Button variant="primary" size="lg">
      Click me
    </Button>
  )
}
```

## Development

To run the component library locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Storybook:
   ```bash
   npm run dev
   ```
4. Build the library:
   ```bash
   npm run build
   ```

## Contributing

We welcome contributions! Please see our contributing guide for details.

## License

MIT 