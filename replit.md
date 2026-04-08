# Nexus - Relationship Network Builder

## Overview

Nexus is a full-stack web application for building, analyzing, and visualizing complex relationship networks from data. It provides tools for creating projects, managing databases, building interactive graphs, collaborating through notes/comments, and exploring knowledge through a visual "Knowledge Garden." The application includes features like a landing page, project management, database querying, graph visualization with node/edge configuration, resource management, AI copilot integration, and a "Brain Market" for sharing graph ontologies.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter with hash-based routing (`useHashLocation`) — all routes are defined in `client/src/App.tsx`
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin) with CSS custom properties for theming (dark mode support). Uses shadcn/ui component library (new-york style) located in `client/src/components/ui/`
- **Graph Visualization**: `@xyflow/react` (React Flow) for interactive node/edge graph rendering, ERD views, and data preprocessing pipelines
- **Animations**: Framer Motion for transitions and drag-and-drop reordering
- **Charts**: Recharts for data visualization (area charts, etc.)
- **i18n**: Custom lightweight internationalization system (`client/src/lib/i18n.tsx`) with `LanguageProvider` context and `useLanguage` hook. Supports English (en) and Korean (ko). Language preference persisted in localStorage key `"em-graph-language"`. Language toggle button in Layout.tsx sidebar (Globe icon, between storage widget and user profile). All pages and major components are fully translated: Home, Projects, CreateProject, SignUp, OrganizationSelect, ProjectSetup, KnowledgeGarden, ProjectView, BrainMarket, ResourcesManager, DatabaseManager, GraphBuilder, GraphBuilderForm, DataPreprocessingBuilder, IntelliSearch, Chatbot, Settings, not-found.
- **Build Tool**: Vite with React plugin, served from `client/` directory, outputs to `dist/public/`
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

### Backend
- **Framework**: Express.js running on Node.js with TypeScript (compiled via tsx in dev, esbuild for production)
- **Entry Point**: `server/index.ts` creates HTTP server, registers routes, serves static files in production or uses Vite dev middleware in development
- **API Structure**: RESTful JSON API under `/api/` prefix with CRUD operations for projects, notes, comments, and graph configs
- **Routes**: Defined in `server/routes.ts` — handles projects, notes (per project), comments (per note), and graph configuration endpoints
- **Storage Layer**: `server/storage.ts` implements `IStorage` interface with `DatabaseStorage` class using Drizzle ORM, providing a clean abstraction over the database

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` using Drizzle's `pgTable` definitions with Zod validation schemas via `drizzle-zod`
- **Database Tables**:
  - `users` — id (UUID), username, password
  - `projects` — id (UUID), title, description, type, nodes count, edges count, timestamps
  - `notes` — id (UUID), projectId (FK), authorName, content, tags (text array), timestamps
  - `comments` — id (UUID), noteId (FK), authorName, content, timestamp
  - `graph_configs` — id (UUID), projectId (FK), filterConfig (JSONB), sizingConfig (JSONB), graphTheoryConfig (JSONB), timestamp
- **Migrations**: Managed via `drizzle-kit` with `drizzle.config.ts`, using `npm run db:push` to push schema changes
- **Connection**: PostgreSQL via `pg.Pool` in `server/db.ts`, requires `DATABASE_URL` environment variable

### Build & Deployment
- **Development**: `npm run dev` starts the Express server with Vite middleware for HMR
- **Production Build**: `npm run build` runs Vite build for client and esbuild for server, outputting to `dist/`
- **Server Build**: `script/build.ts` bundles server with esbuild, externalizing most deps except an allowlist for faster cold starts
- **Static Serving**: Production serves from `dist/public/` with SPA fallback to `index.html`
- **Deploy Script**: `npm run deploy` builds and deploys to GitHub Pages

### Key Design Decisions

1. **Shared Schema Pattern**: The `shared/` directory contains schema definitions used by both frontend (for types) and backend (for database operations), ensuring type safety across the stack.

2. **Hash-based Routing**: Uses `wouter/use-hash-location` for client-side routing, which works well with static deployments (GitHub Pages) and iframe environments.

3. **Storage Interface Abstraction**: The `IStorage` interface in `server/storage.ts` abstracts database operations, making it possible to swap implementations if needed.

4. **Mock Data Alongside Real API**: The frontend has extensive mock data (`client/src/lib/mockData.ts` and inline in components) for UI development, while also connecting to real API endpoints via React Query.

5. **Generated/Stock Images**: The app uses pre-generated images stored in `attached_assets/` (aliased as `@assets/`) for the landing page, graph nodes, and UI elements — these are bundled by Vite.

## External Dependencies

### Database
- **PostgreSQL** — Primary database, connected via `DATABASE_URL` environment variable. Uses `pg` driver with `connect-pg-simple` for session storage capability.

### Key NPM Packages
- **@xyflow/react** — Interactive graph/flow visualization (core feature)
- **@tanstack/react-query** — Server state management and API data fetching
- **drizzle-orm** + **drizzle-zod** — Type-safe ORM with Zod schema validation
- **express** + **express-session** — HTTP server and session management
- **framer-motion** — Animation and drag-and-drop interactions
- **recharts** — Data charting/visualization
- **wouter** — Lightweight client-side routing
- **shadcn/ui ecosystem** — Radix UI primitives, class-variance-authority, clsx, tailwind-merge
- **date-fns** — Date formatting utilities
- **zod** — Runtime schema validation

### Potential Integrations (referenced in code/dependencies)
- **OpenAI / Google Generative AI** — AI copilot features (packages in dependencies)
- **Stripe** — Billing/payments (package in dependencies)
- **Nodemailer** — Email sending capability
- **Passport / passport-local** — Authentication framework
- **Multer** — File upload handling
- **XLSX** — Spreadsheet parsing for data import