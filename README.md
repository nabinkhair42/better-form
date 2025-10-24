# formcn - DX-First Dynamic Form Builder

A next-generation **developer-first dynamic form builder** designed for React/Next.js projects. Built with Next.js, TailwindCSS, and Shadcn/UI.

## Features

- 🎯 **Developer Experience First**: Built for developers, by developers
- 🎨 **Shadcn/UI Integration**: Uses only Shadcn/UI components with no custom themes
- 🔧 **Drag & Drop Builder**: Intuitive form building with dnd-kit
- ⚡ **Live Preview**: Real-time form preview with validation
- 🔒 **Type-Safe**: Full TypeScript support with Zod validation
- 🎛️ **React Hook Form**: Powerful form state management
- 📱 **Responsive**: Mobile-first design following Shadcn defaults

## Tech Stack

- **Framework**: Next.js (latest)
- **Styling**: TailwindCSS + Shadcn/UI
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Drag & Drop**: dnd-kit
- **State Management**: Zustand
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd formcn
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/
│   ├── ui/                # Shadcn/UI components
│   └── form-builder/      # Form builder components
│       ├── form-builder.tsx
│       ├── canvas.tsx
│       ├── sidebar.tsx
│       ├── properties-panel.tsx
│       ├── live-preview.tsx
│       └── ...
├── store/                 # Zustand store
├── types/                 # TypeScript type definitions
└── lib/                   # Utility functions
```

## Usage

### Building Forms

1. **Add Fields**: Drag field types from the sidebar to the canvas
2. **Configure Properties**: Select a field to edit its properties in the right panel
3. **Preview**: Switch to the Preview tab to see your form in action
4. **Validation**: Configure validation rules for each field

### Supported Field Types

- **Text Input**: Single-line text input
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection
- **Checkbox**: Single checkbox
- **Radio Group**: Multiple choice selection
- **Switch**: Toggle switch

### Field Properties

- Label and placeholder text
- Default values
- Validation rules (required, min/max length)
- Options for select and radio fields

## Development Roadmap

### Phase 1: Core Setup ✅
- [x] Next.js + TailwindCSS + Shadcn/UI integration
- [x] FormConfig model and Zustand state management
- [x] Basic UI layout (Canvas, Sidebar, Properties Panel)

### Phase 2: Field Builder ✅
- [x] Drag-and-drop support with dnd-kit
- [x] Field addition and removal
- [x] Field property editing
- [x] Live preview panel

### Phase 3: Validation & Logic (In Progress)
- [x] Zod schema generation
- [x] Basic validation rules
- [ ] Conditional logic (show/hide fields)
- [ ] Advanced validation patterns

### Phase 4: Code Export (Planned)
- [ ] React + Zod + React Hook Form component generation
- [ ] JSON configuration export
- [ ] TypeScript type generation

### Phase 5: DX Enhancements (Planned)
- [ ] Command Palette
- [ ] Keyboard shortcuts
- [ ] Form templates
- [ ] Plugin system

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Design Principles

- **Shadcn/UI Only**: No custom themes or colors, strictly following Shadcn design system
- **Type Safety**: Everything is typed with TypeScript
- **Developer Experience**: Built for developers who want to build forms quickly
- **Accessibility**: Following Shadcn/UI accessibility standards
- **Performance**: Optimized for large forms with virtualization

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- [Shadcn/UI](https://ui.shadcn.com/) for the amazing component library
- [React Hook Form](https://react-hook-form.com/) for form state management
- [Zod](https://zod.dev/) for schema validation
- [dnd-kit](https://dndkit.com/) for drag and drop functionality