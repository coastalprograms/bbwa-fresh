# Expiry Reminders Edge Function

## Overview

This Edge Function automatically checks for worker certifications expiring within the next 30 days and sends notification emails via webhook to Make.com or n8n automation platforms.

## Features

- ✅ Queries certifications expiring in the next 30 days
- ✅ Deduplication to prevent spam notifications (7-day cooldown)
- ✅ Webhook integration with Make.com or n8n
- ✅ Comprehensive audit logging
- ✅ Error handling and retry logic
- ✅ TypeScript with strict type safety

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Automation provider ('make' or 'n8n')
AUTOMATION_PROVIDER=make

# Webhook URLs
MAKE_WEBHOOK_URL=https://hook.make.com/your-webhook-url
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-url

# Application URL for induction form
INDUCTION_URL=https://your-app.netlify.app/induction
```

## Scheduling

### Option 1: Supabase Scheduled Functions (Recommended)

Use Supabase's built-in pg_cron extension:

```sql
-- Run daily at 9:00 AM AEST (23:00 UTC, accounting for timezone)
SELECT cron.schedule(
  'expiry-reminders-daily',
  '0 23 * * *',
  'SELECT net.http_post(
    url := ''https://dslerptraitfgcmxkhkq.supabase.co/functions/v1/expiry-reminders'',
    headers := ''{"Authorization": "Bearer " || current_setting(''app.settings.service_role_key'') || ""}''::jsonb
  );'
);
```

### Option 2: External Cron Service

Use services like GitHub Actions, Netlify Functions, or Vercel Cron:

```yaml
# .github/workflows/expiry-reminders.yml
name: Daily Expiry Reminders
on:
  schedule:
    - cron: '0 23 * * *'  # 9 AM AEST
jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Expiry Reminders
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            https://dslerptraitfgcmxkhkq.supabase.co/functions/v1/expiry-reminders
```

### Option 3: Netlify Scheduled Functions

```javascript
// netlify/functions/trigger-expiry-reminders.js
exports.handler = async (event, context) => {
  const response = await fetch(
    'https://dslerptraitfgcmxkhkq.supabase.co/functions/v1/expiry-reminders',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    }
  );
  
  return {
    statusCode: response.status,
    body: JSON.stringify(await response.json())
  };
};
```

Add to `netlify.toml`:
```toml
[[functions]]
  path = "/trigger-expiry-reminders"
  schedule = "0 23 * * *"
```

## Manual Testing

Test the function manually:

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  https://dslerptraitfgcmxkhkq.supabase.co/functions/v1/expiry-reminders
```

## Webhook Payload Structure

The function sends this payload to your automation platform:

```json
{
  "builder": {
    "type": "builder_summary",
    "generated_at": "2025-08-20T10:30:00.000Z",
    "expiries": [
      {
        "name": "John Smith",
        "email": "john@example.com", 
        "expiry_date": "2025-09-15"
      }
    ]
  },
  "workers": [
    {
      "type": "worker_notice",
      "worker_id": "uuid-here",
      "name": "John Smith",
      "email": "john@example.com",
      "expiry_date": "2025-09-15", 
      "induction_url": "https://your-app.netlify.app/induction"
    }
  ]
}
```

## Monitoring

- Check `notification_audits` table for execution logs
- Check `notification_dedup` table for deduplication records
- Monitor Supabase logs for function execution details
- Set up alerts on automation platform for webhook failures

## Troubleshooting

1. **No notifications sent**: Check that workers have valid email addresses and certifications expiring within 30 days
2. **Webhook failures**: Verify webhook URLs and automation platform configuration
3. **Database errors**: Check RLS policies and service role permissions
4. **Scheduling issues**: Verify cron syntax and timezone settings