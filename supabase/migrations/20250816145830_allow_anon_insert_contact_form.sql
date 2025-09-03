-- Allow anonymous inserts into contact_form_submissions for public contact form
-- Timestamp: 2025-08-16 14:58:30

-- RLS is already enabled on contact_form_submissions in initial migration.
-- Keep select/update/delete restricted to authenticated users only.
-- Permit anonymous inserts only.
create policy if not exists "Anon insert: contact_form_submissions"
  on contact_form_submissions
  for insert
  to anon
  with check (true);
