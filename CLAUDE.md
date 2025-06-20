# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `yarn dev` - Start development server on http://localhost:3000
- `yarn build` - Build production bundle
- `yarn start` - Start production server
- `yarn lint` - Run Next.js linting (note: no ESLint config file exists)

### Docker
- `docker build -t bud-serve-dashboard .` - Build Docker image
- `docker run -p 3000:3000 --env-file .env bud-serve-dashboard` - Run container with environment variables

## Architecture Overview

This is a Next.js 14 dashboard application for managing AI/ML model deployments and infrastructure.

### Key Technologies
- **Framework**: Next.js 14 with React 18 and TypeScript
- **State Management**: Zustand stores in `/src/stores/`
- **Styling**: Tailwind CSS + Ant Design + Radix UI components
- **API Client**: Custom axios wrapper in `/src/pages/api/requests.ts`

### Directory Structure
- `/src/components/` - Reusable UI components (auth, charts, popups, ui)
- `/src/flows/` - Complex multi-step workflows (AddModel, Benchmark, Cluster, DeployModel, Project)
- `/src/pages/` - Next.js pages and API routes
- `/src/stores/` - Zustand state management
- `/src/hooks/` - Custom React hooks
- `/src/utils/` - Utility functions

### API Architecture
The application uses a centralized API client (`AppRequest`) with:
- Automatic token refresh on 401 responses
- Network connectivity monitoring
- Bearer token authentication from localStorage
- Base URL configured via `NEXT_PUBLIC_BASE_URL` environment variable

Key API patterns:
```typescript
// GET request
await AppRequest.Get(`/endpoint`, { params: { key: value } })

// POST request
await AppRequest.Post(`/endpoint`, payload)
```

### Authentication Flow
1. Tokens stored in localStorage as `access_token` and `refresh_token`
2. Automatic token refresh with request queuing
3. Redirects to `/auth/login` on authentication failure
4. Role-based access control managed in `useUser` store

### State Management Patterns
Zustand stores follow this pattern:
- Async actions for API calls
- Loading states (`isLoading`, `loadingCount`)
- Error handling with toast notifications
- Complex workflows split into steps

Example store usage:
```typescript
const { user, getUser, isLoading } = useUser();
const { deploymentData, setStep, currentStep } = useDeployModel();
```

### Environment Variables
Critical environment variables that must be set:
- `NEXT_PUBLIC_BASE_URL` - Main API endpoint
- `NEXT_PUBLIC_VERCEL_ENV` - Environment setting
- `NEXT_PUBLIC_PASSWORD` - Authentication password
- `NEXT_PUBLIC_PRIVATE_KEY` - Encryption key
- `NEXT_PUBLIC_PLAYGROUND_URL` - Playground URL
- Various `NEXT_PUBLIC_NOVU_*` for notifications

### TypeScript Path Aliases
The project uses these path aliases configured in tsconfig.json:
- `@/*` maps to `/src/*`

### Key Features
1. **Model Management** - Deploy, evaluate, and manage AI models
2. **Cluster Management** - Manage cloud and local compute clusters
3. **Benchmarking** - Performance testing and leaderboards
4. **Project Organization** - Resource organization by projects
5. **Real-time Updates** - Socket.io integration for live updates

### Development Notes
- No test suite exists - consider API response structures when making changes
- No ESLint configuration file - rely on Next.js default linting
- Complex workflows in `/src/flows/` have multiple interdependent steps
- API error responses show toast notifications via `handleErrorResponse`
- File uploads use FormData with automatic content-type switching