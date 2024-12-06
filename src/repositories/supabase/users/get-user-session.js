import { supabaseClient } from "../../../config/database.js";

export default class SupabaseGetUserSessionRepository {
  async execute(accessToken) {
    const response = await supabaseClient.auth.getUser(accessToken);
    return response;
  }
}
