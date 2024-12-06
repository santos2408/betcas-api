CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR(100) NOT NULL, -- Nome do cliente
  user_phone VARCHAR(11) NOT NULL, -- Telefone do cliente
  championship_id INT NOT NULL,
  round INTEGER NOT NULL,
  round_status BOOLEAN DEFAULT true, -- status da rodada
  bet_status BOOLEAN DEFAULT true, -- status da aposta
  total_points INTEGER DEFAULT 0, -- Pontuação total da rodada
  predictions JSONB NOT NULL, -- { "matchId": "team1" }...
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);