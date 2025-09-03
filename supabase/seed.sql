-- Seed data for projects table
INSERT INTO projects (title, slug, description, image_url, status, location, completion_date, featured, gallery_images) VALUES
('Coastal Modern Home', 'coastal-modern-home', 'A stunning beachfront property featuring modern architecture with sustainable materials. This 4-bedroom residence showcases open-concept living spaces and floor-to-ceiling windows.', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'published', 'Wollongong, NSW', '2024-03-15', true, '[{"url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750", "caption": "Front exterior view", "category": "exterior"}, {"url": "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d", "caption": "Living room", "category": "interior"}]'::jsonb),
('Heritage Restoration', 'heritage-restoration', 'Complete restoration of a 1920s heritage-listed building in the heart of Kiama. Preserving original features while modernizing for contemporary living.', 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800', 'published', 'Kiama, NSW', '2024-01-20', true, '[{"url": "https://images.unsplash.com/photo-1464146072230-91cabc968266", "caption": "Restored facade", "category": "exterior"}]'::jsonb),
('Commercial Fitout', 'commercial-fitout', 'Modern office space designed for productivity and collaboration. Features include open plan areas, meeting rooms, and breakout spaces.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'published', 'Shellharbour, NSW', '2023-11-10', false, '[{"url": "https://images.unsplash.com/photo-1497366216548-37526070297c", "caption": "Open office space", "category": "interior"}]'::jsonb),
('Sustainable Beach House', 'sustainable-beach-house', 'An eco-friendly beach house featuring solar panels, rainwater harvesting, and locally sourced materials. Winner of the 2024 Sustainable Building Award.', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800', 'published', 'Gerringong, NSW', '2024-08-10', false, '[{"url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2", "caption": "Sustainable interior", "category": "interior"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  location = EXCLUDED.location,
  completion_date = EXCLUDED.completion_date,
  featured = EXCLUDED.featured,
  gallery_images = EXCLUDED.gallery_images,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- Seed data for project_faqs table
INSERT INTO project_faqs (question, answer, display_order) VALUES
('How long does a typical project take?', 'Project timelines vary based on scope and complexity. A standard home build typically takes 8-12 months, while renovations can range from 3-6 months. We provide detailed timelines during the planning phase.', 1),
('Do you handle council approvals?', 'Yes, we manage all council approvals and permits as part of our comprehensive service. Our team has extensive experience navigating local council requirements across the Illawarra region.', 2),
('What areas do you service?', 'We primarily service the Illawarra region including Wollongong, Kiama, Shellharbour, and surrounding areas. We also take on select projects in Southern Sydney and the South Coast.', 3),
('Can I make changes during construction?', 'We understand that ideas evolve during the building process. Minor changes can often be accommodated, though they may affect timeline and budget. We maintain open communication throughout to ensure your vision is realized.', 4),
('Do you offer sustainable building options?', 'Absolutely! We specialize in eco-friendly construction including solar integration, rainwater harvesting, and sustainable materials. We can help you achieve various green building certifications.', 5)
ON CONFLICT DO NOTHING;
