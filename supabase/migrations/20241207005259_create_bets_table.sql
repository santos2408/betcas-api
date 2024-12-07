CREATE TABLE IF NOT EXISTS bets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bet_order UUID REFERENCES bet_orders (id) ON DELETE CASCADE,
  predictions JSONB NOT NULL,
  final_score INTEGER NOT NULL,
  status BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp NOT NULL
);

CREATE TRIGGER update_bets_updated_at
BEFORE UPDATE ON bets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();