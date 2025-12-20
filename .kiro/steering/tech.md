# Technology Stack

## Frontend Framework
- **React 18** with TypeScript
- **Vite** as build tool and dev server
- **React Router DOM** for client-side routing

## UI Framework & Styling
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations and transitions
- **Lucide React** for icons

## Backend & Database
- **Supabase** for backend-as-a-service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Edge functions
- **Supabase RPC functions** for custom database operations

## State Management & Data Fetching
- **TanStack Query (React Query)** for server state management
- **React Context** for authentication state
- **React Hook Form** with Zod validation for forms

## Key Libraries
- **date-fns** for date manipulation
- **html2canvas** & **jspdf** for PDF generation
- **embla-carousel-react** for image carousels
- **next-themes** for theme management
- **sonner** for toast notifications

## Development Tools
- **TypeScript** with relaxed configuration
- **ESLint** for code linting
- **Lovable Tagger** for development mode component tagging

## Build & Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Development build (with dev mode features)
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Path Aliases
- `@/*` maps to `./src/*` for clean imports
- All components use absolute imports from `@/components`
- Utilities accessible via `@/lib/utils`

## Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase public API key

## TypeScript Configuration
- Relaxed settings for rapid development
- `noImplicitAny: false`
- `strictNullChecks: false`
- `skipLibCheck: true`