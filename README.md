# Bayside Builders WA - Construction Compliance Platform

A comprehensive construction compliance and marketing platform that combines a professional public website with sophisticated worker safety compliance and site management systems. This real-world application addresses critical Australian regulatory requirements for construction site worker qualification tracking, preventing $50,000 fines per violation.

## 🏗️ Project Overview

**Bayside Builders WA** is a mission-critical platform that ensures construction site safety compliance while providing a powerful marketing presence. The system automatically tracks worker certifications, manages site check-ins via QR codes, and provides real-time compliance monitoring to prevent costly regulatory violations.

### Key Features

- **Worker Compliance System**: Multi-step induction process with automated certification tracking
- **QR Code Check-In**: Geolocation-verified worker site access with real-time compliance validation  
- **White Card Management**: OCR processing for automatic certification verification
- **Builder Dashboard**: Comprehensive admin interface with KPI monitoring and worker management
- **Automated Alerts**: 30-day expiry reminders and immediate compliance violation notifications
- **Public Website**: Dynamic project portfolio with service area mapping and contact management

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Supabase account with project setup
- Google Maps API key
- Airtable account (optional)

### Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd bbwa
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Copy environment template
   cp apps/web/.env.example apps/web/.env.local
   
   # Fill in your configuration values
   # See .env.example for all required variables
   ```

3. **Database Setup**
   ```bash
   # Run Supabase migrations
   npx supabase migration up
   
   # Generate TypeScript types
   npx supabase gen types typescript --project-id <project-id> > apps/web/src/types/supabase.generated.ts
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at:
   - **Frontend**: http://localhost:3000
   - **Admin Dashboard**: http://localhost:3000/admin
   - **Worker Induction**: http://localhost:3000/induction
   - **QR Check-in**: http://localhost:3000/check-in

## 🏛️ Architecture Overview

### Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript (strict mode)
- **UI Framework**: Shadcn/ui components, Radix UI primitives, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Forms**: React Hook Form + Zod validation
- **Build System**: Turborepo with intelligent caching
- **Deployment**: Netlify with edge function support

### Monorepo Structure

```
bbwa/                           # Turborepo root
├── apps/web/                   # Next.js application
│   └── src/
│       ├── app/               # App Router pages
│       │   ├── (marketing)/   # Public website routes
│       │   ├── (auth)/        # Authentication flows
│       │   ├── admin/         # Builder dashboard
│       │   ├── check-in/      # QR code check-in system
│       │   ├── induction/     # Worker induction process
│       │   └── api/           # API routes & server actions
│       ├── components/        # Reusable React components
│       │   ├── ui/           # Shadcn/ui base components
│       │   └── forms/        # Form-specific components
│       ├── lib/              # Utilities and configurations
│       │   └── supabase/     # Supabase client instances
│       ├── types/            # TypeScript type definitions
│       └── actions/          # Server actions for data mutations
├── supabase/                  # Backend infrastructure
│   ├── migrations/           # Database schema migrations
│   └── functions/            # Edge Functions
├── scripts/                   # Development and build scripts
└── docs/                     # Documentation and specifications
```

### Critical Workflows

1. **Worker Induction Process**
   - Multi-step form validation with Zod schemas
   - White Card OCR processing via Edge Functions
   - Automated compliance status calculation
   - Certificate expiry tracking and notifications

2. **Site Check-In System**
   - QR code generation per project/site
   - Geolocation verification for site access
   - Real-time compliance validation
   - Automatic violation alerts to builders

3. **Admin Dashboard Operations**
   - Worker certification management with manual overrides
   - Project portfolio management with AI-assisted content
   - Real-time KPI monitoring and compliance reporting
   - Automated notification system management

## 🔧 Development Commands

### Core Commands
```bash
# Development
npm run dev              # Start development server with hot reload
npm run dev:fast         # Start with turbo cache optimization

# Building
npm run build            # Production build with optimization
npm run build:prod       # Strict production build
npm run build:analyze    # Build with bundle analysis

# Quality Assurance  
npm run lint             # ESLint code quality check
npm run lint:fix         # Auto-fix linting issues
npm run format           # Prettier code formatting
npm run format:check     # Check code formatting
npm run typecheck        # TypeScript type validation
npm run test             # Jest test suite
npm run test:watch       # Watch mode for continuous testing
npm run test:coverage    # Generate coverage reports

# Environment Management
npm run env:validate     # Validate environment variables
npm run env:setup        # Interactive environment setup
npm run setup            # Full development environment setup

# Maintenance
npm run clean            # Clean all build artifacts and dependencies
npm run clean:cache      # Clear Turborepo cache only
npm run ci:validate      # Full CI validation pipeline
```

### Database Operations
```bash
# Create new migration
npx supabase migration new <migration_name>

# Apply migrations
npx supabase migration up

# Generate TypeScript types from schema
npx supabase gen types typescript --project-id <project-id> > apps/web/src/types/supabase.generated.ts

# Reset local database (development only)
npx supabase db reset
```

## 🔐 Environment Variables

Copy `apps/web/.env.example` to `apps/web/.env.local` and configure:

### Required Configuration
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Provider (gemini or openai)
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_key

# Google Maps Integration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key

# Session Management
SESSION_SECRET=your_session_secret
```

### Optional Configuration
```bash
# Airtable Integration (for contact forms and FAQ)
AIRTABLE_API_KEY=your_airtable_key
AIRTABLE_BASE_ID=your_base_id

# FAQ Source Configuration
FAQ_SOURCE=local # or 'airtable'
FAQ_LIMIT=10
```

## 🧪 Testing Strategy

The platform includes comprehensive testing across multiple levels:

### Test Types
- **Unit Tests**: Component testing with Jest + React Testing Library
- **Integration Tests**: API route testing with mocked Supabase
- **E2E Critical Paths**: Worker induction flow, QR check-in system, admin operations

### Running Tests
```bash
# Run all tests
npm run test

# Watch mode for active development
npm run test:watch

# Generate coverage reports
npm run test:coverage

# CI-optimized test run
npm run test:ci

# Test specific features
npm test -- --testPathPattern="admin/settings"
npm test -- --testPathPattern="check-in"
```

## 🚀 Deployment

### Netlify Deployment

The application is configured for seamless deployment on Netlify:

1. **Automatic Deployment**: Connected to main branch for continuous deployment
2. **Environment Variables**: Configure all required env vars in Netlify dashboard
3. **Build Configuration**: Handled automatically via `netlify.toml`
4. **Edge Functions**: Supabase Edge Functions deployed separately

### Manual Deployment Steps
```bash
# Build production bundle
npm run build:prod

# Validate build before deployment
npm run ci:validate

# Deploy Supabase Edge Functions
npx supabase functions deploy
```

## 📊 Key Performance Indicators

The platform tracks critical compliance and business metrics:

### Compliance Metrics
- **Worker Certification Status**: Real-time tracking of all worker qualifications
- **Site Check-In Compliance**: Percentage of compliant site access attempts
- **Certification Expiry Alerts**: Proactive 30-day expiry notifications
- **Violation Response Time**: Time from detection to builder notification

### Business Metrics
- **Project Portfolio Performance**: Lead generation from public website
- **Worker Induction Completion Rate**: Efficiency of onboarding process
- **Admin Dashboard Usage**: Builder engagement with management tools
- **System Uptime**: Platform availability and reliability

## 🔧 Development Best Practices

### Code Quality Standards
- **TypeScript**: Strict mode with explicit typing for all functions
- **Component Architecture**: Server Components by default, Client Components when necessary
- **Error Handling**: Comprehensive error boundaries and server action error handling
- **Security**: Row Level Security (RLS) on all Supabase tables, input validation on client and server

### Performance Optimization
- **Server Actions**: Efficient data mutations with proper error handling
- **Supabase Integration**: Optimized client patterns with connection pooling
- **Build Optimization**: Turborepo caching with bundle analysis
- **Accessibility**: WCAG 2.2 compliance with proper focus management

## 🆘 Troubleshooting

### Common Issues

**Environment Variables Not Loading**
```bash
# Validate environment configuration
npm run env:validate

# Interactive setup
npm run env:setup
```

**Build Failures**
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

**Database Connection Issues**
```bash
# Verify Supabase configuration
npx supabase status

# Reset local database
npx supabase db reset
```

**Type Generation Failures**
```bash
# Regenerate types from current schema
npx supabase gen types typescript --project-id <project-id> > apps/web/src/types/supabase.generated.ts
```

## 📝 Contributing

This is a production application for Bayside Builders WA. For development guidelines and contribution processes, see the technical documentation in the `docs/` directory.

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with comprehensive tests
3. Validate with `npm run ci:validate`
4. Submit pull request with detailed description
5. Deploy to staging for validation
6. Merge to main for production deployment

---

**Built for Australian Construction Compliance** 🇦🇺  
Preventing $50,000 regulatory fines through intelligent automation and real-time monitoring.