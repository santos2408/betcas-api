CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS championships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  championship_api_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  popular_name VARCHAR(100),
  logo TEXT NOT NULL,
  status BOOLEAN DEFAULT false NOT NULL,
  created_at timestamp with time zone default current_timestamp NOT NULL,
  updated_at timestamp with time zone default current_timestamp NOT NULL
);

CREATE TRIGGER update_championships_updated_at
BEFORE UPDATE ON championships
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();