# Replit Project Documentation

## Overview

This is a full-stack dealership management application built with React (frontend) and Express.js (backend). The application allows dealerships to manage their vehicle inventory, track expenses, and analyze performance metrics. It features a modern UI built with shadcn/ui components and integrates with Replit's authentication system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with proper error handling

## Key Components

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Centralized schema definitions in `shared/schema.ts`
- **Tables**: 
  - `users` - User profiles (required for Replit Auth)
  - `sessions` - Session storage (required for Replit Auth)
  - `vehicles` - Vehicle inventory
  - `vehicleExpenses` - Vehicle-related expenses

### Authentication System
- **Provider**: Custom email/password authentication
- **Strategy**: Passport.js Local Strategy with secure password hashing
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Protection**: Route-level authentication middleware
- **Security**: Crypto-based password hashing with salt

### Frontend Pages
- **Landing**: Marketing page for unauthenticated users
- **Authentication**: Two-column layout with sign-in/sign-up forms and hero section
- **Home**: Dashboard overview with key metrics
- **Inventory**: Vehicle management with CRUD operations
- **Analytics**: Performance metrics and reporting
- **Dashboard**: Detailed statistics and insights

### API Endpoints
- `/api/register` - User registration
- `/api/login` - User login
- `/api/logout` - User logout
- `/api/user` - Get current user data
- `/api/vehicles/*` - Vehicle CRUD operations
- `/api/analytics/*` - Performance metrics and statistics

## Data Flow

1. **Authentication Flow**: Users register/login with email/password, sessions are stored in PostgreSQL
2. **Data Fetching**: React Query handles API calls with caching and error handling
3. **Form Submission**: React Hook Form with Zod validation, data sent to Express endpoints
4. **Database Operations**: Drizzle ORM performs type-safe database operations
5. **Real-time Updates**: React Query invalidates and refetches data after mutations

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **passport**: Authentication middleware

### Development Tools
- **Vite**: Frontend build tool with HMR
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Backend bundling for production

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution with hot reload
- **Database**: Neon serverless PostgreSQL

### Production Build
- **Frontend**: Static assets built with Vite, served from Express
- **Backend**: Bundled with ESBuild for optimized Node.js execution
- **Database**: Migrations managed with Drizzle Kit

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key (auto-generated for development)

The application follows a monorepo structure with shared TypeScript types between frontend and backend, ensuring type safety across the entire stack. The authentication system uses custom email/password authentication with secure password hashing and PostgreSQL session storage.

## Recent Changes

**July 11, 2025**
- ✓ Replaced Replit Auth with custom email/password authentication
- ✓ Implemented secure password hashing with crypto module
- ✓ Created two-column authentication page with sign-in/sign-up forms
- ✓ Updated database schema with proper integer types for user IDs
- ✓ Fixed session index conflicts and PostgreSQL integration
- ✓ Maintained seamless integration with existing vehicle management features