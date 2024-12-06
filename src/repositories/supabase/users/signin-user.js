import { supabaseClient } from "../../../config/database.js";

export default class SupabaseSignInUserRepository {
  async execute(params) {
    const data = await supabaseClient.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });
    return data;
  }
}
