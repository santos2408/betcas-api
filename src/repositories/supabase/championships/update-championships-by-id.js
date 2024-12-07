import { supabaseClient } from "../../../config/database.js";

export default class SupabaseUpdateChampionshipsByIdRepository {
  async execute({ id, status }) {
    const response = await supabaseClient.from("championships").update({ status }).eq("id", id);
    return response;
  }
}
