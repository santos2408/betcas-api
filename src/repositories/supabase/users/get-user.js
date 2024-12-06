import { supabaseClient } from "../../../config/database.js";

export default class SupabaseGetUserRepository {
  async execute(params) {
    const data = await supabaseClient.from("users").select().eq("id", params.id);
    return data;
  }
}
