# Lightning Rock Paper Scissors Application

## Overview

This is a modern React web application featuring a neo-brutalist, pixelated Rock Paper Scissors game with Bitcoin Lightning Network integration. Players can connect their Alby wallets via NWC (Nostr Wallet Connect), stake sats, and battle opponents in real-time. The application uses a client-server architecture with React frontend and Express backend, styled with a neo-brutalist design aesthetic and Press Start 2P pixelated fonts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using functional components and hooks
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React hooks for local state, TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Component Structure**: Modular component-based architecture with ui components in separate directory

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM (DatabaseStorage implementation)
- **Session Management**: Built-in session handling with connect-pg-simple
- **Development**: Hot reload with tsx for development server

### YakiHonne Integration
- **SDK**: YakiHonne Smart Widget Handler integrated for Nostr compatibility
- **Authentication**: YakiHonne context provider manages user authentication
- **Nostr Publishing**: Game results automatically published to Nostr network
- **Widget Communication**: Secure parent-child iframe communication via YakiHonne SDK

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: Neon Database serverless connection
- **Schema**: Located in `/shared/schema.ts` for shared types between client and server
- **Migration**: Drizzle Kit for database migrations
- **Tables**: users, game_records, user_stats with proper relations
- **Storage**: DatabaseStorage class implements IStorage interface

## Key Components

### Core Game Component
- **RockPaperScissors**: Main game component with neo-brutalist design
- **Features**: Real-time multiplayer, Bitcoin Lightning integration, YakiHonne Nostr integration
- **Design**: Pixelated graphics, brutal shadows, Press Start 2P font, retro gaming aesthetic
- **Gameplay**: Stake sats, battle opponents, win/lose/draw mechanics
- **Social**: Game results published to Nostr network via YakiHonne

### UI Components
- **Neo-Brutalist Design**: Heavy borders, bold shadows, pixelated aesthetics
- **Press Start 2P Font**: Retro gaming typography throughout
- **Custom CSS Classes**: brutalist-card, brutalist-button, pixel-emoji, glitch-text
- **Color Palette**: Bitcoin orange, neon colors, high contrast black/white

### Server Components
- **Express Server**: RESTful API with middleware for logging and error handling
- **Storage Interface**: Abstracted storage layer with in-memory fallback
- **Route Registration**: Modular route system for API endpoints

## Data Flow

1. **Client Initialization**: React app loads and initializes widget components
2. **Game Timer**: Widget aligns with minute boundaries and starts countdown
3. **User Interaction**: Players make guesses through UI interactions
4. **State Persistence**: Game data saved to localStorage for persistence
5. **Server Communication**: API calls handle leaderboards, statistics, and game records
6. **Database Operations**: DatabaseStorage with Drizzle ORM handles all database interactions
7. **Leaderboard Display**: Real-time leaderboard shows top players and global statistics

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **UI Libraries**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **State Management**: TanStack Query for server state
- **YakiHonne**: smart-widget-handler for Nostr integration
- **Utilities**: date-fns for date manipulation, clsx for conditional classes

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM, @neondatabase/serverless, connect-pg-simple
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build**: Vite with React plugin and development overlays
- **TypeScript**: Strict configuration with path mapping
- **CSS**: PostCSS with Tailwind and Autoprefixer

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `/dist/public`
2. **Backend Build**: esbuild bundles server code to `/dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: `NODE_ENV=development` with hot reload
- **Production**: `NODE_ENV=production` with optimized builds
- **Database**: `DATABASE_URL` required for PostgreSQL connection

### File Structure
- **Client**: All frontend code in `/client` directory
- **Server**: Backend code in `/server` directory  
- **Shared**: Common types and schemas in `/shared` directory
- **Build Output**: Compiled assets in `/dist` directory

### Scalability Considerations
- **Database**: PostgreSQL with connection pooling via Neon
- **Session Storage**: PostgreSQL-backed sessions for horizontal scaling
- **Static Assets**: Vite-optimized builds for CDN deployment
- **API Design**: RESTful structure ready for microservices migration

## Documentation
- **README.md**: Comprehensive project overview and quick start guide
- **API.md**: Complete API endpoint documentation with examples
- **DEVELOPMENT.md**: Local development setup and coding standards
- **DEPLOYMENT.md**: Production deployment guide for various platforms
- **CONTRIBUTING.md**: Guidelines for contributing to the project
- **.env.example**: Environment variable template for easy setup