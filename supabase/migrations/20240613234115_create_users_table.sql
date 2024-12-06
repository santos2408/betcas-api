DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN
        CREATE TYPE role_enum AS ENUM ('user', 'admin');
    END IF;
END
$$;

create table if not exists users (
  id UUID primary key references auth.users (id),
  name varchar(100),
  email varchar(100) NOT NULL,
  cpf CHAR(11) UNIQUE,
  phone varchar(20),
  role role_enum DEFAULT 'user' NOT NULL,
  created_at timestamp with time zone default current_timestamp NOT NULL,
  updated_at timestamp with time zone default current_timestamp NOT NULL
);
