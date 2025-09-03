-- Seed data for projects table
-- Timestamp: 2025-08-16 10:46:59
-- Purpose: Provide a visible sample row for /db-check page verification

insert into projects (title, description, hero_image_url)
select 'Welcome Project', 'Initial seeded project to verify public read policies via /db-check.', null
where not exists (select 1 from projects where title = 'Welcome Project');
