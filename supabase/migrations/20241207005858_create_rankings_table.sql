CREATE TABLE IF NOT EXISTS rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users (id) ON DELETE CASCADE,
  round_id INT NOT NULL,
  score INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp NOT NULL
);

CREATE TRIGGER update_rankings_updated_at
BEFORE UPDATE ON rankings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();