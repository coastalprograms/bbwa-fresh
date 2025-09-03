# BBWA SWMS Management System Brownfield Enhancement PRD

## Intro Project Analysis and Context

### ⚠️ CRITICAL SCOPE ASSESSMENT ⚠️

This enhancement has been validated as a **Major Impact** brownfield enhancement requiring:
- New feature addition (SWMS Management System)
- Significant integration with existing systems (Airtable, email workflows, contractor management)
- Architectural changes (new database tables, admin routes, contractor portals)
- Multiple coordinated development stories over 6-8 weeks

### Existing Project Overview

**Analysis Source**: IDE-based fresh analysis combined with comprehensive project brief review

**Current Project State**: 
The BBWA platform is a sophisticated construction compliance system built on Next.js 14+ with Supabase backend, handling worker safety certifications, site check-ins, and regulatory compliance. The system currently prevents $50,000 fines through automated compliance checking and manages worker induction workflows, white card processing, and real-time site attendance tracking.

### Available Documentation Analysis

**Available Documentation**: ✅
- Tech Stack Documentation ✅ (Next.js 14+, Supabase, Shadcn/ui)
- Source Tree/Architecture ✅ (Analyzed existing admin routes, components, database schema)  
- API Documentation ✅ (Existing job-sites, workers, compliance APIs)
- External API Documentation ✅ (Supabase Edge Functions, Airtable integration)
- Technical Debt Documentation ✅ (OCR processing 90% complete, admin sidebar patterns)

### Enhancement Scope Definition

**Enhancement Type**: ✅ New Feature Addition + Integration with New Systems

**Enhancement Description**: 
Integrate comprehensive SWMS management directly into existing job sites admin interface, automating contractor email campaigns, document submission tracking, and Work Safe compliance exports while maintaining unified contractor database across all systems.

**Impact Assessment**: ✅ Significant Impact (substantial existing code integration required)

### Goals and Background Context

**Goals**:
- Reduce SWMS management time from 5 hours to 5 minutes per job (95% efficiency gain)
- Achieve 100% Work Safe compliance documentation with automated audit trails
- Maintain professional contractor relationships through automated, consistent communication
- Enable business scaling without proportional administrative burden increase
- Create unified contractor management across induction, check-in, and SWMS systems

**Background Context**:
Frank currently spends 50-75 hours monthly on manual SWMS collection across 10-15 construction jobs. This manual process creates compliance risks ($50,000 potential fines), damages contractor relationships through inconsistent communication, and prevents business growth. The existing BBWA platform provides the perfect foundation with established authentication, admin dashboards, geo-location systems, and Supabase infrastructure already handling worker compliance workflows.

### Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|---------|
| Initial PRD Creation | 2025-01-09 | v1.0 | Created comprehensive SWMS integration PRD based on project brief and system analysis | PM Agent |
| Add Contractor-Employee Linking | 2025-01-10 | v1.1 | Added CR2 requirement for contractor-employee hierarchy to support WorkSafe compliance audits | PM Agent |
| BMAD Method Compliance Update | 2025-01-10 | v2.0 | Restructured PRD to follow proper BMAD brownfield template requirements | PM Agent |

---

## Requirements

Based on comprehensive analysis of the existing BBWA system and SWMS project brief, here are the detailed requirements for integrating SWMS management into current job sites infrastructure:

### Functional Requirements

**FR1**: The existing Job Sites admin interface (`/admin/job-sites/[id]`) shall be enhanced with SWMS management sections without breaking current geo-location and check-in functionality.

**FR2**: Frank shall be able to create SWMS jobs directly from existing job site pages, automatically inheriting geo-location data, site names, and active status from the current `job_sites` table.

**FR3**: The system shall maintain a unified contractor database that seamlessly integrates with existing Airtable workflows, eliminating data duplication between SWMS, worker induction, and check-in systems.

**FR4**: Automated email campaigns shall leverage existing Edge Function patterns (similar to `notify-builder`, `expiry-reminders`) to send SWMS requests with secure submission links to relevant contractors.

**FR5**: Contractor submission portals shall use tokenized access (similar to existing check-in QR codes) requiring no account creation, with submissions stored in new `swms_submissions` table linked to existing `job_sites.id`.

**FR6**: The system shall provide real-time SWMS tracking dashboard integrated into existing job site detail pages, showing submission status with visual indicators consistent with current admin UI patterns.

**FR7**: One-click Work Safe compliance export shall generate properly formatted reports combining SWMS documentation with existing compliance data from `workers` and `certifications` tables.

**FR8**: Automated follow-up sequences shall use n8n workflows (consistent with existing automation approach) sending reminders at Day 7, 14, and 21 intervals for missing submissions.

### Non-Functional Requirements

**NFR1**: Enhancement must maintain existing performance characteristics of job sites admin interface and not exceed current database query times by more than 200ms.

**NFR2**: All new SWMS tables must implement Row Level Security (RLS) policies consistent with existing Supabase security patterns in `workers`, `certifications`, and `job_sites` tables.

**NFR3**: Email delivery success rate must achieve ≥95% through proper domain authentication and spam prevention, leveraging existing Supabase Edge Function infrastructure.

**NFR4**: Contractor portal loading times must not exceed 3 seconds on mobile devices, optimized for construction site connectivity conditions.

**NFR5**: The system must handle Frank's typical monthly volume (10-15 jobs with 20-50 contractor relationships) without requiring Supabase plan upgrades or performance degradation.

**NFR6**: All SWMS data must maintain audit trails and compliance-grade logging consistent with existing `certification_audits` and `notification_audits` patterns.

**NFR7**: Database schema changes must be implemented through proper migration scripts that preserve existing data integrity and relationships.

**NFR8**: The system must achieve 99.5% uptime during Australian business hours (8 AM - 6 PM AWST) for contractor submission workflows.

### Compatibility Requirements

**CR1**: **Existing Job Sites API Compatibility**: All current `/api/admin/job-sites/` endpoints must continue to function without modification, with SWMS data accessible through extended API responses rather than breaking changes.

**CR2**: **Contractor-Employee Linking Feature**: 
- Create new `contractors` table to establish proper organizational hierarchy for WorkSafe compliance audits
- Contractors table will store company information only (name, ABN, contact details) - NO SWMS or insurance documents as these are job-specific
- Update workers table to include `contractor_id` foreign key linking to contractors table
- Replace existing free-text "company" field in worker induction form with dropdown selection from contractors table
- Add new Contractors tab in admin dashboard showing hierarchical view of contractors and their employees
- Enable quick WorkSafe audit compliance by showing which workers belong to which contractor companies
- Migration will preserve existing company data by creating contractor records from unique company values in workers table
- This creates the foundation for future SWMS system integration where job-specific SWMS can be linked appropriately

**CR3**: **Database Schema Compatibility**: New SWMS tables (`swms_jobs`, `swms_submissions`) must integrate seamlessly with existing foreign key relationships to `job_sites.id` and leverage the new `contractors` table from CR2 without requiring changes to current tables.

**CR4**: **Admin UI Consistency**: SWMS management interfaces must follow existing Shadcn/ui component patterns, color schemes, and navigation structures used in current job sites, workers, and projects admin pages.

**CR5**: **Check-in System Integration**: Existing worker check-in functionality at `/check-in` must continue operating without interference, with potential future enhancement to validate SWMS compliance during check-in process.

**CR6**: **Airtable Integration Compatibility**: SWMS contractor data synchronization must work alongside existing contact form and FAQ Airtable integrations without API rate limit conflicts or data structure changes.

**CR7**: **Edge Functions Compatibility**: New SWMS-related Edge Functions must follow existing patterns (`process-white-card`, `notify-builder`, `expiry-reminders`) for authentication, error handling, and audit logging.

**CR8**: **Authentication System Integration**: SWMS admin features must use existing Supabase Auth patterns without requiring additional authentication layers or user management changes.

**CR9**: **Geo-location System Compatibility**: SWMS job creation must leverage existing `job_sites.lat`, `job_sites.lng`, and `job_sites.radius_m` data for contractor portal location context without duplicating location management.

---

## User Interface Enhancement Goals

Based on the SWMS project brief requirement for seamless integration with existing admin workflows, here's how UI changes will integrate with current design patterns:

### Integration with Existing UI

**Consistent Design Language**: 
SWMS management interfaces will extend the existing Shadcn/ui component library already used throughout the admin dashboard. All new SWMS sections will use established patterns from current job sites, workers, and projects admin pages, including consistent card layouts, button styles, form components, and color schemes.

**Navigation Integration**: 
Rather than creating new navigation paths, SWMS functionality will be integrated as additional sections within existing job site detail pages (`/admin/job-sites/[id]`). This maintains Frank's familiar workflow of managing all job site aspects in one location, consistent with how worker check-ins, compliance alerts, and geo-location are currently managed.

**Component Reuse Strategy**: 
New SWMS components will leverage existing admin infrastructure including `AppSidebar`, `JobSiteForm`, status indicator patterns (Active/Inactive badges), and established loading states, form validation, and error handling patterns proven in current worker and certification management interfaces.

### Modified/New Screens and Views

**New Contractors Management Page (`/admin/contractors`)**:
- New tab in admin sidebar for contractor management
- Hierarchical view showing contractors with expandable rows to display their employees
- Quick actions for adding/editing contractor details
- Employee count badges and compliance status indicators
- Search and filter capabilities for easy contractor lookup

**Enhanced Worker Induction Form**:
- Replace free-text "company" field with dropdown selector populated from contractors table
- Include "Other/Not Listed" option for new contractors not yet in system
- Maintain all existing safety and certification fields

**Enhanced Job Site Detail Page (`/admin/job-sites/[id]`)**:
- Add SWMS Management section with contractor list, submission tracking, and email campaign controls
- Integrate SWMS status indicators alongside existing site status (Active/Inactive)
- Include SWMS completion metrics in existing site statistics cards
- Leverage contractor relationships from CR2 for SWMS contractor selection

**Extended Job Site Form (`JobSiteForm.tsx`)**:
- Add SWMS configuration fields for contractor selection and email automation settings
- Maintain existing geo-location and check-in radius functionality
- Include SWMS-specific toggles for email automation and follow-up sequences

**Contractor Submission Portal (New - Public)**:
- Token-based access requiring no authentication, consistent with existing check-in QR code approach
- Mobile-first responsive design optimized for construction site conditions
- File upload interface following existing white card upload patterns from worker induction

**SWMS Dashboard Widget (Admin)**:
- Real-time submission status grid integrated into existing job site overview
- Visual progress indicators consistent with current compliance status displays
- Quick action buttons for email campaigns and manual follow-ups

### UI Consistency Requirements

**Visual Design Consistency**:
All SWMS interfaces must maintain the existing blue (#0066CC) and green (#00AA44) color scheme used for primary actions and success states. Error states, warning messages, and form validation must follow established red (#DC2626) and yellow (#EAB308) patterns currently used in check-in forms and worker management.

**Interaction Patterns**:
SWMS forms will use identical interaction patterns to existing admin forms including real-time validation feedback, loading spinner states during submissions, and success/error toast notifications. Contractor portal interactions will mirror the simplicity and clarity of the current worker check-in form.

**Responsive Design Standards**:
All SWMS interfaces must maintain the existing mobile-responsive breakpoints and touch-friendly button sizing established in current admin dashboard. Contractor portals specifically must function seamlessly on mobile devices commonly used by construction workers in field conditions.

**Accessibility Compliance**:
SWMS interfaces will maintain existing WCAG 2.2 compliance standards including proper focus states for keyboard navigation, screen reader compatibility, and sufficient color contrast ratios consistent with current admin interface accessibility patterns.

---

## Technical Constraints and Integration Requirements

Based on the detailed analysis of the existing BBWA system architecture, here are the technical constraints and integration requirements for safe SWMS implementation:

### Existing Technology Stack

**Current Architecture (Validated)**:
- **Languages**: TypeScript (strict mode), JavaScript (ES2022+)
- **Frontend Framework**: Next.js 14+ with App Router, React 18, Tailwind CSS
- **UI Components**: Shadcn/ui components, Radix UI primitives
- **Backend**: Supabase (PostgreSQL 17.4, Auth, Storage, Edge Functions)  
- **Database**: PostgreSQL with Row Level Security (RLS) on all tables
- **Forms**: React Hook Form + Zod validation patterns
- **Deployment**: Netlify with existing configuration
- **Authentication**: Supabase Auth with `/admin` route protection

### Integration Approach

**Database Integration Strategy**:
New contractors table (CR2) will be created first to establish contractor-employee relationships, with workers table updated to include contractor_id foreign key. SWMS tables will then extend existing schema through proper foreign key relationships to both `job_sites.id` and the new `contractors.id`, maintaining referential integrity with current geo-location and check-in systems. Migration scripts will follow existing patterns in `supabase/migrations/` with proper rollback capabilities and RLS policy implementation matching current security model.

**API Integration Strategy**:
SWMS functionality will extend existing `/api/admin/job-sites/` endpoints rather than creating separate API routes, ensuring consistent authentication, error handling, and response formatting. New Edge Functions for email automation will follow proven patterns from `notify-builder`, `expiry-reminders`, and `process-white-card` functions.

**Frontend Integration Strategy**:
SWMS components will extend existing `JobSiteForm.tsx` and related admin components using established patterns from worker and project management interfaces. All new components will use existing Shadcn/ui library, form validation patterns, and state management approaches proven in current admin dashboard.

**Testing Integration Strategy**:
SWMS features will integrate with existing Jest + React Testing Library test suite, following established patterns from current admin component tests and API route testing. Critical path testing will focus on SWMS workflow integration with existing job site and contractor management flows.

### Code Organization and Standards

**File Structure Approach**:
SWMS functionality will be organized within existing admin directory structure:
- `/admin/job-sites/` - Enhanced with SWMS management sections
- `/api/admin/job-sites/` - Extended endpoints for SWMS operations  
- `/components/admin/` - New SWMS-specific components following existing patterns
- `supabase/functions/` - New Edge Functions for email automation following existing naming conventions

**Naming Conventions**:
All SWMS-related files will follow existing kebab-case naming for components (`swms-management.tsx`), camelCase for hooks (`useSWMSData.ts`), and existing Supabase patterns for database objects (`swms_jobs`, `swms_submissions`, `contractors` tables).

**Coding Standards**:
SWMS implementation will adhere to existing TypeScript strict mode requirements, ESLint configuration, Prettier formatting rules, and established patterns for error boundaries, loading states, and form handling used throughout current admin interface.

**Documentation Standards**:
All SWMS functions will include explicit TypeScript types, JSDoc comments for complex logic, and README updates in relevant directories following existing documentation patterns for worker management and compliance systems.

### Deployment and Operations

**Build Process Integration**:
SWMS features will integrate seamlessly with existing `npm run build` process, requiring no changes to current Netlify deployment configuration or build optimization settings. TypeScript compilation and bundling will leverage existing Next.js configuration and performance optimization patterns.

**Deployment Strategy**:
SWMS functionality will be deployed through existing Netlify deployment pipeline with feature flags for gradual rollout. Database migrations will be applied via existing Supabase migration workflow, ensuring zero-downtime deployment consistent with current operational practices.

**Monitoring and Logging**:
SWMS operations will integrate with existing Supabase logging infrastructure, using established patterns from current compliance alert and notification audit systems. All SWMS database operations will be logged to existing audit tables (`notification_audits`, `certification_audits`) for compliance tracking.

**Configuration Management**:
SWMS features will use existing environment variable patterns (`.env.local`, Netlify environment settings) and leverage current Supabase configuration management for service keys, webhook URLs, and email automation settings.

### Risk Assessment and Mitigation

**Technical Risks (Based on Existing System Analysis)**:
- **Database Performance**: Additional SWMS queries on `job_sites` table could impact existing check-in performance; mitigated through proper indexing and query optimization following existing patterns
- **Supabase Limits**: Increased Edge Function usage for email automation may approach current plan limits; monitoring and optimization strategies based on existing function patterns
- **Email Deliverability**: Contractor email automation could face spam filtering; addressed through existing domain authentication and gradual sending patterns

**Integration Risks**:
- **Admin UI Complexity**: Adding SWMS sections to existing job site forms could impact usability; mitigated through progressive enhancement and consistent component patterns
- **Data Consistency**: Contractor information synchronization between Airtable and SWMS could create conflicts; addressed through existing API integration patterns and proper error handling
- **Authentication Dependencies**: SWMS admin features dependent on existing Supabase Auth; risk mitigation through established session management and fallback patterns

**Deployment Risks**:
- **Migration Complexity**: Database schema changes could impact existing job site functionality; mitigated through comprehensive migration testing and rollback procedures
- **Performance Regression**: Additional admin interface complexity could slow existing workflows; addressed through performance monitoring and incremental feature rollout
- **Feature Flag Management**: Gradual SWMS rollout requires careful feature flag coordination; managed through existing deployment practices and configuration management

**Mitigation Strategies**:
All technical risks will be addressed through established patterns proven in existing worker compliance, certification management, and admin dashboard implementations. Database changes will use existing migration patterns with proper foreign key constraints and RLS policies. Performance monitoring will leverage current Supabase analytics and Netlify deployment monitoring for consistent operational oversight.

---

## Epic and Story Structure

**Epic Structure Decision**: Single comprehensive epic with rationale - This enhancement integrates tightly with existing job sites infrastructure and contractor management systems, making it most logical as a single epic that delivers unified SWMS functionality while maintaining existing system integrity.

### Epic 1: SWMS Management System Integration

**Epic Goal**: Transform Frank's manual SWMS collection process into a fully automated system integrated with existing BBWA job sites and contractor management, reducing administrative time by 95% while ensuring 100% Work Safe compliance through automated workflows and contractor portals.

**Integration Requirements**: All SWMS functionality must seamlessly integrate with existing job sites admin interface, contractor database (from CR2), and current authentication/authorization systems without breaking existing worker check-in, compliance monitoring, or project management workflows.

#### Story 1.1: Contractor-Employee Hierarchy Foundation

As a builder admin,
I want to establish proper contractor-employee relationships in the database,
so that I can organize workers by their employer companies for compliance tracking.

**Acceptance Criteria:**
1. Create contractors table with company information (name, ABN, contact details)
2. Add contractor_id foreign key to workers table
3. Replace free-text company field in worker induction form with contractor dropdown
4. Create data migration to preserve existing company information
5. Implement proper RLS policies following existing patterns

**Integration Verification:**
- IV1: Existing worker check-in functionality continues operating without modification
- IV2: Current worker management interface displays contractor names correctly
- IV3: All existing worker data maintains integrity during contractor migration

#### Story 1.2: Admin Contractors Management Interface

As a builder admin,
I want a dedicated contractors management page in the admin dashboard,
so that I can view and manage contractor companies and their employees hierarchically.

**Acceptance Criteria:**
1. Add Contractors tab to admin sidebar following existing navigation patterns
2. Create contractors list page showing company details and employee counts
3. Implement expandable rows to display employees under each contractor
4. Add search and filter functionality for contractor lookup
5. Include quick actions for adding/editing contractor details

**Integration Verification:**
- IV1: Admin sidebar maintains existing layout and functionality for all other tabs
- IV2: New contractors page follows existing Shadcn/ui component patterns and styling
- IV3: Page performance does not impact existing admin dashboard loading times

#### Story 1.3: SWMS Data Structure Setup

As a builder admin,
I want the database structure for SWMS management established,
so that the foundation exists for job site integration and contractor submissions.

**Acceptance Criteria:**
1. Create swms_jobs table linked to existing job_sites table
2. Create swms_submissions table with proper relationships to contractors and jobs
3. Implement proper RLS policies following existing security patterns
4. Create database functions for SWMS data management
5. Set up proper indexing for performance optimization

**Integration Verification:**
- IV1: Existing job_sites table structure and functionality remains unchanged
- IV2: Database performance maintains existing query response times
- IV3: New tables integrate properly with existing foreign key relationships

#### Story 1.4: Contractor Submission Portal

As a contractor,
I want a secure portal to submit SWMS documents for specific job sites,
so that I can fulfill compliance requirements without creating accounts.

**Acceptance Criteria:**
1. Build token-based public portal following existing QR code patterns
2. Implement mobile-optimized file upload interface
3. Create submission confirmation and status tracking
4. Implement proper security validations and virus scanning
5. Store submissions in swms_submissions table with audit logging

**Integration Verification:**
- IV1: Portal security model aligns with existing check-in token approach
- IV2: File upload follows existing white card processing patterns
- IV3: Submission data integrates properly with database structure from Story 1.3

#### Story 1.5: SWMS Job Site Management Interface

As a builder admin,
I want SWMS functionality integrated into existing job site management pages,
so that I can manage all job site aspects including SWMS in one unified interface.

**Acceptance Criteria:**
1. Add SWMS management section to job site detail pages
2. Implement SWMS job creation inheriting geo-location and site data
3. Create visual indicators for SWMS status alongside existing site status
4. Add SWMS metrics to existing job site statistics cards
5. Display submission status using data from swms_submissions table

**Integration Verification:**
- IV1: Existing job site creation, editing, and deletion functionality remains unchanged
- IV2: Current geo-location and check-in radius settings continue operating properly
- IV3: Job site API endpoints maintain backward compatibility

#### Story 1.6: Email Automation System

As a builder admin,
I want automated email campaigns to request SWMS from contractors,
so that I can eliminate manual follow-up and ensure timely submissions.

**Acceptance Criteria:**
1. Create email automation Edge Function following existing patterns
2. Implement campaign scheduling and tracking
3. Build automated follow-up sequences (Day 7, 14, 21)
4. Create email templates with secure submission links to existing portal
5. Implement delivery status monitoring and audit logging

**Integration Verification:**
- IV1: Email system uses existing Supabase Edge Function infrastructure
- IV2: Audit logging integrates with existing notification_audits patterns
- IV3: Email delivery does not impact existing system performance

#### Story 1.7: Compliance Dashboard and Reporting

As a builder admin,
I want comprehensive SWMS tracking and Work Safe compliance reports,
so that I can quickly demonstrate compliance during inspections and audits.

**Acceptance Criteria:**
1. Create real-time SWMS dashboard integrated into job site pages
2. Implement visual progress indicators and status tracking
3. Build one-click Work Safe compliance export functionality
4. Create comprehensive audit trails and compliance documentation
5. Implement quick action buttons for campaign management

**Integration Verification:**
- IV1: Dashboard integration maintains existing job site interface performance
- IV2: Compliance reports combine SWMS data with existing worker certification data
- IV3: Visual indicators follow existing admin UI design patterns

---

## Document Status
- **Status**: Complete - Ready for Development  
- **Last Updated**: 2025-01-10
- **Version**: 2.0 - BMAD Method Compliant