# MindFuel Frontend

This is the frontend for **MindFuel – AI Mental Health Companion**, built with Next.js, React, and a modern UI kit. It provides a calming, interactive user experience for stress relief, meditation, and better sleep.

## Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for utility-first styling
- **Radix UI** and **shadcn/ui** for accessible, composable UI primitives
- **Framer Motion** for smooth animations
- **Reusable UI Kit**: Forms, feedback, overlays, navigation, charts, layout, and media components
- **Theming** with `next-themes`
- **Date handling** with `date-fns`
- **Data visualization** with `recharts`
- **Form management** with `react-hook-form` and `zod`
- **Modern best practices** (linting, strict types, etc.)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
cd frontend
npm install
# or
pnpm install
```

### Running the Development Server

```bash
npm run dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

- `app/` – Next.js app directory (routes, layouts, pages)
- `components/` – Shared React components
- `components/ui-kit/` – Reusable UI kit (see [UI Kit README](components/ui-kit/README.md))
- `hooks/` – Custom React hooks
- `lib/` – Utility libraries
- `public/` – Static assets
- `styles/` – Global and component styles
- `tsconfig.json` – TypeScript configuration
- `tailwind.config.ts` – Tailwind CSS configuration

## Scripts

- `dev` – Start development server
- `build` – Build for production
- `start` – Start production server
- `lint` – Run linter

## UI Kit

A comprehensive set of accessible, animated, and themeable components. See [`components/ui-kit/README.md`](components/ui-kit/README.md) for details and usage examples.

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

[MIT](../LICENSE) (if applicable) 