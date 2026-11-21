CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 200),
  done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE todos DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE todos TO anon;
GRANT ALL ON TABLE todos TO authenticated;
GRANT ALL ON TABLE todos TO service_role;
