# Check-in Functionality Test Cases

## Test Environment Setup
- Ensure development server is running (`npm run dev`)
- Access check-in page at: `http://localhost:3000/check-in`
- Open browser dev tools to monitor console logs and network requests

## Manual Test Cases

### Test 1: Page Load and UI
**Steps:**
1. Navigate to `/check-in`
2. Verify page loads without errors
3. Check all UI elements are present

**Expected Results:**
- ✅ Page title: "Site Check-in — Bayside Builders WA"
- ✅ Heading: "Site Check-in" 
- ✅ Warning notice about induction requirements
- ✅ Email input field with validation
- ✅ "Share Location" button
- ✅ "Check In" button (initially disabled until location shared)
- ✅ Help text about required fields

### Test 2: Form Validation - Empty Fields
**Steps:**
1. Leave email field empty
2. Don't click "Share Location"
3. Click "Check In"

**Expected Results:**
- ✅ Error summary appears with focus
- ✅ "Email is required" error message
- ✅ "Please share your location to check in" error message
- ✅ Form does not submit

### Test 3: Form Validation - Invalid Email
**Steps:**
1. Enter invalid email: "notanemail"
2. Don't share location
3. Click "Check In"

**Expected Results:**
- ✅ "Please enter a valid email address" error
- ✅ Location error also appears
- ✅ Form does not submit

### Test 4: Geolocation Permission Denied
**Steps:**
1. Block location permission in browser
2. Click "Share Location"

**Expected Results:**
- ✅ Button shows loading spinner briefly
- ✅ Error message: "Location permission denied. Please allow location access and try again."
- ✅ Focus returns to location button
- ✅ No location coordinates displayed

### Test 5: Geolocation Success
**Steps:**
1. Allow location permission
2. Click "Share Location"
3. Wait for geolocation

**Expected Results:**
- ✅ Button shows "Getting location..." with spinner
- ✅ Green confirmation box appears with coordinates
- ✅ Coordinates formatted to 4 decimal places
- ✅ Button returns to "Share Location"

### Test 6: Australian Coordinate Validation
**Test with Mock Coordinates (modify geo.ts temporarily):**
1. Mock coordinates outside Australia (e.g., lat: 40, lng: -74 for NYC)
2. Click "Share Location"

**Expected Results:**
- ✅ Error: "Location appears to be outside Australia"

### Test 7: Worker Not Found
**Steps:**
1. Enter email not in database: "notfound@example.com"
2. Share valid location
3. Click "Check In"

**Expected Results:**
- ✅ Error: "Worker not found or not approved. Please complete induction first or contact your supervisor."

### Test 8: Database Integration - Valid Worker
**Prerequisites:**
1. Ensure test worker exists in database with approved status
2. Ensure job_sites table has active sites
3. Use worker's registered email

**Steps:**
1. Enter valid worker email
2. Share location within job site radius
3. Click "Check In"

**Expected Results:**
- ✅ Success message: "Successfully checked in to [Site Name]! Stay safe on site."
- ✅ Form clears email and location
- ✅ Success announcement for screen readers

### Test 9: Outside Job Site Radius
**Prerequisites:**
1. Mock user location far from all job sites
2. Use valid worker email

**Steps:**
1. Enter valid email
2. Share location outside site radius
3. Click "Check In"

**Expected Results:**
- ✅ Error: "You are not within range of any active job site. Please move closer to a job site and try again."

### Test 10: Duplicate Check-in Prevention
**Prerequisites:**
1. Complete successful check-in first
2. Use same worker email and site

**Steps:**
1. Try to check in again with same details
2. Click "Check In"

**Expected Results:**
- ✅ Error: "You have already checked in to [Site Name] today."

### Test 11: White Card Expiry Warning
**Prerequisites:**
1. Set worker's white_card_expiry to date within 30 days
2. Use valid location within site radius

**Steps:**
1. Complete check-in process

**Expected Results:**
- ✅ Success with warning: "Successfully checked in to [Site Name]! Stay safe on site. Note: Your white card expires in X days."

### Test 12: Expired White Card
**Prerequisites:**
1. Set worker's white_card_expiry to past date

**Steps:**
1. Attempt check-in

**Expected Results:**
- ✅ Error: "Your white card has expired. Please renew it before checking in."

### Test 13: CSRF Protection
**Steps:**
1. Clear browser cookies
2. Try to submit form

**Expected Results:**
- ✅ Error: "Security validation failed. Please refresh the page and try again."

### Test 14: Honeypot Protection
**Steps:**
1. Use browser dev tools to fill hidden "website" field
2. Submit form

**Expected Results:**
- ✅ Error: "Spam detection triggered. Please try again."

### Test 15: Accessibility Testing
**Steps:**
1. Navigate using only keyboard (Tab, Enter, Space)
2. Use screen reader to test announcements
3. Check focus management

**Expected Results:**
- ✅ All interactive elements accessible via keyboard
- ✅ Error summary receives focus when errors appear
- ✅ Success message announced to screen readers
- ✅ Proper ARIA labels and roles

### Test 16: Loading States
**Steps:**
1. Test form submission with network throttling
2. Test location request with slow GPS

**Expected Results:**
- ✅ "Checking in..." state shows during submission
- ✅ "Getting location..." state shows during geolocation
- ✅ Form fields disabled during submission
- ✅ No double-submission possible

### Test 17: Error UI Recovery
**Steps:**
1. Generate form errors
2. Correct the errors
3. Resubmit successfully

**Expected Results:**
- ✅ Errors clear when user starts typing
- ✅ Error summary disappears on successful submission
- ✅ Form returns to clean state

## Database Verification

### Check Site Attendance Records
```sql
SELECT 
  sa.*,
  w.email as worker_email,
  js.name as site_name
FROM site_attendance sa
JOIN workers w ON sa.worker_id = w.id
JOIN job_sites js ON sa.job_site_id = js.id
ORDER BY sa.checked_in_at DESC
LIMIT 5;
```

### Verify Job Sites Table
```sql
SELECT id, name, lat, lng, radius_m, active 
FROM job_sites 
WHERE active = true;
```

## Edge Cases to Consider

1. **Network Connectivity**: Test with poor/intermittent connection
2. **GPS Accuracy**: Test with low accuracy GPS readings
3. **Multiple Sites**: Test with overlapping site radii
4. **Concurrent Check-ins**: Multiple workers checking in simultaneously
5. **Long-running Sessions**: Test after page has been open for hours
6. **Browser Compatibility**: Test across different browsers and devices

## Performance Considerations

1. **Server Action Response Time**: Should complete within 2-3 seconds
2. **Geolocation Speed**: Should obtain location within 10 seconds
3. **Database Queries**: Monitor query performance in development logs
4. **Error Handling**: All database errors should be gracefully handled