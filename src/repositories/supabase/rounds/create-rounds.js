import { supabaseClient } from "../../../config/database.js";

export default class SupabaseCreateRoundsRepository {
  async execute({ round }) {
    const response = await supabaseClient.from("rounds").insert(round);
    return response;
  }
}
