-- Enable Row Level Security (RLS) on isoc_pushes table
ALTER TABLE isoc_pushes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to isoc_pushes" ON isoc_pushes;
DROP POLICY IF EXISTS "Allow authenticated users to insert isoc_pushes" ON isoc_pushes;
DROP POLICY IF EXISTS "Allow authenticated users to delete isoc_pushes" ON isoc_pushes;

-- Policy: Allow anyone to read updates (all users can see updates)
CREATE POLICY "Allow public read access to isoc_pushes"
  ON isoc_pushes
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert (admin will be authenticated)
-- Using auth.uid() IS NOT NULL is more reliable than auth.role()
CREATE POLICY "Allow authenticated users to insert isoc_pushes"
  ON isoc_pushes
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Only authenticated users can delete (admin will be authenticated)
CREATE POLICY "Allow authenticated users to delete isoc_pushes"
  ON isoc_pushes
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

