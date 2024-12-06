import { supabaseClient } from "../../../config/database.js";

export default class SupabaseSignOutUserRepository {
  async execute() {
    const data = await supabaseClient.auth.signOut();
    return data;
  }
}
