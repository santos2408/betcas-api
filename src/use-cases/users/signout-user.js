import SupabaseSignOutUserRepository from "../../repositories/supabase/users/signout-user.js";

export default class SignOutUserUseCase {
  async execute() {
    const supabaseSignOutUserRepository = new SupabaseSignOutUserRepository();
    const data = await supabaseSignOutUserRepository.execute();
    return data;
  }
}
