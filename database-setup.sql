-- Employee Well-Being Dashboard Database Setup
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create moods table
CREATE TABLE IF NOT EXISTS moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create productivity table
CREATE TABLE IF NOT EXISTS productivity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  event_id TEXT NOT NULL,
  summary TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE productivity ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for moods
CREATE POLICY "Users can insert their own moods"
  ON moods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own moods"
  ON moods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own moods"
  ON moods FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own moods"
  ON moods FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for productivity
CREATE POLICY "Users can insert their own productivity"
  ON productivity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own productivity"
  ON productivity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own productivity"
  ON productivity FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own productivity"
  ON productivity FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for meetings
CREATE POLICY "Users can insert their own meetings"
  ON meetings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own meetings"
  ON meetings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own meetings"
  ON meetings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meetings"
  ON meetings FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_moods_user_id ON moods(user_id);
CREATE INDEX IF NOT EXISTS idx_moods_created_at ON moods(created_at);
CREATE INDEX IF NOT EXISTS idx_productivity_user_id ON productivity(user_id);
CREATE INDEX IF NOT EXISTS idx_productivity_created_at ON productivity(created_at);
CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON meetings(start_time);

-- Optional: Create a function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
  total_moods BIGINT,
  avg_mood NUMERIC,
  total_productivity BIGINT,
  avg_productivity NUMERIC,
  total_meetings BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM moods WHERE user_id = user_uuid) as total_moods,
    (SELECT COALESCE(AVG(mood), 0) FROM moods WHERE user_id = user_uuid) as avg_mood,
    (SELECT COUNT(*) FROM productivity WHERE user_id = user_uuid) as total_productivity,
    (SELECT COALESCE(AVG(score), 0) FROM productivity WHERE user_id = user_uuid) as avg_productivity,
    (SELECT COUNT(*) FROM meetings WHERE user_id = user_uuid) as total_meetings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats(UUID) TO anon, authenticated;

-- Optional: Create a view for recent activity
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
  'mood' as type,
  user_id,
  created_at,
  mood as value,
  note as description
FROM moods
UNION ALL
SELECT 
  'productivity' as type,
  user_id,
  created_at,
  score as value,
  note as description
FROM productivity
ORDER BY created_at DESC;

-- Grant access to the view
GRANT SELECT ON recent_activity TO anon, authenticated; 