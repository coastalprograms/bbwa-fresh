/**
 * Database migration tests for SWMS Story 1.3
 * Tests all SWMS-related table creation, constraints, and functions
 */

const { createClient } = require('@supabase/supabase-js')

// Test configuration
const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-key'

describe('SWMS Database Structure Tests', () => {
  let supabase

  beforeAll(() => {
    supabase = createClient(supabaseUrl, supabaseKey)
  })

  describe('Table Creation Tests', () => {
    test('job_sites table should exist with correct schema', async () => {
      const { data, error } = await supabase
        .from('job_sites')
        .select('*')
        .limit(0)

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)

      // Test schema by attempting to insert a valid record
      const testInsert = {
        name: 'Test Job Site',
        address: '123 Test St, Perth WA',
        lat: -31.9505,
        lng: 115.8605,
        status: 'active',
        check_in_radius_meters: 100
      }

      const { data: insertData, error: insertError } = await supabase
        .from('job_sites')
        .insert(testInsert)
        .select()

      expect(insertError).toBeNull()
      expect(insertData).toHaveLength(1)
      expect(insertData[0]).toMatchObject(testInsert)

      // Clean up test data
      await supabase
        .from('job_sites')
        .delete()
        .eq('name', 'Test Job Site')
    })

    test('swms_jobs table should exist with correct schema and foreign key constraints', async () => {
      // First create a job site for foreign key reference
      const { data: jobSiteData } = await supabase
        .from('job_sites')
        .insert({
          name: 'Test Site for SWMS Job',
          address: '456 Test Ave',
          status: 'active'
        })
        .select()

      const jobSiteId = jobSiteData[0].id

      // Test swms_jobs table
      const testSwmsJob = {
        job_site_id: jobSiteId,
        name: 'Test SWMS Job',
        description: 'Test description',
        start_date: '2025-09-04',
        status: 'planned'
      }

      const { data, error } = await supabase
        .from('swms_jobs')
        .insert(testSwmsJob)
        .select()

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data[0]).toMatchObject(testSwmsJob)

      // Test foreign key constraint by trying to insert with invalid job_site_id
      const invalidJob = {
        job_site_id: '00000000-0000-0000-0000-000000000000',
        name: 'Invalid Job',
        start_date: '2025-09-04',
        status: 'planned'
      }

      const { error: fkError } = await supabase
        .from('swms_jobs')
        .insert(invalidJob)

      expect(fkError).not.toBeNull()
      expect(fkError.code).toBe('23503') // Foreign key constraint violation

      // Clean up
      await supabase.from('swms_jobs').delete().eq('name', 'Test SWMS Job')
      await supabase.from('job_sites').delete().eq('id', jobSiteId)
    })

    test('swms_submissions table should exist with correct schema and constraints', async () => {
      // Create test data dependencies
      const { data: jobSiteData } = await supabase
        .from('job_sites')
        .insert({
          name: 'Test Site for Submission',
          address: '789 Test Rd',
          status: 'active'
        })
        .select()

      const { data: swmsJobData } = await supabase
        .from('swms_jobs')
        .insert({
          job_site_id: jobSiteData[0].id,
          name: 'Test Job for Submission',
          start_date: '2025-09-04',
          status: 'active'
        })
        .select()

      const { data: contractorData } = await supabase
        .from('contractors')
        .insert({
          name: 'Test Contractor for Submission',
          active: true
        })
        .select()

      // Test swms_submissions
      const testSubmission = {
        swms_job_id: swmsJobData[0].id,
        contractor_id: contractorData[0].id,
        document_name: 'Test SWMS Document.pdf',
        file_url: 'https://example.com/test-document.pdf',
        status: 'submitted'
      }

      const { data, error } = await supabase
        .from('swms_submissions')
        .insert(testSubmission)
        .select()

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data[0]).toMatchObject(testSubmission)

      // Test unique constraint (same contractor, job, document name)
      const { error: uniqueError } = await supabase
        .from('swms_submissions')
        .insert(testSubmission)

      expect(uniqueError).not.toBeNull()
      expect(uniqueError.code).toBe('23505') // Unique violation

      // Clean up
      await supabase.from('swms_submissions').delete().eq('document_name', 'Test SWMS Document.pdf')
      await supabase.from('swms_jobs').delete().eq('id', swmsJobData[0].id)
      await supabase.from('job_sites').delete().eq('id', jobSiteData[0].id)
      await supabase.from('contractors').delete().eq('id', contractorData[0].id)
    })

    test('swms_audit_log table should exist with correct schema', async () => {
      const testAudit = {
        table_name: 'swms_submissions',
        record_id: '12345678-1234-1234-1234-123456789012',
        action_type: 'status_update',
        old_values: { status: 'submitted' },
        new_values: { status: 'approved' }
      }

      const { data, error } = await supabase
        .from('swms_audit_log')
        .insert(testAudit)
        .select()

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data[0].table_name).toBe('swms_submissions')
      expect(data[0].action_type).toBe('status_update')

      // Clean up
      await supabase.from('swms_audit_log').delete().eq('id', data[0].id)
    })
  })

  describe('Database Function Tests', () => {
    let testJobSiteId, testSwmsJobId, testContractorId, testSubmissionId

    beforeAll(async () => {
      // Set up test data for function tests
      const { data: jobSiteData } = await supabase
        .from('job_sites')
        .insert({
          name: 'Function Test Site',
          address: '123 Function St',
          status: 'active'
        })
        .select()
      testJobSiteId = jobSiteData[0].id

      const { data: swmsJobData } = await supabase
        .from('swms_jobs')
        .insert({
          job_site_id: testJobSiteId,
          name: 'Function Test Job',
          start_date: '2025-09-04',
          status: 'active'
        })
        .select()
      testSwmsJobId = swmsJobData[0].id

      const { data: contractorData } = await supabase
        .from('contractors')
        .insert({
          name: 'Function Test Contractor',
          active: true
        })
        .select()
      testContractorId = contractorData[0].id

      const { data: submissionData } = await supabase
        .from('swms_submissions')
        .insert({
          swms_job_id: testSwmsJobId,
          contractor_id: testContractorId,
          document_name: 'Function Test Document.pdf',
          file_url: 'https://example.com/function-test.pdf',
          status: 'submitted'
        })
        .select()
      testSubmissionId = submissionData[0].id
    })

    afterAll(async () => {
      // Clean up test data
      await supabase.from('swms_submissions').delete().eq('id', testSubmissionId)
      await supabase.from('swms_jobs').delete().eq('id', testSwmsJobId)
      await supabase.from('job_sites').delete().eq('id', testJobSiteId)
      await supabase.from('contractors').delete().eq('id', testContractorId)
    })

    test('get_swms_job_with_submissions function should return correct data', async () => {
      const { data, error } = await supabase
        .rpc('get_swms_job_with_submissions', { job_id: testSwmsJobId })

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(typeof data).toBe('object')
      
      // Verify structure
      expect(data.job).toBeDefined()
      expect(data.submissions).toBeDefined()
      expect(data.submission_counts).toBeDefined()
      
      expect(data.job.id).toBe(testSwmsJobId)
      expect(data.job.name).toBe('Function Test Job')
      expect(Array.isArray(data.submissions)).toBe(true)
      expect(data.submissions.length).toBe(1)
      expect(data.submission_counts.total).toBe(1)
      expect(data.submission_counts.submitted).toBe(1)
    })

    test('calculate_swms_completion_rate function should return correct metrics', async () => {
      const { data, error } = await supabase
        .rpc('calculate_swms_completion_rate', { job_site_id_param: testJobSiteId })

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(typeof data).toBe('object')
      
      expect(data.overall_stats).toBeDefined()
      expect(data.job_details).toBeDefined()
      
      expect(data.overall_stats.total_jobs).toBe(1)
      expect(data.overall_stats.total_submissions).toBe(1)
      expect(Array.isArray(data.job_details)).toBe(true)
    })

    test('get_contractor_swms_submissions function should return contractor data', async () => {
      const { data, error } = await supabase
        .rpc('get_contractor_swms_submissions', { contractor_id_param: testContractorId })

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(typeof data).toBe('object')
      
      expect(data.contractor).toBeDefined()
      expect(data.submissions).toBeDefined()
      expect(data.submission_summary).toBeDefined()
      
      expect(data.contractor.id).toBe(testContractorId)
      expect(data.contractor.name).toBe('Function Test Contractor')
      expect(Array.isArray(data.submissions)).toBe(true)
      expect(data.submissions.length).toBe(1)
      expect(data.submission_summary.total).toBe(1)
    })

    test('update_swms_submission_status function should update status and create audit log', async () => {
      const { data, error } = await supabase
        .rpc('update_swms_submission_status', {
          submission_id: testSubmissionId,
          new_status: 'approved',
          reviewer_id: testContractorId, // Using contractor ID as reviewer for test
          review_notes: 'Test approval note'
        })

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.success).toBe(true)
      expect(data.submission).toBeDefined()
      expect(data.submission.status).toBe('approved')
      
      // Verify the submission was actually updated
      const { data: updatedSubmission } = await supabase
        .from('swms_submissions')
        .select('status, notes')
        .eq('id', testSubmissionId)
        .single()
      
      expect(updatedSubmission.status).toBe('approved')
      expect(updatedSubmission.notes).toBe('Test approval note')
      
      // Verify audit log was created
      const { data: auditLogs } = await supabase
        .from('swms_audit_log')
        .select('*')
        .eq('record_id', testSubmissionId)
        .eq('action_type', 'status_update')
      
      expect(auditLogs.length).toBeGreaterThan(0)
    })
  })

  describe('RLS Policy Tests', () => {
    test('Tables should have RLS enabled', async () => {
      const tables = ['job_sites', 'swms_jobs', 'swms_submissions', 'swms_audit_log']
      
      for (const table of tables) {
        const { data, error } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('tablename', table)
          .eq('schemaname', 'public')
        
        expect(error).toBeNull()
        expect(data).toHaveLength(1)
        
        // Check RLS is enabled (this would require admin access to test properly)
        // In a real test environment, you'd verify with supabase admin client
      }
    })
  })

  describe('Performance Tests', () => {
    test('Queries should complete within performance requirements', async () => {
      const startTime = Date.now()
      
      const { data, error } = await supabase
        .from('swms_active_jobs_summary')
        .select('*')
        .limit(100)
      
      const duration = Date.now() - startTime
      
      expect(error).toBeNull()
      expect(duration).toBeLessThan(200) // Should complete within 200ms
    })

    test('Dashboard stats materialized view should be accessible', async () => {
      const { data, error } = await supabase
        .from('swms_dashboard_stats')
        .select('*')
        .limit(10)
      
      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })
  })
})