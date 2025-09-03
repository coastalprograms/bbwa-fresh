-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project photos table
CREATE TYPE photo_category AS ENUM ('inside', 'outside', 'kitchen', 'bathroom', 'other');

CREATE TABLE IF NOT EXISTS project_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  path VARCHAR(500) NOT NULL,
  category photo_category NOT NULL,
  alt_text VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at);
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at);
CREATE INDEX IF NOT EXISTS idx_project_photos_project_id ON project_photos(project_id);
CREATE INDEX IF NOT EXISTS idx_project_photos_category ON project_photos(category);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON projects;
CREATE POLICY "Projects are viewable by everyone"
ON projects FOR SELECT
USING (deleted_at IS NULL AND status = 'published');

DROP POLICY IF EXISTS "Authenticated users can manage all projects" ON projects;
CREATE POLICY "Authenticated users can manage all projects"
ON projects FOR ALL
USING (auth.role() = 'authenticated');

-- RLS Policies for project_photos
DROP POLICY IF EXISTS "Project photos are viewable by everyone" ON project_photos;
CREATE POLICY "Project photos are viewable by everyone"
ON project_photos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_photos.project_id 
    AND projects.deleted_at IS NULL 
    AND projects.status = 'published'
  )
);

DROP POLICY IF EXISTS "Authenticated users can manage all project photos" ON project_photos;
CREATE POLICY "Authenticated users can manage all project photos"
ON project_photos FOR ALL
USING (auth.role() = 'authenticated');

-- Create storage bucket for project photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-photos', 'project-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for project-photos bucket
DROP POLICY IF EXISTS "Anyone can view project photos" ON storage.objects;
CREATE POLICY "Anyone can view project photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-photos');

DROP POLICY IF EXISTS "Authenticated users can upload project photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload project photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-photos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update project photos" ON storage.objects;
CREATE POLICY "Authenticated users can update project photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-photos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete project photos" ON storage.objects;
CREATE POLICY "Authenticated users can delete project photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-photos' AND auth.role() = 'authenticated');