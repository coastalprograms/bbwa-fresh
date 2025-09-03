# Tech Stack

This document defines the approved technology stack for BBWA SWMS Management System development.

## Core Technologies

### Frontend Stack
- **Framework**: Next.js 14+ App Router
- **Language**: TypeScript (strict mode)
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with existing design tokens
- **State Management**: React Server Components (default) + Client Components when necessary
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React (via Shadcn/ui)

### Backend Stack
- **Database**: Supabase PostgreSQL 17.4 (Australia East)
- **Authentication**: Supabase Auth with JWT tokens
- **API**: Next.js API Routes + Server Actions
- **File Storage**: Supabase Storage with signed URLs
- **Edge Functions**: Supabase Edge Functions (Deno runtime)
- **Email**: SMTP via Edge Functions

### Infrastructure
- **Hosting**: Netlify (frontend) + Supabase Cloud (backend)
- **CDN**: Netlify Edge Network
- **Domain**: baysidebuilderswa.com.au
- **SSL/TLS**: Automatic via Netlify + Supabase
- **Monitoring**: Supabase Analytics + Netlify Analytics

### External Integrations
- **Business Data**: Airtable API
- **Maps**: Google Maps API
- **Government**: Work Safe WA API (compliance export)

## Development Tools

### Build Tools
- **Package Manager**: npm
- **Build System**: Next.js built-in build system
- **TypeScript Compiler**: Built into Next.js
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier
- **Testing**: Jest + React Testing Library

### Version Control
- **Repository**: Git
- **Hosting**: GitHub
- **Deployment**: Netlify (automatic from main branch)

## Database Architecture

### Current Tables
- `job_sites` - Construction site locations and status
- `workers` - Employee records and certifications
- `certifications` - Safety compliance tracking
- `projects` - Marketing portfolio items
- `contact_forms` - Lead generation data

### SWMS Enhancement Tables
- `contractors` - Company records (CR2 requirement)
- `swms_jobs` - SWMS assignments per job site
- `swms_submissions` - Contractor document submissions

### Security
- **Row Level Security (RLS)**: All tables protected
- **Authentication**: Supabase Auth JWT validation
- **Authorization**: Role-based access (admin/worker/public)

## API Patterns

### Existing Endpoints
- `/api/admin/job-sites/*` - Site management
- `/api/admin/workers/*` - Worker records
- `/api/admin/settings/*` - System configuration
- `/api/csrf` - CSRF protection
- `/api/analytics/*` - Usage tracking

### SWMS Integration
- Extend existing `/api/admin/job-sites/` endpoints
- Add SWMS-specific routes following REST patterns
- Maintain backward compatibility

## Deployment Configuration

### Environment Variables Required
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Provider
AI_PROVIDER=gemini
GEMINI_API_KEY=

# External APIs
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
```

### Build Commands
- **Development**: `npm run dev`
- **Production Build**: `npm run build`
- **Type Checking**: `npm run typecheck`
- **Linting**: `npm run lint`
- **Testing**: `npm test`

## Performance Requirements

### Frontend Performance
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

### Backend Performance
- Database queries: < 200ms additional overhead
- API responses: < 500ms
- File uploads: Support up to 10MB documents
- Email delivery: < 30s processing time

## Security Standards

### Authentication Flow
1. Supabase Auth for admin users
2. Magic link tokens for contractor portals
3. QR code tokens for worker check-in

### Data Protection
- All data encrypted at rest (Supabase managed)
- TLS 1.3 for data in transit
- Signed URLs for file access
- Token expiration for public portals

### Compliance
- Row Level Security on all tables
- Audit trails for all data changes
- Work Safe WA reporting compliance
- Australian data sovereignty (Supabase AU East)