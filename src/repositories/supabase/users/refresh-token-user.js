import { supabaseClient } from "../../../config/database.js";

export default class SupabaseRefreshTokenUserRepository {
  async execute(refreshToken) {
    const response = await supabaseClient.auth.refreshSession({ refresh_token: refreshToken });
    return response;
  }
}
