# Coding Standards

This document defines the coding standards and conventions for BBWA SWMS Management System development, extracted from CLAUDE.md and existing codebase patterns.

## File Naming Conventions

### Components
- **Format**: `kebab-case.tsx`
- **Examples**: `project-card.tsx`, `job-site-form.tsx`, `swms-submission-portal.tsx`
- **Location**: `src/components/` with subdirectories by domain

### Hooks
- **Format**: `use-[name].ts`
- **Examples**: `use-mobile.ts`, `use-job-sites.ts`, `use-swms-tracking.ts`
- **Location**: `src/hooks/`

### Server Actions
- **Format**: `actions.ts` in route folders
- **Examples**: `app/admin/job-sites/actions.ts`, `app/admin/workers/actions.ts`
- **Pattern**: Co-located with page components

### Types
- **Format**: `[domain].ts`
- **Examples**: `workers.ts`, `projects.ts`, `swms.ts`
- **Location**: `src/types/`

## Import Organization

### Import Order (Required)
1. External libraries (React, Next.js, third-party)
2. Absolute aliases (@/)
3. Internal modules (same domain)
4. Relative paths (./,../)

### Example
```typescript
// 1. External libraries
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

// 2. Absolute aliases
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

// 3. Internal modules
import { JobSiteForm } from './JobSiteForm'

// 4. Relative paths
import './styles.css'
```

## Component Guidelines

### Component Structure
- **Type**: Functional components only
- **Props**: Explicit interfaces required
- **Size**: Keep under 300 lines per file
- **Pattern**: Server Components by default, Client Components ('use client') only when necessary

### Example Component Structure
```typescript
interface JobSiteCardProps {
  jobSite: JobSite
  onUpdate?: (id: string) => void
  className?: string
}

export function JobSiteCard({ 
  jobSite, 
  onUpdate, 
  className 
}: JobSiteCardProps) {
  // Implementation
}
```

### Accessibility Requirements
- **WCAG Level**: 2.2 AA compliance mandatory
- **Labels**: All form inputs must have labels
- **Focus Management**: Proper focus states and keyboard navigation
- **Screen Readers**: Proper ARIA labels and semantic HTML

## TypeScript Standards

### Type Definitions
- **Strict Mode**: Enabled across project
- **Explicit Types**: All functions must have explicit return types
- **No Any**: Avoid `any` type, use `unknown` or proper interfaces

### Database Types
- **Generated Types**: Use Supabase generated types from `src/types/supabase.generated.ts`
- **Custom Types**: Extend generated types for UI-specific properties
- **Validation**: Use Zod schemas for runtime validation

### Example Type Definitions
```typescript
// Database type (generated)
type JobSite = Database['public']['Tables']['job_sites']['Row']

// UI-enhanced type
interface JobSiteWithStatus extends JobSite {
  worker_count: number
  active_workers: Worker[]
  swms_completion_rate?: number
}
```

## Server Actions Pattern

### Server Action Structure
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateJobSite(
  jobSiteId: string, 
  data: JobSiteUpdateData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    
    // Implementation with proper error handling
    const { error } = await supabase
      .from('job_sites')
      .update(data)
      .eq('id', jobSiteId)
    
    if (error) throw error
    
    revalidatePath('/admin/job-sites')
    return { success: true }
    
  } catch (error) {
    console.error('Update job site error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
```

## Database Patterns

### Row Level Security (RLS)
- **Required**: All new tables must implement RLS policies
- **Pattern**: Follow existing patterns in `workers`, `certifications`, `job_sites` tables
- **Authentication**: Use `auth.uid()` for user-specific access

### Query Patterns
```typescript
// Preferred: Type-safe queries with proper error handling
const { data: jobSites, error } = await supabase
  .from('job_sites')
  .select(`
    *,
    workers:workers(count)
  `)
  .eq('status', 'active')

if (error) {
  throw new Error(`Failed to fetch job sites: ${error.message}`)
}
```

## Form Handling Standards

### React Hook Form + Zod Pattern
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const jobSiteSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  lat: z.number(),
  lng: z.number(),
})

type JobSiteFormData = z.infer<typeof jobSiteSchema>

export function JobSiteForm() {
  const form = useForm<JobSiteFormData>({
    resolver: zodResolver(jobSiteSchema),
  })
  
  // Implementation
}
```

## Error Handling Standards

### Client-Side Error Handling
- **User-Friendly Messages**: Never expose internal errors to users
- **Logging**: Log detailed errors for debugging
- **Fallbacks**: Provide graceful degradation

### Server-Side Error Handling
- **Try-Catch**: Wrap all database operations
- **Structured Responses**: Return consistent error response format
- **Audit Trail**: Log errors for compliance tracking

## Testing Standards

### Unit Tests
- **Framework**: Jest + React Testing Library
- **Coverage**: Minimum 80% for new code
- **Location**: `__tests__` directories or `.test.tsx` files
- **Naming**: Match component names with `.test.tsx` suffix

### Integration Tests
- **API Routes**: Test with mock Supabase client
- **User Flows**: Test critical paths (job creation, worker check-in, SWMS submission)
- **Error Scenarios**: Test error handling and edge cases

## Security Standards

### Authentication
- **Pattern**: Use `createClient()` for server-side operations
- **Never**: Expose service role keys to client
- **Tokens**: Handle JWT tokens securely with proper expiration

### Input Validation
- **Client AND Server**: Validate on both sides
- **Sanitization**: Sanitize all user inputs
- **SQL Injection**: Use Supabase query builders, never raw SQL

### Environment Variables
- **Secrets**: Store in `.env.local`, never commit
- **Public**: Prefix with `NEXT_PUBLIC_` only when necessary
- **Production**: Set in Netlify environment variables

## Performance Standards

### React Performance
- **Memoization**: Use `React.memo()` for expensive components
- **Lazy Loading**: Implement for non-critical components
- **Images**: Optimize using Next.js Image component
- **Bundle Size**: Monitor and optimize bundle size

### Database Performance
- **Indexes**: Ensure proper indexing for frequent queries
- **Pagination**: Implement for large datasets
- **Caching**: Use Next.js caching where appropriate
- **Query Optimization**: Select only required fields

## SWMS-Specific Standards

### SWMS Integration
- **Existing Patterns**: Follow job-sites management patterns
- **File Uploads**: Use existing Supabase Storage patterns from white card processing
- **Email**: Follow existing Edge Function patterns (`notify-builder`, `expiry-reminders`)

### Contractor Portal
- **Token Security**: Use UUID tokens with expiration (like check-in system)
- **Mobile Optimization**: Ensure responsive design for construction site use
- **Offline Support**: Consider service worker for document uploads

### Work Safe Compliance
- **Audit Trails**: Log all SWMS actions for compliance
- **Export Format**: Generate reports matching Work Safe requirements
- **Data Retention**: Follow Australian compliance requirements for data retention