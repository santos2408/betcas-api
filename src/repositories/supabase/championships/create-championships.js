import { supabaseClient } from "../../../config/database.js";

export default class SupabaseCreateChampionshipsRepository {
  async execute({ championship }) {
    const response = await supabaseClient.from("championships").insert(championship);
    return response;
  }
}
