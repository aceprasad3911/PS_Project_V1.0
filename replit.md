# Sapient Slingshot AI Platform

## Overview

Sapient Slingshot is a comprehensive AI-powered development platform designed to accelerate software development workflows. The application combines modern web technologies with AI capabilities to provide code generation, project management, and intelligent agent orchestration for enterprise-scale development teams.

## Recent Changes (January 2025)

### Windows Development Setup
- ✓ Added cross-env and dotenv for Windows compatibility
- ✓ Created Windows batch scripts (dev.bat, setup.bat) for easy development
- ✓ Fixed environment variable handling for Windows Command Prompt
- ✓ Added comprehensive README with Windows-specific setup instructions
- ✓ Created .env.example for environment configuration template

### UI Implementation Status
- ✓ Complete React frontend with Publicis Sapient branding (red/black theme)
- ✓ Landing page with Slingshot AI features showcase
- ✓ Dashboard with project management and AI agent status
- ✓ Real-time chat interface with WebSocket integration
- ✓ Responsive sidebar navigation with user profile display
- ✓ Database-backed authentication with Replit OAuth

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Session Store**: PostgreSQL-backed session storage using connect-pg-simple
- **Migration System**: Drizzle Kit for database schema migrations

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect integration
- **Session Management**: Server-side sessions stored in PostgreSQL
- **User Management**: Automatic user creation and profile synchronization
- **Security**: HTTP-only cookies with secure session handling

### Database Schema
- **Users**: Core user profiles with Replit integration
- **Projects**: Development project management with status tracking
- **Messages**: Chat system for AI assistant interactions
- **AI Agents**: Configurable AI agent definitions and status
- **Sessions**: Secure session storage for authentication

### API Structure
- **Authentication Routes**: `/api/auth/*` for user management
- **Project Routes**: `/api/projects/*` for project CRUD operations
- **Message Routes**: `/api/messages/*` for chat functionality
- **AI Agent Routes**: `/api/ai-agents/*` for agent management
- **WebSocket Support**: Real-time messaging capabilities

### Frontend Components
- **Layout System**: Sidebar navigation with responsive design
- **Dashboard**: Project overview with statistics and quick actions
- **Chat Interface**: Real-time AI assistant with message history
- **Project Management**: CRUD operations for development projects
- **AI Agent Dashboard**: Status monitoring and configuration

## Data Flow

### Authentication Flow
1. User initiates login through Replit Auth
2. OpenID Connect handles authentication
3. User profile is created/updated in PostgreSQL
4. Session is established with secure cookies
5. Frontend receives user context via `/api/auth/user`

### Chat System Flow
1. User sends message through chat interface
2. Message is stored in PostgreSQL via `/api/messages`
3. AI response is simulated (placeholder for actual AI integration)
4. WebSocket connection provides real-time message updates
5. Chat history is maintained per user/project

### Project Management Flow
1. Projects are created and managed through `/api/projects`
2. Project data includes metadata, status, and progress tracking
3. AI agents can be associated with specific projects
4. Dashboard provides overview of all user projects

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **express**: Web server framework
- **@tanstack/react-query**: Server state management
- **wouter**: Client-side routing

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe styling variants

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database migration management
- **esbuild**: Server-side bundling

## Deployment Strategy

### Development Environment
- **Server**: Node.js with tsx for TypeScript execution
- **Client**: Vite development server with HMR
- **Database**: Neon Database with environment-based configuration
- **Session Secret**: Environment variable for session encryption

### Production Build
- **Client Build**: Vite builds to `dist/public` directory
- **Server Build**: esbuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built client files
- **Environment**: Production mode with optimized builds

### Database Management
- **Schema**: Centralized in `shared/schema.ts` for type safety
- **Migrations**: Drizzle Kit handles schema migrations
- **Connection**: Neon Database with connection pooling
- **Environment**: DATABASE_URL environment variable required

### Replit Integration
- **Authentication**: Seamless integration with Replit identity
- **Development**: Optimized for Replit development environment
- **Deployment**: Configured for Replit hosting platform
- **Error Handling**: Replit-specific error overlay in development

The architecture prioritizes type safety, modern development practices, and scalability while maintaining simplicity for rapid development and deployment on the Replit platform.