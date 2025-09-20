# Purpose App - Discover What Resonates

## Overview

Purpose is a self-discovery application that helps users identify their personal values and goals through an intuitive card-swiping experience. Inspired by Tinder's engaging swipe mechanics and Headspace's calming aesthetic, the app presents purpose cards covering different life categories (family, adventure, wealth, growth, service, creativity) that users can swipe left (not for me) or right (resonates with me). The app tracks user preferences across sessions and provides insights into their top resonating purposes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens for brand colors (soft teal, peach, coral)
- **Animations**: React Spring for card animations and @use-gesture/react for gesture handling
- **State Management**: TanStack Query for server state management with local component state

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API with endpoints for cards, sessions, and swipes
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Anonymous sessions using browser-generated UUIDs stored in localStorage

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless configuration
- **Schema Design**: Four main tables - users (optional), purpose_cards, sessions, and swipes
- **Data Persistence**: Cards are seeded on server startup; user sessions and swipe data persist across app uses

### Card Swiping System
- **Gesture Recognition**: Uses @use-gesture/react for touch and mouse drag interactions
- **Animation System**: React Spring for smooth card transitions, scaling, and rotation effects
- **Stack Management**: Cards positioned with perspective effects and z-index stacking
- **Threshold Detection**: Configurable swipe distance thresholds determine left/right actions

### Results Analysis
- **Aggregation Logic**: Groups swipe results by card category and counts positive selections
- **Ranking System**: Displays top 3 resonating categories with selection counts
- **Session Tracking**: Maintains session history for returning users with dedicated history view

## Recent Changes (December 20, 2024)

### Database Integration
- **Schema**: Created complete PostgreSQL schema with purpose_cards, sessions, and swipes tables
- **API Endpoints**: Implemented full REST API for session management, swipe tracking, and results
- **Data Seeding**: Automatic purpose card seeding on server startup with idempotent design

### Session Management
- **Anonymous Tracking**: Uses localStorage UUID for anonymous user session continuity
- **Session Lifecycle**: Create session → record swipes → complete session → display results
- **Error Handling**: Added graceful fallbacks for API failures with local data backup

### Session History Feature
- **History View**: Users can view past completed sessions and their purpose discoveries
- **Results Tracking**: Shows evolution of user preferences over time
- **UI Components**: Clean history modal with session details and top categories

## External Dependencies

### UI and Animation Libraries
- **@radix-ui/react-***: Accessible component primitives for dialogs, buttons, cards
- **@react-spring/web**: Physics-based animations for card interactions
- **@use-gesture/react**: Touch and mouse gesture recognition
- **class-variance-authority**: Component variant styling system
- **tailwindcss**: Utility-first CSS framework

### Data Management
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe PostgreSQL ORM
- **@neondatabase/serverless**: Serverless PostgreSQL database client
- **zod**: Schema validation for API requests and responses

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **drizzle-kit**: Database migration and schema management tools

### Font Integration
- **Google Fonts**: Poppins (headings) and Inter (body text) for typography hierarchy

The application now provides full data persistence, session tracking, and user history while maintaining the beautiful swipe-based interface for discovering personal purpose and values.