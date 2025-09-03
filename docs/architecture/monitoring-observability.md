# Monitoring & Observability

## Application Performance Monitoring

**Performance Monitoring Strategy:**
```typescript
interface MonitoringArchitecture {
  // Frontend monitoring
  clientSide: {
    metrics: ["Core Web Vitals", "Load times", "Error rates"]
    tools: ["Netlify Analytics", "Browser console tracking"]
    alerts: ["Performance degradation", "High error rates"]
  }
  
  // Backend monitoring  
  serverSide: {
    database: ["Query performance", "Connection pools", "RLS overhead"]
    edgeFunctions: ["Execution time", "Memory usage", "Error rates"]
    storage: ["Upload speeds", "Download reliability", "Quota usage"]
  }
  
  // Business metrics
  businessKPIs: {
    swmsMetrics: ["Submission rates", "Email delivery", "Portal usage"]
    complianceMetrics: ["Document completeness", "Deadline compliance"]
    userExperience: ["Portal completion rates", "Admin efficiency"]
  }
}
```

## Logging & Audit Architecture

**Comprehensive Audit Strategy:**
```sql
-- Audit logging tables for SWMS system
CREATE TABLE swms_audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name text NOT NULL,
    operation text NOT NULL, -- INSERT, UPDATE, DELETE
    record_id uuid NOT NULL,
    old_values jsonb,
    new_values jsonb,
    user_id uuid,
    ip_address text,
    user_agent text,
    timestamp timestamptz DEFAULT now()
);

-- Email audit logging
CREATE TABLE email_audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id uuid,
    recipient_email text NOT NULL,
    email_type text NOT NULL, -- initial, reminder_1, reminder_2, etc.
    status text NOT NULL, -- sent, delivered, bounced, failed
    external_id text, -- SMTP provider message ID
    sent_at timestamptz DEFAULT now(),
    delivered_at timestamptz,
    error_message text
);

-- Portal access logging
CREATE TABLE portal_access_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_token uuid NOT NULL,
    ip_address text,
    user_agent text,
    action text NOT NULL, -- view, upload, submit
    success boolean DEFAULT true,
    error_message text,
    timestamp timestamptz DEFAULT now()
);
```

## Alert & Notification System

**Operational Alerts:**
```typescript
interface AlertingSystem {
  // Critical system alerts
  systemAlerts: {
    databaseDown: "Immediate SMS + email to Frank"
    edgeFunctionFailure: "Email within 5 minutes"
    fileUploadFailure: "Email within 15 minutes"
    authenticationIssues: "Email within 10 minutes"
  }
  
  // Business process alerts
  businessAlerts: {
    swmsOverdue: "Daily digest to Frank"
    emailDeliveryFailure: "Hourly summary if > 5% failure rate"
    unusualPortalActivity: "Email if suspicious access patterns"
    complianceDeadlines: "7/3/1 day warnings to Frank"
  }
  
  // Performance alerts
  performanceAlerts: {
    slowQueries: "Log and weekly report"
    portalLoadTime: "Email if > 5 seconds"
    adminDashboardPerformance: "Alert if > 3 seconds"
    storageQuotaWarning: "Alert at 80% usage"
  }
}
```
