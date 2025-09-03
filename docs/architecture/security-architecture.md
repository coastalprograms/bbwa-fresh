# Security Architecture

## Authentication & Authorization

**Current Security Model (Extended for SWMS):**
```typescript
interface SecurityArchitecture {
  // Existing authentication patterns
  adminAuth: {
    provider: "Supabase Auth"
    method: "Email/password + session cookies"
    protection: "/admin/* routes protected"
    mfa: "Optional TOTP"
  }
  
  // New SWMS-specific security patterns
  contractorAccess: {
    method: "Token-based (no account required)"
    scope: "Single submission per token"
    expiry: "7 days default"
    validation: "UUID + database lookup"
  }
  
  // Data access security
  databaseSecurity: {
    rls: "All tables protected by RLS"
    audit: "All operations logged"
    encryption: "TDE + column-level encryption"
    backup: "Encrypted automated backups"
  }
}
```

## Data Security & Compliance

**Australian Compliance Requirements:**
```typescript
interface ComplianceArchitecture {
  // Privacy Act compliance
  dataRetention: {
    personalData: "7 years minimum for construction records"
    swmsDocuments: "Permanent retention for regulatory compliance"
    auditLogs: "7 years for compliance audits"
    emailLogs: "2 years for communication records"
  }
  
  // Work Safe compliance
  documentSecurity: {
    storage: "Australian data centres (Supabase AU East)"
    access: "Role-based with audit trails"
    integrity: "Digital signatures and checksums"
    availability: "99.9% uptime SLA"
  }
  
  // Data sovereignty
  dataLocation: {
    primary: "Australia East (Sydney)"
    backup: "Australia Southeast (Melbourne)"
    crossBorder: "No data stored outside Australia"
    processing: "Edge functions in Australian regions"
  }
}
```

## File Storage Security

**SWMS Document Security Model:**
```typescript
interface FileStorageSecurity {
  bucketStructure: {
    "swms-documents": {
      path: "/job-sites/{job_id}/submissions/{contractor_id}/"
      access: "RLS + signed URLs"
      expiry: "24 hours for download links"
      encryption: "AES-256 at rest"
    }
    
    "site-maps": {
      path: "/job-sites/{job_id}/maps/"
      access: "Admin only"
      expiry: "No expiry for admin access"
      encryption: "AES-256 at rest"
    }
  }
  
  virusScanning: {
    integration: "Edge Function + external service"
    action: "Quarantine suspicious files"
    notification: "Alert admin immediately"
    cleanup: "Auto-delete after 30 days"
  }
}
```
