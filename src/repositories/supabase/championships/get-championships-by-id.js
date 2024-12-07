import { supabaseClient } from "../../../config/database.js";

export default class SupabaseGetChampionshipsByIdRepository {
  async execute({ id }) {
    const response = await supabaseClient.from("championships").select().eq("championship_api_id", id).single();
    return response;
  }
}
