# SWMS Migration Tests

This directory contains tests for the SWMS (Safe Work Method Statements) database migrations created in Story 1.3.

## Test Categories

1. **Table Creation Tests** - Verify all tables are created with correct schema
2. **Foreign Key Constraint Tests** - Test referential integrity
3. **Database Function Tests** - Test custom functions work correctly
4. **RLS Policy Tests** - Verify Row Level Security is properly configured
5. **Performance Tests** - Ensure queries meet performance requirements

## Running Tests

### Prerequisites

1. Have Supabase running locally or access to test database
2. Apply all migrations first: `supabase db push`
3. Set environment variables:
   ```bash
   export SUPABASE_URL="your-supabase-url"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

### Running the Tests

From this directory:
```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### From project root:
```bash
# Run migration tests specifically
cd supabase/migrations/__tests__ && npm test
```

## Test Data

Tests create and clean up their own test data. Each test suite:
- Creates necessary test records before running
- Cleans up all test data after completion
- Uses unique identifiers to avoid conflicts

## Expected Behavior

All tests should pass after migrations are applied. If tests fail:

1. **Table not found errors** - Migrations haven't been applied
2. **Foreign key constraint errors** - Dependencies missing (contractors table)
3. **Function not found errors** - Database functions weren't created
4. **Performance test failures** - Query optimization needed

## Test Coverage

- ✅ job_sites table creation and constraints
- ✅ swms_jobs table creation and foreign keys
- ✅ swms_submissions table creation and unique constraints
- ✅ swms_audit_log table creation
- ✅ Database functions (get_swms_job_with_submissions, etc.)
- ✅ RLS policies enabled
- ✅ Performance requirements met
- ✅ Data integrity constraints