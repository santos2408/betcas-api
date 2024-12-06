import SupabaseRefreshTokenUserRepository from "../../repositories/supabase/users/refresh-token-user.js";

export default class RefreshTokenUserUseCase {
  async execute(refreshToken) {
    const supabaseRefreshTokenUserRepository = new SupabaseRefreshTokenUserRepository();
    const response = await supabaseRefreshTokenUserRepository.execute(refreshToken);
    return response;
  }
}
