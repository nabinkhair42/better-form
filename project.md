Perfect! Thanks for the clarification — we can update the **technical documentation for `betterform`** with your chosen tech stack and design constraints. Here's the **updated version with your tech stack and Shadcn/UI theme rules** baked in.

---

# **Project Documentation: betterform (DX-First Dynamic Form Builder)**

### _The Developer-Friendly, Type-Safe Form Builder Built on Shadcn/UI_

---

## **1. Product Overview**

**betterform** is a next-generation **developer-first dynamic form builder** designed for React/Next.js projects.
It allows developers to **drag-and-drop fields, configure validations, preview forms, and export production-ready React code**.

**Key points:**

- Built with **Next.js + TailwindCSS + Shadcn/UI**.
- Uses **React Hook Form** for state management.
- Uses **Zod** for type-safe validation.
- Fully **Shadcn theme-compliant** — no custom colors or themes.
- Prioritizes **Developer Experience (DX)** over visual customization.

---

## **2. Product Vision**

> **Vision Statement:**
> To create the **most intuitive and DX-focused form builder for React developers**, fully leveraging Shadcn/UI's design system without introducing custom theme variables.

**Principles:**

- Transparency: all actions generate **readable React + Zod code**.
- Type-Safety: validation is **compile-time safe** using Zod.
- DX-First: keyboard shortcuts, command palette, and CLI integration.
- Theme-Compliant: strictly uses Shadcn/UI's **colors, variants, and design tokens**.

---

## **3. Tech Stack**

| Layer                            | Technology                                            |
| -------------------------------- | ----------------------------------------------------- |
| **Frontend Framework**           | Next.js (latest stable version)                       |
| **Styling**                      | TailwindCSS (JIT mode), Shadcn/UI prebuilt components |
| **UI Components**                | Shadcn/UI only (no custom theme overrides)            |
| **Form State**                   | React Hook Form                                       |
| **Validation**                   | Zod                                                   |
| **Drag-and-Drop**                | dnd-kit                                               |
| **State Management**             | Zustand / Context API                                 |
| **Code Editor / Preview**        | Monaco Editor or Prism.js (live preview)              |
| **Version Control / Deployment** | GitHub + Vercel (Next.js recommended)                 |

**Constraints:**

- **No custom themes**: Only Shadcn's base colors, variants, spacing, and tokens.
- Responsiveness and light/dark mode **must follow Shadcn defaults**.
- Any new component added must respect **Shadcn design system**.

---

## **4. Core Features**

### **Drag-and-Drop Form Builder**

- Add fields (`Input`, `Select`, `Checkbox`, `Radio`, `Switch`, `Textarea`)
- Nested/repeatable fields supported
- Reorder with drag-and-drop (`dnd-kit`)
- Field configuration panel (label, placeholder, default value, validation)

### **Validation & Conditional Logic**

- Configurable rules: `required`, `min/max`, regex, custom Zod validators
- Conditional visibility: field shows only if another field satisfies a condition
- Automatic Zod schema generation for runtime + compile-time safety

### **Live Preview**

- Real-time preview with Shadcn/UI components
- Fully reflects validation, conditional logic, and field variants
- Light/Dark mode follows **Shadcn defaults**

### **Code Export**

- Export React component with **React Hook Form + Zod integration**
- Export TypeScript interfaces and JSON form configuration
- All exported code uses **Shadcn/UI styling** and design system

### **DX Enhancements**

- Command Palette (keyboard shortcuts for adding fields, validations, export)
- Two-way sync (UI ↔ code edits)
- Prebuilt templates (Login, Signup, Feedback forms)

### **Plugin / Extensibility**

- Add custom Shadcn-compatible components via plugin interface
- Plugin must use Shadcn/UI for all styling (no external custom themes)

---

## **5. Form Data Model**

```ts
type FormConfig = {
  id: string;
  name: string;
  fields: FormField[];
};

type FormField = {
  id: string;
  type:
    | "input"
    | "select"
    | "checkbox"
    | "radio"
    | "textarea"
    | "switch"
    | "custom";
  label: string;
  placeholder?: string;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  validation?: ValidationRules;
  conditional?: ConditionalRule;
};

type ValidationRules = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  custom?: string;
};

type ConditionalRule = {
  fieldId: string;
  operator: "equals" | "not" | "gt" | "lt";
  value: any;
};
```

All forms are **fully type-safe**, and code export will generate a React component based on this structure.

---

## **6. Implementation Roadmap**

### **Phase 1: Core Setup (Week 1–2)**

- Next.js + TailwindCSS + Shadcn/UI integration
- Create FormConfig model and initial state with Zustand
- Scaffold UI canvas and sidebar

### **Phase 2: Field Builder (Week 3–5)**

- Drag-and-drop support with `dnd-kit`
- Sidebar for adding/removing/reordering fields
- Inline field property editing
- Initial live preview panel

### **Phase 3: Validation & Logic (Week 6–8)**

- Zod schema builder for each field
- Conditional logic UI (show/hide/enable/disable)
- Real-time validation preview

### **Phase 4: Code Export (Week 9–10)**

- React + Zod + React Hook Form component generation
- JSON + TypeScript type export
- Live code preview

### **Phase 5: DX & Extensibility (Week 11–13)**

- Command Palette and keyboard shortcuts
- Plugin API for custom Shadcn-compatible fields
- Templates and prebuilt forms

### **Phase 6: Testing & Polish (Week 14–15)**

- Unit & integration tests (form rendering, validation, export)
- Performance optimization for large forms
- Ensure full adherence to **Shadcn design system**

---

## **7. Developer Experience (DX) Focus**

- **Code Transparency:** Visual actions always correspond to real React code
- **Keyboard-first interactions:** Command Palette & hotkeys for all major actions
- **Prebuilt templates:** Reduce repetitive setup
- **Plugin-friendly:** Extend functionality while following Shadcn design system
- **Live Preview:** See form behavior immediately, without leaving builder

---

## **8. Anticipated Challenges & Mitigation**

| Challenge                                             | Impact      | Mitigation                                         |
| ----------------------------------------------------- | ----------- | -------------------------------------------------- |
| Dynamic form state (nested fields, conditional logic) | Medium-High | Use normalized state + memoization                 |
| Two-way code sync (UI ↔ code)                         | Medium      | One-way initial sync; gradually evolve two-way     |
| Schema generation complexity                          | Medium      | Modular Zod builder with tests                     |
| Performance with large forms                          | Medium      | Virtualize field rendering, debounce updates       |
| Plugin stability                                      | Medium      | Enforce Shadcn/UI interface + sandboxing           |
| UI overload                                           | Low-Medium  | Progressive disclosure (Basic vs Advanced tabs)    |
| Consistency with Shadcn theme                         | Low         | Enforce base colors and variants; no custom tokens |

---

## **9. Success Metrics**

| Metric                                 | Target             |
| -------------------------------------- | ------------------ |
| Time to create a production-ready form | < 5 minutes        |
| Export code matches preview            | 100%               |
| DX satisfaction (survey)               | ≥ 9/10             |
| Plugin adoption                        | ≥ 30% of users     |
| GitHub stars / OSS adoption            | ≥ 1000 in 6 months |

---

## **10. Constraints & Rules**

- **No custom themes or colors**; only Shadcn base colors, variants, spacing, and tokens
- Must adhere to **Shadcn/UI responsive design** principles
- All exported forms must **only use Shadcn/UI components**
- No external CSS frameworks or overrides beyond TailwindCSS + Shadcn

---

## **11. Long-Term Vision**

- **Team Collaboration:** Shared forms, versioning, comments
- **Cloud Sync:** Save and import form configs
- **Marketplace:** Share prebuilt forms and custom Shadcn fields
- **IDE Integration:** VSCode plugin for in-editor form building
- **AI Assistant:** Suggest validations, field labels, and field types

---

**Summary:**

`betterform` is the **next-generation DX-first form builder** for React developers. By strictly adhering to Shadcn/UI design system, leveraging React Hook Form + Zod, and providing live previews, code exports, and plugin extensibility, `betterform` empowers developers to **build forms faster, safer, and more maintainably** than any existing solution.
