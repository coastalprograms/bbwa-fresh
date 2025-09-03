-- Story 2.3: Dynamic Projects Page Enhancement
-- Purpose: Add required fields for dynamic projects display with categories and FAQ

-- 1) Ensure projects table has all required fields
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS completion_date DATE,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- 2) Add gallery_images JSONB if not exists (for categorized photos)
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '{}';

-- 3) Sample project data for testing
INSERT INTO projects (
  title, 
  slug, 
  description, 
  image_url,
  location,
  completion_date,
  featured,
  gallery_images,
  status
) VALUES 
(
  'Modern Coastal Home',
  'modern-coastal-home',
  'A stunning 4-bedroom coastal residence featuring open-concept living spaces, floor-to-ceiling windows, and sustainable building materials. This project showcases our expertise in combining modern architecture with environmental consciousness.',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  'Kiama, NSW',
  '2024-06-15',
  true,
  '{
    "Inside": [
      {"url": "https://images.unsplash.com/photo-1565538420870-da08ff96a207?w=800", "alt": "Open plan living area"},
      {"url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800", "alt": "Modern kitchen"}
    ],
    "Outside": [
      {"url": "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800", "alt": "Exterior facade"},
      {"url": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", "alt": "Pool area"}
    ],
    "Bathroom": [
      {"url": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800", "alt": "Master bathroom"},
      {"url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", "alt": "Guest bathroom"}
    ]
  }',
  'published'
),
(
  'Heritage Restoration',
  'heritage-restoration',
  'Complete restoration of a 1920s heritage-listed building, preserving original features while modernizing for contemporary living. This project required careful attention to historical detail and compliance with heritage regulations.',
  'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800',
  'Wollongong, NSW',
  '2024-03-20',
  true,
  '{
    "Inside": [
      {"url": "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?w=800", "alt": "Restored living room"},
      {"url": "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=800", "alt": "Original timber features"}
    ],
    "Outside": [
      {"url": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800", "alt": "Heritage facade"},
      {"url": "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800", "alt": "Garden view"}
    ]
  }',
  'published'
),
(
  'Sustainable Beach House',
  'sustainable-beach-house',
  'An eco-friendly beach house featuring solar panels, rainwater harvesting, and locally sourced materials. Winner of the 2024 Sustainable Building Award.',
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
  'Gerringong, NSW',
  '2024-08-10',
  false,
  '{
    "Inside": [
      {"url": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "alt": "Sustainable interior"},
      {"url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800", "alt": "Natural lighting"}
    ],
    "Outside": [
      {"url": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", "alt": "Beach house exterior"}
    ]
  }',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  gallery_images = EXCLUDED.gallery_images,
  location = EXCLUDED.location,
  completion_date = EXCLUDED.completion_date;

-- 4) Create FAQ table for projects page
CREATE TABLE IF NOT EXISTS project_faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE project_faqs ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "FAQs are viewable by everyone"
ON project_faqs FOR SELECT
USING (true);

-- Authenticated write
CREATE POLICY "Authenticated users can manage FAQs"
ON project_faqs FOR ALL
USING (auth.role() = 'authenticated');

-- Sample FAQ data
INSERT INTO project_faqs (question, answer, display_order) VALUES
('How long does a typical project take?', 'Project timelines vary based on scope and complexity. A standard home build typically takes 8-12 months, while renovations can range from 3-6 months. We provide detailed timelines during the planning phase.', 1),
('Do you handle council approvals?', 'Yes, we manage all council approvals and permits as part of our comprehensive service. Our team has extensive experience navigating local council requirements across the Illawarra region.', 2),
('What areas do you service?', 'We primarily service the Illawarra region including Wollongong, Kiama, Shellharbour, and surrounding areas. We also take on select projects in Southern Sydney and the South Coast.', 3),
('Can I make changes during construction?', 'We understand that ideas evolve during the building process. Minor changes can often be accommodated, though they may affect timeline and budget. We maintain open communication throughout to ensure your vision is realized.', 4),
('Do you offer sustainable building options?', 'Absolutely! We specialize in eco-friendly construction including solar integration, rainwater harvesting, and sustainable materials. We can help you achieve various green building certifications.', 5)
ON CONFLICT DO NOTHING;
