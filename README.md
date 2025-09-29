# Dev EDC

A collection of developer tools accessible through a single web interface. Dev EDC provides common utilities for encoding, decoding, generation, formatting, and conversion tasks used in software development.

## Overview

Dev EDC is a static web application that consolidates frequently used developer tools into one interface. The application runs entirely in the browser without requiring a backend server or internet connection after initial load.

## Tools

### Encoders & Decoders
- **Base64 Encoder/Decoder** - Convert text to/from Base64 encoding
- **JWT Decoder** - Decode JSON Web Tokens and display payload contents
- **URL Encoder/Decoder** - Encode/decode URL strings
- **HTML Entity Converter** - Convert between HTML entities and plain text

### Generators
- **Quick JSON Generator** - Generate sample JSON data structures
- **UUID Generator** - Generate one or more UUIDs
- **Hash Generator** - Generate MD5, SHA-1, SHA-256, and other hash types
- **Lorem Ipsum Generator** - Generate placeholder text
- **Logo Generator** - Create simple SVG logos
- **Color Palette Generator** - Generate color schemes with CSS variable output

### Formatters & Converters
- **Code Minifier/Prettifier** - Minify or format JavaScript, CSS, HTML, and JSON
- **Text Formatter** - Remove excess whitespace and line breaks
- **Data Converter** - Convert between JSON, YAML, and CSV formats
- **Color Converter** - Convert between HEX, RGB, and HSL color formats
- **Timestamp Converter** - Convert between different timestamp formats
- **Image to Base64 Converter** - Convert images to Base64 data URLs

### Utilities
- **Diff Checker** - Compare two text blocks and highlight differences
- **Markdown Previewer** - Preview Markdown content as HTML
- **Symbol Copier** - Copy common symbols and Unicode characters
- **Emoji Copier** - Browse and copy emojis

## Setup

### Requirements
- Node.js 18+
- Yarn

### Installation
```bash
git clone <repository-url>
cd dev-edc
yarn install
```

### Development
```bash
yarn dev
```

### Production Build
```bash
yarn build
yarn preview
```

## Technical Details

### Stack
- React 18 with TypeScript
- Vite build tool
- React Router for navigation
- CSS variables for theming

### Key Dependencies
- `js-beautify`, `html-minifier-terser`, `csso`, `terser` - Code formatting
- `papaparse`, `js-yaml` - Data parsing
- `diff` - Text comparison
- `@dnd-kit/core` - Drag and drop functionality
- `react-markdown` - Markdown rendering
- `@uiw/react-color` - Color picker components

### Architecture
The application is a single-page React application with client-side routing. Each tool is implemented as a separate React component with its own state management. User preferences (theme colors, navigation order, hidden tools) are stored in browser localStorage.

## Customization

### Theme
Users can customize all interface colors through the settings panel. Color changes are applied using CSS custom properties and persist in localStorage.

### Navigation
The navigation menu can be customized by:
- Reordering tools via drag and drop
- Hiding unused tools
- Exporting/importing settings as JSON

### Settings Storage
All customizations are stored in browser localStorage:
- `userTheme` - Theme color configuration
- `navItems` - Navigation order and visibility settings

## Project Structure

```
src/
├── components/           # Tool components
│   ├── Base64EncoderDecoder/
│   ├── JWTDecoder/
│   ├── QuickJSONGenerator/
│   └── ...
├── utils/               # Shared utilities
├── App.tsx              # Main application
├── App.css              # Global styles
└── main.tsx             # Entry point
```

## Development

### Adding New Tools
1. Create component directory under `src/components/`
2. Implement React component following existing patterns
3. Add route to `App.tsx`
4. Add navigation item to default `navItems` array
5. Export component from `src/components/index.ts`

## Contact

- **Email:** hello@devedc.com
- **Website:** [devedc.com](https://www.devedc.com)