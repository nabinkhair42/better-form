# Better Form

A next-generation developer-first dynamic form builder for React and Next.js. Build powerful forms with drag & drop, live preview, TypeScript, Zod validation, and Shadcn/UI components.

**[Live Demo](https://better-form.nabinkhair.com.np)**

## Features

- **shadcn/ui Integration** - Beautiful, accessible components
- **Drag & Drop Builder** - Intuitive form building interface
- **Live Preview** - Real-time form preview with validation
- **Type-Safe** - Full TypeScript support with Zod validation
- **React Hook Form** - Powerful form state management
- **Code Export** - Generate production-ready code
- **One-Command Installation** - Install forms via shadcn CLI
- **MongoDB Storage** - Persistent registry storage for reliable distribution
- **Responsive** - Mobile-first design

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB Atlas account (free tier) - [Setup Guide](./MONGODB_SETUP.md)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nabinkhair42/better-form.git
cd better-form
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

   - Copy `.env.example` to `.env.local`

   ```bash
   MONGODB_URI=your-mongodb-connection-string
   ```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## MongoDB Setup

Better Form uses MongoDB to store registry data for form distribution. This enables:

- Persistent storage across deployments
- Reliable form distribution via shadcn CLI
- Automatic cleanup with TTL indexes


## Tech Stack

- Next.js 16
- TypeScript
- Zod
- shadcn/ui
- React Hook Form
- Tailwind CSS
- MongoDB
