create trigger add_user_to_users_trigger
  after insert on auth.users
for each row 
  execute function add_new_user_to_users_function();