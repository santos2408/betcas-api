import { supabaseClient } from "../../../config/database.js";

export default class SupabaseUpdateRoundsByIdAndStatusRepository {
  async execute({ id, status }) {
    const response = await supabaseClient.from("rounds").update({ status }).eq("id", id);
    return response;
  }
}
