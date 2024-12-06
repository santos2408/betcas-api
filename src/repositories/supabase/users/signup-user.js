import { supabaseClient } from "../../../config/database.js";

export default class SupabaseSignUpUserRepository {
  async execute(params) {
    const data = await supabaseClient.auth.signUp({
      email: params.email,
      password: params.password,
    });

    return data;
  }
}
