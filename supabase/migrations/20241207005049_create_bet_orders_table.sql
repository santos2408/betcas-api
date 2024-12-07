CREATE TABLE IF NOT EXISTS bet_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  championship_id UUID REFERENCES championships (id) ON DELETE CASCADE,
  round_id UUID REFERENCES rounds (id) ON DELETE CASCADE,
  user_name VARCHAR(100) NOT NULL,
  user_phone VARCHAR(11) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp NOT NULL
);

CREATE TRIGGER update_bet_orders_updated_at
BEFORE UPDATE ON bet_orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();