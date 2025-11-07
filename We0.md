# We0.md

This file provides guidance to We0 (we0.ai) when working with code in this repository.

## Project Overview

This is a Next.js 15 application called "registration-system" that serves as a content management platform for blogs and shops. It's built with modern React patterns using the App Router, TypeScript, and includes authentication, database integration, and an admin interface.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start

# Lint and fix code
npm run lint

# Format code
npm run format
```

## Environment Setup

Copy `env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_BASE_URL` - Your app's base URL
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret for Better Auth
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - For Google OAuth (optional)
- `RESEND_FROM_EMAIL` & `RESEND_API_KEY` - For email OTP functionality

## Database Management

The project uses Drizzle ORM with PostgreSQL:

```bash
# Generate migrations
npx drizzle-kit generate

# Push schema changes to database
npx drizzle-kit push

# Open Drizzle Studio for database management
npx drizzle-kit studio
```

Migration files are stored in the `drizzle/` directory.

## Architecture Overview

### Authentication System
- Uses Better Auth with email OTP and Google OAuth support
- Session management with cookie caching (5-minute cache)
- Client and server-side auth utilities in `src/lib/auth/`
- Trusted origins configured for development and production domains

### Database Schema
- **Blogs**: Title, slug, content, excerpt, author, tags, cover image
- **Shops**: Name, image, price, description
- **Auth tables**: Managed automatically by Better Auth adapter

### API Structure
- RESTful APIs in `src/app/api/`
- Blog management: GET (with search/filtering), POST, PUT, DELETE
- Shop management: Similar CRUD operations
- All API routes include proper error handling and Zod validation

### Frontend Architecture
- **App Router**: Next.js 15 with React 19
- **State Management**: TanStack Query for server state
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom component variants
- **Forms**: React Hook Form with Zod validation

### Admin Interface
- Protected admin routes for content management
- Blog creation, editing, and deletion
- Shop management with image uploads
- Sidebar navigation with responsive design

### Component Structure
- `components/admin/` - Admin-specific components
- `components/ui/` - Reusable UI components (excluded from linting)
- `components/sign-in/` - Authentication components
- Custom hooks in `src/hooks/` for data fetching

### Email System
- React Email components for OTP verification
- Resend integration for email delivery
- Customizable email templates

## Code Quality

- **Linting**: Biome with custom rules and formatting
- **TypeScript**: Strict configuration with proper typing
- **Code Organization**: Feature-based structure with clear separation of concerns

## Key Dependencies

- **Framework**: Next.js 15 with Turbopack
- **Database**: Drizzle ORM + PostgreSQL
- **Authentication**: Better Auth
- **UI**: Radix UI + Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Email**: React Email + Resend
- **State**: TanStack Query

The project follows modern React patterns with TypeScript, proper error boundaries, and comprehensive type safety throughout the application.