import { supabaseClient } from "../../../config/database.js";

export default class SupabaseGetRoundsByNumberAndChampionshipIdRepository {
  async execute({ championship_api_id, round }) {
    const response = await supabaseClient
      .from("rounds")
      .select()
      .eq("championship_api_id", championship_api_id)
      .eq("round", round)
      .single();
    return response;
  }
}
