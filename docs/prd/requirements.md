# Requirements

Based on comprehensive analysis of the existing BBWA system and SWMS project brief, here are the detailed requirements for integrating SWMS management into current job sites infrastructure:

## Functional Requirements

**FR1**: The existing Job Sites admin interface (`/admin/job-sites/[id]`) shall be enhanced with SWMS management sections without breaking current geo-location and check-in functionality.

**FR2**: Frank shall be able to create SWMS jobs directly from existing job site pages, automatically inheriting geo-location data, site names, and active status from the current `job_sites` table.

**FR3**: The system shall maintain a unified contractor database that seamlessly integrates with existing Airtable workflows, eliminating data duplication between SWMS, worker induction, and check-in systems.

**FR4**: Automated email campaigns shall leverage existing Edge Function patterns (similar to `notify-builder`, `expiry-reminders`) to send SWMS requests with secure submission links to relevant contractors.

**FR5**: Contractor submission portals shall use tokenized access (similar to existing check-in QR codes) requiring no account creation, with submissions stored in new `swms_submissions` table linked to existing `job_sites.id`.

**FR6**: The system shall provide real-time SWMS tracking dashboard integrated into existing job site detail pages, showing submission status with visual indicators consistent with current admin UI patterns.

**FR7**: One-click Work Safe compliance export shall generate properly formatted reports combining SWMS documentation with existing compliance data from `workers` and `certifications` tables.

**FR8**: Automated follow-up sequences shall use n8n workflows (consistent with existing automation approach) sending reminders at Day 7, 14, and 21 intervals for missing submissions.

## Non-Functional Requirements

**NFR1**: Enhancement must maintain existing performance characteristics of job sites admin interface and not exceed current database query times by more than 200ms.

**NFR2**: All new SWMS tables must implement Row Level Security (RLS) policies consistent with existing Supabase security patterns in `workers`, `certifications`, and `job_sites` tables.

**NFR3**: Email delivery success rate must achieve ≥95% through proper domain authentication and spam prevention, leveraging existing Supabase Edge Function infrastructure.

**NFR4**: Contractor portal loading times must not exceed 3 seconds on mobile devices, optimized for construction site connectivity conditions.

**NFR5**: The system must handle Frank's typical monthly volume (10-15 jobs with 20-50 contractor relationships) without requiring Supabase plan upgrades or performance degradation.

**NFR6**: All SWMS data must maintain audit trails and compliance-grade logging consistent with existing `certification_audits` and `notification_audits` patterns.

**NFR7**: Database schema changes must be implemented through proper migration scripts that preserve existing data integrity and relationships.

**NFR8**: The system must achieve 99.5% uptime during Australian business hours (8 AM - 6 PM AWST) for contractor submission workflows.

## Compatibility Requirements

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
