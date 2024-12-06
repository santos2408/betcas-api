import SupabaseGetUserSessionRepository from "../../repositories/supabase/users/get-user-session.js";
import SupabaseRefreshTokenUserRepository from "../../repositories/supabase/users/refresh-token-user.js";

export default class GetUserSessionUseCase {
  async execute(accessToken, refreshToken) {
    const supabaseGetUserSessionRepository = new SupabaseGetUserSessionRepository();
    const { data, error } = await supabaseGetUserSessionRepository.execute(accessToken);

    if (error) {
      const supabaseRefreshTokenUserRepository = new SupabaseRefreshTokenUserRepository();
      const { data, error } = await supabaseRefreshTokenUserRepository.execute(refreshToken);

      if (error) {
        throw error;
      }

      return data;
    }

    return data;
  }
}
