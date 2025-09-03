# Epic and Story Structure

**Epic Structure Decision**: Single comprehensive epic with rationale - This enhancement integrates tightly with existing job sites infrastructure and contractor management systems, making it most logical as a single epic that delivers unified SWMS functionality while maintaining existing system integrity.

## Epic 1: SWMS Management System Integration

**Epic Goal**: Transform Frank's manual SWMS collection process into a fully automated system integrated with existing BBWA job sites and contractor management, reducing administrative time by 95% while ensuring 100% Work Safe compliance through automated workflows and contractor portals.

**Integration Requirements**: All SWMS functionality must seamlessly integrate with existing job sites admin interface, contractor database (from CR2), and current authentication/authorization systems without breaking existing worker check-in, compliance monitoring, or project management workflows.

### Story 1.1: Contractor-Employee Hierarchy Foundation

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

### Story 1.2: Admin Contractors Management Interface

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

### Story 1.3: SWMS Data Structure Setup

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

### Story 1.4: Contractor Submission Portal

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

### Story 1.5: SWMS Job Site Management Interface

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

### Story 1.6: Email Automation System

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

### Story 1.7: Compliance Dashboard and Reporting

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
