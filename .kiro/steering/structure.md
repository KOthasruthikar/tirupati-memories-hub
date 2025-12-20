# Project Structure & Organization

## Root Directory Structure

```
├── src/                    # Main application source code
├── supabase/              # Supabase backend configuration
├── public/                # Static assets
├── .kiro/                 # Kiro IDE configuration
└── node_modules/          # Dependencies
```

## Source Code Organization (`src/`)

### Core Application Files
- `main.tsx` - Application entry point
- `App.tsx` - Root component with routing and providers
- `index.css` - Global styles and CSS variables
- `vite-env.d.ts` - Vite type definitions

### Component Architecture (`src/components/`)
- **UI Components** (`ui/`) - shadcn/ui components (buttons, cards, dialogs, etc.)
- **Feature Components** - Business logic components (Header, Footer, etc.)
- **Specialized Components** - Domain-specific components (ImageUploadForm, PhotoCarousel, etc.)

### Page Components (`src/pages/`)
- Route-level components following React Router structure
- Each page represents a distinct user flow or feature area
- Examples: `Home.tsx`, `Gallery.tsx`, `Members.tsx`, `Profile.tsx`

### State Management (`src/contexts/`)
- React Context providers for global state
- `AuthContext.tsx` - Authentication and user session management

### Custom Hooks (`src/hooks/`)
- Reusable logic extraction following React patterns
- Data fetching hooks (e.g., `useGallery.ts`, `useMembers.ts`)
- UI interaction hooks (e.g., `use-mobile.tsx`, `use-toast.ts`)

### Backend Integration (`src/integrations/`)
- `supabase/` - Supabase client configuration and type definitions
- `client.ts` - Configured Supabase client instance
- `types.ts` - Auto-generated database types

### Utilities (`src/lib/`)
- `utils.ts` - Shared utility functions and helpers
- Typically includes className merging, formatting functions, etc.

### Type Definitions (`src/types/`)
- `database.ts` - Custom database type definitions
- Application-specific type interfaces

### Seed Data (`src/data/`)
- `seed.ts` - Static data and configuration
- Site metadata, initial content, mock data

## Backend Structure (`supabase/`)

### Configuration
- `config.toml` - Supabase project configuration

### Database Migrations (`migrations/`)
- SQL migration files with timestamps
- Database schema evolution and updates

### Edge Functions (`functions/`)
- Serverless functions for backend logic
- Examples: `send-access-notification/`, `send-recovery-code/`

## Naming Conventions

### Files & Directories
- **Components**: PascalCase (e.g., `Header.tsx`, `PhotoCarousel.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useGallery.ts`)
- **Pages**: PascalCase (e.g., `Home.tsx`, `MemberDetail.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Types**: camelCase (e.g., `database.ts`)

### Import Patterns
- Use `@/` alias for all internal imports
- Group imports: external libraries first, then internal modules
- Prefer named exports over default exports for utilities

### Component Organization
- One component per file
- Co-locate related components in feature directories
- Keep UI components generic and reusable in `ui/` folder

## Architecture Patterns

### Data Flow
1. **Pages** consume data via custom hooks
2. **Hooks** use TanStack Query for server state
3. **Context** manages global client state (auth)
4. **Supabase** handles all backend operations

### Component Composition
- Use composition over inheritance
- Leverage shadcn/ui component patterns
- Implement consistent prop interfaces across similar components

### State Management Strategy
- Server state: TanStack Query
- Global client state: React Context
- Local component state: useState/useReducer
- Form state: React Hook Form