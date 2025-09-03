# Development & Operations Integration

## CI/CD Pipeline Enhancement

**Development Workflow:**
```yaml
# GitHub Actions workflow for SWMS features
name: SWMS Development Pipeline
on:
  push:
    branches: [main, develop, feature/swms-*]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run TypeScript checks
        run: npm run typecheck
      - name: Run tests
        run: npm test
      - name: Run E2E tests for SWMS flows
        run: npm run test:e2e:swms
        
  database:
    runs-on: ubuntu-latest
    steps:
      - name: Run database migrations (staging)
        run: npx supabase db push --staging
      - name: Verify migration integrity
        run: npm run verify:migrations
        
  deploy:
    needs: [test, database]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: netlify deploy --prod
      - name: Run smoke tests
        run: npm run test:smoke:production
```

## Environment Configuration Management

**Configuration Strategy:**
```bash
# Environment variable management for SWMS
# Development (.env.local)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=local-anon-key
SUPABASE_SERVICE_ROLE_KEY=local-service-key

# SWMS-specific development config
SWMS_EMAIL_MODE=mock
SWMS_DOCUMENT_STORAGE=local
SWMS_DEBUG_LOGGING=true

# Production (Netlify environment variables)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key  
SUPABASE_SERVICE_ROLE_KEY=prod-service-key

# SWMS-specific production config
SWMS_EMAIL_MODE=live
SWMS_DOCUMENT_STORAGE=supabase
SWMS_DEBUG_LOGGING=false
SWMS_EMAIL_FROM=admin@baysidebuilderswa.com.au
```
