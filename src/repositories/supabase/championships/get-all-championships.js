import { supabaseClient } from "../../../config/database.js";

export default class SupabaseGetAllChampionshipsRepository {
  async execute() {
    const response = await supabaseClient.from("championships").select();
    return response;
  }
}
