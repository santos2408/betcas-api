CREATE TABLE IF NOT EXISTS rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  championship_id UUID REFERENCES championships (id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  round INTEGER NOT NULL,
  status BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp NOT NULL
);

CREATE TRIGGER update_rounds_updated_at
BEFORE UPDATE ON rounds
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();