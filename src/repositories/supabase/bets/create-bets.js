import { supabaseClient } from "../../../config/database.js";

export default class SupabaseCreateBetsRepository {
  async execute(params) {
    const data = await supabaseClient.from("bets").insert(params).select();
    return data;
  }
}
