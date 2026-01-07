-- Create updates table for storing admin-published updates
CREATE TABLE IF NOT EXISTS updates (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT, -- base64 encoded image or image URL
  is_warning BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_updates_created_at ON updates(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read updates (all users can see updates)
CREATE POLICY "Allow public read access to updates"
  ON updates
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert (admin will be authenticated)
CREATE POLICY "Allow authenticated users to insert updates"
  ON updates
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete (admin will be authenticated)
CREATE POLICY "Allow authenticated users to delete updates"
  ON updates
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_updates_updated_at
  BEFORE UPDATE ON updates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

