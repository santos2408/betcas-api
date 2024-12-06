create
  or replace function add_new_user_to_users_function()
  returns trigger as $$
begin
  insert into public.users (id, name, email, cpf, phone, role, created_at, updated_at)
  values (
    NEW.id,
    '',
    NEW.email,
    '',
    '',
    'user',
    now(),
    now()
  );
  return NEW;
end;
$$ language plpgsql security definer;
