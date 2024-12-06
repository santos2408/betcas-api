import SupabaseGetUserRepository from "../../repositories/supabase/users/get-user.js";

export default class GetUserUseCase {
  async execute(params) {
    const supabaseGetUserRepository = new SupabaseGetUserRepository();
    const { data, error } = await supabaseGetUserRepository.execute(params);

    if (error) {
      throw error;
    }

    return data;
  }
}
