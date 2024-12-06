import SupabaseSignUpUserRepository from "../../repositories/supabase/users/signup-user.js";

export default class SignUpUserUseCase {
  async execute(params) {
    const supabaseSignUpUserRepository = new SupabaseSignUpUserRepository();
    const { data, error } = await supabaseSignUpUserRepository.execute(params);

    if (error) {
      throw error;
    }

    return data;
  }
}
