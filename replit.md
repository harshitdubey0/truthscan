# Fake News Detector

## Overview

This is a full-stack fake news detection application that analyzes article text using machine learning models to determine credibility. The system uses an ensemble of four ML algorithms (Logistic Regression, Decision Tree, Gradient Boosting, Random Forest) to provide accurate predictions with confidence scores. The application features a React-based frontend with a sophisticated news-themed UI, an Express backend API, and an optional Python Flask ML service that can be used for enhanced analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS v4 for styling

**State Management**: TanStack Query (React Query) for server state management

**Routing**: Wouter for lightweight client-side routing

**Design System**:
- Custom color scheme with fresh green/red theme for credibility visualization
- Typography combines Inter (UI) and Merriweather (headings) for journalistic feel
- Responsive design with mobile-first approach
- Framer Motion for animations and transitions

**Key Components**:
- `NewsAnalyzer`: Main analysis interface with textarea input and results display
- `ModelsDialog`: Educational modal explaining the four ML models used
- Chart visualizations using Recharts for displaying statistics

### Backend Architecture

**Runtime**: Node.js with Express.js framework

**API Design**: RESTful endpoints with JSON responses

**Development Setup**: 
- Vite dev server with HMR for development
- TSX for TypeScript execution
- esbuild for production builds with selective bundling

**Key Endpoints**:
- `POST /api/analyze`: Analyzes article text and returns verdict with confidence scores
- `GET /api/ml/status`: Checks availability of Python ML service
- `GET /api/stats`: Returns aggregate statistics (total scans, fake/real counts)

**Analysis Strategy**: The system attempts to use the Python ML service first, then falls back to a JavaScript-based heuristic analyzer if the Python service is unavailable. This provides resilience and ensures the application always functions.

**Storage**: In-memory storage using a Map-based implementation (`MemStorage`) for analysis history. The schema is defined for PostgreSQL but the application currently uses memory storage, making it suitable for stateless deployment while maintaining the option to add database persistence later.

### Machine Learning Service

**Architecture**: Separate Python Flask service (`ml_service/app.py`) that can run independently

**Models**: Ensemble of four scikit-learn classifiers:
- Logistic Regression (linear baseline)
- Decision Tree (rule-based patterns)
- Gradient Boosting (weighted ensemble)
- Random Forest (bagging ensemble)

**Text Processing**: TF-IDF vectorization with preprocessing pipeline (lowercasing, punctuation removal, URL removal, stopword filtering)

**Training Data**: Expects `Fake.csv` and `True.csv` files in the ml_service directory

**Fallback Mechanism**: If Python service is unavailable, a JavaScript-based analyzer (`server/ml-analyzer.ts`) provides heuristic analysis using keyword matching and scoring algorithms

### Data Schema

**Database ORM**: Drizzle ORM configured for PostgreSQL

**Schema Definition** (`shared/schema.ts`):
- `analysis_history` table with fields: id, articleText, verdict, confidence, modelPredictions (JSON), createdAt
- Zod schemas for request/response validation

**Current Implementation**: Uses in-memory storage but maintains database-ready schema for future migration

### Build and Deployment

**Build Process** (`script/build.ts`):
- Client: Vite builds React application to `dist/public`
- Server: esbuild bundles server code to `dist/index.cjs`
- Selective bundling: Core dependencies are bundled, others externalized for faster cold starts

**Environment Variables**:
- `DATABASE_URL`: PostgreSQL connection string (optional, for future DB integration)
- `ML_SERVICE_URL`: Python Flask service URL (defaults to `http://localhost:5001`)
- `NODE_ENV`: Environment flag (development/production)

**Development Workflow**:
- `npm run dev`: Starts Express server with Vite middleware for HMR
- `npm run dev:client`: Standalone Vite dev server
- `npm run build`: Production build
- `npm run start`: Production server

### Cross-Cutting Concerns

**Type Safety**: Shared TypeScript types between client and server via `shared/` directory

**Error Handling**: Graceful degradation with fallback mechanisms for ML service unavailability

**Logging**: Custom logging utility with timestamp formatting

**Meta Tags**: Custom Vite plugin for updating OpenGraph images with Replit deployment URLs

**Validation**: Zod schemas for runtime type validation on API boundaries

**UI Theming**: CSS custom properties with light/dark mode support, though currently configured for light mode