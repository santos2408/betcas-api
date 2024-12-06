import { supabaseClient } from "../../../config/database.js";

export default class SupabaseGetAllBetsRepository {
  async execute() {
    const data = await supabaseClient.from("bets").select();
    return data;
  }
}
