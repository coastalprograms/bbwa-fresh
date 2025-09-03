# Source Tree

This document defines the project structure and file organization for BBWA SWMS Management System development.

## Project Root Structure

```
bbwa/                              # Monorepo root
├── apps/web/                      # Next.js application
├── docs/                          # Documentation
│   ├── architecture/              # Architecture documentation
│   ├── prd/                       # Product Requirements (sharded)
│   ├── brief.md                   # Project brief
│   └── prd.md                     # Product Requirements (full)
├── supabase/                      # Backend infrastructure
│   ├── functions/                 # Edge Functions
│   ├── migrations/                # Database migrations
│   └── seed.sql                   # Database seeding
├── scripts/                       # Build and utility scripts
├── package.json                   # Root package configuration
└── turbo.json                     # Monorepo build configuration
```

## Next.js Application Structure (`apps/web/`)

### App Directory (`src/app/`)

```
src/app/
├── (auth)/                        # Authentication routes
│   └── login/                     # Login page and actions
├── (marketing)/                   # Public website routes
│   ├── about/                     # About page
│   ├── contact/                   # Contact form
│   ├── projects/                  # Portfolio pages
│   ├── services/                  # Service description pages
│   ├── layout.tsx                 # Marketing layout
│   └── page.tsx                   # Homepage
├── admin/                         # Protected admin routes
│   ├── _components/               # Admin-only components
│   ├── job-sites/                 # Job site management
│   │   ├── [id]/edit/            # Edit job site pages
│   │   ├── new/                   # Create job site
│   │   ├── JobSiteForm.tsx       # Job site form component
│   │   └── page.tsx              # Job sites list
│   ├── workers/                   # Worker management
│   │   ├── [id]/                 # Individual worker pages
│   │   └── page.tsx              # Workers list
│   ├── projects/                  # Portfolio management
│   ├── settings/                  # System settings
│   ├── actions.ts                # Admin server actions
│   ├── layout.tsx                # Admin layout with sidebar
│   └── page.tsx                  # Admin dashboard
├── check-in/                      # Worker check-in system
├── induction/                     # Worker induction process
├── portal/                        # General portal access
├── api/                          # API routes
│   ├── admin/                    # Protected admin APIs
│   ├── analytics/                # Usage tracking
│   ├── csrf/                     # CSRF protection
│   └── health/                   # Health checks
├── actions/                      # Global server actions
├── layout.tsx                    # Root layout
├── globals.css                   # Global styles
└── providers.tsx                 # App providers (Theme, etc.)
```

### Components Directory (`src/components/`)

```
src/components/
├── ui/                           # Shadcn/ui component library
│   ├── button.tsx               # Base button component
│   ├── card.tsx                 # Card layouts
│   ├── form.tsx                 # Form components
│   ├── input.tsx                # Form inputs
│   └── [other-ui-components]    # Additional UI primitives
├── admin/                       # Admin-specific components
│   ├── AppSidebar.tsx           # Main admin navigation
│   └── SimpleSidebar.tsx        # Simplified sidebar variant
├── forms/                       # Form components
│   └── ContactForm.tsx          # Contact form implementation
├── layout/                      # Layout components
│   ├── Header.tsx               # Site header
│   ├── Footer.tsx               # Site footer
│   └── navigation.tsx           # Navigation menus
├── projects/                    # Portfolio components
├── services/                    # Service page components
├── testimonials/                # Customer testimonials
├── whimsy/                      # Delightful UI enhancements
└── accessibility/               # Accessibility testing tools
```

### Library Directory (`src/lib/`)

```
src/lib/
├── supabase/                    # Supabase client configurations
│   ├── client.ts               # Client-side Supabase client
│   ├── server.ts               # Server-side Supabase client
│   └── admin.ts                # Admin/service role client
├── utils.ts                     # Utility functions (cn, etc.)
├── alerts.ts                    # Alert/notification utilities
├── geo.ts                       # Geolocation utilities
├── animation-utils.ts           # Animation helpers
└── services-data.ts             # Static service data
```

### Types Directory (`src/types/`)

```
src/types/
├── supabase.generated.ts        # Generated Supabase types
├── supabase.ts                  # Custom Supabase type extensions
├── workers.ts                   # Worker-related types
├── projects.ts                  # Project-related types
├── compliance.ts                # Compliance-related types
├── dashboard.ts                 # Dashboard-specific types
└── jest.d.ts                    # Jest type declarations
```

## SWMS Integration Points

### New SWMS Routes (to be added)
```
src/app/admin/job-sites/[id]/
├── swms/                        # SWMS management for job site
│   ├── page.tsx                # SWMS overview/dashboard
│   ├── contractors/             # Contractor management
│   │   ├── page.tsx            # Contractor list
│   │   └── [contractorId]/     # Individual contractor
│   ├── submissions/             # Document submissions
│   │   ├── page.tsx            # Submissions list
│   │   └── [submissionId]/     # Individual submission
│   └── actions.ts              # SWMS-specific server actions
```

### New SWMS Components (to be added)
```
src/components/swms/             # SWMS-specific components
├── SwmsJobForm.tsx             # Create/edit SWMS job
├── ContractorForm.tsx          # Contractor information form
├── SubmissionTracker.tsx       # Track submission status
├── ComplianceExport.tsx        # Work Safe export functionality
└── EmailTemplateEditor.tsx     # Email template management
```

### New SWMS Types (to be added)
```
src/types/
├── swms.ts                     # SWMS-related type definitions
└── contractors.ts              # Contractor-related types
```

### Public SWMS Portal (to be added)
```
src/app/swms-portal/[token]/    # Contractor submission portal
├── page.tsx                    # Main submission interface
├── upload/                     # Document upload pages
├── confirmation/               # Submission confirmation
└── actions.ts                  # Portal-specific actions
```

## Supabase Backend Structure

### Edge Functions (`supabase/functions/`)

```
supabase/functions/
├── _shared/                     # Shared utilities
│   ├── cors.ts                 # CORS handling
│   └── compliance-types.ts     # Shared types
├── airtable-contact-forward/    # Contact form → Airtable
├── airtable-faq/               # FAQ management
├── expiry-reminders/           # Certification expiry alerts
├── notify-builder/             # Builder notifications
├── notify-compliance-alert/    # Compliance alerts
└── process-white-card/         # White card OCR processing
```

### New SWMS Edge Functions (to be added)
```
supabase/functions/
├── swms-email-automation/      # SWMS email campaigns
├── swms-reminder-scheduler/    # Automated reminders
├── work-safe-export/           # Government compliance export
└── swms-document-processor/    # Document validation
```

### Database Migrations (`supabase/migrations/`)

Current migrations handle:
- Initial schema setup
- Worker and certification management  
- Job sites and compliance tracking
- Contact forms and lead generation
- Project portfolio management

New SWMS migrations will add:
- Contractors table (CR2 requirement)
- SWMS jobs and submissions tables
- Email template storage
- Audit trail enhancements

## File Organization Patterns

### Component Co-location
- Place components near their usage point when domain-specific
- Use shared `src/components/ui/` for reusable primitives
- Admin components go in `src/components/admin/`

### Server Actions
- Co-locate with page components: `app/admin/job-sites/actions.ts`
- Group related actions in single files
- Use descriptive function names

### API Routes
- Follow REST conventions: `/api/admin/job-sites/[id]/route.ts`
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Include route-level error handling

### Types Organization
- Domain-based type files: `workers.ts`, `projects.ts`
- Generated types in separate files: `supabase.generated.ts`
- Extend generated types for UI needs

## Naming Conventions

### Directories
- **kebab-case**: `job-sites/`, `check-in/`, `swms-portal/`
- **Domain-based**: Group by feature/domain

### Files
- **Components**: `PascalCase.tsx` - `JobSiteForm.tsx`
- **Pages**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- **Actions**: `actions.ts`
- **Types**: `kebab-case.ts` - `workers.ts`, `swms.ts`
- **Utilities**: `kebab-case.ts` - `animation-utils.ts`

### Functions and Variables
- **camelCase**: `createJobSite`, `jobSiteData`
- **Server Actions**: Descriptive verbs - `updateWorkerCertification`
- **Components**: PascalCase - `JobSiteForm`, `SwmsTracker`

## Import Path Guidelines

### Absolute Imports (Preferred)
```typescript
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { JobSite } from '@/types/supabase'
```

### Relative Imports (Limited Use)
```typescript
import './styles.css'              # Styles in same directory
import '../shared/utils'           # Shared utilities
```

## Development Workflow

### Adding New Features
1. **Types**: Define in `src/types/[domain].ts`
2. **Database**: Create migration in `supabase/migrations/`
3. **Server Actions**: Add to appropriate `actions.ts` file
4. **Components**: Create in domain-appropriate directory
5. **Pages**: Add routes following Next.js App Router conventions
6. **Tests**: Co-locate with components or in `__tests__/`

### SWMS-Specific Additions
- **Extend Job Sites**: Add SWMS functionality to existing job sites routes
- **New Contractor Portal**: Create public portal following check-in patterns  
- **Database Integration**: Link to existing tables via foreign keys
- **Component Reuse**: Leverage existing admin UI patterns and components