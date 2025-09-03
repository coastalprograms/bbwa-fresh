# Infrastructure Architecture

## Current Production Environment

**Primary Infrastructure Stack:**
```
Production Environment (Current State)
├── Frontend: Netlify Edge Network
│   ├── CDN: Global edge locations
│   ├── Build: Next.js static optimization
│   └── Domain: baysidebuilderswa.com.au
├── Backend: Supabase Cloud Platform
│   ├── Database: PostgreSQL 17.4 (Australia East)
│   ├── Authentication: Supabase Auth
│   ├── Storage: Supabase Storage buckets
│   └── Edge Functions: Deno runtime
└── External Services:
    ├── Airtable: Business data sync
    ├── Google Maps: Geolocation services
    └── Email: SMTP via Edge Functions
```

## SWMS Enhancement Infrastructure Requirements

**Additional Infrastructure Components:**
```
SWMS Production Enhancements
├── Email Automation Infrastructure
│   ├── Email Service: Supabase Edge Functions + SMTP
│   ├── Campaign Management: Database-driven workflows
│   ├── Delivery Tracking: Audit logs in PostgreSQL
│   └── Template Storage: Supabase Storage bucket
├── Document Management Infrastructure  
│   ├── File Storage: Supabase Storage (swms-documents bucket)
│   ├── Access Control: Row Level Security + signed URLs
│   ├── Virus Scanning: Edge Function integration
│   └── Backup: Automated daily snapshots
├── Workflow Automation Infrastructure
│   ├── Triggers: Database triggers for automation
│   ├── Scheduling: cron-based Edge Functions
│   ├── Notifications: Real-time via Supabase Realtime
│   └── Audit Logging: Comprehensive tracking tables
└── Monitoring Infrastructure
    ├── Application Monitoring: Supabase Analytics
    ├── Performance Monitoring: Netlify Analytics  
    ├── Error Tracking: Supabase Edge Function logs
    └── Uptime Monitoring: External service monitoring
```

## Network Architecture & Security

**Network Security Model:**
```
Security Boundaries
├── Public Layer
│   ├── Marketing site (/)
│   ├── Worker induction (/induction)
│   ├── Worker check-in (/check-in)
│   └── SWMS submission portals (/swms-portal/[token])
├── Authenticated Layer
│   ├── Admin dashboard (/admin/*)
│   ├── Protected API routes (/api/admin/*)
│   └── Private file storage access
└── System Layer
    ├── Database (RLS protected)
    ├── Edge Functions (authenticated)
    └── Internal API communications
```

**API Security Architecture:**
```typescript
// Security Patterns for SWMS APIs
interface SecurityModel {
  // Public portals use token-based access
  tokenAccess: {
    swmsSubmission: "UUID token with expiry"
    workerCheckIn: "QR code token validation"
  }
  
  // Admin functions require Supabase Auth
  adminAccess: {
    authentication: "Supabase Auth JWT"
    authorization: "RLS policies"
    sessionManagement: "Automatic refresh"
  }
  
  // Database security via RLS
  dataAccess: {
    rowLevelSecurity: "User/role based filtering"
    auditLogging: "All operations logged"
    dataEncryption: "At rest and in transit"
  }
}
```
