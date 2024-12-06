import SupabaseSignInUserRepository from "../../repositories/supabase/users/signin-user.js";

export default class SignInUserUseCase {
  async execute(params) {
    const supabaseSignInUserRepository = new SupabaseSignInUserRepository();
    const data = await supabaseSignInUserRepository.execute(params);
    return data;
  }
}
