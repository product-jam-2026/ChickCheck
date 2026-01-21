-- Add UPDATE policy for isoc_pushes table
-- This allows authenticated users to update updates

-- Drop existing UPDATE policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated users to update isoc_pushes" ON isoc_pushes;

-- Policy: Only authenticated users can update (admin will be authenticated)
CREATE POLICY "Allow authenticated users to update isoc_pushes"
  ON isoc_pushes
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

