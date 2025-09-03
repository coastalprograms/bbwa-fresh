# Story 3.3 Test Plan - Automated White Card Data Extraction

## Overview
This test plan covers the automated OCR processing workflow for white card certifications.

## Test Prerequisites
- Supabase project running with latest migrations applied
- Edge Functions deployed: `process-white-card` and `notify-builder`
- Sample white card images/PDFs uploaded to certifications bucket
- Worker records with completed Step 1 and Step 2 induction

## Database Trigger Tests

### Test 1: Trigger on New Certification
**Objective**: Verify trigger fires when new certification with white_card_path is inserted

**Steps**:
1. Insert new certification record via Supabase dashboard or SQL:
```sql
insert into certifications (worker_id, type, white_card_path, status) 
values ('worker-uuid-here', 'White Card', 'workers/test/white-card-123.jpg', 'Awaiting Review');
```

**Expected Results**:
- Status automatically updates to 'queued'
- Audit record created with event 'queued_for_processing'
- Trigger function executes without errors

### Test 2: No Trigger on Invalid Data
**Objective**: Verify trigger doesn't fire for invalid scenarios

**Test Cases**:
- Certification without white_card_path ❌ Should not trigger
- Certification with status other than 'Awaiting Review' ❌ Should not trigger  
- Update without changing white_card_path ❌ Should not trigger

## Edge Function Tests

### Test 3: Process White Card - Happy Path
**Objective**: Test successful OCR processing flow

**Setup**:
```javascript
const payload = {
  certification_id: 'cert-uuid-here',
  worker_id: 'worker-uuid-here', 
  white_card_path: 'workers/test/white-card-123.jpg'
}
```

**Steps**:
1. Call Edge Function via Supabase dashboard Functions tab
2. Use test payload above
3. Monitor function logs

**Expected Results**:
- Function returns 200 status
- Certification status moves: 'queued' → 'processing' → 'processed'
- OCR data extracted and saved to database fields:
  - `card_number` populated
  - `name_on_card` populated
  - `expiry_date` parsed correctly (YYYY-MM-DD format)
- `processed_at` timestamp set
- Multiple audit records created
- Builder notification sent

### Test 4: Process White Card - File Access Error
**Objective**: Test handling of file access failures

**Steps**:
1. Use payload with invalid `white_card_path`
2. Call Edge Function

**Expected Results**:
- Function returns 500 status with error message
- Certification status set to 'failed'
- `processing_error` field populated
- Audit record with 'processing_failed' event
- Failure notification sent to builder

### Test 5: Duplicate Processing Prevention
**Objective**: Verify rate limiting prevents duplicate processing

**Steps**:
1. Call Edge Function with same certification_id twice rapidly
2. Monitor both responses

**Expected Results**:
- First call processes normally
- Second call returns "Already processing" or "Already processed"
- No duplicate database updates

## OCR Service Tests

### Test 6: Mock OCR Data Extraction
**Objective**: Verify mock OCR service returns valid data

**Expected Behavior**:
- Returns random mock data with card numbers like 'WC123456789'
- Includes Australian date format (DD/MM/YYYY)
- Confidence scores between 0.8-0.95
- Processing delay ~1 second

### Test 7: Date Parsing
**Objective**: Test Australian date format parsing

**Test Cases**:
- '15/03/2026' → '2026-03-15' ✅
- '8/7/2027' → '2027-07-08' ✅  
- 'Invalid date' → null ✅
- Past date → null ✅
- Far future date → null ✅

## Notification Tests

### Test 8: Success Notification
**Objective**: Test builder notification for successful processing

**Expected Email Content**:
- Subject: "✅ White Card Processing Complete"
- Worker name and email
- Extracted card number and expiry date
- Next steps for builder

### Test 9: Failure Notification  
**Objective**: Test builder notification for failed processing

**Expected Email Content**:
- Subject: "❌ White Card Processing Failed"
- Worker details
- Error message
- Action required for builder

## Audit Trail Tests

### Test 10: Complete Audit Log
**Objective**: Verify comprehensive audit logging

**Expected Audit Events** (in order):
1. `queued_for_processing` - When trigger fires
2. `processing_started` - When Edge Function begins
3. `ocr_completed` - When OCR finishes
4. `processing_completed` - When data is saved
5. `notification_sent` - When builder is notified

### Test 11: Audit Data Integrity
**Objective**: Verify audit records contain required data

**Each Audit Record Should Include**:
- `certification_id` (FK to certifications)
- `event` (string describing what happened)
- `detail` (JSONB with contextual data)
- `created_at` (timestamp)

## Performance Tests

### Test 12: Processing Time
**Objective**: Measure end-to-end processing time

**Acceptance Criteria**:
- Total processing time < 10 seconds
- OCR simulation: ~1 second
- Database operations: < 2 seconds
- Notification: < 1 second

## Error Handling Tests

### Test 13: Database Connection Issues
**Objective**: Test behavior when database is unavailable

**Expected Behavior**:
- Graceful error handling
- Meaningful error messages
- No partial state changes

### Test 14: Storage Access Issues
**Objective**: Test behavior when file storage fails

**Expected Behavior**:
- Status set to 'failed'
- Error message stored
- Notification sent with failure details

## Integration Tests

### Test 15: End-to-End Worker Induction Flow
**Objective**: Test complete flow from Step 2 submission to OCR processing

**Steps**:
1. Complete worker induction Step 1
2. Submit Step 2 with white card upload
3. Verify automatic OCR processing triggers
4. Check final certification status and extracted data
5. Verify builder receives notification

## Manual Testing Checklist

### Setup Verification
- [ ] Database migrations applied successfully
- [ ] Edge Functions deployed and active
- [ ] Sample white card files uploaded to storage
- [ ] Environment variables configured

### Trigger Testing
- [ ] New certification with white_card_path triggers processing
- [ ] Status updates from 'Awaiting Review' to 'queued'
- [ ] Audit log entry created for queueing

### Edge Function Testing  
- [ ] Function accepts valid payloads
- [ ] Function rejects invalid payloads with 400 error
- [ ] Duplicate processing prevention works
- [ ] File access and signed URL generation works
- [ ] Mock OCR service returns expected data format
- [ ] Date parsing handles various formats correctly
- [ ] Database updates succeed with extracted data
- [ ] Status transitions work correctly

### Notification Testing
- [ ] Success notifications contain correct data
- [ ] Failure notifications contain error details  
- [ ] Mock email service logs output correctly
- [ ] Notification audit entries created

### Error Scenarios
- [ ] Invalid file paths handled gracefully
- [ ] Database errors don't leave partial state
- [ ] All failures result in 'failed' status and error messages

## Test Data Setup

### Sample Worker Record
```sql
insert into workers (id, full_name, email, company, trade, phone)
values (
  'test-worker-123',
  'Test Worker',
  'test@example.com', 
  'Test Company',
  'Carpenter',
  '+61412345678'
);
```

### Sample Certification Record  
```sql
insert into certifications (id, worker_id, type, white_card_path, status)
values (
  'test-cert-123',
  'test-worker-123',
  'White Card',
  'workers/test-worker-123/white-card-test.jpg',
  'Awaiting Review'  
);
```

## Success Criteria
- ✅ All trigger tests pass
- ✅ All Edge Function tests pass  
- ✅ OCR mock service works as expected
- ✅ Notifications sent correctly
- ✅ Complete audit trail maintained
- ✅ Rate limiting prevents duplicates
- ✅ Error handling graceful and informative
- ✅ End-to-end integration works smoothly