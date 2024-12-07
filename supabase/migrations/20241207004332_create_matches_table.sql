CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id UUID REFERENCES rounds (id) ON DELETE CASCADE,
  championship_id UUID REFERENCES championships (id) ON DELETE CASCADE,
  home_team_id INTEGER NOT NULL,
  away_team_id INTEGER NOT NULL,
  home_team_result INTEGER NOT NULL,
  away_team_result INTEGER NOT NULL,
  status BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp NOT NULL
);

CREATE TRIGGER update_matches_updated_at
BEFORE UPDATE ON matches
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();